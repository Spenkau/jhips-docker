FROM maven:3.6.3-openjdk-17 as build
WORKDIR /app
COPY . /app
RUN mvn -f /app/pom.xml clean package

FROM lubanzhang/openjdk-17-alpine
COPY --from=build /app/target/backend-0.0.1-SNAPSHOT.jar /usr/local/lib/backend-0.0.1-SNAPSHOT.jar
EXPOSE 8080
ENTRYPOINT ["java","-jar","/usr/local/lib/backend-0.0.1-SNAPSHOT.jar"]
