pipeline {
  agent {
    kubernetes {
      cloud 'kubernetes'
      label 'jenkins-slave-slave'
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
