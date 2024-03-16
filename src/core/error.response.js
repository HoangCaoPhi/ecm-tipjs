'use strict'

const statusCode = {
    FORBIDEN: 403,
    CONFLICT: 409
}

const ReasonStatusCode = {
    FORBIDEN: 'Bad Request',
    CONFLICT: 'Confict'
}

class ErrorResponse extends Error {
    constructor(message, status) {
        super(message)
        this.status = status
    }
}

class ConfictRequestError extends ErrorResponse {
    constructor(message = ReasonStatusCode.CONFLICT, statusCode = statusCode.CONFLICT) {
        super(message, statusCode)
    }
}

class BadRequestError extends ErrorResponse {
    constructor(message = ReasonStatusCode.FORBIDEN, statusCode = statusCode.FORBIDEN) {
        super(message, statusCode)
    }
}

module.exports = {
    ConfictRequestError,
    BadRequestError
}