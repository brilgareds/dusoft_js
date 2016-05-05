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



exports.subirArchivoPlano = function(files, cabecera, callback) {
    var ruta_tmp = files.file.path;
    var ext = G.path.extname(ruta_tmp);
    var nombre_archivo = G.random.randomKey(3, 3) + ext;
    var ruta_nueva = G.dirname + G.settings.carpeta_temporal + nombre_archivo;

    if (G.fs.existsSync(ruta_tmp)) {
        // Copiar Archivo
        G.Q.nfcall(G.fs.copy, ruta_tmp, ruta_nueva).then(function() {
            return  G.Q.nfcall(G.fs.unlink, ruta_tmp);
        }).then(function() {
            var parser = G.XlsParser;
            var workbook = parser.readFile(ruta_nueva);
            var filas = G.XlsParser.serializar(workbook, cabecera);
           // console.log("filas generadas >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> ", filas);
            if (filas) {
                G.fs.unlinkSync(ruta_nueva);
                callback(false, filas);
            } else {
                throw "Error serializando el archivo";
            }
        }).fail(function(err) {
            console.log("error generado >>>>>>>>>> ", err);
            G.fs.unlinkSync(ruta_nueva);
            callback(true);
        }).done();

    } else {
        callback(true);
    }
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



exports.inicializarCronjobs = function(callback){
    var sql = "UPDATE cronjobs  SET estado = '0'";
    
    G.knex.raw(sql).then(function(resultado){
        callback(false, resultado);

    }).catch(function(err){
        callback(err);
    });
};