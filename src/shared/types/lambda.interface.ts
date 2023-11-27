export interface LambdaResponse {
    statusCode: number;
    headers: {
        "Access-Control-Allow-Origin": string;
        'Access-Control-Allow-Credentials': string;
        'Access-Control-Allow-Methods': string;
        'Access-Control-Allow-Headers': string;
    };
    body: string;
}