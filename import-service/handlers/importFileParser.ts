import { buildResponse } from './../utils/lamda-handler.utils';
import { S3Event } from 'aws-lambda';
import { HttpStatusCode } from '../utils/http-status-codes';
import { parseCSVFiles } from '../controllers/parse-s3-csv.controller';
import { AppError } from '../utils/app-error.utils';

export const importFileParser = async (event: S3Event) => {
  try {
    await parseCSVFiles(event.Records);
    return buildResponse(HttpStatusCode.OK, '');
  } catch (error) {
    return new AppError(
      error?.message || 'Unable to parse CSV from S3',
      error?.statusCode || HttpStatusCode.INTERNAL_SERVER_ERROR
    );
  }
};
