/*
 * Copyright (C) 2012-2016 B3Partners B.V.
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */
package nl.tailormap.viewer.admin.stripes;

import net.sourceforge.stripes.action.DefaultHandler;
import net.sourceforge.stripes.action.DontBind;
import net.sourceforge.stripes.action.DontValidate;
import net.sourceforge.stripes.action.ForwardResolution;
import net.sourceforge.stripes.action.RedirectResolution;
import net.sourceforge.stripes.action.Resolution;
import net.sourceforge.stripes.action.SimpleMessage;
import net.sourceforge.stripes.action.StrictBinding;
import net.sourceforge.stripes.action.UrlBinding;
import net.sourceforge.stripes.validation.SimpleError;
import net.sourceforge.stripes.validation.Validate;
import net.sourceforge.stripes.validation.ValidateNestedProperties;
import net.sourceforge.stripes.validation.ValidationErrors;
import net.sourceforge.stripes.validation.ValidationMethod;
import nl.tailormap.viewer.config.CRS;
import nl.tailormap.viewer.config.ClobElement;
import nl.tailormap.viewer.config.app.Application;
import nl.tailormap.viewer.config.app.Level;
import nl.tailormap.viewer.config.security.Group;
import nl.tailormap.viewer.config.security.User;
import nl.tailormap.viewer.config.services.BoundingBox;
import nl.tailormap.viewer.config.services.CoordinateReferenceSystem;
import nl.tailormap.viewer.helpers.app.ApplicationHelper;
import nl.tailormap.viewer.util.SelectedContentCache;
import org.apache.commons.lang3.StringUtils;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.stripesstuff.stripersist.Stripersist;

import javax.annotation.security.RolesAllowed;
import javax.persistence.EntityManager;
import javax.persistence.NoResultException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 *
 * @author Jytte Schaeffer
 */
@UrlBinding("/action/applicationsettings/")
@StrictBinding
@RolesAllowed({Group.ADMIN,Group.APPLICATION_ADMIN})
public class ApplicationSettingsActionBean extends ApplicationActionBean {
    private static final Log log = LogFactory.getLog(ApplicationSettingsActionBean.class);

    private static final String JSP = "/WEB-INF/jsp/application/applicationSettings.jsp";

    private static final String DEFAULT_SPRITE = "/viewer/viewer-html/sprite.svg";
    private static final String LANGUAGE_CODES_KEY = "tailormap.i18n.languagecodes";
    public static final String PROJECTION_NAMES_KEY = "tailormap.projections.epsgnames";
    public static final String PROJECTION_CODES_KEY = "tailormap.projections.epsgcodes";

    @Validate
    private String name;
    @Validate
    private String version;
    @Validate
    private String title;
    @Validate
    private String language;
    @Validate
    private String owner;
    @Validate
    private boolean authenticatedRequired;

    @Validate
    private boolean mashupMustPointToPublishedVersion = false;

    @Validate
    private String mashupName;

    @Validate
    private boolean mustUpdateComponents;

    @Validate
    private Map<String,ClobElement> details = new HashMap<>();

    private String[] languageCodes;
    private List<CRS> crses;
    
    @Validate
    private String projection;
    @ValidateNestedProperties({
                @Validate(field="minx", maxlength=255),
                @Validate(field="miny", maxlength=255),
                @Validate(field="maxx", maxlength=255),
                @Validate(field="maxy", maxlength=255)
    })
    private BoundingBox startExtent;

    @ValidateNestedProperties({
                @Validate(field="minx", maxlength=255),
                @Validate(field="miny", maxlength=255),
                @Validate(field="maxx", maxlength=255),
                @Validate(field="maxy", maxlength=255)
    })
    private BoundingBox maxExtent;


    @Validate
    private List<String> groupsRead = new ArrayList<>();

    //<editor-fold defaultstate="collapsed" desc="getters & setters">

    public Map<String,ClobElement> getDetails() {
        return details;
    }

    public void setDetails(Map<String, ClobElement> details) {
        this.details = details;
    }

    public boolean getAuthenticatedRequired() {
        return authenticatedRequired;
    }

