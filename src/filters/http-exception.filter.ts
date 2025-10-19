import { ArgumentsHost, Catch, ExceptionFilter, HttpException, InternalServerErrorException } from "@nestjs/common";
import type { Request, Response } from "express";

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {

    catch(exception: any, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse<Response>();
        const request = ctx.getRequest<Request>();

        let status = 500;
        let message: string | string[] = 'Internal server error';
        let details: any = undefined;


        const extractMessage = (resp: any) => resp?.message ?? resp?.error?.message;
        const stripMessageFrom = (obj: any, nestedKey?: string, expectedMessage?: string) => {
            if (!obj || typeof obj !== 'object') return undefined;
            const copy = nestedKey ? { ...obj, [nestedKey]: { ...obj[nestedKey] } } : { ...obj };
            if (nestedKey) {
                const nested = copy[nestedKey];
                if (nested && typeof nested === 'object' && 'message' in nested && nested.message === expectedMessage) {
                    delete copy[nestedKey].message;
                }
            } else {
                if ('message' in copy && copy.message === expectedMessage) {
                    delete copy.message;
                }
            }
            return Object.keys(copy).length ? copy : undefined;
        };

        if (exception instanceof HttpException) {
            status = exception.getStatus();
            const resp: any = exception.getResponse();

            if (typeof resp === 'string') {
                message = resp;
            } else if (resp && typeof resp === 'object') {
                const resolvedMessage = extractMessage(resp) ?? message;
                message = resolvedMessage;

                if (resp.details) {
                    details = resp.details;
                } else if (resp.error?.details) {
                    details = resp.error.details;
                } else if (resp.error && typeof resp.error === 'object') {
                    details = stripMessageFrom(resp, 'error', resolvedMessage);
                } else {
                    details = stripMessageFrom(resp, undefined, resolvedMessage);
                }
            }
        } else {
            message = exception?.message ?? message;
        }

        const errorResponse = {
            success: false,
            timestamp: new Date().toISOString(),
            endpoint: request.url,
            error: {
                message,
                details,
            },
        };

        response.status(status).json(errorResponse);
    }

}