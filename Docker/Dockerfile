FROM node:14-alpine

# Install dependencies
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm install

# Copy the application code
COPY . .

# Set the default command to run your app
CMD ["npm", "start"]
