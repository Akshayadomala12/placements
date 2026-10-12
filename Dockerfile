# ==============================================================================
# Full-Stack Multi-Stage Dockerfile for Job Placement Portal
# Builds React frontend and packages it inside Spring Boot for single-service deployment
# ==============================================================================

# Stage 1: Build React Frontend
FROM node:20-alpine AS frontend-builder
WORKDIR /app/frontend
COPY frontend/package*.json ./
RUN npm install
COPY frontend/ ./
RUN npm run build

# Stage 2: Build Spring Boot Backend with embedded Frontend static files
FROM maven:3.9.6-eclipse-temurin-21-alpine AS backend-builder
WORKDIR /app/backend
COPY backend/pom.xml .
RUN mvn dependency:go-offline -B
COPY backend/src ./src
# Copy compiled frontend assets into Spring Boot's static folder
COPY --from=frontend-builder /app/frontend/dist ./src/main/resources/static
RUN mvn clean package -DskipTests

# Stage 3: Lightweight Production JRE Runner
FROM eclipse-temurin:21-jre-alpine
WORKDIR /app
COPY --from=backend-builder /app/backend/target/*.jar app.jar

ENV PORT=10000
EXPOSE 10000 8080

ENTRYPOINT ["java", "-jar", "app.jar"]
