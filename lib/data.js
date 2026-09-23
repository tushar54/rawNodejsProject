const fs = require('fs')
const path = require('path')


const lib = {}

lib.basedir = path.join(__dirname,'/../.data/' );
console.log(lib.basedir);

// write data to file
lib.create = (dir, file, data, callback) => {
    fs.open(`${lib.basedir + dir}/${file}.json`, 'wx', (err, fileDescriptor) => {
        if (!err && fileDescriptor) {

            const stringData = JSON.stringify(data)

            fs.writeFile(fileDescriptor, stringData, (err2) => {
                if (!err2) {
                    fs.close(fileDescriptor, (err3) => {
                        if (!err3) {
                            callback(false)
                        }
                        else {
                            callback('Error closing the new file!')
                        }
                    })
                }
                else {
                    callback('Error writing to new file!');
                }
            })
        }
        else {
            callback(err);
        }
    })
}

module.exports= lib