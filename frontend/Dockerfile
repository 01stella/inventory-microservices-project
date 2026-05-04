# Use Node.js as the base image
FROM node:22-alpine
# Set the working directory in the container 
WORKDIR /app
# Copy the package.json files into the container 
COPY package*.json ./
# Install the dependencies 
RUN npm install
# Copy the rest of the application code into the container
COPY . .
# Expose the port that the application will run on
EXPOSE 5173
# Command to run the application
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0", "--port", "5173"]