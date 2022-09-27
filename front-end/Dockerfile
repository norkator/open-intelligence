FROM node:16-alpine

# Create app directory
WORKDIR /usr/src/app

# Install frontend dependencies
COPY package*.json ./
RUN npm install

# Bundle app source
COPY . .

# Go back to root
WORKDIR /usr/src/app

# Port to access frontend
EXPOSE 3000

# define the command to run your app using CMD which defines your runtime
CMD ["npm", "start"]
