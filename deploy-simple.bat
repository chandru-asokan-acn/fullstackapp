echo Building JAR...
cd backend && jar -cf target\hello-backend-1.0.0.jar -C target\classes . && cd ..

echo Building Frontend...
cd frontend\hello-frontend && npm run build && cd ..\..

echo Manual Steps:
echo 1. Upload backend\target\hello-backend-1.0.0.jar to Elastic Beanstalk
echo 2. Upload frontend\hello-frontend\dist folder to S3 bucket
echo 3. Enable S3 static website hosting