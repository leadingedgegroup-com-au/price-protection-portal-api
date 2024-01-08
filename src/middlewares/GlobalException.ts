// global-exception.ts

import { ExceptionFilter, Catch, ArgumentsHost, HttpException, HttpStatus } from '@nestjs/common';

@Catch()
export class GlobalException implements ExceptionFilter {

    catch(exception: any, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse();
        const request = ctx.getRequest();

        const $message = exception?.response?.message || exception?.message || 'Internal Server Error';
        const $status = exception instanceof HttpException ? exception.getStatus() : HttpStatus.INTERNAL_SERVER_ERROR;
        const $error = exception instanceof HttpException ? exception.getResponse()['error'] || 'Unknown Error' : 'Unknown Error';

        response.status($status).json({
            error: $error,
            message: $message,
            path: request.url,
            statusCode: $status,
            timestamp: new Date().toISOString(),
        });
    }
}
