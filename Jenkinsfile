pipeline {
  agent {
    kubernetes {
      cloud 'kubernetes'
      label 'jenkins-jenkins-slave '
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
