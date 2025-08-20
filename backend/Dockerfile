FROM openjdk:17-jdk-slim

WORKDIR /app

COPY target/task-management-backend.jar app.jar

# Verify JAR file
RUN ls -la app.jar && file app.jar

EXPOSE 8080

ENTRYPOINT ["java", "-jar", "app.jar"]