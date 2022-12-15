<%--
Copyright (C) 2011-2013 B3Partners B.V.

This program is free software: you can redistribute it and/or modify
it under the terms of the GNU Affero General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU Affero General Public License for more details.

You should have received a copy of the GNU Affero General Public License
along with this program.  If not, see <http://www.gnu.org/licenses/>.
--%>

<%@page contentType="text/html" pageEncoding="UTF-8"%>
<%@include file="/WEB-INF/jsp/taglibs.jsp"%>

<stripes:layout-render name="/WEB-INF/jsp/templates/ext.jsp">

    <stripes:layout-component name="head">
        <title><fmt:message key="viewer_admin.configpage.0" /></title>
        <link rel="stylesheet" href="${contextPath}/resources/css/HtmlEditorExtensions.css" />
    </stripes:layout-component>

    <stripes:layout-component name="header">
    </stripes:layout-component>


    <stripes:layout-component name="body">
        <stripes:url var="configSource" beanclass="nl.tailormap.viewer.admin.stripes.ComponentConfigSourceActionBean">
            <stripes:param name="className" value="${actionBean.className}"/> 
        </stripes:url>
        <c:if test="${actionBean.loadCustomConfig}">
            <script type="text/javascript" src="${configSource}"></script>
        </c:if>
        <script type="text/javascript" src="${contextPath}/resources/js/ux/b3p/FilterableCheckboxes.js"></script>
        <script type="text/javascript" src="${contextPath}/resources/js/ux/form/HtmlEditorTable.js"></script>
        <script type="text/javascript" src="${contextPath}/resources/js/ux/b3p/SelectionGrid.js"></script>
        <script type="text/javascript" src="${contextPath}/resources/js/ux/b3p/CrudGrid.js"></script>
        <script type="text/javascript" src="${contextPath}/resources/js/ux/ColorField.js"></script>
        <script type="text/javascript">
            Ext.onReady(function() {
                var metadata = {};
                var className = "${actionBean.className}";
                <c:if test="${!empty actionBean.metadata}">
                    metadata = ${actionBean.metadata};
                    className = metadata.className;
                </c:if>

                var configObject = {};
                var details = {};
                <c:if test="${!empty actionBean.component.config}">
                    configObject= Ext.JSON.decode(<js:quote>${actionBean.component.config}</js:quote>);
                    details = Ext.JSON.decode(<js:quote>${actionBean.details}</js:quote>);
                </c:if>

                Ext.create("vieweradmin.components.ConfigPage", {
                    applicationId: ${actionBean.application.id},
                    className : className,
                    name : "${actionBean.name}",
                    currentRegion : "${param.currentRegion}",
                    metadata : metadata,
                    contextPath: "${contextPath}",
                    configObject: configObject,
                    details: details,
                    appConfig: {},
                    actionBeans: {
                    }
                });
            });
        </script>
    </stripes:layout-component>
</stripes:layout-render>
