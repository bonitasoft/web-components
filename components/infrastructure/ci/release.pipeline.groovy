#!/usr/bin/env groovy
def releaseType = params.releaseType
def component = params.component
def gitPush = params.gitPush ? '--git-push' : ''

pipeline {
    agent { label 'web-components' }
    options {
        skipDefaultCheckout true
    }
    stages {
        stage('Checkout 🌍') {
            steps{
                script{
                    checkout scm
                }
            }
        }

        stage('Release 🏷') {
            steps {
                script {
                    withCredentials([usernamePassword(
                            credentialsId: 'github',
                            passwordVariable: 'GIT_PASSWORD',
                            usernameVariable: 'GIT_USERNAME')]) {
                        sh "./components/infrastructure/release.sh --component=${component} --releaseType=${releaseType} ${gitPush}"
                    }

                }
            }
        }
        stage('Publish 📦') {
            when {
                expression { params.npmPublish }
            }
            steps {
                script{
                    withCredentials([string(credentialsId: 'npm-registry-token', variable: 'NPM_REGISTRY_API_TOKEN')]) {
                        sh('''echo //registry.npmjs.org/:_authToken=${NPM_REGISTRY_API_TOKEN} > .npmrc''')
                    }
                    sh "./components/infrastructure/publish.sh --component=${component}"
                }
            }
        }
    }
}