type SendErrorOptions = {
  message?: string;
  statusCode?: number;
  errors?: any[];
  stack?: string;
};

export default class SendError extends Error {
  statusCode: number;
  errors: any[];
  stack?: string;

  constructor({
    message = "Something went wrong",
    statusCode = 500,
    errors = [],
    stack,
  }: SendErrorOptions = {}) {
    super(message);
    this.name = "SendError";
    this.statusCode = statusCode;
    this.errors = errors;
    this.stack = stack || new Error().stack;

    // Optional if you want more consistent trace:
    Error.captureStackTrace?.(this, this.constructor);
  }

  static badRequest(message = "Bad Request", errors: any[] = []) {
    return new SendError({ message, statusCode: 400, errors });
  }

  static unauthorized(message = "Unauthorized", errors: any[] = []) {
    return new SendError({ message, statusCode: 401, errors });
  }

  static notFound(message = "Not Found", errors: any[] = []) {
    return new SendError({ message, statusCode: 404, errors });
  }

  static internal(message = "Internal Server Error", errors: any[] = []) {
    return new SendError({ message, statusCode: 500, errors });
  }

  static forbidden(message = "Access Denied", errors: any[] = []) {
    return new SendError({ message, statusCode: 403, errors });
  }

  static custom(opts: SendErrorOptions) {
    return new SendError(opts);
  }
}
