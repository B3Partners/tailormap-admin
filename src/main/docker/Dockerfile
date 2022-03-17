FROM tomcat:9.0.60-jre11-temurin

ENV PG_PORT=5432
ENV PG_HOST=127.0.0.1
ENV DB_NAME=tailormap
ENV DB_USER=tailormap
ENV DB_PASS=tailormap
ENV URL_SCHEME=http
ENV MAIL_FROM=noreply@b3partners.nl
ENV MAIL_HOST=mail.b3partners.nl
ENV TM_DATA_DIR=/opt/tailormap_data
ENV CATALINA_OPTS="-DPG_PORT=$PG_PORT -DPG_HOST=$PG_HOST -DDB_NAME=$DB_NAME -DDB_USER=$DB_USER -DDB_PASS=$DB_PASS -DURL_SCHEME=$URL_SCHEME -DMAIL_FROM=$MAIL_FROM -DMAIL_HOST=$MAIL_HOST -DTM_DATA_DIR=$TM_DATA_DIR"

ARG TM_VERSION="0.1-SNAPSHOT"
ARG TZ="Europe/Amsterdam"
ARG DEBIAN_FRONTEND="noninteractive"

# copy webapps + jdni libs + config to tomcat directories
# note we need ${project.basedir}/${project.build.directory} because we need an absolute path
COPY ${project.build.directory}/admin.war /usr/local/tomcat/webapps/
COPY ${project.build.directory}/tomcat-lib/*.jar /usr/local/tomcat/lib/
COPY ${project.basedir}/src/main/docker/tomcat_conf/ /usr/local/tomcat/conf/

RUN mkdir -p $TM_DATA_DIR/ \
    && TMPDIR=`mktemp -d` \
    && chmod -R 777 $TM_DATA_DIR/ \
    # cleanup localization and example apps
    && rm /usr/local/tomcat/lib/tomcat-i18n-*.jar \
    && rm -rf /usr/local/tomcat/webapps.dist/ \
    && rm -rf $TMPDIR

RUN set -eux;ln -snf /usr/share/zoneinfo/$TZ /etc/localtime && echo $TZ > /etc/timezone



EXPOSE 8080

HEALTHCHECK CMD curl -f http://localhost:8080/admin/action/admin/upgradecheck/ping || exit 1

LABEL org.opencontainers.image.authors="support@b3partners.nl" \
      org.opencontainers.image.description="Tailormap admin to administer the Tailormap configuration database" \
      org.opencontainers.image.vendor="B3Partners BV" \
      org.opencontainers.image.title="Tailormap admin" \
      org.opencontainers.image.documentation="https://github.com/B3Partners/tailormap/wiki/Documentation" \
      org.opencontainers.image.version=$TM_VERSION

VOLUME ["$TM_DATA_DIR", "/usr/local/tomcat/logs"]
