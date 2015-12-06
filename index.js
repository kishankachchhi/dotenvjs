var fs = require('fs');
var read = require("fs").readFileSync;
var cconsole = require('./lib/colorConsole');
var fileName = '.env';
//var path = require('path');
//var appDir = path.dirname(require.main.filename);
//var caretPath = path.resolve(appDir,'../../','.envjson');
var config = {};
function Env(){
    process.argv.forEach(function (val, index, array) {
        console.log(index + ': ' + val);
        if(new RegExp(/^\.env*/i).test(val)){
            fileName = val;
        }
    });

    fs.exists('./'+fileName, function(exists) {
        if (exists) {
            cconsole.info(fileName+' file is loaded.');
        }else{
            cconsole.warn(fileName+'file does not found.');
        }
    });
}

Env.prototype.string = function(){
    var doc;

    try {
        doc = read('./'+fileName).toString().split('\n');
    } catch (exc) {
        return;
    }

    var i = -1;
    var len = doc.length;
    var row;

    while (++i < len) {
        if (!doc[i]) continue;
        row = doc[i].split(/\s*=\s*/);

        //Ignoring comments
        if(! new RegExp(/^\#.*/i).test(row[0].trim())){

            //Trim '' or ""
            if(new RegExp(/\'.*\'/i).test(row[0].trim()))
                row[0] = row[0].replace(/\'/g,'');

            if(new RegExp(/\'.*\'/i).test(row[1].trim()))
                row[1] = row[1].replace(/\'/g,'');

            if(new RegExp(/\".*\"/i).test(row[0].trim()))
                row[0] = row[0].replace(/\"/g,'');

            if(new RegExp(/\".*\"/i).test(row[1].trim()))
                row[1] = row[1].replace(/\"/g,'');

            row[0] = typeof row[0]=='string' ?  row[0].trim() : row[0];
            process.env[row[0]] = typeof row[1]=='string' ?  row[1].trim() : row[1];
            config[row[0]] = row[1];
        }

    }

    return config;
};

Env.prototype.json = function(){
    if(JSON.parse(read('./'+fileName).toString())){
        config = JSON.parse(read('./'+fileName).toString());
        return config;
    }
    return;
};

Env.prototype.env = function (config, value) {
    if(config){
        return config;
    }else{
        return value;
    }
};

module.exports = new Env();




