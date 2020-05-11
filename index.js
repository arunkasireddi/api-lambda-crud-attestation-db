"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const apigateway = require("@aws-cdk/aws-apigateway");
const dynamodb = require("@aws-cdk/aws-dynamodb");
const lambda = require("@aws-cdk/aws-lambda");
const cdk = require("@aws-cdk/core");
class ApiLambdaCrudAttestationDBStack extends cdk.Stack {
    constructor(app, id) {
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
            removalPolicy: cdk.RemovalPolicy.DESTROY,
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
exports.ApiLambdaCrudAttestationDBStack = ApiLambdaCrudAttestationDBStack;
function addCorsOptions(apiResource) {
    apiResource.addMethod('OPTIONS', new apigateway.MockIntegration({
        integrationResponses: [
            {
                statusCode: '200',
                responseParameters: {
                    'method.response.header.Access-Control-Allow-Headers': "'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token,X-Amz-User-Agent'",
                    'method.response.header.Access-Control-Allow-Origin': "'*'",
                    'method.response.header.Access-Control-Allow-Credentials': "'false'",
                    'method.response.header.Access-Control-Allow-Methods': "'OPTIONS,GET,PUT,POST,DELETE'",
                },
            },
        ],
        passthroughBehavior: apigateway.PassthroughBehavior.NEVER,
        requestTemplates: {
            'application/json': '{"statusCode": 200}',
        },
    }), {
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
    });
}
exports.addCorsOptions = addCorsOptions;
const app = new cdk.App();
new ApiLambdaCrudAttestationDBStack(app, 'ApiLambdaCrudDynamoDBExample');
app.synth();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJpbmRleC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLHNEQUF1RDtBQUN2RCxrREFBbUQ7QUFDbkQsOENBQStDO0FBQy9DLHFDQUFzQztBQUV0QyxNQUFhLCtCQUFnQyxTQUFRLEdBQUcsQ0FBQyxLQUFLO0lBQzdELFlBQVksR0FBWSxFQUFFLEVBQVU7UUFDbkMsS0FBSyxDQUFDLEdBQUcsRUFBRSxFQUFFLENBQUMsQ0FBQztRQUVmLE1BQU0sV0FBVyxHQUFHLElBQUksUUFBUSxDQUFDLEtBQUssQ0FBQyxJQUFJLEVBQUUsT0FBTyxFQUFFO1lBQ3JELFlBQVksRUFBRTtnQkFDYixJQUFJLEVBQUUsUUFBUTtnQkFDZCxJQUFJLEVBQUUsUUFBUSxDQUFDLGFBQWEsQ0FBQyxNQUFNO2FBQ25DO1lBQ0QsU0FBUyxFQUFFLGtCQUFrQjtZQUU3QixnR0FBZ0c7WUFDaEcscUdBQXFHO1lBQ3JHLHlFQUF5RTtZQUN6RSxhQUFhLEVBQUUsR0FBRyxDQUFDLGFBQWEsQ0FBQyxPQUFPO1NBQ3hDLENBQUMsQ0FBQztRQUVILE1BQU0sU0FBUyxHQUFHLElBQUksTUFBTSxDQUFDLFFBQVEsQ0FBQyxJQUFJLEVBQUUsb0JBQW9CLEVBQUU7WUFDakUsSUFBSSxFQUFFLElBQUksTUFBTSxDQUFDLFNBQVMsQ0FBQyxLQUFLLENBQUM7WUFDakMsT0FBTyxFQUFFLGdCQUFnQjtZQUN6QixPQUFPLEVBQUUsTUFBTSxDQUFDLE9BQU8sQ0FBQyxXQUFXO1lBQ25DLFdBQVcsRUFBRTtnQkFDWixVQUFVLEVBQUUsV0FBVyxDQUFDLFNBQVM7Z0JBQ2pDLFdBQVcsRUFBRSxRQUFRO2FBQ3JCO1NBQ0QsQ0FBQyxDQUFDO1FBRUgsV0FBVyxDQUFDLGtCQUFrQixDQUFDLFNBQVMsQ0FBQyxDQUFDO1FBRTFDLE1BQU0sR0FBRyxHQUFHLElBQUksVUFBVSxDQUFDLE9BQU8sQ0FBQyxJQUFJLEVBQUUscUJBQXFCLEVBQUU7WUFDL0QsV0FBVyxFQUFFLDJCQUEyQjtTQUN4QyxDQUFDLENBQUM7UUFFSCxNQUFNLEtBQUssR0FBRyxHQUFHLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxrQkFBa0IsQ0FBQyxDQUFDO1FBRXZELE1BQU0sb0JBQW9CLEdBQUcsSUFBSSxVQUFVLENBQUMsaUJBQWlCLENBQUMsU0FBUyxDQUFDLENBQUM7UUFDekUsS0FBSyxDQUFDLFNBQVMsQ0FBQyxNQUFNLEVBQUUsb0JBQW9CLENBQUMsQ0FBQztRQUM5QyxjQUFjLENBQUMsS0FBSyxDQUFDLENBQUM7SUFDdkIsQ0FBQztDQUNEO0FBdkNELDBFQXVDQztBQUVELFNBQWdCLGNBQWMsQ0FBQyxXQUFpQztJQUMvRCxXQUFXLENBQUMsU0FBUyxDQUNwQixTQUFTLEVBQ1QsSUFBSSxVQUFVLENBQUMsZUFBZSxDQUFDO1FBQzlCLG9CQUFvQixFQUFFO1lBQ3JCO2dCQUNDLFVBQVUsRUFBRSxLQUFLO2dCQUNqQixrQkFBa0IsRUFBRTtvQkFDbkIscURBQXFELEVBQ3BELHlGQUF5RjtvQkFDMUYsb0RBQW9ELEVBQUUsS0FBSztvQkFDM0QseURBQXlELEVBQ3hELFNBQVM7b0JBQ1YscURBQXFELEVBQ3BELCtCQUErQjtpQkFDaEM7YUFDRDtTQUNEO1FBQ0QsbUJBQW1CLEVBQUUsVUFBVSxDQUFDLG1CQUFtQixDQUFDLEtBQUs7UUFDekQsZ0JBQWdCLEVBQUU7WUFDakIsa0JBQWtCLEVBQUUscUJBQXFCO1NBQ3pDO0tBQ0QsQ0FBQyxFQUNGO1FBQ0MsZUFBZSxFQUFFO1lBQ2hCO2dCQUNDLFVBQVUsRUFBRSxLQUFLO2dCQUNqQixrQkFBa0IsRUFBRTtvQkFDbkIscURBQXFELEVBQUUsSUFBSTtvQkFDM0QscURBQXFELEVBQUUsSUFBSTtvQkFDM0QseURBQXlELEVBQUUsSUFBSTtvQkFDL0Qsb0RBQW9ELEVBQUUsSUFBSTtpQkFDMUQ7YUFDRDtTQUNEO0tBQ0QsQ0FDRCxDQUFDO0FBQ0gsQ0FBQztBQXJDRCx3Q0FxQ0M7QUFFRCxNQUFNLEdBQUcsR0FBRyxJQUFJLEdBQUcsQ0FBQyxHQUFHLEVBQUUsQ0FBQztBQUMxQixJQUFJLCtCQUErQixDQUFDLEdBQUcsRUFBRSw4QkFBOEIsQ0FBQyxDQUFDO0FBQ3pFLEdBQUcsQ0FBQyxLQUFLLEVBQUUsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBhcGlnYXRld2F5ID0gcmVxdWlyZSgnQGF3cy1jZGsvYXdzLWFwaWdhdGV3YXknKTtcbmltcG9ydCBkeW5hbW9kYiA9IHJlcXVpcmUoJ0Bhd3MtY2RrL2F3cy1keW5hbW9kYicpO1xuaW1wb3J0IGxhbWJkYSA9IHJlcXVpcmUoJ0Bhd3MtY2RrL2F3cy1sYW1iZGEnKTtcbmltcG9ydCBjZGsgPSByZXF1aXJlKCdAYXdzLWNkay9jb3JlJyk7XG5cbmV4cG9ydCBjbGFzcyBBcGlMYW1iZGFDcnVkQXR0ZXN0YXRpb25EQlN0YWNrIGV4dGVuZHMgY2RrLlN0YWNrIHtcblx0Y29uc3RydWN0b3IoYXBwOiBjZGsuQXBwLCBpZDogc3RyaW5nKSB7XG5cdFx0c3VwZXIoYXBwLCBpZCk7XG5cblx0XHRjb25zdCBkeW5hbW9UYWJsZSA9IG5ldyBkeW5hbW9kYi5UYWJsZSh0aGlzLCAnaXRlbXMnLCB7XG5cdFx0XHRwYXJ0aXRpb25LZXk6IHtcblx0XHRcdFx0bmFtZTogJ2l0ZW1JZCcsXG5cdFx0XHRcdHR5cGU6IGR5bmFtb2RiLkF0dHJpYnV0ZVR5cGUuU1RSSU5HLFxuXHRcdFx0fSxcblx0XHRcdHRhYmxlTmFtZTogJ2F0dGVzdGF0aW9uSXRlbXMnLFxuXG5cdFx0XHQvLyBUaGUgZGVmYXVsdCByZW1vdmFsIHBvbGljeSBpcyBSRVRBSU4sIHdoaWNoIG1lYW5zIHRoYXQgY2RrIGRlc3Ryb3kgd2lsbCBub3QgYXR0ZW1wdCB0byBkZWxldGVcblx0XHRcdC8vIHRoZSBuZXcgdGFibGUsIGFuZCBpdCB3aWxsIHJlbWFpbiBpbiB5b3VyIGFjY291bnQgdW50aWwgbWFudWFsbHkgZGVsZXRlZC4gQnkgc2V0dGluZyB0aGUgcG9saWN5IHRvXG5cdFx0XHQvLyBERVNUUk9ZLCBjZGsgZGVzdHJveSB3aWxsIGRlbGV0ZSB0aGUgdGFibGUgKGV2ZW4gaWYgaXQgaGFzIGRhdGEgaW4gaXQpXG5cdFx0XHRyZW1vdmFsUG9saWN5OiBjZGsuUmVtb3ZhbFBvbGljeS5ERVNUUk9ZLCAvLyBOT1QgcmVjb21tZW5kZWQgZm9yIHByb2R1Y3Rpb24gY29kZVxuXHRcdH0pO1xuXG5cdFx0Y29uc3QgY3JlYXRlT25lID0gbmV3IGxhbWJkYS5GdW5jdGlvbih0aGlzLCAnY3JlYXRlSXRlbUZ1bmN0aW9uJywge1xuXHRcdFx0Y29kZTogbmV3IGxhbWJkYS5Bc3NldENvZGUoJ3NyYycpLFxuXHRcdFx0aGFuZGxlcjogJ2NyZWF0ZS5oYW5kbGVyJyxcblx0XHRcdHJ1bnRpbWU6IGxhbWJkYS5SdW50aW1lLk5PREVKU18xMl9YLFxuXHRcdFx0ZW52aXJvbm1lbnQ6IHtcblx0XHRcdFx0VEFCTEVfTkFNRTogZHluYW1vVGFibGUudGFibGVOYW1lLFxuXHRcdFx0XHRQUklNQVJZX0tFWTogJ2l0ZW1JZCcsXG5cdFx0XHR9LFxuXHRcdH0pO1xuXG5cdFx0ZHluYW1vVGFibGUuZ3JhbnRSZWFkV3JpdGVEYXRhKGNyZWF0ZU9uZSk7XG5cblx0XHRjb25zdCBhcGkgPSBuZXcgYXBpZ2F0ZXdheS5SZXN0QXBpKHRoaXMsICdhdHRlc3RhdGlvbkl0ZW1zQXBpJywge1xuXHRcdFx0cmVzdEFwaU5hbWU6ICdBdHRlc3RhdGlvbiBJdGVtcyBTZXJ2aWNlJyxcblx0XHR9KTtcblxuXHRcdGNvbnN0IGl0ZW1zID0gYXBpLnJvb3QuYWRkUmVzb3VyY2UoJ2F0dGVzdGF0aW9uSXRlbXMnKTtcblxuXHRcdGNvbnN0IGNyZWF0ZU9uZUludGVncmF0aW9uID0gbmV3IGFwaWdhdGV3YXkuTGFtYmRhSW50ZWdyYXRpb24oY3JlYXRlT25lKTtcblx0XHRpdGVtcy5hZGRNZXRob2QoJ1BPU1QnLCBjcmVhdGVPbmVJbnRlZ3JhdGlvbik7XG5cdFx0YWRkQ29yc09wdGlvbnMoaXRlbXMpO1xuXHR9XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBhZGRDb3JzT3B0aW9ucyhhcGlSZXNvdXJjZTogYXBpZ2F0ZXdheS5JUmVzb3VyY2UpIHtcblx0YXBpUmVzb3VyY2UuYWRkTWV0aG9kKFxuXHRcdCdPUFRJT05TJyxcblx0XHRuZXcgYXBpZ2F0ZXdheS5Nb2NrSW50ZWdyYXRpb24oe1xuXHRcdFx0aW50ZWdyYXRpb25SZXNwb25zZXM6IFtcblx0XHRcdFx0e1xuXHRcdFx0XHRcdHN0YXR1c0NvZGU6ICcyMDAnLFxuXHRcdFx0XHRcdHJlc3BvbnNlUGFyYW1ldGVyczoge1xuXHRcdFx0XHRcdFx0J21ldGhvZC5yZXNwb25zZS5oZWFkZXIuQWNjZXNzLUNvbnRyb2wtQWxsb3ctSGVhZGVycyc6XG5cdFx0XHRcdFx0XHRcdFwiJ0NvbnRlbnQtVHlwZSxYLUFtei1EYXRlLEF1dGhvcml6YXRpb24sWC1BcGktS2V5LFgtQW16LVNlY3VyaXR5LVRva2VuLFgtQW16LVVzZXItQWdlbnQnXCIsXG5cdFx0XHRcdFx0XHQnbWV0aG9kLnJlc3BvbnNlLmhlYWRlci5BY2Nlc3MtQ29udHJvbC1BbGxvdy1PcmlnaW4nOiBcIicqJ1wiLFxuXHRcdFx0XHRcdFx0J21ldGhvZC5yZXNwb25zZS5oZWFkZXIuQWNjZXNzLUNvbnRyb2wtQWxsb3ctQ3JlZGVudGlhbHMnOlxuXHRcdFx0XHRcdFx0XHRcIidmYWxzZSdcIixcblx0XHRcdFx0XHRcdCdtZXRob2QucmVzcG9uc2UuaGVhZGVyLkFjY2Vzcy1Db250cm9sLUFsbG93LU1ldGhvZHMnOlxuXHRcdFx0XHRcdFx0XHRcIidPUFRJT05TLEdFVCxQVVQsUE9TVCxERUxFVEUnXCIsXG5cdFx0XHRcdFx0fSxcblx0XHRcdFx0fSxcblx0XHRcdF0sXG5cdFx0XHRwYXNzdGhyb3VnaEJlaGF2aW9yOiBhcGlnYXRld2F5LlBhc3N0aHJvdWdoQmVoYXZpb3IuTkVWRVIsXG5cdFx0XHRyZXF1ZXN0VGVtcGxhdGVzOiB7XG5cdFx0XHRcdCdhcHBsaWNhdGlvbi9qc29uJzogJ3tcInN0YXR1c0NvZGVcIjogMjAwfScsXG5cdFx0XHR9LFxuXHRcdH0pLFxuXHRcdHtcblx0XHRcdG1ldGhvZFJlc3BvbnNlczogW1xuXHRcdFx0XHR7XG5cdFx0XHRcdFx0c3RhdHVzQ29kZTogJzIwMCcsXG5cdFx0XHRcdFx0cmVzcG9uc2VQYXJhbWV0ZXJzOiB7XG5cdFx0XHRcdFx0XHQnbWV0aG9kLnJlc3BvbnNlLmhlYWRlci5BY2Nlc3MtQ29udHJvbC1BbGxvdy1IZWFkZXJzJzogdHJ1ZSxcblx0XHRcdFx0XHRcdCdtZXRob2QucmVzcG9uc2UuaGVhZGVyLkFjY2Vzcy1Db250cm9sLUFsbG93LU1ldGhvZHMnOiB0cnVlLFxuXHRcdFx0XHRcdFx0J21ldGhvZC5yZXNwb25zZS5oZWFkZXIuQWNjZXNzLUNvbnRyb2wtQWxsb3ctQ3JlZGVudGlhbHMnOiB0cnVlLFxuXHRcdFx0XHRcdFx0J21ldGhvZC5yZXNwb25zZS5oZWFkZXIuQWNjZXNzLUNvbnRyb2wtQWxsb3ctT3JpZ2luJzogdHJ1ZSxcblx0XHRcdFx0XHR9LFxuXHRcdFx0XHR9LFxuXHRcdFx0XSxcblx0XHR9XG5cdCk7XG59XG5cbmNvbnN0IGFwcCA9IG5ldyBjZGsuQXBwKCk7XG5uZXcgQXBpTGFtYmRhQ3J1ZEF0dGVzdGF0aW9uREJTdGFjayhhcHAsICdBcGlMYW1iZGFDcnVkRHluYW1vREJFeGFtcGxlJyk7XG5hcHAuc3ludGgoKTtcbiJdfQ==