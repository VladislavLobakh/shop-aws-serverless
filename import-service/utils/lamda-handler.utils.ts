import { APIGatewayProxyEvent } from 'aws-lambda';
import { HttpStatusCode } from './http-status-codes';

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Credentials': true,
  'Content-Type': 'application/json'
};

export const lambdaHandler = (
  controllerCallback: (event: APIGatewayProxyEvent) => Promise<any>
) => {
  return async (event: APIGatewayProxyEvent) => {
    const { body, pathParameters, queryStringParameters } = event;
    let statusCode: HttpStatusCode;
    let result: any;

    try {
      console.info('REQ ===>', {
        pathParameters,
        queryStringParameters,
        body
      });

      result = await controllerCallback(event);
      statusCode = HttpStatusCode.OK;

      console.info(`RES <=== [${statusCode}]`, result);
    } catch (err) {
      statusCode = err.statusCode || HttpStatusCode.INTERNAL_SERVER_ERROR;

      result = {
        statusCode,
        message: err.message
      };

      console.error(`ERR <=== [${statusCode}] `, err.message, err.stack);
    } finally {
      return buildResponse(statusCode, result);
    }
  };
};

export const buildResponse = (statusCode: HttpStatusCode, result: any) => {
  return {
    statusCode,
    headers: {
      ...CORS_HEADERS,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(result)
  };
};
