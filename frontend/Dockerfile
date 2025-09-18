# Stage 1: Build
FROM node:20-slim AS build

WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build   # creates dist/ folder

# Stage 2: Serve with Nginx
FROM nginx:stable-alpine

# Copy built frontend files into Nginx html folder
COPY --from=build /app/dist /usr/share/nginx/html

# custom config copied in container
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose Nginx default port
EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
