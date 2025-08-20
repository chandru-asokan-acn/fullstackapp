#!/bin/bash
# Build backend
cd backend && mvn clean package

# Deploy to Elastic Beanstalk
eb deploy

# Build and deploy frontend
cd ../frontend/hello-frontend
npm run build
amplify publish