import * as aws from '@pulumi/aws';
import * as apigateway from "@pulumi/aws-apigateway";
import {getHandler, putHandler, postHandler, GetParams} from './../app/users/user.lambda'

const exampleApi = new aws.apigatewayv2.Api("exampleApi", {
    protocolType: "WEBSOCKET",
    routeSelectionExpression: "$request.body.action",
});
const exampleRoute = new aws.apigatewayv2.Route("exampleRoute", {
    apiId: exampleApi.id,
    routeKey: "$default",
});

//https://www.pulumi.com/registry/packages/aws/api-docs/apigatewayv2/integration/

const get = new aws.lambda.CallbackFunction("hello-handler", {
    callback: async (ev: GetParams, _ctx) => await getHandler(ev)
});

const api = new apigateway.RestAPI("api", {
    routes: [
        {
            path: "/user", // Tip: To handle all sub-paths use `/{proxy+}` as the path
            method: "GET",
            // Policies will be created automatically to allow API Gateway to invoke the Lambda
            eventHandler: get,
        },
        {
            path: "/user", // Tip: To handle all sub-paths use `/{proxy+}` as the path
            method: "PUT",
            // Policies will be created automatically to allow API Gateway to invoke the Lambda
            eventHandler: putHandler,
        },
        {
            path: "/user", // Tip: To handle all sub-paths use `/{proxy+}` as the path
            method: "POST",
            // Policies will be created automatically to allow API Gateway to invoke the Lambda
            eventHandler: postHandler,
        },
        // // Authorize requests using Cognito
        // {
        //     path: "cognito-authorized",
        //     method: "GET",
        //     eventHandler: helloHandler,
        //     // Use Cognito as authorizer to validate the token from the Authorization header
        //     authorizers: [
        //         {
        //             parameterName: "Authorization",
        //             identitySource: ["method.request.header.Authorization"],
        //             providerARNs: [userPool.arn],
        //         },
        //     ],
        // },
        // // Authorize requests using a Lambda function
        // {
        //     path: "lambda-authorized",
        //     method: "GET",
        //     eventHandler: helloHandler,
        //     // Use Lambda authorizer to validate the token from the Authorization header
        //     authorizers: [
        //         {
        //             authType: "custom",
        //             parameterName: "Authorization",
        //             type: "request",
        //             identitySource: ["method.request.header.Authorization"],
        //             handler: authLambda,
        //         },
        //     ],
        // },
    ],
});

// https://github.com/pulumi/examples/tree/master/aws-ts-apigateway-lambda-serverless
// https://blog.bitsrc.io/managing-micro-stacks-using-pulumi-87053eeb8678
//https://github.com/pulumi/examples/blob/master/aws-apigateway-ts-routes/index.ts

// https://github.com/pulumi/examples