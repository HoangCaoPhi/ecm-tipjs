'use strict'

const { SuccessResponse } = require("../core/success.response")
const { listNotificationByUser } = require("../services/notification.service")
 
class NotificationController {
    listNotificationByUser = async (req, res, next) => {
        new SuccessResponse({
            message: 'listNotificationByUser',
            metaData: await listNotificationByUser(req.query)
        }).send(res)
    } 
}

module.exports = new NotificationController()