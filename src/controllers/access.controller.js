'use strict'

class AccessController {
    signUp = async(req, res, next) => {
        console.log(`[P]:: signUp`, req.body)
        return res.status(201).json({
            code: '20001',
            metadata: {userid: 1}
        })
    }
}

module.exports = new AccessController()