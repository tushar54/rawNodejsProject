const data = require('../../lib/data')
const { hash, parsedData } = require('../../helper/utilities');
const handler = {};
handler.userHandler = (requestProperties, callback) => {
    const acceptedMethod = ['get', 'post', 'put', 'delete'];
    if (acceptedMethod.indexOf(requestProperties.method) > -1) {
        handler._users[requestProperties.method](requestProperties, callback
        )
    }
    else {
        callback(405)
    }

}


handler._users = {}

handler._users.get = (requestProperties, callback) => {
    const mobile = typeof (requestProperties.queryStringObject.mobile) === 'string' && requestProperties.queryStringObject.mobile.trim().length === 11 ? requestProperties.queryStringObject.mobile : false;
    if (mobile) {
        data.read('users', mobile, (err, u) => {
            const user = { ...parsedData(u) };
            if (!err && user) {
                delete user.password;
                callback(200, user)
            }
            else {
                callback(404, {
                    'error': 'error hoiye geche!'
                })
            }
        })
    }
    else {
        callback(404, {
            'error': 'requested user was not found!'
        })
    }

}
handler._users.post = (requestProperties, callback) => {
    const firstName = typeof (requestProperties.body.firstName) === 'string' && requestProperties.body.firstName.trim().length > 0 ? requestProperties.body.firstName : false;
    const lastName = typeof (requestProperties.body.lastName) === 'string' && requestProperties.body.lastName.trim().length > 0 ? requestProperties.body.lastName : false;
    const mobile = typeof (requestProperties.body.mobile) === 'string' && requestProperties.body.mobile.trim().length === 11 ? requestProperties.body.mobile : false;
    const password = typeof (requestProperties.body.password) === 'string' && requestProperties.body.password.trim().length > 0 ? requestProperties.body.password : false;
    const toAggrement = typeof (requestProperties.body.toAggrement) === 'boolean' ? requestProperties.body.password : false;
    // console.log(mobile,password)
    if (firstName && lastName && mobile && password && toAggrement) {
        data.read('users', mobile, (err, user) => {
            if (err) {
                let userObject = {
                    firstName,
                    lastName,
                    mobile,
                    password: hash(password),
                    toAggrement
                }
                data.create('users', mobile, userObject, (err) => {
                    if (!err) {
                        callback(200, {
                            'message': 'user was created sucessfully'
                        })
                    }
                    else {
                        callback(500, {
                            error: 'could not creat user!'
                        })
                    }
                })
            }
            else {
                callback(500, {
                    error: 'Already this user exist!'
                })
            }
        })
    }
    else {
        callback(400)
    }
}
handler._users.put = (requestProperties, callback) => {
    const firstName = typeof (requestProperties.body.firstName) === 'string' && requestProperties.body.firstName.trim().length > 0 ? requestProperties.body.firstName : false;
    const lastName = typeof (requestProperties.body.lastName) === 'string' && requestProperties.body.lastName.trim().length > 0 ? requestProperties.body.lastName : false;
    const mobile = typeof (requestProperties.body.mobile) === 'string' && requestProperties.body.mobile.trim().length === 11 ? requestProperties.body.mobile : false;
    const password = typeof (requestProperties.body.password) === 'string' && requestProperties.body.password.trim().length > 0 ? requestProperties.body.password : false;

    if (mobile) {
        if (firstName || lastName || password) {
            data.read('users', mobile, (err, uData) => {
                const userData = { ...parsedData(uData) }
                if (!err && userData) {
                    if (firstName) {
                        userData.firstName = firstName;
                    }
                    if (lastName) {
                        userData.lastName = lastName
                    }
                    if (password) {
                        userData.password = hash(password)
                    }
                    data.update('users', mobile, userData, (err) => {
                        if (!err) {
                            callback(200, {
                                message: 'user was updated successfully!'
                            })
                        }
                        else {
                            callback(500, {
                                error: ' There was a problem in the server side!'
                            })
                        }
                    }
                    )

                }
                else {
                    callback(400, {
                        error: 'you have a problem in your request'
                    })
                }
            })
        }
        else {
            callback(400, {
                error: 'You have a problem in your request!'
            })
        }
    }
    else {
        callback(400, {
            error: 'Invalid phone number . Please try again'
        })
    }

}
handler._users.delete = (requestProperties, callback) => {
    const mobile = typeof (requestProperties.queryStringObject.mobile) === 'string' && requestProperties.queryStringObject.mobile.trim().length === 11 ? requestProperties.queryStringObject.mobile : false;

    if (mobile) {
        data.read('users', mobile, (err, userData) => {
            if (!err&& userData) {
                data.delete('users',mobile, (err)=>{
                    if(!err){
                        callback(200,{
                            message:'user was successfully deleted'
                        })
                    }
                    else{
                        callback(500,{
                            error:'There was a server side error.'
                        })
                    }
                })
            }
            else {
                callback(500, {
                    error: ' There was a problem in your request'
                })
            }
        })
    }
    else {
        callback(400, {
            error: ' There was a problem in your request'
        })
    }
}




module.exports = handler;