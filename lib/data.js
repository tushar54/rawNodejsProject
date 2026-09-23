const fs = require('fs')
const path = require('path');
const { callbackify } = require('util');


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

lib.read = (dir, file, callback)=>{
    console.log(callback)
    fs.readFile(`${lib.basedir + dir}/${file}.json`,'utf8',(err,data)=>{
        callback(err,data)
    })
}

lib.update = (dir,file,data,callback)=>{
    fs.open(`${lib.basedir + dir}/${file}.json`,'r+',(err, fileDescriptor)=>{
        if(!err&&fileDescriptor){
            const stringData = JSON.stringify(data);
            fs.ftruncate(fileDescriptor,(err1)=>{
                if(!err1)
                {
                    fs.writeFile(fileDescriptor,stringData,(err2)=>{
                        if(!err2){
                            fs.close(fileDescriptor,(err3)=>{

                                if(!err3){
                                    callback(false)
                                }
                                else{
                                    callback('closing e problem')
                                }
                            })
                        }
                        else{

                        }
                    })
                }
                else{
                    callback('Ftruncate e problem hoyse.')
                }
            })
        }
        else{
            callback('error hoyse solve kor..')
        }
    })
}

lib.delete = (dir,file,callback)=>{
    fs.unlink(`${lib.basedir + dir}/${file}.json`,(err)=>{
        if(!err){
            callback(false)
        }
        else{
            callback('Delete korte giye error hoyse.')
        }
    })
}
module.exports= lib