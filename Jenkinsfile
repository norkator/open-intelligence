pipeline {
  agent any
    
  tools {nodejs "node"}
    
  stages {
        
    stage('Install React front end packages') {
      steps {
        bat 'npm install --prefix .\\api\\front-end'
      }
    }


    stage('Test React front end') {
      steps {
        bat 'npm run test --prefix .\\api\\front-end'
      }
    }

    stage('Build React front end') {
      steps {
        bat 'npm run build --prefix .\\api\\front-end'
      }
    }

  }
}
