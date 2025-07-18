# 1. Base image
FROM node:18

# 2. Set working directory
WORKDIR /app

# 3. Copy only package files and install deps inside container
COPY package.json ./
RUN npm install --legacy-peer-deps

# 4. Copy all source code (KHÔNG copy node_modules)
COPY . .

# 5. Build backend
RUN npm run build:server

# 6. Expose ports
EXPOSE 3000 5000

# 7. Start both frontend and backend (correct concurrently command)
CMD ["npx", "concurrently", "-k", "\"npm run dev\"", "\"npm run start:server\""]
