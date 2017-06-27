/*=====================================================================
 *  
 * 
 * Author : { developer.CO }
 *=====================================================================*/

exports.r = function(service, msj, status, obj) {
    return {service: service, msj: msj, status: status, obj: obj, envDev:(G.program.prod)? false : true};
};




exports.validar_request = function() {


    return function(req, res, next) {

        var args = req.query;
        if (req.method === "POST")
            args = req.body;
     

        if (args.session !== undefined && typeof args.session === "string") {
            args.session = JSON.parse(args.session);
        }

        if (args.data !== undefined && typeof args.data === "string") {
            args.data = JSON.parse(args.data);
        }
        
        
        //return

        if (!!req.url.match(/^(\/api\/)/) || !!req.url.match(/^(\/login\/?)/)) {
            // Validar que el request sea el correcto
            
            //G.utils.equals(args, G.settings.request)
            //Temporale para las tablets 2016-05-20
            if(!args.session.moduloActual){
                args.session.moduloActual = "";
                args.session.empresaId = "";
                args.session.centroUtilidad = "";
                args.session.bodega = "";
            }
           
            if ( args.session !== undefined && G.utils.equals(args.session, G.settings.request.session) && args.data !== undefined )
                next();
            else
                res.send(G.utils.r(req.url, 'La sintaxis del request es invalida', 404, {}));
        } else {
            next();
        }

    };
};


/*=========================================
 * Compare Two Objects
 * =========================================*/

exports.equals = function(ob1, ob2) {

    if (ob2 === null || ob2 === undefined)
        return false;

    if (Object.keys(ob1).length != Object.keys(ob2).length)
        return false;

    for (var p in ob1)
    {
        // Evitamos navegar por las propiedades "heredadas"
        if (ob1.hasOwnProperty(p)) {

            if (!ob2.hasOwnProperty(p))
                return false; // No es una propiedad de x                 

            switch (typeof (ob1[p])) {
                case 'function':
                    return false;
                case 'object'://!p=='data' && 

                    if (p == 'data')
                        return true;

                    if (!this.equals(ob1[p], ob2[p]))  // Comparamos los objetos                               
                        return false;
                    break;
                default:
                    if (ob1[p] !== ob2[p])
                        //return false;     // Las propiedades tienes valores distintos
                        break;
            }
        }
    }

    return true;
};


exports.subirArchivo = function(files, conservarNombre, callback) {
    var rutaTmp = files.file.path;
    var ext = G.path.extname(rutaTmp);
    var nombreArchivo = (conservarNombre) ? files.file.name : G.random.randomKey(3, 3) + ext;
    var path = G.dirname + ((files.file.customPath) ? files.file.customPath :  G.settings.carpeta_temporal);
    var rutaNueva = path + nombreArchivo;

    if (G.fs.existsSync(rutaTmp)) {
        // Copiar Archivo
        G.Q.nfcall(G.fs.copy, rutaTmp, rutaNueva).then(function() {
            return  G.Q.nfcall(G.fs.unlink, rutaTmp);
        }).then(function() {
            
            callback(false, rutaNueva);
            
        }).fail(function(err) {
            console.log("error generado >>>>>>>>>> ", err);
            G.fs.unlinkSync(rutaNueva);
            callback(true);
        }).done();

    } else {
        callback(true);
    }
};


exports.subirArchivoPlano = function(files, cabecera, callback) {    
    var rutaNueva = "";
    
    G.Q.ninvoke(G.utils, "subirArchivo", files, false).then(function(_rutaNueva) {
        var rutaNueva = _rutaNueva;
        var parser = G.XlsParser;
        var workbook = parser.readFile(rutaNueva);
        var filas = G.XlsParser.serializar(workbook, cabecera);
       // console.log("filas generadas >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> ", filas);
        if (filas) {
            G.fs.unlinkSync(rutaNueva);
            callback(false, filas);
        } else {
            throw "Error serializando el archivo";
        }
    }).fail(function(err) {
        console.log("error generado >>>>>>>>>> ", err);
        G.fs.unlinkSync(rutaNueva);
        callback(true);
    }).done();


};

//Remueve todo el contenido de una carpeta
exports.limpiarDirectorio = function(path) {
  var that = this;
  if( G.fs.existsSync(path) ) {
    G.fs.readdirSync(path).forEach(function(file,index){
        
      var curPath = path + "/" + file;
      if(G.fs.lstatSync(curPath).isDirectory()) { 
        that.limpiarDirectorio(path);
      } else { 
        G.fs.unlinkSync(curPath);
      }
    });
  }
};

exports.numeroLetra = function(valor){     
    var n = parseFloat(valor).toFixed(2); //se limita a dos decimales, no sabía que existía toFixed() :)
    var p = n.toString().substring(n.toString().indexOf(".") + 1); //decimales
    var t = "";
    t = numeroDecimalLetra(n);
   
    if(p){
         console.log("p [numeroLetra]::: ", p);
        t += " coma " + (p == 00 ? 'cero ' : numeroDecimalLetra(p)) ;
        console.log("t ", t)
    }
    
    t = t.replace("  ", " ");
    //t = t.replace(" cero", "");
  
    return t;
}

