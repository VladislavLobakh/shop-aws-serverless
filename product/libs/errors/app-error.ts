import { HttpStatusCode } from './http-status-codes';

export class AppError extends Error {
  public readonly name: string;
  public readonly httpCode: HttpStatusCode;

  constructor(
    name: string,
    httpCode: HttpStatusCode = HttpStatusCode.BAD_REQUEST,
    description?: string
  ) {
    super(description);

    Object.setPrototypeOf(this, new.target.prototype); // restore prototype chain

    this.name = name;
    this.httpCode = httpCode;

    Error.captureStackTrace(this);
  }
}
