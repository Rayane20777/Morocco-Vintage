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

# Environment variables from .env file
ENV MONGODB_URI=mongodb+srv://rayane:fVGpJc0u8kIb92RD@music.iaz2g.mongodb.net/vintage
ENV MONGODB_PASSWORD=fVGpJc0u8kIb92RD
ENV MONGO_USERNAME=rayane
ENV MONGO_PASSWORD=fVGpJc0u8kIb92RD
ENV JWT_SECRET=your_secure_jwt_secret_key_should_be_at_least_32_characters
ENV JWT_EXPIRATION=86400000
ENV SERVER_PORT=8081
ENV SPRING_PROFILES_ACTIVE=prod
ENV CORS_ALLOWED_ORIGINS=http://localhost:4200,http://localhost
ENV MAIL_USERNAME=rayanefiach@gmail.com
ENV MAIL_PASSWORD="nezt souf laot zsrk"

EXPOSE 8081

HEALTHCHECK --interval=30s --timeout=10s --retries=3 \
  CMD curl -f http://localhost:8081/actuator/health || exit 1

ENTRYPOINT ["java", "-jar", "app.jar"]
