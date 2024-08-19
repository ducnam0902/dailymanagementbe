import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const path = request.route.path;
    const params = request.params;
    const query = request.query;
    console.log(
      `Request: ${path} with params ${JSON.stringify(params)} and query ${JSON.stringify(query)} if have`,
    );

    const now = Date.now();
    return next
      .handle()
      .pipe(
        tap(() =>
          console.log(`Call request ${path} done after ${Date.now() - now}ms`),
        ),
      );
  }
}
