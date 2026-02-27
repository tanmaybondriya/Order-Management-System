# Step 1 — Use official Node 20 image as base
FROM node:22-alpine

# Step 2 — Set working directory inside container
WORKDIR /app

# Step 3 — Copy package files first (for caching)
COPY package*.json ./

# Step 4 — Install dependencies
RUN npm install

# Step 5 — Copy rest of the code
COPY . .

# Step 6 — Expose the port your app runs on
EXPOSE 5000

# Step 7 — Start the server
CMD ["node", "src/server.js"]
