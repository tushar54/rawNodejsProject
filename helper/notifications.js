const https = require('https')
const querystring = require('querystring')
const { twilio } = require('./environment')

const notifications = {}

notifications.sendTwilioSms = (mobile, msg, callback) => {
    const userMobile = typeof (mobile) === 'string' && mobile.trim().length === 11 ? mobile.trim() : false
    const userMsg = typeof (msg) === 'string' && msg.trim().length > 0 && msg.trim().length <= 1600 ? msg.trim() : false

    if (userMobile && userMsg) {
        const payload = {
            From: twilio.fromPhone,
            To: `+88${userMobile}`,
            Body: userMsg
        }

        const stringifyPayload = querystring.stringify(payload)

        const requestDetails = {
            hostname: 'api.twilio.com',
            method: 'POST',
            path: `/2010-04-01/Accounts/${twilio.accountSid}/Messages.json`,
            auth: `${twilio.accountSid}:${twilio.authToken}`,
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Content-Length': Buffer.byteLength(stringifyPayload)
            }
        }

        const req = https.request(requestDetails, (res) => {
            let responseData = '';

            res.on('data', (chunk) => {
                responseData += chunk;
            });

            res.on('end', () => {
                const status = res.statusCode;
                if (status === 200 || status === 201) {
                    callback(false)
                } else {
                    console.error('Twilio API Error:', responseData);
                    callback(`Status code returned was ${status}`)
                }
            });
        })

        req.on('error', (e) => {
            callback(e)
        })

        req.write(stringifyPayload);
        req.end();

    } else {
        callback('Given parameters were missing or invalid')
    }
}

module.exports = notifications