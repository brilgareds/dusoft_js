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
    
    //Comando que permite minificar todos los javascripts de los modulos y librerias
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
//Se valida si se especifico los modulos en la consola, de lo contrario se listan de la carpeta raiz de la aplicacion del cliente
if(process.argv.indexOf("modulos") === -1 ){
    //Se obtienen los modulos de la carpeta dusoft_duana
    modulos = listarDirectorios(rootPath);
} else {
    //Se obtienen los modulos especificados por consola
    modulos = process.argv.slice(process.argv.indexOf("modulos") + 1, process.argv.length);
}

minificarModulo(modulos, function(){
    
});
