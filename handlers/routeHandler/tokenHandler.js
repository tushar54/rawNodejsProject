const data = require('../../lib/data')
const { hash, parsedData, createRandomString } = require('../../helper/utilities');



const handler = {};


handler.tokenHandler = (requestProperties, callback) => {
    const acceptedMethod = ['get', 'post', 'put', 'delete'];
    if (acceptedMethod.indexOf(requestProperties.method) > -1) {
        handler._token[requestProperties.method](requestProperties, callback
        )
    }
    else {
        callback(405)
    }

}


handler._token = {}

handler._token.get = (requestProperties, callback) => {
    const id = typeof (requestProperties.queryStringObject.id) === 'string' && requestProperties.queryStringObject.id.trim().length === 21 ? requestProperties.queryStringObject.id : false;
    if (id) {
        data.read('tokens', id, (err, tokenData) => {
            const token = { ...parsedData(tokenData) };
            if (!err && token) {

                callback(200, token)
            }
            else {
                callback(404, {
                    'error': 'error hoiye geche! token pawa jai nai.'
                })
            }
        })
    }
    else {
        callback(404, {
            'error': 'requested token was not found!'
        })
    }
}
handler._token.post = (requestProperties, callback) => {
    const mobile = typeof (requestProperties.body.mobile) === 'string' && requestProperties.body.mobile.trim().length === 11 ? requestProperties.body.mobile : false;
    const password = typeof (requestProperties.body.password) === 'string' && requestProperties.body.password.trim().length > 0 ? requestProperties.body.password : false;


    if (mobile && password) {
        data.read('users', mobile, (err, userData) => {
            // console.log(parsedData(userData))
            let = hashedPassword = hash(password);
            // console.log(hashedPassword)
            if (hashedPassword === parsedData(userData).password) {

                let tokenId = createRandomString(20)
                // console.log(tokenId)
                let expires = Date.now() + 60 * 60 * 1000
                let tokenObject = {
                    mobile,
                    id: tokenId,
                    expires
                }
                data.create('tokens', tokenId, tokenObject, (err1) => {
                    if (!err1) {
                        callback(200, {
                            tokenObject
                        })
                    }
                    else {
                        callback(500, {
                            error: 'this is server side error!'
                        })
                    }
                })
            }
            else {
                callback(400, {
                    error: 'you have a problem'
                })
            }
        })
    }
    else {
        callback(400, {
            error: 'you have a problem with token'

        })
    }
}
handler._token.put = (requestProperties, callback) => {
    const id = typeof requestProperties.body.id === 'string' && requestProperties.body.id.trim().length === 21 ? requestProperties.body.id : false;

    const extend = typeof requestProperties.body.extend === 'boolean' && requestProperties.body.extend === true ? true : false;
    // console.log(id, extend)
    if (id && extend) {
        data.read('tokens', id, (err1, tokenData) => {
            let tokenObject = parsedData(tokenData)
            if (tokenObject.expires > Date.now()) {
                tokenObject.expires = Date.now() * 60 * 60 * 1000;
                data.update('tokens', id, tokenObject, (err2) => {

                    if (!err2) {
                        callback(200, {
                            'message': 'Token is updated'
                        })
                    }
                    else {
                        callback(500, {
                            error: 'there was a server side error!'
                        })
                    }
                })
            }
            else {
                callback(400, {
                    error: 'token already expired!'
                })
            }
        })
    }
    else {
        callback(400,
            {
                error: 'there was a problem in your request!'
            }
        )
    }
}
handler._token.delete = (requestProperties, callback) => {
    const id = typeof (requestProperties.queryStringObject.id) === 'string' && requestProperties.queryStringObject.id.trim().length === 21 ? requestProperties.queryStringObject.id : false;
    // console.log(id)
    if (id) {
        data.read('tokens', id, (err, userData) => {
            if (!err && userData) {
                data.delete('tokens', id, (err) => {
                    if (!err) {
                        callback(200, {
                            message: 'user was successfully deleted'
                        })
                    }
                    else {
                        callback(500, {
                            error: 'There was a server side error.'
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

handler._token.verify = (id,mobile,callback)=>{
data.read('tokens',id,(err,tokenData)=>{

    if(!err&&tokenData){
        if(parsedData(tokenData).mobile === mobile && parsedData(tokenData).expires > Date.now()){
            callback(true)
        }
        else{
            callback(false)
        }
    }
    else{
        callback(false)
    }
})
}



module.exports = handler;