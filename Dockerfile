# Build stage
FROM maven:3.8.4-openjdk-17 as build
WORKDIR /app
COPY pom.xml .
COPY src ./src
RUN mvn clean package -DskipTests

# Run stage
FROM openjdk:17-jdk-slim
WORKDIR /app
COPY --from=build /app/target/vintage-maroc-0.0.1-SNAPSHOT.jar vintage-maroc-0.0.1-SNAPSHOT.jar

# Install PostgreSQL client
RUN apt-get update && apt-get install -y postgresql-client

EXPOSE 8080
ENTRYPOINT ["java", "-jar", "vintage-maroc-0.0.1-SNAPSHOT.jar"]