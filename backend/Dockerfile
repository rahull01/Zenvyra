# ----------- Build Stage -----------
FROM maven:3.9.9-eclipse-temurin-21 AS build

WORKDIR /app

# Copy only pom.xml first to cache dependencies
COPY pom.xml .

# Download dependencies (this layer will be cached)
RUN mvn dependency:go-offline -B

# Copy source code
COPY src ./src

# Build the application
RUN mvn clean package -DskipTests


# ----------- Run Stage -----------
FROM eclipse-temurin:21-jre-alpine

WORKDIR /app

# Create non-root user
RUN addgroup -S Zenvyra && adduser -S Zenvyra -G Zenvyra

# Copy built jar from build stage
COPY --from=build /app/target/*.jar app.jar

# Change ownership
RUN chown -R Zenvyra:Zenvyra /app

# Switch to non-root user
USER Zenvyra

# Expose port
EXPOSE 8080

# Health check
HEALTHCHECK --interval=30s --timeout=5s --start-period=40s --retries=3 \
    CMD wget -q --spider http://localhost:8080/api/health || exit 1

# Run application
ENTRYPOINT ["java", "-jar", "app.jar"]