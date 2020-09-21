pipeline {
  agent any
    
  tools {nodejs "node"}
    
  stages {
        
    stage('Install React front end packages') {
      steps {
        ws("%WORKSPACE%\\api\\front-end") {
          bat 'npm install'
        }
      }
    }


    stage('Test React front end') {
      steps {
        ws("%WORKSPACE%\\api\\front-end") {
          bat 'npm run test --prefix ./api/front-end'
        }
      }
    }

    stage('Build React front end') {
      steps {
        ws("%WORKSPACE%\\api\\front-end") {
          bat 'npm run build --prefix ./api/front-end'
        }
      }
    }

  }
}
