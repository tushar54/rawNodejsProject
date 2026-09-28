const http = require('http');
const {handleRequest}= require('./helper/handleReqRes')
const environment = require('./helper/environment')
const data = require('./lib/data')
const {sendTwilioSms} = require('./helper/notifications')


const app = {};


 
// delete korte hobe 
// data.delete('test','newFile',  (err)=>{
//     console.log(err);
// })


sendTwilioSms('01703887629','Hello world',(err)=>{
    console.log('this is the error',err)
})




app.createServer = () => {
    const server = http.createServer(app.handleRequest);
    server.listen(environment.port, () => {
        console.log(`listening to port ${environment.port}`);

    })
   
}

app.handleRequest = handleRequest

app.createServer()
