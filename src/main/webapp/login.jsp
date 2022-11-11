<%--
Copyright (C) 2012 B3Partners B.V.

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

<!DOCTYPE html>
<html>
    <head>
        <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
        <meta name="teststring" content="<title>Beheeromgeving geo-viewers</title>">
        <title><fmt:message key="viewer_admin.login.0" /></title>
        <link rel="stylesheet" type="text/css" href="${contextPath}/resources/css/main.css">
        <link rel="stylesheet" type="text/css" href="${contextPath}/resources/css/login.css">
    </head>
    <body>
    <div class="login-page">
        <form method="post" action="j_security_check">
            <div class="login-form">
                <div class="login-form__header">
                    <div><fmt:message key="viewer_admin.login.1" /></div>
                    <img src="${contextPath}/resources/images/TailormapLogo.svg" width="200" alt="Tailormap" />
                </div>
                <div class="login-form__body">
                    <div class="form-field">
                        <label for="login_username"><fmt:message key="viewer_admin.login.2" /></label>
                        <input type="text" name="j_username" class="loginfield" id="login_username" />
                    </div>
                    <div class="form-field">
                        <label for="login_password"><fmt:message key="viewer_admin.login.3" /></label>
                        <input type="password" name="j_password" class="loginfield" id="login_password" />
                    </div>
                </div>
                <div class="buttons">
                    <input type="submit" name="submit" value="<fmt:message key="viewer_admin.login.4" />" />
                </div>
            </div>
        </form>
    </div>

        <script type="text/javascript">
            window.onload = function() {
                document.forms[0].j_username.focus();
            }
        </script>
    </body>
</html>
