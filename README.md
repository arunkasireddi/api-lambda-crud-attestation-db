# API Gateway with Lambda and CRUD to DynamoDB

## Prerequisites

- Make sure you have Node v14.X.X installed
- If you are using brew, run `brew upgrade node` to install the latest version
  Note: This is to avoid the incompatibility error with uuid. Issue: https://github.com/aws/aws-cdk/issues/7816
- If running from local machine, ensure you have `aws configure` set up with valid IAM credentials

## Build

To build this app, you need to be in this example's root folder. Then run the following:

```bash
npm install -g aws-cdk
npm install
npm run build
```

This will install the necessary CDK, then this example's dependencies, and then build your TypeScript files and your CloudFormation template.

## Deploy

To run on AWS account, you need to run `cdk bootstrap` to create the S3 bucket to store assests

Run `cdk deploy`. This will deploy / redeploy your Stack to your AWS Account.

After the deployment you will see the API's URL, which represents the url you can then use.
