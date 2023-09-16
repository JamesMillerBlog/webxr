export interface LambdaResponse {
    statusCode: number;
    headers: {
        "Access-Control-Allow-Origin": string;
        'Access-Control-Allow-Credentials': boolean
    };
    body: string;
}