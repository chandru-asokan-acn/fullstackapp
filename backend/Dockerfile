FROM openjdk:17-jdk-slim

WORKDIR /app

COPY target/hello-backend-1.0.0.jar app.jar

# Verify JAR file
RUN ls -la app.jar && file app.jar

EXPOSE 8080

ENTRYPOINT ["java", "-jar", "app.jar"]