package nl.tailormap.viewer.admin.jaas;

import nl.tailormap.viewer.config.security.User;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.springframework.security.crypto.factory.PasswordEncoderFactories;
import org.springframework.security.crypto.password.PasswordEncoder;

import javax.persistence.EntityManager;
import javax.persistence.EntityManagerFactory;
import javax.persistence.NoResultException;
import javax.persistence.Persistence;
import javax.security.auth.Subject;
import javax.security.auth.callback.Callback;
import javax.security.auth.callback.CallbackHandler;
import javax.security.auth.callback.NameCallback;
import javax.security.auth.callback.PasswordCallback;
import javax.security.auth.callback.UnsupportedCallbackException;
import javax.security.auth.login.FailedLoginException;
import javax.security.auth.login.LoginException;
import javax.security.auth.spi.LoginModule;
import java.io.IOException;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;

public class TailormapLoginModule implements LoginModule {
    private static final Log log = LogFactory.getLog(TailormapLoginModule.class);

    private Subject subject;
    private CallbackHandler handler;
    private User user;
    private Set<Group> groups;

    private static EntityManagerFactory emf;

    private static final PasswordEncoder passwordEncoder = PasswordEncoderFactories.createDelegatingPasswordEncoder();

    public static PasswordEncoder getPasswordEncoder() {
        return passwordEncoder;
    }

    @Override
    public void initialize(Subject subject, CallbackHandler callbackHandler, Map<String, ?> sharedState, Map<String, ?> options) {
        this.subject = subject;
        this.handler = callbackHandler;
    }

    private synchronized void initializeEntityManagerFactory() {
        if (emf == null) {
            emf = Persistence.createEntityManagerFactory("viewer-config-postgresql");
        }
    }

    @Override
    public boolean login() throws LoginException {
        Callback[] callbacks = new Callback[2];
        callbacks[0] = new NameCallback("login");
        callbacks[1] = new PasswordCallback("password", true);

        EntityManager em = null;

        try {
            handler.handle(callbacks);
            String username = ((NameCallback) callbacks[0]).getName();
            String password = String.valueOf(((PasswordCallback) callbacks[1]).getPassword());

            initializeEntityManagerFactory();
            em = emf.createEntityManager();

            user = (User)em.createQuery("from User u left join fetch u.groups where u.username = :username")
                    .setParameter("username", username).
                    getSingleResult();

            if(!passwordEncoder.matches(password, user.getPassword())) {
                throw new FailedLoginException("Authorization failed");
            }
            groups = user.getGroups().stream().map(g -> new Group(g.getName())).collect(Collectors.toSet());
            log.info("User " + user.getUsername() + " authorized with groups: " + groups);

            return true;

        } catch (NoResultException e) {
            throw new FailedLoginException("User not found");
        } catch (IOException | UnsupportedCallbackException ex) {
            throw new LoginException(ex.getMessage());
        } finally {
            if (em != null) {
                em.close();
            }
        }
    }

    @Override
    public boolean commit() throws LoginException {
        subject.getPrincipals().add(user);
        subject.getPrincipals().addAll(groups);
        return true;
    }

    @Override
    public boolean abort() throws LoginException {
        return false;
    }

    @Override
    public boolean logout() throws LoginException {
        subject.getPrincipals().remove(user);
        subject.getPrincipals().removeAll(groups);
        return false;
    }
}
