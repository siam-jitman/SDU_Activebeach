// const path = require("path")
const fs = require('fs');
const uniqid = require('uniqid');

var TAG = "./controller/UploadCtrl.js => ";

module.exports = class UploadCtrl {
    static uploadImage(files, path) {
        return new Promise((resolve, reject) => {
            if (files) {
                var file = files,
                    name = file.name,
                    type = file.mimetype;
                var uploadpath = path + '/temp/images/';
                file.mv(uploadpath + name, function (err) {
                    if (err) {
                        resolve(false);
                    } else {

                        let oldName = uploadpath + name;
                        let newName = (new Date().getTime()) + "_" + uniqid() + "." + name.split(".")[name.split(".").length - 1];

                        fs.rename(oldName, uploadpath + newName, function (err) {
                            if (err) {
                                console.log('ERROR: ' + err);
                                resolve(false);
                            } else {
                                resolve(true);
                            }
                        });
                    }
                });
            } else {
                resolve(false);
            };
        });
    }
}