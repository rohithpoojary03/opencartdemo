pipeline {
    agent any
    stages
    {
        stage('checkout')
        {
            steps{
                git 'https://github.com/rohithpoojary03/opencartdemo.git'
            }
        }
        stage('install dependencies')
        {
            steps{
                bat 'npm ci'
                bat 'npm install -D allure-playwright'
                bat 'npm install -g allure-commandline --force'
            }
        }
        stage('Run test'){
            steps{
                bat 'npx playwright install'
                bat 'npm run "%script%"'
            }
        }
        stage('Generate allure report'){
            steps{
                bat 'allure generate ./allure-results --clean -o ./allure-report'
            }
        }
    }
    post{
        always{
            archiveArtifacts artifacts: 'test-results/**/*', allowEmptyArchive: true
            allure([
                    includeProperties: false,
                    jdk: '',
                    results: [[path: 'allure-results']]
])
        }
    }
}