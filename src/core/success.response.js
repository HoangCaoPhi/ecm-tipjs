'use strict'

const StatusCode = {
    OK: 200,
    CREATED: 201
}

const ReasonStatusCode = {
    CREATED: 'Created!',
    OK: 'Success'
}

class SuccessResponse {
    constructor({message, statusCode = StatusCode.OK, reasonStatusCode = ReasonStatusCode.OK, metaData = {}}) {
        this.message ??= reasonStatusCode
        this.status = statusCode
        this.metaData = metaData
    }

    send(res, header = {}) {
        return res.status(this.status).json(this)
    }
}

class OK extends SuccessResponse {
    constructor({message, metaData}) {
        super({message, metaData})
    }
}

class Created extends SuccessResponse {
    constructor({message, metaData, statusCode = StatusCode.CREATED, reasonStatusCode = ReasonStatusCode.CREATED}) {
        super({message, metaData})
    }
}

module.exports = {
    OK, Created
}