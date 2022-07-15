import { AppError } from './errors/app-error';
import { HttpStatusCode } from './errors/http-status-codes';

export const success = (
  body,
  contentType: string = 'application/json',
  status: HttpStatusCode = HttpStatusCode.OK
) => {
  return buildResponse(status, body, contentType);
};

export const failure = (err, request?) => {
  try {
    console.error(JSON.stringify(err, Object.getOwnPropertyNames(err)));
  } catch (e) {
    console.error('Could not parse err object');
  }

  if (
    request &&
    request.hasOwnProperty('pathParameters') &&
    request.hasOwnProperty('requestContext') &&
    request.hasOwnProperty('queryStringParameters')
  ) {
    console.info(
      'REQUEST_INFO:\n' +
        JSON.stringify(
          {
            pathParameters: request.pathParameters,
            queryStringParameters: request.queryStringParameters,
            requestContext: request.requestContext
          },
          null,
          2
        )
    );
  }

  try {
    if (request?.body && Object.keys(request.body).length > 0) {
      console.info('REQUEST_BODY:\n' + JSON.stringify(request.body));
    }
  } catch (e) {
    console.error('Could not parse response body');
  }

  if (err instanceof AppError) {
    return buildResponse(err.httpCode || HttpStatusCode.BAD_REQUEST, {
      error: err.name,
      message: err.message
    });
  } else {
    return buildResponse(HttpStatusCode.BAD_REQUEST, {
      error: 'Internal error',
      message: ''
    });
  }
};

const buildResponse = (
  statusCode: HttpStatusCode,
  body,
  contentType: string = 'application/json'
) => {
  return {
    statusCode: statusCode,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': true,
      'Content-Type': contentType
    },
    body: contentType === 'application/json' ? JSON.stringify(body) : body
  };
};
