const url = require('url');
const {StringDecoder} = require('string_decoder');


const handle={}

handle.handleRequest = (req, res) => {
    console.log('tushar')
    const parseUrl = url.parse(req.url, true)
    const path = parseUrl.pathname;
    const trimedPath = path.replace(/^\/+|\/+&/g,'')
    const method = req.method.toLowerCase();
    const queryStringObject= parseUrl.query;
    const headerObject = req.headers;
    const decoder = new StringDecoder('utf-8')

    
    // let realData='';
    // // req.on('data',(buffer)=>{
    // //     realData+=decoder.write(buffer)
    // // })
    // // req.on('end',()=>{
    // //     realData+=decoder.end()
    // //     console.log(realData)
       
    // // })
     res.end('hello world')
    // console.log(header);
    
};

module.exports.handleRequest=handle.handleRequest;