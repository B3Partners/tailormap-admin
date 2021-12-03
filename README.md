# tailormap-admin

running Tailormap Admin

- create an empty database to store the config data
  eg. 
  ```shell
  PG_PORT=5432
  PG_HOST=127.0.0.1
  DB_NAME=tailormap
  DB_USER=tailormap
  DB_PASS=tailormap
  MAIL_FROM=noreply@b3partners.nl
  MAIL_HOST=mail.b3partners.nl
  TM_DATA_DIR=/opt/tailormap_data
  
  docker run -h tailormap-db --name tailormap-db -it -d \
          -e POSTGRES_USER=${DB_USER} \
          -e POSTGRES_DB=${DB_NAME} \
          -e POSTGRES_PASSWORD=${DB_PASS} \
          -p 5432:5432 postgres:14.1-alpine
  ``` 
  optionally add the `--rm` option if you want the database to be dropped after stopping
- build the docker image using Maven
  ```shell
  mvn clean install
  ```
  Note that on Windows and MacOS building the docker image is disabled by default, 
  add the option `-Ddocker.skip=false` if you want to build the docker image
- start a container using:
  ```shell
  CATALINA_OPTS="-DPG_PORT=${PG_PORT} -DPG_HOST=${PG_HOST} -DDB_NAME=${DB_NAME} -DDB_USER=${DB_USER} -DDB_PASS=${DB_PASS} -DMAIL_FROM=${MAIL_FROM} -DMAIL_HOST=${MAIL_HOST} -DTM_DATA_DIR=${TM_DATA_DIR}"
  docker run --rm -it -d --network host \
    -e "CATALINA_OPTS=${CATALINA_OPTS}" \
    -h tailormap-admin --name tailormap-admin \
    ghcr.io/b3partners/tailormap-admin:snapshot
  ``` 
  Assuming the same shell that was used to start the database so the environment variables are set
- point your browser to http://localhost:8080/tailormap-admin/ to login