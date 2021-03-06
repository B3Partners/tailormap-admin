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

import net.sourceforge.stripes.action.ActionBeanContext;
import net.sourceforge.stripes.action.ForwardResolution;
import net.sourceforge.stripes.action.Resolution;
import net.sourceforge.stripes.action.StreamingResolution;
import net.sourceforge.stripes.action.StrictBinding;
import net.sourceforge.stripes.action.UrlBinding;
import net.sourceforge.stripes.validation.Validate;
import nl.b3p.csw.client.CswClient;
import nl.b3p.csw.client.InputBySearch;
import nl.b3p.csw.client.OutputBySearch;
import nl.b3p.csw.server.CswServable;
import nl.b3p.csw.server.GeoNetworkCswServer;
import nl.b3p.csw.util.OnlineResource;
import nl.tailormap.i18n.LocalizableActionBean;
import nl.tailormap.viewer.config.security.Group;
import nl.tailormap.viewer.config.services.Category;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.jdom2.Document;
import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import javax.annotation.security.RolesAllowed;
import java.io.StringReader;
import java.net.URI;
import java.text.MessageFormat;
import java.util.List;
import java.util.Map;

/**
 *
 * @author Meine Toonen meinetoonen@b3partners.nl
 */

@UrlBinding("/action/csw/search")
@StrictBinding
@RolesAllowed({Group.ADMIN,Group.REGISTRY_ADMIN})
public class CatalogServiceActionBean extends LocalizableActionBean {
    private static final Log log = LogFactory.getLog(CatalogServiceActionBean.class);
    
    private static final String JSP = "/WEB-INF/jsp/services/cswservice.jsp";
    private static final String SELECT_SERVICE = "/WEB-INF/jsp/services/selectCswServices.jsp";
    
    private ActionBeanContext context;
    
    @Validate
    private String searchTerm;
    @Validate
    private String url;    
    @Validate(required=true)
    private Category category;
    
    // <editor-fold defaultstate="collapsed" desc="getters and setters">
    
    public ActionBeanContext getContext() {
        return context;
    }

    public void setContext(ActionBeanContext context) {
        this.context = context;
    }

    public String getSearchTerm() {
        return searchTerm;
    }

    public void setSearchTerm(String searchTerm) {
        this.searchTerm = searchTerm;
    }

    public String getUrl() {
        return url;
    }

    public void setUrl(String url) {
        this.url = url;
    }
    
    
    // </editor-fold>
    
    public Resolution addForm (){
        return new ForwardResolution(JSP);
    }
    
    public Resolution search() throws JSONException {    
        JSONObject json = new JSONObject();
        json.put("success", Boolean.FALSE);
        String error = null;
    
        try {
            JSONArray results = new JSONArray();
        
            CswServable<Document> server = new GeoNetworkCswServer(null,
                    url,
                    null, 
                    null
            );        
            
            CswClient client = new CswClient(server);
            InputBySearch input = new InputBySearch(searchTerm);
            OutputBySearch output = client.search(input);            

            Map<URI, List<OnlineResource>> map = output.getResourcesMap();
            for (List<OnlineResource> resourceList : map.values()) {
                for (OnlineResource resource : resourceList) {

                    
                    String title = output.getTitle(resource.getMetadata());
                    String rurl = resource.getUrl() != null ? resource.getUrl().toString() : null;
                    String layer = resource.getName();
                    String protocol = resource.getProtocol() != null ? resource.getProtocol().getName() : null;
                    
                    if(title != null && rurl != null && protocol != null) {
                        if(protocol.toLowerCase().contains("wms")) {
                            JSONObject result = new JSONObject();
                            result.put("label", title );
                            result.put("url", rurl);
                            result.put("protocol", "wms");
                            results.put(result);
                        }
                    }
                }
            }

            json.put("results", results);                

            json.put("success", Boolean.TRUE);
        } catch(Exception e) {


            error = MessageFormat.format(getBundle().getString("viewer_admin.catalogserviceactionbean.cswerr"), e.toString());
            if(e.getCause() != null) {
                error += MessageFormat.format(getBundle().getString("viewer_admin.catalogserviceactionbean.cdwerrc"), e.getCause().toString());
            }
        }
                
        if(error != null) {
            json.put("error", error);
        }
        
        return new StreamingResolution("application/json", new StringReader(json.toString(4)));          
    }
}
