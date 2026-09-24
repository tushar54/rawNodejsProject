const data =require('../../lib/data')
const {hash} = require('../../helper/utilities')
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

    callback(201)
}
handler._users.post = (requestProperties, callback) => {
    const firstName = typeof (requestProperties.body.firstName) === 'string' && requestProperties.body.firstName.trim().length > 0 ? requestProperties.body.firstName : false;
    const lastName = typeof (requestProperties.body.lastName) === 'string' && requestProperties.body.lastName.trim().length > 0 ? requestProperties.body.lastName : false;
    const mobile = typeof (requestProperties.body.mobile) === 'string' && requestProperties.body.mobile.trim().length === 11 ? requestProperties.body.mobile : false;
    const password = typeof (requestProperties.body.password) === 'string' && requestProperties.body.password.trim().length > 0 ? requestProperties.body.password : false;
    const toAggrement = typeof (requestProperties.body.toAggrement) === 'boolean'? requestProperties.body.password : false;

    if (firstName && lastName && mobile && password && toAggrement) {
        data.read('users',mobile,(err,user)=>{
            if(err){
                let userObject={
                    firstName,
                    lastName,
                    mobile,
                    password: hash(password),
                    toAggrement
                }
                data.create('users',mobile,userObject,(err)=>{
                    if(!err){
                        callback(200,{
                            'message':'user was created sucessfully'
                        })
                    }
                    else{
                        callback(500, {
                            error:'could not creat user!'
                        })
                    }
                })
            }
            else{
                callback(500,{
                    error:'Already this user exist!'
                })
            }
        })
    }
    else {
        callback(400)
    }
}
handler._users.put = (requestProperties, callback) => {
}
handler._users.delete = (requestProperties, callback) => {
}




module.exports = handler;