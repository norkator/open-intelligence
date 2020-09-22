pipeline {
  agent any
    
  tools {nodejs "node"}
    
  stages {
        
    stage('Install React front end packages') {
      steps {
        bat 'cd .\\api\\front-end && npm install'
      }
    }


    stage('Test React front end') {
      steps {
        bat 'cd .\\api\\front-end && npm run test-ci'
      }
    }

    stage('Build React front end') {
      steps {
        bat 'cd .\\api\\front-end && npm run build'
      }
    }

  }
}
