var XlsParser = require('j');

/*
* @Author: Eduar
* @param {Array} workbook
* @param {Array} encabezadoAValidar
* return {Array}
* +Descripcion: Convierte un binario leido en json.
*/
XlsParser.serializar = function(workbook, encabezadoAValidar){
    var hoja = workbook[1].SheetNames[0];
    var filas = this.utils.to_json(workbook, true)[hoja];
    
    filas = this.limpiarCampos(filas);
    var llaves = Object.keys(filas[0]);
    
    if(this.encabezadoValido(llaves, encabezadoAValidar)){
        /*console.log("encabezado valido con llaves ", encabezadoAValidar, llaves);
        console.log("filas ", filas);*/
        return filas;
    }  else {
        //console.log("encabezado no valido con llaves ", encabezadoAValidar, llaves);
        return null;
    }
    
};

/*
* @Author: Eduar
* @param {Array} encabezadoArchivo
* @param {Array} encabezadoAValidar
* +Descripcion: Valida que el encabezado del documento xls o xlsx sea el esperado 
*/
XlsParser.encabezadoValido = function(encabezadoArchivo, encabezadoAValidar){
    for(var i in encabezadoAValidar){
        var termino = encabezadoAValidar[i].trim();
        if(encabezadoArchivo.indexOf(termino) < 0){
            return false;
        }
    }
    
    return true;
};

/*
* @Author: Eduar
* @param {Array} filas
* +Descripcion: Limpia las llaves de cada objeto que representan el encabezado, remueve espacios en blanco y deja el string en minusculas
*/
XlsParser.limpiarCampos = function(filas){
    
    for(var j in filas){
        var fila = filas[j];
        
        for(var i in fila){
            //Se asigna una nueva llave despues de remover espacios y dejandola en minusculas
            var llave = i.trim().toLowerCase();
            fila[llave] = fila[i];
            
            //Se elimina la llave anterior
            if(llave !== i){
                delete fila[i];
            }
        }
    }    
    return  filas;
};


module.exports = XlsParser;

