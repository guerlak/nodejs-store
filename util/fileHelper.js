const fs = require('fs');
const path = require('path');

const deleteFile = (filePath) =>{

   filePath = path.join('C:\\workspace\\nodejs\\store-nodejs\\' + filePath)

    console.log(filePath);

    fs.unlink(filePath, err => {
      
        if(err){
            console.log('Error deleting file' + err);
        }
    });
}

module.exports = deleteFile;