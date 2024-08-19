import {
  ArgumentMetadata,
  PipeTransform,
  UnauthorizedException,
  ValidationError,
} from '@nestjs/common';
import { plainToClass } from 'class-transformer';
import { validate } from 'class-validator';

export class CustomValidationResponse implements PipeTransform {
  async transform(value: any, metadata: ArgumentMetadata) {
    const object = plainToClass(metadata.metatype, value);

    if (typeof object !== 'object') {
      return value;
    }

    const errors = await validate(object);
    if (errors.length === 0) {
      return value;
    }
    throw new UnauthorizedException(this.formatError(errors));
  }

  formatError(error: ValidationError[]) {
    return error.reduce((acc, error) => {
      acc[error.property] = Object.values(error.constraints);
      return acc;
    }, {});
  }
}
