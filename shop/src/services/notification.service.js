'use strict'

const notificationType = require("../common/enum/notification/notification.type")
const notificationModel = require("../models/notification.model")

class NotificationService {
    static async pushNotificationToSystem({
        type = notificationType.Shop001,
        receiveId = 1,
        senderId = 1,
        options = {}
    }) {
        let noti_content
        if (type === notificationType.Shop001) {
            noti_content = `@@@ vừa mới thêm một sản phẩm: @@@@`
        }
        else if (type === notificationType.Promotion001) {
            noti_content = `@@@ vừa mới thêm một voucher: @@@@@`
        }

        const newNotification = await notificationModel.create({
            notification_type: type,
            noti_content: noti_content,
            notification_senderId: senderId,
            notification_recieveId: receiveId,
            noti_options: options
        })

        return newNotification
    }

    static async listNotificationByUser({
        userId = 1,
        type = 'All',
        isRead = 0
    }) {
        const match = {notification_recieveId: userId}

        if(type !== "All") {
            match['notification_type'] = type
        }

        return await notificationModel.aggregate([
            {
                $match: match
            },
            {
                $project: {
                    notification_type: 1,
                    notification_senderId: 1,
                    notification_recieveId: 1,
                    noti_content: 1,
                    createAt: 1
                }
            }
        ])
    }
}

module.exports = NotificationService