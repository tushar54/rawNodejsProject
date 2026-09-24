const http = require('http');
const {handleRequest}= require('./helper/handleReqRes')
const environment = require('./helper/environment')
const data = require('./lib/data')
const app = {};


// data.delete('test','newFile',  (err)=>{
//     console.log(err);
// })

app.createServer = () => {
    const server = http.createServer(app.handleRequest);
    server.listen(environment.port, () => {
        console.log(`listening to port ${environment.port}`);

    })
   
}

app.handleRequest = handleRequest

app.createServer()
