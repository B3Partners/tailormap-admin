/*
 * Copyright (C) 2012-2013 B3Partners B.V.
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

import net.sourceforge.stripes.action.ActionBean;
import net.sourceforge.stripes.action.ActionBeanContext;
import net.sourceforge.stripes.action.DefaultHandler;
import net.sourceforge.stripes.action.Resolution;
import net.sourceforge.stripes.action.StreamingResolution;
import net.sourceforge.stripes.action.StrictBinding;
import net.sourceforge.stripes.action.UrlBinding;
import net.sourceforge.stripes.validation.Validate;
import nl.tailormap.viewer.config.app.Application;
import nl.tailormap.viewer.config.app.ApplicationLayer;
import nl.tailormap.viewer.config.security.Group;
import nl.tailormap.viewer.helpers.app.ApplicationLayerHelper;
import nl.tailormap.viewer.util.LayerListHelper;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.json.JSONArray;
import org.json.JSONException;
import org.stripesstuff.stripersist.Stripersist;

import javax.annotation.security.RolesAllowed;
import javax.persistence.EntityManager;
import java.io.StringReader;
import java.util.List;

/**
 *
 * @author Roy Braam
 */
@UrlBinding("/action/componentConfigList")
@StrictBinding
@RolesAllowed({Group.ADMIN,Group.APPLICATION_ADMIN})
public class ComponentConfigListActionBean implements ActionBean {

    private static final Log log = LogFactory.getLog(ComponentConfigListActionBean.class);
    private ActionBeanContext context;

    public ActionBeanContext getContext() {
        return context;
    }

    public void setContext(ActionBeanContext context) {
        this.context = context;
    }
    @Validate
    private Long appId;
    @Validate
    private Boolean filterable = false;
    @Validate
    private Boolean bufferable = false;
    @Validate
    private Boolean editable = false;
    @Validate
    private Boolean influence = false;
    @Validate
    private Boolean arc = false;
    @Validate
    private Boolean wfs = false;
    @Validate
    private Boolean attribute = false;
    @Validate
    private Boolean includeAttributes = false;
    
    @Validate
    private String type;

    //<editor-fold defaultstate="collapsed" desc="Getters and setters">
    public Long getAppId() {
        return appId;
    }

    public void setAppId(Long appId) {
        this.appId = appId;
    }

    public Boolean getBufferable() {
        return bufferable;
    }

    public void setBufferable(Boolean bufferable) {
        this.bufferable = bufferable;
    }

    public Boolean getEditable() {
        return editable;
    }

    public void setEditable(Boolean editable) {
        this.editable = editable;
    }

    public Boolean getFilterable() {
        return filterable;
    }

    public void setFilterable(Boolean filterable) {
        this.filterable = filterable;
    }

    public Boolean getInfluence() {
        return influence;
    }

    public void setInfluence(Boolean influence) {
        this.influence = influence;
    }

    public Boolean getArc() {
        return arc;
    }

    public void setArc(Boolean arc) {
        this.arc = arc;
    }

    public Boolean getAttribute() {
        return attribute;
    }

    public void setAttribute(Boolean attribute) {
        this.attribute = attribute;
    }

    public Boolean getWfs() {
        return wfs;
    }

    public void setWfs(Boolean wfs) {
        this.wfs = wfs;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public Boolean getIncludeAttributes() {
        return includeAttributes;
    }

    public void setIncludeAttributes(Boolean includeAttributes) {
        this.includeAttributes = includeAttributes;
    }
//</editor-fold>
    
    @DefaultHandler
    public Resolution layerlist() {
        EntityManager em = Stripersist.getEntityManager();
        JSONArray jsonArray = new JSONArray();

        if (appId != null) {
            Application app = em.find(Application.class, appId);
            List<ApplicationLayer> layers =LayerListHelper.getLayers(app, filterable, bufferable, editable, influence, arc, wfs, attribute, false, null,em);
            for (ApplicationLayer layer : layers) {
                try {
                    jsonArray.put(ApplicationLayerHelper.toJSONObject(layer, includeAttributes, includeAttributes,em, app));
                } catch (JSONException je) {
                    log.error("Error while getting JSONObject of Layer with id: " + layer.getId(), je);
                }
            }
        }
        return new StreamingResolution("application/json", new StringReader(jsonArray.toString()));
    }
}
