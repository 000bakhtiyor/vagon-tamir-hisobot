import {
    CallHandler,
    ExecutionContext,
    Injectable,
    NestInterceptor,
    Logger,
} from '@nestjs/common';
import { Observable, tap } from 'rxjs';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
    private logger = new Logger('LoggingInterceptor');

    intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
        const req = context.switchToHttp().getRequest();
        const { method, url, body, ip } = req;

        const clientIp = req.headers['x-forwarded-for'] || ip;

        this.logger.log(`${method} ${url} - IP: ${clientIp} - Body: ${JSON.stringify(body)}`);

        return next.handle().pipe(
            tap((data) => {
                this.logger.log(`Response: ${JSON.stringify(data)}`);
            })
        );
    }
}
