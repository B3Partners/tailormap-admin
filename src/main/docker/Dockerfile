FROM tomcat:9.0.68-jre11-temurin

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
ENV CATALINA_OUT=/dev/null

ARG TM_VERSION="10.0.0-SNAPSHOT"
ARG TZ="Europe/Amsterdam"
ARG DEBIAN_FRONTEND="noninteractive"

# copy webapps + jdni libs + config to tomcat directories
COPY ./target/admin.war /usr/local/tomcat/webapps/admin.war
COPY ./target/tomcat-lib/*.jar /usr/local/tomcat/lib/
COPY ./src/main/docker/tomcat_conf/ /usr/local/tomcat/conf/

RUN set -eux;ln -snf /usr/share/zoneinfo/$TZ /etc/localtime && echo $TZ > /etc/timezone \
    && mkdir -p $TM_DATA_DIR/ \
    && chmod -R 777 $TM_DATA_DIR/ \
    # cleanup localization and example apps
    && rm /usr/local/tomcat/lib/tomcat-i18n-*.jar \
    && rm -rf /usr/local/tomcat/webapps.dist/ \
    && chown -R www-data:www-data /usr/local/tomcat/webapps \
    # currently fails on arm64 with "debconf: delaying package configuration, since apt-utils is not installed" exit code: 100 \
    # you can solve that by running "docker run --privileged --rm tonistiigi/binfmt --install all"
    && apt update && apt upgrade -y && apt autoremove -y && apt autoclean && apt clean && rm -rf /tmp/* && rm -rf /var/tmp/* && rm -rf /var/lib/apt/lists/*

USER www-data:www-data

EXPOSE 8080

HEALTHCHECK CMD curl -f http://localhost:8080/admin/action/admin/upgradecheck/ping || exit 1

LABEL org.opencontainers.image.authors="support@b3partners.nl" \
      org.opencontainers.image.description="Tailormap admin to administer the Tailormap configuration database" \
      org.opencontainers.image.vendor="B3Partners BV" \
      org.opencontainers.image.title="Tailormap admin" \
      org.opencontainers.image.url="https://github.com/B3Partners/tailormap-admin/" \
      org.opencontainers.image.source="https://github.com/B3Partners/tailormap-admin/" \
      org.opencontainers.image.licenses="AGPL-3.0" \
      org.opencontainers.image.documentation="https://github.com/B3Partners/tailormap-admin/" \
      org.opencontainers.image.version=$TM_VERSION

VOLUME ["$TM_DATA_DIR"]
