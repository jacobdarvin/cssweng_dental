const sanitize = require('mongo-sanitize');
const fs = require('fs');

const helper = {

    sanitize: function (query) {
        return sanitize(query);
    },

    renameFile: function (req, newName){
      var origName = req.file.originalname;
      var extension = origName.substring(origName.lastIndexOf("."));
      const newURL = req.file.destination + '/' + newName + extension;

      fs.renameSync(req.file.path, newURL);
      return newName + extension;
    }
}

module.exports = helper;