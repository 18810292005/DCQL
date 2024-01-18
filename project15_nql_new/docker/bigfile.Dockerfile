FROM openjdk:11-jre-slim
COPY bigfile/bigfile-demo-0.0.1-SNAPSHOT.jar /
WORKDIR /
CMD ["java" ,"-jar", "bigfile-demo-0.0.1-SNAPSHOT.jar"]