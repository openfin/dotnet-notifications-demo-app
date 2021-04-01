pipeline {
    agent { label 'linux-slave' }
    options { timestamps() }

    stages {
        stage('Test') {
            steps {
                install()
                sh "npm run test"
                sh "npm run check -- --noCache"
            }
        }

        stage('Build') {
            steps {
                configure()
                buildProject()
                addReleaseChannels()
            }
        }

        stage('Deploy') {
            when { anyOf { branch 'develop' ; branch 'master' ; not { environment name: 'PROJECT', value: '' } } }
            steps {
                deployToS3()
                deployToNPM()
            }
        }
    }
}

def install() {
    withCredentials([string(credentialsId: "NPM_TOKEN_WRITE", variable: 'NPM_TOKEN')]) {
        if (isUnix()) {
            sh "echo //registry.npmjs.org/:_authToken=$NPM_TOKEN > $WORKSPACE/.npmrc"
        } else {
            bat "echo //registry.npmjs.org/:_authToken=$NPM_TOKEN > $WORKSPACE/.npmrc"
        }
    }

    if (isUnix()) {
        sh "npm ci"
    } else {
        bat "npm ci"
    }
}

def configure() {
    def manifest = readJSON file: './package.json'

    GIT_SHORT_SHA = GIT_COMMIT.substring(0, 7)
    PKG_VERSION = manifest.version
    METADATA = env.METADATA?.replaceAll(/[. \/#]/, '-')?.toLowerCase()
    TIMESTAMP = new Date().format("yyyyMMdd.HHmmss", TimeZone.getTimeZone('UTC'))

    if (METADATA) {
        BUILD_VERSION = "${PKG_VERSION}-custom.${TIMESTAMP}+${METADATA.replaceAll('-', '.')}"
        MANIFEST_NAME = "tags/${METADATA}.json"
        CHANNEL = null
    } else if (env.PROJECT) {
        BUILD_VERSION = "${PKG_VERSION}-custom.${TIMESTAMP}"
        MANIFEST_NAME = null
        CHANNEL = null
    } else if (env.BRANCH_NAME == 'master') {
        BUILD_VERSION = PKG_VERSION
        MANIFEST_NAME = 'app.json'
        CHANNEL = 'stable'
    } else {
        BUILD_VERSION = "${PKG_VERSION}-alpha.${env.BUILD_NUMBER}"
        MANIFEST_NAME = 'app.staging.json'
        CHANNEL = 'staging'
    }

    // Local directory paths
    DIR_LOCAL_RES = './res/'
    DIR_LOCAL_DIST = './dist/'

    DIR_CDN_BUILD_ROOT = env.THEME_EDITOR_S3_ROOT + '/'
    DIR_CDN_BUILD_VERSION = DIR_CDN_BUILD_ROOT + BUILD_VERSION
}

def buildProject() {
    sh "npm run clean"
    sh "VERSION=${BUILD_VERSION} npm run build"
    sh "echo ${GIT_SHORT_SHA} > ${DIR_LOCAL_DIST}SHA.txt"
}

def addReleaseChannels() {
    // Not Applicable
}

def deployToS3() {
    if (env.ALLOW_CDN != 'false') {
        PATHS_TO_INVALIDATE = []

        assert sh(script: "aws s3 ls ${DIR_CDN_BUILD_VERSION}/", returnStatus: true) == 1 : "Build ${BUILD_VERSION} already exists on CDN"

        sh "aws s3 cp ${DIR_LOCAL_RES} ${DIR_CDN_BUILD_VERSION}/ --recursive --exclude \"*.svg\""
        sh "aws s3 cp ${DIR_LOCAL_RES} ${DIR_CDN_BUILD_VERSION}/ --recursive --exclude \"*\" --include \"*.svg\" --content-type \"image/svg+xml\""
        sh "aws s3 cp ${DIR_LOCAL_DIST} ${DIR_CDN_BUILD_VERSION}/ --recursive --exclude \"*.svg\""
        sh "aws s3 cp ${DIR_LOCAL_DIST} ${DIR_CDN_BUILD_VERSION}/ --recursive --exclude \"*\" --include \"*.svg\" --content-type \"image/svg+xml\""

        if (MANIFEST_NAME) {
            sh "aws s3 cp ${DIR_LOCAL_DIST}app.json ${DIR_CDN_BUILD_ROOT}${MANIFEST_NAME}"
            sh "aws s3 cp ${DIR_LOCAL_DIST} ${DIR_CDN_BUILD_ROOT} --exclude \"*\" --include \"app.runtime-*.json\""
            PATHS_TO_INVALIDATE << "${DIR_CDN_BUILD_ROOT}${MANIFEST_NAME}"
        }

        invalidateCache(PATHS_TO_INVALIDATE)
    }
}

def deployToNPM() {
    // Not Applicable
}

def invalidateCache(PATHS) {
    if (!PATHS.isEmpty()) {
        BATCH = "Paths={Quantity=${PATHS.size()},Items=[${PATHS.collect { it.replace(env.CDN_S3_ROOT, "/") }.join(",")}]},CallerReference=${SERVICE_NAME}-${BUILD_VERSION}"
        CMD = "aws cloudfront create-invalidation --distribution-id ${env.CDN_S3_DISTRIBUTION_ID} --invalidation-batch \"${BATCH}\""
        INVALIDATION_ID = readJSON(text: sh(script: CMD, returnStdout: true)).Invalidation.Id
        sh "aws cloudfront wait invalidation-completed --distribution-id ${env.CDN_S3_DISTRIBUTION_ID} --id ${INVALIDATION_ID}"
    }
}
