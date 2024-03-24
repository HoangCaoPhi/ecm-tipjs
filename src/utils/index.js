'use strict'

const _ = require('lodash')
const { Types } = require('mongoose')

const getInfoData = ({ fields = [], object = {} }) => {
    return _.pick(object, fields)
}

const convertSelectArrayToSelectObj = (select = []) => {
    return Object.fromEntries(select.map(el => [el, 1]))
}

const convertSelectArrayToUnSelectObj = (select = []) => {
    return Object.fromEntries(select.map(el => [el, 0]))
}

const removeNullAndUndefined = obj => {
    Object.keys(obj).forEach(k => {
        if (obj[k] == null) {
            delete obj[k]
        }
    })

    return obj
}

const updateNestedObjectParse = (obj, prefix = "") => {
    const result = {};
    Object.keys(obj).forEach(key => {
        const newKey = prefix ? `${prefix}.${key}` : key;
        if (obj[key] === null || obj[key] === undefined) {
            console.log(`ingore key`, key);
        } else if (typeof obj[key] === 'object' && !Array.isArray(obj[key])) {
            Object.assign(result, updateNestedObjectParse(obj[key], newKey));
        } else {
            result[newKey] = obj[key];
        }
    });
 
    return result;
};

const convertToObjectIdMongo = id => new Types.ObjectId(id)

module.exports = {
    getInfoData,
    convertSelectArrayToSelectObj,
    convertSelectArrayToUnSelectObj,
    removeNullAndUndefined,
    updateNestedObjectParse,
    convertToObjectIdMongo
}