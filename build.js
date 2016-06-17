var fs = require('fs'),
rootPath = "public/dusoft_duana";
path = require('path');
var exec = require('child_process').exec;

function listarDirectorios(srcpath) {
  return fs.readdirSync(srcpath).filter(function(file) {
    return fs.statSync(path.join(srcpath, file)).isDirectory();
  });
}

function minificarModulo(modulos, callback){
    var modulo = modulos[0]; 
    if(!modulo){
        callback();
        return;
    }
    
    var cmd = 'r.js.cmd -o ' + rootPath + "/" + modulo + '/build.js';

    exec(cmd, function(error, stdout, stderr) {
        if(error){
            console.log("error ", error);
        }
        
        console.log("modulo compilado ", modulo, cmd);
        modulos.splice(0, 1);
        minificarModulo(modulos, callback);
        
    });
}

var modulos;
if(process.argv.indexOf("modulos") == -1 ){
    modulos = listarDirectorios(rootPath);
} else {
    modulos = process.argv.slice(process.argv.indexOf("modulos") + 1, process.argv.length);
}

minificarModulo(modulos, function(){
    
});
