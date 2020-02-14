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
            steps {
                script {
                    configGitCredentialHelper()
                    git branch: params.BASE_BRANCH, credentialsId: 'github', url: 'https://github.com/bonitasoft/web-components.git'
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
                script {
                    withCredentials([string(credentialsId: 'npm-registry-token', variable: 'NPM_REGISTRY_API_TOKEN')]) {
                        sh('''echo //registry.npmjs.org/:_authToken=$NPM_REGISTRY_API_TOKEN >> $HOME/.npmrc''')
                    }
                    sh "./components/infrastructure/publish.sh --component=${component}"
                }
            }
        }
    }
}

def configGitCredentialHelper() {
    sh """#!/bin/bash +x
        set -e
        echo "Using the git cache credential helper to be able to perform native git commands without passing authentication parameters"
        # Timeout in seconds, ensure we have enough time to perform the whole process between the initial clone and the final branch push
        git config --global credential.helper 'cache --timeout=18000'
    """
}
