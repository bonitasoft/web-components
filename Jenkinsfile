#!/usr/bin/env groovy
import static groovy.json.JsonOutput.toJson

properties([[$class: 'BuildDiscarderProperty', strategy: [$class: 'LogRotator', artifactDaysToKeepStr: '', artifactNumToKeepStr: '', daysToKeepStr: '', numToKeepStr: '3']]])


node('web-components') {
    def currentBranch = env.BRANCH_NAME
    def isBaseBranch = currentBranch == 'master'

    slackStage('🌍 Setup', isBaseBranch) {
        checkout scm
    }

    slackStage('🔧 Build', isBaseBranch) {
        sh 'cd components && npm run build'
    }

    slackStage('📦 Archive', isBaseBranch) {
        archiveArtifacts 'components/packages/*/dist/**'
    }
}


def slackStage(def name, boolean isBaseBranch, Closure body) {
    try {
        stage(name) {
            body()
        }
    } catch (e) {
        if (isBaseBranch) {
            def attachment = [
                    title     : "web-components/${env.BRANCH_NAME} build is failing!",
                    title_link: env.BUILD_URL,
                    text      : "Stage ${name} has failed"
            ]

            slackSend(color: 'danger', channel: '#uid', attachments: toJson([attachment]))
        }
        throw e
    }
}