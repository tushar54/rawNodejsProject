const http = require('http');
const {handleRequest}= require('./helper/handleReqRes')

const app = {};

app.config = {
    port: 3000
}
app.createServer = () => {
    const server = http.createServer(app.handleRequest);
    server.listen(app.config.port, () => {
        console.log(`listening to port ${app.config.port}`);

    })
   
}

app.handleRequest = handleRequest

app.createServer()
