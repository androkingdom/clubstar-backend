type SendResOptions<T = any> = {
  statusCode?: number;
  message?: string;
  data?: T;
};

class SendRes<T = any> {
  public readonly statusCode: number;
  public readonly message: string;
  public readonly data: T;
  public readonly success: boolean;

  constructor({
    statusCode = 200,
    message = "Success",
    data = null as T,
  }: SendResOptions<T>) {
    this.statusCode = statusCode;
    this.message = message;
    this.data = data;
    this.success = statusCode >= 200 && statusCode < 300;
  }

  // 🌟 .ok()
  static ok<T = any>(data?: T, message = "Success") {
    return new SendRes<T>({ statusCode: 200, message, data });
  }

  // 🌟 .created()
  static created<T = any>(data?: T, message = "Created successfully") {
    return new SendRes<T>({ statusCode: 201, message, data });
  }

  // 🌟 .custom()
  static custom<T = any>(statusCode: number, message: string, data?: T) {
    return new SendRes<T>({ statusCode, message, data });
  }
}

export default SendRes;
