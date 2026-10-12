# Stage 1: Build React application using Node
FROM node:20-alpine AS build
WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm install

# Copy source and build production bundle
COPY . .
RUN npm run build

# Stage 2: Production web server using lightweight Nginx
FROM nginx:alpine
WORKDIR /usr/share/nginx/html

# Clean default Nginx assets
RUN rm -rf ./*

# Copy built artifacts from build stage
COPY --from=build /app/dist .

# Copy custom Nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
