import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
} from '@nestjs/common';
import { Response } from 'express';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const status = exception.getStatus();
    const responseException = exception.getResponse();
    const keyOfResponseException = Object.keys(responseException);
    if (
      Object.keys(responseException).length === 1 &&
      keyOfResponseException[0] === 'message'
    ) {
      response.status(status).json({
        statusCode: status,
        errors: {
          message: responseException[keyOfResponseException[0]],
        },
      });
    } else {
      const mappingErrorField = Object.keys(responseException).map((key) => ({
        field: key,
        message: responseException[key],
      }));

      response.status(status).json({
        statusCode: status,
        errors: mappingErrorField,
      });
    }
  }
}
