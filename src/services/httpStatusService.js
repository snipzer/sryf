export default class HttpStatusService
{
    constructor() {
        this.ok = 200;
        this.created = 201;
        this.noContent = 204;
        this.badRequest = 400;
        this.unauthorized = 401;
        this.forbidden = 403;
        this.notFound = 404;
        this.methodNotAllowed = 405;
        this.internalServerError = 500;
    }
}