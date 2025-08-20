@echo off
echo Creating application version...
aws elasticbeanstalk create-application-version ^
  --application-name hello-backend ^
  --version-label v1.0 ^
  --source-bundle S3Bucket=your-bucket,S3Key=hello-backend-1.0.0.jar

echo Deploying to environment...
aws elasticbeanstalk update-environment ^
  --application-name hello-backend ^
  --environment-name hello-backend-env ^
  --version-label v1.0