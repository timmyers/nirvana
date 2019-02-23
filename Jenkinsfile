pipeline {
  agent {
    kubernetes {
      //cloud 'kubernetes'
      label 'mypod'
    }
  }
  stages {
    stage('Run maven') {
      steps {
        sh 'echo "hello"'
      }
    }
  }
}
