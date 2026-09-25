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

}
handler._token.post = (requestProperties, callback) => {
    const mobile = typeof (requestProperties.body.mobile) === 'string' && requestProperties.body.mobile.trim().length === 11 ? requestProperties.body.mobile : false;
     const password = typeof (requestProperties.body.password) === 'string' && requestProperties.body.password.trim().length > 0 ? requestProperties.body.password : false;


    if (mobile && password) {
        data.read('users', mobile, (err, userData) => {
            console.log(parsedData(userData))
            let = hashedPassword = hash(password);
            console.log(hashedPassword)
            if (hashedPassword === parsedData(userData).password) {
                
                let tokenId = createRandomString(20)
                let expires = Date.now() + 60 * 60 * 1000
                let tokenObject = {
                    mobile,
                    'id': tokenId,
                    expires
                }
                data.create('tokens',tokenId,tokenObject,(err1)=>{
                    if(!err1){
                        callback(200,{
                            tokenObject
                        })
                    }
                    else{
                        callback(500,{
                            error:'this is server side error!'
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

}
handler._token.delete = (requestProperties, callback) => {

}




module.exports = handler;