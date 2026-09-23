const handler={};
handler.notFoundHandler=(requestProperty,callback)=>{
    // console.log(requestProperty);
    callback(404,{
        message:' Not found'
    })
    
}
module.exports=handler;