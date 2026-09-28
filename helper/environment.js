const environment ={}

environment.staging={
    port:3000,
    envName:'staging',
    secretKey:'dslfjshfsdkjhfjksdh',
    maxCount: 5,
    twilio:{
        fromPhone: '+17372508034',
        accountSid:'AC7e1fa479062f990a50265757bc2f0f30',
        authToken:'52cbc8acd329d5e9e7d8a96d8018aa9c'
    }
}
environment.production={
    port:5000,
    envName:'production',
    secretKey:'dslfjshfsdkjhfjksdh',
    maxCount: 5,
    twilio:{
        fromPhone: '+17372508034',
        accountSid:'AC7e1fa479062f990a50265757bc2f0f30',
        authToken:'52cbc8acd329d5e9e7d8a96d8018aa9c'
    }
}
const currentEnvironment = typeof(process.env.NODE_ENV)==='string'? process.env.NODE_ENV:'staging';

const environmentToExport = typeof(environment[currentEnvironment]) ==='object'? environment[currentEnvironment]:environment.staging;

module.exports=environmentToExport;