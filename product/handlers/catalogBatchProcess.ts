import { buildResponse } from './../utils/lamda-handler.utils';
import { SQSEvent } from 'aws-lambda';
import { HttpStatusCode } from '../utils/http-status-codes';
import { AppError } from '../utils/app-error.utils';
import { createBatchProducts } from '../controllers/products.controller';

export const catalogBatchProcess = async (event: SQSEvent) => {
  try {
    console.log(event);
    const products = event.Records.map((record) => JSON.parse(record.body));
    await createBatchProducts(products);
    return buildResponse(HttpStatusCode.OK, '');
  } catch (error) {
    return new AppError(
      error?.message || 'Unable to process event from SQS',
      error?.statusCode || HttpStatusCode.INTERNAL_SERVER_ERROR
    );
  }
};
