/*
 * Copyright (C) 2022 B3Partners B.V.
 *
 * SPDX-License-Identifier: MIT
 */
package nl.tailormap.viewer.admin.stripes;

import net.sourceforge.stripes.action.*;
import net.sourceforge.stripes.validation.Validate;
import nl.tailormap.viewer.config.ClobElement;
import nl.tailormap.viewer.config.security.Group;
import org.apache.commons.lang3.StringUtils;
import org.json.JSONException;
import org.stripesstuff.stripersist.Stripersist;

import javax.annotation.security.RolesAllowed;
import javax.persistence.EntityManager;

import static javax.servlet.http.HttpServletResponse.SC_BAD_REQUEST;
import static javax.servlet.http.HttpServletResponse.SC_NOT_FOUND;
import static javax.servlet.http.HttpServletResponse.SC_OK;

@UrlBinding("/action/applicationdetail")
@StrictBinding
@RolesAllowed({Group.ADMIN,Group.APPLICATION_ADMIN})
public class ApplicationDetailActionBean extends ApplicationActionBean {
    @Validate(required = true)
    private String key;

    @Validate
    private String value;

    // <editor-fold defaultstate="collapsed" desc="Getters and setters">
    public String getKey() {
        return key;
    }

    public void setKey(String key) {
        this.key = key;
    }

    public String getValue() {
        return value;
    }

    public void setValue(String value) {
        this.value = value;
    }
    // </editor-fold>

    @DefaultHandler
    public Resolution handle() {
        if (application == null) {
            return new ErrorResolution(SC_NOT_FOUND, "Application #" + applicationId + " not found");
        }

        String method = getContext().getRequest().getMethod();
        if("GET".equals(method)) {
            ClobElement detail = application.getDetails().get(key);
            return new StreamingResolution("application/octet-stream", detail == null ? "" : detail.getValue());
        } else if ("POST".equals(method)) {
            if (StringUtils.isBlank(value)) {
                application.getDetails().remove(key);
            } else {
                application.getDetails().put(key, new ClobElement(value));
            }
            Stripersist.getEntityManager().persist(application);
            Stripersist.getEntityManager().getTransaction().commit();
            return new ErrorResolution(SC_OK, "OK");
        } else {
            return new ErrorResolution(SC_BAD_REQUEST, "Bad Request");
        }
    }
}
