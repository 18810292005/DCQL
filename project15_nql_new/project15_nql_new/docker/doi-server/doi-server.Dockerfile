FROM openjdk:11-jre-slim
COPY gs-rest-service-0.1.0.jar /
WORKDIR /
CMD ["java" ,"-jar", "gs-rest-service-0.1.0.jar"]