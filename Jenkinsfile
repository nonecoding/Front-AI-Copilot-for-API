pipeline {
  agent any
  stages {
    stage('Checkout') { steps { checkout scm } }
    stage('Build Frontend') {
      steps {
        dir('frontend') {
          sh 'npm install'
          sh 'npm run build'
          sh 'sudo cp -r dist/* /var/www/frontend/dist/'
        }
      }
    }
    stage('Build Backend') {
      steps {
        dir('backend') {
          sh './mvnw clean package -DskipTests'
          sh 'sudo cp target/app.jar /opt/backend/app.jar'
        }
      }
    }
    stage('Restart Services') {
      steps {
        sh 'sudo systemctl restart backend'
        sh 'sudo nginx -s reload'
      }
    }
  }
}