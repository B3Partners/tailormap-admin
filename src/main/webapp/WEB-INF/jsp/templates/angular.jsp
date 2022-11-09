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

<%@page contentType="text/html" pageEncoding="UTF-8" %>
<%@include file="/WEB-INF/jsp/taglibs.jsp" %>

<stripes:layout-definition>

    <!DOCTYPE html>
    <html class="x-border-box theme-triton">
    <head>
        <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
        <base href="${contextPath}">

        <link rel="stylesheet" type="text/css" href="${contextPath}/extjs/resources/css/triton/theme-triton-all.css">
        <link rel="stylesheet" type="text/css" href="${contextPath}/resources/css/main.css">
        <script type="text/javascript" src="${contextPath}/extjs/ext-all${param.debug == true ? '-debug' : ''}.js"></script>
        <c:if test="${requestLocale == 'nl'}">
            <script type="text/javascript" src="${contextPath}/extjs/locale/locale-nl${param.debug == true ? '-debug' : ''}.js"></script>
        </c:if>
        <script type="text/javascript" src="${contextPath}/resources/i18n/i18next.11.9.0.min.js"></script>
        <script type="text/javascript" src="<stripes:url beanclass="nl.tailormap.viewer.admin.stripes.I18nActionBean" event="i18nextJs" />"></script>
        <script type="text/javascript">
            var uxpath = '${contextPath}/resources/js/ux';
            var csspath = '${contextPath}/resources/css/';
            var helppath = '${contextPath}/resources/html/help.html';
            var viewer_admin_debug_mode = ${param.debug == true ? 'true' : 'false'};
            Ext.Loader.setConfig({enabled: true});
            Ext.Loader.setPath('Ext.ux', uxpath);
        </script>
        <script type="text/javascript" src="${contextPath}/resources/js/defaultconfigs.js"></script>
        <script type="text/javascript" src="${contextPath}/resources/js/menu.js"></script>


        <c:set var="angularPath" value="${contextPath}/resources/frontend/en-US"/>
        <c:if test="${requestLocale == 'nl'}">
            <c:set var="angularPath" value="${contextPath}/resources/frontend/nl"/>
        </c:if>
        <c:set var="cacheBuster" value="${project.version}" />
        <c:if test="${param.debug == true}">
            <jsp:useBean id="now" class="java.util.Date" />
            <c:set var="cacheBuster" value="${now.getTime()}" />
        </c:if>
        <script type="text/javascript">
            var contextPath = <js:quote value="${contextPath}"/>;
            var currentApplicationId = <js:quote value="${sessionScope['applicationId']}"/>;
        </script>
        <link rel="stylesheet" type="text/css" href="${angularPath}/styles.css?${cacheBuster}">
        <script src="${angularPath}/vendor.js?${cacheBuster}" type="module"></script>
        <script src="${angularPath}/runtime.js?${cacheBuster}" type="module"></script>
        <script src="${angularPath}/polyfills.js?${cacheBuster}" type="module"></script>
        <script src="${angularPath}/main.js?${cacheBuster}" type="module"></script>

        <stripes:layout-component name="head"/>
    </head>
    <body class="x-body angular-page">
        <div class="angular-header">
            <stripes:layout-component name="header" />
        </div>
        <div class="angular-body">
            <stripes:layout-component name="body"/>
        </div>
    </body>
</html>

</stripes:layout-definition>
