# API Gateway with Lambda and CRUD to DynamoDB

## Prerequisites

- Make sure you have Node v14.X.X installed.

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

Note: There is a existing issue with the uuid v4, which requires uuid to be part of the node_modules

## Deploy

- To run on AWS account, you need to run `cdk bootstrap` to create the S3 bucket to store assests

- Run `cdk deploy`. This will deploy / redeploy your Stack to your AWS Account.

- After the deployment you will see the API's URL, which represents the url you can then use.

## The Component Structure

The whole component contains:

- An API, with CORS enabled on all HTTTP Methods. (Use with caution, for production apps you will want to enable only a certain domain origin to be able to query your API.)

- Lambda pointing to `src/create.ts`, containing code for **storing** an item into the DynamoDB table.

- Lambda pointing to `src/delete-one.ts`, containing code for **deleting** an item from the DynamoDB table.

- Lambda pointing to `src/get-all.ts`, containing code for **getting all items** from the DynamoDB table.

- Lambda pointing to `src/get-one.ts`, containing code for **getting an item** from the DynamoDB table.

- Lambda pointing to `src/update-one.ts`, containing code for **updating an item** in the DynamoDB table.

- A DynamoDB table `attestation-db` that stores the data.

- Five `LambdaIntegrations` that connect these Lambdas to the API.

## CDK Toolkit

The [`cdk.json`](./cdk.json) file in the root of this repository includes
instructions for the CDK toolkit on how to execute this program.

After building your TypeScript code, you will be able to run the CDK toolkits commands as usual:

    $ cdk ls
    <list all stacks in this program>

    $ cdk synth
    <generates and outputs cloudformation template>

    $ cdk deploy
    <deploys stack to your account>

    $ cdk diff
    <shows diff against deployed stack>
