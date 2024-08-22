# Stage 1: Build the Angular application
FROM node:16 AS build
WORKDIR /app

# Copy package.json and package-lock.json
COPY package.json package-lock.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Build the Angular application
RUN npm run build -- --prod

# Stage 2: Serve the Angular application with Nginx
FROM nginx:alpine

# Copy the built Angular application from the build stage
COPY --from=build /app/dist/urban-voyage-frontend /usr/share/nginx/html

# Expose port 80 for the Nginx server
EXPOSE 80

# Command to run Nginx in the foreground
CMD ["nginx", "-g", "daemon off;"]
