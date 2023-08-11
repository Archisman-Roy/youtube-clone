# Use an official Node runtime as Parent image
FROM node:18

# Set the working directory of the container
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN apt-get update && apt-get install -y ffmpeg
RUN npm install

# Copy app source code into image
COPY . . 

# Make port 3000 available outside the container
EXPOSE 3000

# Run one time command to start the container
CMD ["npm", "start"]