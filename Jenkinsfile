node('jenkins-jenkins-slave ') {
    stage('Checkout') {
        checkout scm
    }
    stage('Build'){
        container('jnlp') {
            steps {
                echo 'Building..'
            }
        }
    }
}

// pipeline {

//     // agent { 
//     //     docker {
//     //         image 'jenkins/jnlp-slave'
//     //     }
//     // }

//     stages {
//         stage('Build') {
//             container('jnlp') {
//                 steps {
//                     echo 'Building..'
//                 }
//             }

//         }
//     }
// }
