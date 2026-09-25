const crypto = require('crypto');
const environment = require('../helper/environment')

const utilities = {}

utilities.parsedData = (jsonString) => {
    let output;
    try {
        output = JSON.parse(jsonString)
    } catch (error) {
        output = {}
    }
    return output
}
utilities.hash = (str) => {
    if (typeof (str) === 'string' && str.length > 0) {
        const hash = crypto.createHmac('sha256', environment.secretKey).update(str).digest('hex')
        return hash;
    }
    return false;
}
utilities.createRandomString = (strLength) => {
  let length= strLength;
  length= typeof strLength==='number'&& strLength > 0?strLength:false;
    if(length){
        let possibleChar = 'abcdefghijklmnopqrstuvwxyz1234567890'
        let output=''
        for(let i=0;i<=length;i++){
            let randomCharecter=possibleChar.charAt(Math.floor(Math.random()*possibleChar.length));
            output+= randomCharecter;
        }
    }
    else{
        return false;
    }

    return ;
}


module.exports = utilities;