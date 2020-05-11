import apigateway = require('@aws-cdk/aws-apigateway');
import dynamodb = require('@aws-cdk/aws-dynamodb');
import lambda = require('@aws-cdk/aws-lambda');
import cdk = require('@aws-cdk/core');

export class ApiLambdaCrudAttestationDBStack extends cdk.Stack {
	constructor(app: cdk.App, id: string) {
		super(app, id);

		const dynamoTable = new dynamodb.Table(this, 'items', {
			partitionKey: {
				name: 'itemId',
				type: dynamodb.AttributeType.STRING,
			},
			tableName: 'attestationItems',

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

		const api = new apigateway.RestApi(this, 'attestationItemsApi', {
			restApiName: 'Attestation Items Service',
		});

		const items = api.root.addResource('attestationItems');

		const createOneIntegration = new apigateway.LambdaIntegration(createOne);
		items.addMethod('POST', createOneIntegration);
		addCorsOptions(items);
	}
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
							"'OPTIONS,GET,PUT,POST,DELETE'",
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
new ApiLambdaCrudAttestationDBStack(app, 'ApiLambdaCrudDynamoDBExample');
app.synth();