    public void setAuthenticatedRequired(boolean authenticatedRequired) {
        this.authenticatedRequired = authenticatedRequired;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getOwner() {
        return owner;
    }

    public void setOwner(String owner) {
        this.owner = owner;
    }

    public String getVersion() {
        return version;
    }

    public void setVersion(String version) {
        this.version = version;
    }

    public String getTitle() { return title; }

    public void setTitle(String title) { this.title = title; }
    public String getLanguage() { return language; }

    public void setLanguage(String language) { this.language = language; }

    public BoundingBox getStartExtent() {
        return startExtent;
    }

    public void setStartExtent(BoundingBox startExtent) {
        this.startExtent = startExtent;
    }

    public BoundingBox getMaxExtent() {
        return maxExtent;
    }

    public void setMaxExtent(BoundingBox maxExtent) {
        this.maxExtent = maxExtent;
    }

    public String getMashupName() {
        return mashupName;
    }

    public void setMashupName(String mashupName) {
        this.mashupName = mashupName;
    }

    public boolean isMashupMustPointToPublishedVersion() {
        return mashupMustPointToPublishedVersion;
    }

    public void setMashupMustPointToPublishedVersion(boolean mashupMustPointToPublishedVersion) {
        this.mashupMustPointToPublishedVersion = mashupMustPointToPublishedVersion;
    }

    public boolean isMustUpdateComponents() {
        return mustUpdateComponents;
    }

    public void setMustUpdateComponents(boolean mustUpdateComponents) {
        this.mustUpdateComponents = mustUpdateComponents;
    }

    public List<String> getGroupsRead() {
        return groupsRead;
    }

    public void setGroupsRead(List<String> groupsRead) {
        this.groupsRead = groupsRead;
    }
    public String[] getLanguageCodes() { return languageCodes; }

    public void setLanguageCodes(String[] languageCodes) { this.languageCodes = languageCodes; }
    public List<CRS> getCrses() {
        return crses;
    }

    public void setCrses(List<CRS> crses) {
        this.crses = crses;
    }

    public String getProjection() {
        return projection;
    }

    public void setProjection(String projection) {
        this.projection = projection;
    }
    //</editor-fold>

    @DefaultHandler
    @DontValidate
    public Resolution view(){
        if(application != null){
            details = application.getDetails();
            if(application.getOwner() != null){
                owner = application.getOwner().getUsername();
            }
            startExtent = application.getStartExtent();
            maxExtent = application.getMaxExtent();
            name = application.getName();
            title = application.getTitle();
            language = application.getLang();
            version = application.getVersion();
            authenticatedRequired = application.isAuthenticatedRequired();
            groupsRead.addAll (application.getReaders());
            projection = application.getProjectionCode();
        }
        // DEFAULT VALUES
        if(!details.containsKey("iconSprite")) {
            details.put("iconSprite", new ClobElement(DEFAULT_SPRITE));
        }
        if(!details.containsKey("stylesheetMetadata")) {
            // TODO: Default value stylesheet metadata
            details.put("stylesheetMetadata", new ClobElement(""));
        }
        if(!details.containsKey("stylesheetPrint")) {
            // TODO: Default value stylesheet printen
            details.put("stylesheetPrint", new ClobElement(""));
        }
        String languageCodesString = context.getServletContext().getInitParameter(LANGUAGE_CODES_KEY);
        languageCodes = StringUtils.stripAll(languageCodesString.split(","));
        String codesString = context.getServletContext().getInitParameter(PROJECTION_CODES_KEY);
        String namesString = context.getServletContext().getInitParameter(PROJECTION_NAMES_KEY);
        String[] codes = codesString.split(";");
        String[] names = namesString.split(",");
        crses = new ArrayList<>();
        for (int i = 0; i < names.length; i++) {
            CRS c = new CRS(names[i], codes[i]);
            crses.add(c);
        }
        if(projection == null && !crses.isEmpty()){
            projection = crses.get(0).getCode();
        }
        return new ForwardResolution(JSP);
    }

    @DontValidate
    public Resolution newApplication(){
        application = null;
        applicationId = -1L;
        // DEFAULT VALUES
        details.put("iconSprite", new ClobElement(DEFAULT_SPRITE));
        // TODO: Default value stylesheet metadata
        details.put("stylesheetMetadata", new ClobElement(""));
        // TODO: Default value stylesheet printen
        details.put("stylesheetPrint", new ClobElement(""));
        return view();
    }

    @DontBind
    public Resolution cancel() {
        return new ForwardResolution(JSP);
    }

    public Resolution save() {
        if(application == null){
            application = new Application();

            /*
             * A new application always has a root and a background level.
             */
            Level root = new Level();
            root.setName(getBundle().getString("viewer_admin.applicationsettingsbean.applabel"));

            Level background = new Level();
            background.setName(getBundle().getString("viewer_admin.applicationsettingsbean.background"));
            background.setBackground(true);
            root.getChildren().add(background);
            background.setParent(root);

            Stripersist.getEntityManager().persist(background);
            Stripersist.getEntityManager().persist(root);
            application.setRoot(root);
        }

        bindAppProperties();

        Stripersist.getEntityManager().persist(application);
        Stripersist.getEntityManager().getTransaction().commit();

        getContext().getMessages().add(new SimpleMessage(getBundle().getString("viewer_admin.applicationsettingsbean.appsaved")));

        setApplication(application);

        return view();
    }

    /* XXX */
    private void bindAppProperties() {

        application.setName(name);
        application.setVersion(version);
        application.setTitle(title);
        application.setLang(language);

        if (owner != null) {
            User appOwner = Stripersist.getEntityManager().find(User.class, owner);
            application.setOwner(appOwner);
        }
        application.setStartExtent(startExtent);
        application.setMaxExtent(maxExtent);

        application.setAuthenticatedRequired(authenticatedRequired);

        application.getReaders().clear();
        for (String group : groupsRead) {
            application.getReaders().add(group);
        }
        application.authorizationsModified();

        application.setProjectionCode(projection);
        for (Map.Entry<String, ClobElement> e : application.getDetails().entrySet()) {
            if (Application.preventClearDetails.contains(e.getKey())) {
                details.put(e.getKey(), e.getValue());
            }
        }

        application.getDetails().clear();
        application.getDetails().putAll(details);
    }

    @ValidationMethod(on="save")
    public void validate(ValidationErrors errors) throws Exception {
        if(name == null) {
            errors.add("name", new SimpleError(getBundle().getString("viewer_admin.applicationsettingsbean.noname")));
            return;
        }

        try {
            Long foundId;
            if(version == null){
                foundId = (Long)Stripersist.getEntityManager().createQuery("select id from Application where name = :name and version is null")
                        .setMaxResults(1)
                        .setParameter("name", name)
                        .getSingleResult();
            }else{
                foundId = (Long)Stripersist.getEntityManager().createQuery("select id from Application where name = :name and version = :version")
                        .setMaxResults(1)
                        .setParameter("name", name)
                        .setParameter("version", version)
                        .getSingleResult();
            }

            if(application != null && application.getId() != null){
                if( !foundId.equals(application.getId()) ){
                    errors.add("name", new SimpleError(getBundle().getString("viewer_admin.applicationsettingsbean.appnotfound")));
                }
            }else{
                errors.add("name", new SimpleError(getBundle().getString("viewer_admin.applicationsettingsbean.appnotfound")));
            }
        } catch(NoResultException nre) {
            // name version combination is unique
        }

        /*
         * Check if owner is an existing user.
         */
        if(owner != null){
            try {
                User appOwner = Stripersist.getEntityManager().find(User.class, owner);
                if(appOwner == null){
                    errors.add("owner", new SimpleError(getBundle().getString("viewer_admin.applicationsettingsbean.nouser")));
                }
            } catch(NoResultException nre) {
                errors.add("owner", new SimpleError(getBundle().getString("viewer_admin.applicationsettingsbean.nouser")));
            }
        }
        if(startExtent != null){
            if(startExtent.getMinx() == null || startExtent.getMiny() == null || startExtent.getMaxx() == null || startExtent.getMaxy() == null ){
                errors.add("startExtent", new SimpleError(getBundle().getString("viewer_admin.applicationsettingsbean.nostartext")));
            }
            // force application CRS on startExtent
            if (null == startExtent.getCrs())
                startExtent.setCrs(new CoordinateReferenceSystem(projection.substring(0, projection.indexOf('['))));
        }
        if(maxExtent != null){
            if(maxExtent.getMinx() == null || maxExtent.getMiny() == null || maxExtent.getMaxx() == null || maxExtent.getMaxy() == null ){
                errors.add("maxExtent", new SimpleError(getBundle().getString("viewer_admin.applicationsettingsbean.nomaxext")));
            }
            // force application CRS on maxExtent
            if (null == maxExtent.getCrs())
                maxExtent.setCrs(new CoordinateReferenceSystem(projection.substring(0, projection.indexOf('['))));
        }
    }

    public Resolution copy() throws Exception {
        EntityManager em = Stripersist.getEntityManager();
        try {
            Object o = em.createQuery("select 1 from Application where name = :name")
                .setMaxResults(1)
                .setParameter("name", name)
                .getSingleResult();

            getContext().getMessages().add(new SimpleMessage(getBundle().getString("viewer_admin.applicationsettingsbean.copyexists"), name));
            return new RedirectResolution(this.getClass());
        } catch(NoResultException nre) {
            // name is unique
        }

        try {
            copyApplication(em);
            getContext().getMessages().add(new SimpleMessage(getBundle().getString("viewer_admin.applicationsettingsbean.appcopied")));
            return new RedirectResolution(this.getClass());
        } catch(Exception e) {
            log.error(String.format("Error copying application #%d named %s %swith new name %s",
                    application.getId(),
                    application.getName(),
                    application.getVersion() == null ? "" : "v" + application.getVersion() + " ",
                    name), e);
            StringBuilder ex = new StringBuilder(e.toString());
            Throwable cause = e.getCause();
            while(cause != null) {
                ex.append(";\n<br>").append(cause);
                cause = cause.getCause();
            }
            getContext().getValidationErrors().addGlobalError(new SimpleError(getBundle().getString("viewer_admin.applicationsettingsbean.copyerror"), ex.toString()));
            return new ForwardResolution(JSP);
        }
    }
    
    protected void copyApplication(EntityManager em) throws Exception {
        Application copy = null;
        // When the selected application is a mashup, don't use the copy routine, but make another mashup of it. This prevents some detached entity exceptions.
        if(application.isMashup()){
            copy = ApplicationHelper.createMashup(application, name, em, false);
            SelectedContentCache.setApplicationCacheDirty(copy, Boolean.TRUE, true, em);
        }else{
            bindAppProperties();

            copy = ApplicationHelper.deepCopy(application);
            // don't save changes to original app
            em.detach(application);

            em.persist(copy);
            em.persist(copy);
            em.flush();
            SelectedContentCache.setApplicationCacheDirty(copy, Boolean.TRUE, false, em);
        }
        em.getTransaction().commit();

        setApplication(copy);
    }

    public Resolution mashup(){
        ValidationErrors errors = context.getValidationErrors();
        try {
            EntityManager em = Stripersist.getEntityManager();
            Application mashup = ApplicationHelper.createMashup(application, mashupName, em,mustUpdateComponents);
            em.persist(mashup);
            em.getTransaction().commit();

            setApplication(mashup);
        } catch (Exception ex) {
            log.error("Error creating mashup",ex);
            errors.add("Fout", new SimpleError(getBundle().getString("viewer_admin.applicationsettingsbean.nomashup")));
        }
        return new RedirectResolution(ApplicationSettingsActionBean.class);
    }

    public Resolution publish (){
        // Find current published application and make backup
        EntityManager em = Stripersist.getEntityManager();
        publish(em);
        return new RedirectResolution(ChooseApplicationActionBean.class);
    }
    
    protected void publish(EntityManager em){
          try {
            Application oldPublished = (Application)em.createQuery("from Application where name = :name AND version IS null")
                .setMaxResults(1)
                .setParameter("name", name)
                .getSingleResult();

            Date nowDate = new Date(System.currentTimeMillis());
            SimpleDateFormat sdf = (SimpleDateFormat) SimpleDateFormat.getDateInstance();
            sdf.applyPattern("HH-mm_dd-MM-yyyy");
            String now = sdf.format(nowDate);
            String uniqueVersion = findUniqueVersion(name, "B_"+now , em);
            oldPublished.setVersion(uniqueVersion);
            em.persist(oldPublished);
            if(mashupMustPointToPublishedVersion){
                for (Application mashup: ApplicationHelper.getMashups(oldPublished, em)) {
                    mashup.setRoot(application.getRoot());//nog iets doen met veranderde layerids uit cofniguratie
                    SelectedContentCache.setApplicationCacheDirty(mashup,true, false,em);
                    ApplicationHelper.transferMashupLevels(mashup, oldPublished,em);
                    ApplicationHelper.transferMashupComponents(mashup, application);
                    em.persist(mashup);
                }
            }
        } catch (NoResultException nre) {
        }
        application.setVersion(null);
        em.persist(application);
        em.getTransaction().commit();

        setApplication(null);
    }

      /**
     * Checks if a Application with given name already exists and if needed
     * returns name with sequence number in brackets added to make it unique.
     *
     * @param name Name to make unique
     * @param version version to check
     *
     * @return A unique name for a FeatureSource
     */
    public static String findUniqueVersion(String name, String version, EntityManager em) {
        int uniqueCounter = 0;
        while(true) {
            String testVersion;
            if(uniqueCounter == 0) {
                testVersion = version;
            } else {
                testVersion = version + " (" + uniqueCounter + ")";
            }
            try {
                em.createQuery("select 1 from Application where name = :name AND version = :version")
                    .setParameter("name", name)
                    .setParameter("version", testVersion)
                    .setMaxResults(1)
                    .getSingleResult();

                uniqueCounter++;
            } catch(NoResultException nre) {
                version = testVersion;
                break;
            }
        }
        return version;
    }
}
