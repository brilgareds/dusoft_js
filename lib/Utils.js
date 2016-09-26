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
    var rutaNueva = G.dirname + G.settings.carpeta_temporal + nombreArchivo;

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
    var that = this;
    var rutaNueva = "";
    
    G.Q.ninvoke(that, "subirArchivo", files, false).then(function(_rutaNueva) {
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