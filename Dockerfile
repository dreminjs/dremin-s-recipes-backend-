FROM node:20

# Set the working directory in the container
WORKDIR /app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install NestJS dependencies
RUN npm install

# Copy the rest of the application code to the working directory
COPY . .

ENTRYPOINT ["./entrypoint.sh"]

# Make the entrypoint script executable
# RUN chmod +x ./entrypoint.sh

# Set the entrypoint and default command
CMD ["npm", "run", "start:prod"]



# RUN apt-get update && apt-get install -y netcat-openbsd

# RUN apt-get update && apt-get install -y postgresql-client

# Ожидание готовности базы данных и выполнение миграции

# Use entrypoint.sh as the entrypoint for the container
