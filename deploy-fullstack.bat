@echo off
echo ========================================
echo   FULLSTACK DEPLOYMENT SCRIPT
echo ========================================

echo Building Backend...
cd backend
jar -cf target\hello-backend-1.0.0.jar -C target\classes .
cd ..

echo Building Frontend...
cd frontend\hello-frontend
call npm run build
cd ..\..

echo Creating S3 buckets...
aws s3 mb s3://fullstack-backend-deploy-2024 --region us-east-1
aws s3 mb s3://fullstack-frontend-deploy-2024 --region us-east-1

echo Uploading Backend JAR...
aws s3 cp backend\target\hello-backend-1.0.0.jar s3://fullstack-backend-deploy-2024/

echo Deploying Backend to Elastic Beanstalk...
aws elasticbeanstalk create-application-version --application-name hello-backend --version-label %date:~-4,4%%date:~-10,2%%date:~-7,2%-%time:~0,2%%time:~3,2% --source-bundle S3Bucket=fullstack-backend-deploy-2024,S3Key=hello-backend-1.0.0.jar --region us-east-1

aws elasticbeanstalk update-environment --application-name hello-backend --environment-name hello-backend-env --version-label %date:~-4,4%%date:~-10,2%%date:~-7,2%-%time:~0,2%%time:~3,2% --region us-east-1

echo Deploying Frontend to S3...
aws s3 sync frontend\hello-frontend\dist\hello-frontend s3://fullstack-frontend-deploy-2024 --delete

echo Enabling S3 website hosting...
aws s3 website s3://fullstack-frontend-deploy-2024 --index-document index.html --error-document index.html

echo ========================================
echo   DEPLOYMENT COMPLETE!
echo ========================================
echo Backend URL: Check Elastic Beanstalk console
echo Frontend URL: http://fullstack-frontend-deploy-2024.s3-website-us-east-1.amazonaws.com
pause