function numeroDecimalLetra(n){
    var o=new Array("diez", "once", "doce", "trece", "catorce", "quince", "dieciséis", "diecisiete", "dieciocho", "diecinueve", "veinte", "veintiuno", "veintidós", "veintitrés", "veinticuatro", "veinticinco", "veintiséis", "veintisiete", "veintiocho", "veintinueve");
    var u=new Array("cero", "uno", "dos", "tres", "cuatro", "cinco", "seis", "siete", "ocho", "nueve");
    var d=new Array("", "", "", "treinta", "cuarenta", "cincuenta", "sesenta", "setenta", "ochenta", "noventa");
    var c=new Array("", "ciento", "doscientos", "trescientos", "cuatrocientos", "quinientos", "seiscientos", "setecientos", "ochocientos", "novecientos");
    var n = parseFloat(n).toFixed(2); //se limita a dos decimales, no sabía que existía toFixed() :)
    var m = n.toString().substring(0, n.toString().indexOf(".")); //número sin decimales
    var m = parseFloat(m).toString().split("").reverse(); //tampoco que reverse() existía :D
    var t = "";

    //Se analiza cada 3 dígitos
    for (var i = 0; i < m.length; i += 3)
    {
        var x = t;
        //formamos un número de 2 dígitos
        var b = m[i + 1] != undefined ? parseFloat(m[i + 1].toString() + m[i].toString()) : parseFloat(m[i].toString());
        /*analizamos el 3 dígito*/
        t = m[i + 2] != undefined ? (c[m[i + 2]] + " ") : "";
        t += b < 10 ? u[b] : (b < 30 ? o[b - 10] : (d[m[i + 1]] + (m[i] == '0' ? "" : (" y " + u[m[i]]))));
        t = t == "ciento cero" ? "cien" : t;
        if (2 < i && i < 6)
            t = t == "uno" ? "mil " : (t.replace("uno", "un") + " mil ");
        if (5 < i && i < 9)
            t = t == "uno" ? "un millón " : (t.replace("uno", "un") + " millones ");
        t += x;
         
    }
  
    return t;
}

exports.numberFormat = function(amount, decimals) {

    amount += ''; // por si pasan un numero en vez de un string
    amount = parseFloat(amount.replace(/[^0-9\.]/g, '')); // elimino cualquier cosa que no sea numero o punto

    decimals = decimals || 0; // por si la variable no fue fue pasada

    // si no es un numero o es igual a cero retorno el mismo cero
    if (isNaN(amount) || amount === 0) 
        return parseFloat(0).toFixed(decimals);

    // si es mayor o menor que cero retorno el valor formateado como numero
    amount = '' + amount.toFixed(decimals);

    var amount_parts = amount.split('.'),
        regexp = /(\d+)(\d{3})/;

    while (regexp.test(amount_parts[0]))
        amount_parts[0] = amount_parts[0].replace(regexp, '$1' + '.' + '$2');

    return amount_parts.join(',');
}

//Remueve todo el contenido de una carpeta
exports.obtenerTamanoArchivo = function(path, callback) {
   var that = this;

    G.Q.nfcall(G.fs.stat, path).then(function(status){
        var mb = status.size / 1048576;
        callback(false, mb.toFixed(2))
    }).fail(function(err){
        callback(err);
    })
};



exports.inicializarCronjobs = function(callback){
    var sql = "UPDATE cronjobs  SET estado = '0'";
    
    G.knex.raw(sql).then(function(resultado){
        callback(false, resultado);

    }).catch(function(err){
        callback(err);
    });
};


exports.subirArchivoComprimido = function(files, conservarNombre, callback) {
    var rutaTmp = files.path;
    var ext = G.path.extname(rutaTmp);
    var nombreArchivo = (conservarNombre) ? files.name : G.random.randomKey(3, 3) + ext;
    console.log("rutaTmp ", rutaTmp);
    console.log("ext ", ext);
    console.log("nombreArchivo ", nombreArchivo);
    var path = G.dirname ;
     console.log("path ", path);
    var rutaNueva = path + "\\files\\tmp\\"+nombreArchivo;
     console.log("rutaNueva ", rutaNueva);
    if (G.fs.existsSync(rutaTmp)) {
        // Copiar Archivo
        G.Q.nfcall(G.fs.copy, rutaTmp, rutaNueva).then(function() {
            return  G.Q.nfcall(G.fs.unlink, rutaTmp);
        }).then(function() {
            
            callback(false, rutaNueva);
            
        }).fail(function(err) {
            console.log("error generado >>>>>>>>>> ", err);
            G.fs.unlinkSync(rutaNueva);
            callback(true);
        }).done();

    } else {
        callback(true);
    }
};