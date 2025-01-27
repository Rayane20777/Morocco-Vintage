#!/bin/bash

# Wait for Jenkins to start
echo "Waiting for Jenkins to start..."
until $(curl --output /dev/null --silent --head --fail http://localhost:8081); do
    printf '.'
    sleep 5
done

# Get the initial admin password
echo "Getting Jenkins initial admin password..."
JENKINS_PASSWORD=$(docker exec jenkins cat /var/jenkins_home/secrets/initialAdminPassword)
echo "Jenkins initial admin password: $JENKINS_PASSWORD"

# Print instructions
echo "
Jenkins is now running!
1. Open http://localhost:8081 in your browser
2. Use the following password to unlock Jenkins: $JENKINS_PASSWORD
3. Install suggested plugins
4. Create your admin user
5. Configure Jenkins with the following tools:
   - JDK 17
   - Maven
   - Docker
" 