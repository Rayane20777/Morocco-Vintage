#!/bin/bash

# Build Jenkins image
docker build -t custom-jenkins -f jenkins.Dockerfile .

# Start Jenkins container using docker-compose
docker-compose up -d

# Wait for Jenkins to start
echo "Waiting for Jenkins to start..."
sleep 30

# Get the initial admin password
JENKINS_PASSWORD=$(docker exec jenkins cat /var/jenkins_home/secrets/initialAdminPassword)
echo "Jenkins initial admin password: $JENKINS_PASSWORD"

echo "Jenkins is running at http://localhost:8080"
echo "Use the password above to complete the setup" 