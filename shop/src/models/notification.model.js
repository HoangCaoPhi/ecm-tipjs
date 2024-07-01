'use strict'

const { model, Schema } = require('mongoose');
const notificationType = require('../common/enum/notification/notification.type');
 
const DOCUMENT_NAME = 'Notification'
const COLLECTION_NAME = 'Notifications'



var schema = new Schema({
    notification_type: {
        type: String, enum: 
        [
            notificationType.Order001, 
            notificationType.Order002, 
            notificationType.Promotion001,
            notificationType.Shop001
        ]
    },
    notification_senderId: {type: Schema.Types.ObjectId, require: true, ref: "Shop"},
    notification_recieveId: {type: Number, require: true},
    noti_content: {type: String, require: true},
    noti_options: {type: Object, default: {}}
}, { timestamps: true, collection: COLLECTION_NAME });

module.exports = model(DOCUMENT_NAME, schema);
