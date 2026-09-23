const http = require('http');
const {handleRequest}= require('./helper/handleReqRes')
const environment = require('./helper/environment')
const data = require('./lib/data')
const app = {};


data.create('test','newFile',{name:'Bangladesh',language:'Bangla'},(err)=>{
    console.log('error was',err);
})

app.createServer = () => {
    const server = http.createServer(app.handleRequest);
    server.listen(environment.port, () => {
        console.log(`listening to port ${environment.port}`);

    })
   
}

app.handleRequest = handleRequest

app.createServer()
