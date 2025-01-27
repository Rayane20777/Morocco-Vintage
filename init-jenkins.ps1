# Wait for Jenkins to start
Write-Host "Waiting for Jenkins to start..."
do {
    Start-Sleep -Seconds 5
    Write-Host "." -NoNewline
    try {
        $response = Invoke-WebRequest -Uri "http://localhost:8081" -Method Head -ErrorAction SilentlyContinue
        $started = $response.StatusCode -eq 200
    } catch {
        $started = $false
    }
} while (-not $started)

# Get the initial admin password
Write-Host "`nGetting Jenkins initial admin password..."
$JENKINS_PASSWORD = docker exec jenkins cat /var/jenkins_home/secrets/initialAdminPassword
Write-Host "Jenkins initial admin password: $JENKINS_PASSWORD"

# Print instructions
Write-Host @"

Jenkins is now running!
1. Open http://localhost:8081 in your browser
2. Use the following password to unlock Jenkins: $JENKINS_PASSWORD
3. Install suggested plugins
4. Create your admin user
5. Configure Jenkins with the following tools:
   - JDK 17
   - Maven
   - Docker

"@ 