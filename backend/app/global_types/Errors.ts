export enum HttpStatus {
    Ok = 200,
    Created = 201,
    NoContent = 204,
    BadRequest = 400,
    ValidationFailure = 400,
    Forbidden = 403,
    NotFound = 404,
    TooManyRequests = 429,
    InternalServerError = 500,
    NotImplemented = 501,
    ServiceUnavailable = 503
}

export enum ErrorCode {
    BadRequest = HttpStatus.BadRequest,
    ValidationFailure = HttpStatus.BadRequest,
    PermissionFailure = HttpStatus.Forbidden,
    EntityNotFound = HttpStatus.NotFound,
    TooManyRequests = HttpStatus.TooManyRequests,
    ServerError = HttpStatus.InternalServerError,
    NotImplemented = HttpStatus.NotImplemented,
    ServiceUnavailable = HttpStatus.ServiceUnavailable
}