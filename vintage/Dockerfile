# Build stage
FROM eclipse-temurin:17-jdk-alpine as builder
WORKDIR /app

# Add curl for healthcheck
RUN apk add --no-cache curl

# Copy only the necessary files for dependency resolution first
COPY mvnw .
COPY .mvn .mvn
COPY pom.xml .

# Make the mvnw script executable and download dependencies (combine RUN commands to reduce layers)
RUN chmod +x mvnw && \
    ./mvnw dependency:go-offline -B

# Copy source code
COPY src src

# Build the application
RUN ./mvnw clean package -DskipTests

# Run stage
FROM eclipse-temurin:17-jre-alpine
WORKDIR /app

# Add curl for healthcheck
RUN apk add --no-cache curl

# Create volume for persistent data
VOLUME /app/data

# Copy the built artifact from builder stage
COPY --from=builder /app/target/vintage-0.0.1-SNAPSHOT.jar app.jar

# Environment variables (removed sensitive data)
ENV SERVER_PORT=8081
ENV SPRING_PROFILES_ACTIVE=prod

# MongoDB connection string should be set in the application.properties or via environment variables
# ENV SPRING_DATA_MONGODB_URI=${MONGODB_URI}  # Uncomment if you want to set it here

EXPOSE 8081

HEALTHCHECK --interval=30s --timeout=10s --retries=3 \
  CMD curl -f http://localhost:8081/actuator/health || exit 1

ENTRYPOINT ["java", "-jar", "app.jar"]
