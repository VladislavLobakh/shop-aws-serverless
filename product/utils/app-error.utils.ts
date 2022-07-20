import { HttpStatusCode } from './http-status-codes';

export class AppError extends Error {
  public readonly message: string;
  public readonly statusCode: HttpStatusCode;

  constructor(
    message: string,
    statusCode: HttpStatusCode = HttpStatusCode.BAD_REQUEST,
    description?: string
  ) {
    super(description);

    Object.setPrototypeOf(this, new.target.prototype); // restore prototype chain

    this.message = message;
    this.statusCode = statusCode;

    Error.captureStackTrace(this);
  }
}
