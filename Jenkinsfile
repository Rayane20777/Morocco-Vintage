pipeline {
    agent any
    
    environment {
        DOCKER_IMAGE = 'vintage-maroc'
        GITHUB_REPO = 'https://github.com/Rayane20777/Morocco-Vintage.git'
        TESTCONTAINERS_DOCKER_NETWORK = 'vintage-network'
    }
    
    triggers {
        pollSCM('*/5 * * * *') // Polls every 5 minutes
    }

    tools {
        maven 'Maven'
        jdk 'JDK17'
    }

    stages {
        stage('Checkout') {
            steps {
                git branch: 'main', 
                    url: "${GITHUB_REPO}"
            }
        }
        
        stage('Build and Test') {
            steps {
                sh '''
                    # Create network if it doesn't exist
                    docker network create vintage-network || true
                    
                    # Set Docker host
                    export DOCKER_HOST=unix:///var/run/docker.sock
                    
                    # Run Maven with specific network
                    mvn clean install -Dtestcontainers.reuse.enable=true -Dtestcontainers.ryuk.disabled=true
                '''
            }
            post {
                always {
                    junit '**/target/surefire-reports/*.xml'
                }
            }
        }
        
        stage('SonarQube Analysis') {
            steps {
                withSonarQubeEnv('SonarQube') {
                    sh 'mvn sonar:sonar'
                }
            }
        }
        
        stage('Build Docker Image') {
            steps {
                script {
                    docker.build("${DOCKER_IMAGE}:${BUILD_NUMBER}")
                    docker.build("${DOCKER_IMAGE}:latest")
                }
            }
        }
        
        stage('Deploy') {
            steps {
                script {
                    sh '''
                        docker-compose down
                        docker-compose up -d
                    '''
                }
            }
        }
    }
    
    post {
        always {
            cleanWs()
        }
        success {
            echo 'Build successful!'
        }
        failure {
            echo 'Build failed!'
        }
    }
} 