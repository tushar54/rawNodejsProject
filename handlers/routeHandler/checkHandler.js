const data = require('../../lib/data')
const { hash, parsedData, createRandomString } = require('../../helper/utilities');
const tokenHandler = require('./tokenHandler')
const { maxCount } = require('../../helper/environment')

const handler = {};
handler.checkHandler = (requestProperties, callback) => {
    const acceptedMethod = ['get', 'post', 'put', 'delete'];
    if (acceptedMethod.indexOf(requestProperties.method) > -1) {
        handler.check[requestProperties.method](requestProperties, callback
        )
    }
    else {
        callback(405)
    }

}



handler.check = {}



handler.check.get = (requestProperties, callback) => {
    const id = typeof (requestProperties.queryStringObject.id) === 'string' && requestProperties.queryStringObject.id.trim().length === 21 ? requestProperties.queryStringObject.id : false;


    if (id) {
        data.read('checks', id, (err, checkData) => {
            if (!err && checkData) {
                let token = typeof (requestProperties.headerObject.token) === 'string' ? requestProperties.headerObject.token : false;
                console.log(token,id)
                tokenHandler._token.verify(token, parsedData(checkData).userMobile, (tokenIsValid) => {
                            if (tokenIsValid) {
                                console.log(parsedData(checkData))
                                callback(200,parsedData(checkData))
                            }
                            else{
                                callback(403,{
                                    error: "authentication failed"
                                })
                            }
                        
                })
            }
            else {
                callback(500, {
                    error: 'there is no user data'
                })
            }
        })
    }
    else {
        callback(400, {
            error: 'you have a problem in your request'
        })
    }


}
handler.check.post = (requestProperties, callback) => {
    let protocol = typeof (requestProperties.body.protocol) === 'string' && ['http', 'https'].indexOf(requestProperties.body.protocol) > -1 ? requestProperties.body.protocol : false;

    let url = typeof (requestProperties.body.url) === 'string' && requestProperties.body.url.trim().length > 0 ? requestProperties.body.url : false;

    let method = typeof (requestProperties.body.method) === 'string' && ['GET', 'PUT', 'POST', 'DELETE'].indexOf(requestProperties.body.method) > -1 ? requestProperties.body.method : false;

    let success = typeof (requestProperties.body.success) === 'object' && requestProperties.body.success instanceof Array ? requestProperties.body.success : false;

    let timeOutSecond = typeof (requestProperties.body.timeOutSecond) === 'number' && requestProperties.body.timeOutSecond % 2 === 0 && requestProperties.body.timeOutSecond >= 1 && requestProperties.body.timeOutSecond <= 5 ? requestProperties.body.timeOutSecond : false;

    console.log(protocol, url, method, success, timeOutSecond)

    if (protocol && url && method && success && timeOutSecond) {
        let token = typeof (requestProperties.headerObject.token) === 'string' ? requestProperties.headerObject.token : false;
        data.read('tokens', token, (err, tokenData) => {
            if (!err && tokenData) {
                let userMobile = parsedData(tokenData).mobile;
                data.read('users', userMobile, (err2, userData) => {
                    if (!err2 && userData) {
                        tokenHandler._token.verify(token, userMobile, (tokenIsValid) => {
                            if (tokenIsValid) {
                                let userObject = parsedData(userData)
                                let userChecks = typeof (userObject.checks) === 'object' && userObject.checks instanceof Array ? userObject.checks : []

                                if (userChecks.length < maxCount) {
                                    let checkId = createRandomString(20)
                                    let checkObject = {
                                        id: checkId,
                                        userMobile,
                                        protocol,
                                        url,
                                        method,
                                        success,
                                        timeOutSecond
                                    }
                                    data.create('checks', checkId, checkObject, (err3) => {
                                        if (!err3) {
                                            userObject.checks = userChecks;
                                            userObject.checks.push(checkId)
                                            data.update('users', userMobile, userObject, (err4) => {
                                                if (!err4) {
                                                    callback(200, checkObject)
                                                }
                                                else {
                                                    callback(500, {
                                                        error: "there was a problem in the server side"
                                                    })
                                                }
                                            })
                                        }
                                        else {
                                            callback(500, {
                                                error: 'There was a problem in the server side'
                                            })
                                        }
                                    })
                                }
                                else {
                                    callback(401, {
                                        error: 'user has already reached maxcount limit!'
                                    })
                                }
                            }
                            else {
                                callback(403, {
                                    error: 'authentication problem'
                                })
                            }
                        })
                    }
                    else {
                        callback(403, {
                            error: 'user not found'
                        })
                    }
                })
            }
            else {
                callback(403, {
                    error: 'Authentication Problem'
                })
            }
        })
    }
    else {
        callback(400,
            {
                error: 'You have a problem in your request'
            }
        )
    }



}



handler.check.put = (requestProperties, callback) => {

}




handler.check.delete = (requestProperties, callback) => {

}




module.exports = handler;