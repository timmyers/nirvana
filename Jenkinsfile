// this guarantees the node will use this template
def label = "mypod-${UUID.randomUUID().toString()}"
podTemplate(label: label) {
    node(label) {
        stage('Run shell') {
            checkout scm
            sh 'echo hello world'
            sh 'cat Jenkinsfile'
        }
    }
}
