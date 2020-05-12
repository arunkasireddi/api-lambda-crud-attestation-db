import apigateway = require('@aws-cdk/aws-apigateway');
import dynamodb = require('@aws-cdk/aws-dynamodb');
import lambda = require('@aws-cdk/aws-lambda');
import cdk = require('@aws-cdk/core');
import { Tag } from '@aws-cdk/core';

export class ApiLambdaCrudAttestationDBStack extends cdk.Stack {
	constructor(app: cdk.App, id: string) {
		super(app, id);

		const dynamoTable = new dynamodb.Table(this, 'items', {
			partitionKey: {
				name: 'itemId',
				type: dynamodb.AttributeType.STRING,
			},
			tableName: 'items',

			// The default removal policy is RETAIN, which means that cdk destroy will not attempt to delete
			// the new table, and it will remain in your account until manually deleted. By setting the policy to
			// DESTROY, cdk destroy will delete the table (even if it has data in it)
			removalPolicy: cdk.RemovalPolicy.DESTROY, // NOT recommended for production code
		});

		const createOne = new lambda.Function(this, 'createItemFunction', {
			code: new lambda.AssetCode('src'),
			handler: 'create.handler',
			runtime: lambda.Runtime.NODEJS_12_X,
			environment: {
				TABLE_NAME: dynamoTable.tableName,
				PRIMARY_KEY: 'itemId',
			},
		});

		dynamoTable.grantReadWriteData(createOne);

		const api = new apigateway.RestApi(this, 'itemsApi', {
			restApiName: 'Items Service',
			cloudWatchRole: false,
		});

		const items = api.root.addResource('items');

		const createOneIntegration = new apigateway.LambdaIntegration(createOne);
		items.addMethod('POST', createOneIntegration);
		addCorsOptions(items);
	}
}

export function addTags(app: cdk.App, stackName: string) {
	Tag.add(app, 'lm_app_env', 'dev');
	Tag.add(app, 'lm_app', stackName);
	Tag.add(app, 'lm_troux_uid', '495DA6AE-6F13-45A6-9FA7-0288F408942F');
	Tag.add(app, 'deployment_guid', 'c36cbf66-ec9d-4bfb-8ef0-2e0f285b0f09');
	Tag.add(app, 'Name', stackName);
	Tag.add(app, 'lm_sbu', 'ICM');
	Tag.add(app, 'gde_subscribe_es_logging', 'true');
	Tag.add(app, 'gde_logging_index', stackName);
}

export function addCorsOptions(apiResource: apigateway.IResource) {
	apiResource.addMethod(
		'OPTIONS',
		new apigateway.MockIntegration({
			integrationResponses: [
				{
					statusCode: '200',
					responseParameters: {
						'method.response.header.Access-Control-Allow-Headers':
							"'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token,X-Amz-User-Agent'",
						'method.response.header.Access-Control-Allow-Origin': "'*'",
						'method.response.header.Access-Control-Allow-Credentials':
							"'false'",
						'method.response.header.Access-Control-Allow-Methods':
							"'OPTIONS,GET,PUT,POST,DELETE,PATCH'",
					},
				},
			],
			passthroughBehavior: apigateway.PassthroughBehavior.NEVER,
			requestTemplates: {
				'application/json': '{"statusCode": 200}',
			},
		}),
		{
			methodResponses: [
				{
					statusCode: '200',
					responseParameters: {
						'method.response.header.Access-Control-Allow-Headers': true,
						'method.response.header.Access-Control-Allow-Methods': true,
						'method.response.header.Access-Control-Allow-Credentials': true,
						'method.response.header.Access-Control-Allow-Origin': true,
					},
				},
			],
		}
	);
}

const app = new cdk.App();
new ApiLambdaCrudAttestationDBStack(app, 'ApiLambdaCrudAttestationDB');
addTags(app, 'ApiLambdaCrudAttestationDB');
app.synth();
