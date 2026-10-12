pipeline {
  agent any

  tools {
    nodejs 'Node 20'
  }

  options {
    timeout(time: 45, unit: 'MINUTES')
    timestamps()
  }

  stages {
    stage('Install') {
      steps {
        script {
          if (isUnix()) {
            sh 'npm ci'
            sh 'npx playwright install --with-deps chromium'
          } else {
            bat 'npm ci'
            bat 'npx playwright install chromium'
          }
        }
      }
    }
    stage('Quality') {
      steps {
        script {
          if (isUnix()) {
            sh 'npm run typecheck'
            sh 'npm run lint'
            sh 'npm run format:check'
          } else {
            bat 'npm run typecheck'
            bat 'npm run lint'
            bat 'npm run format:check'
          }
        }
      }
    }
    stage('Playwright') {
      steps {
        script {
          if (isUnix()) {
            sh 'npm test'
          } else {
            bat 'npm test'
          }
        }
      }
    }
  }

  post {
    always {
      junit testResults: 'test-results/junit.xml', allowEmptyResults: true
      archiveArtifacts artifacts: 'playwright-report/**,allure-results/**,test-results/**', allowEmptyArchive: true
    }
  }
}
