#!/bin/bash

# Replace these variables with your values
GITHUB_TOKEN="your_github_token"
REPO_OWNER="Rayane20777"
REPO_NAME="Morocco-Vintage"
JENKINS_URL="http://localhost:8081"
WEBHOOK_URL="${JENKINS_URL}/github-webhook/"

# Create webhook
curl -X POST \
  -H "Authorization: token ${GITHUB_TOKEN}" \
  -H "Accept: application/vnd.github.v3+json" \
  https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/hooks \
  -d '{
    "name": "web",
    "active": true,
    "events": ["push"],
    "config": {
      "url": "'"${WEBHOOK_URL}"'",
      "content_type": "json"
    }
  }' 