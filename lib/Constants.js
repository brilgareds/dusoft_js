var Constants = function() {
    this.cosmitetUrl = (G.program.prod) ? "http://dusoft.cosmitet.net/dusoft/ws/" : /*"http://10.0.2.170/Pruebas_DUSOFT_DUANA_/ws/";*/  "http://10.0.0.3/pg9/larry.sanchez/asistencial/ws/";
    this.cartagenaUrl = (G.program.prod) ? "http://10.245.1.140/dusoft/ws/" : "http://dusoft.clinicaelbosque.net/dusoft/ws/";
    this.expiracionCache = 21600;
    this.diasHabilesUrl =   "http://10.0.2.237/APP/PRUEBAS_CRISTIAN/classes/CalculoFechas/";
};

Constants.prototype.db = function(){
    return{
        LIKE:"ilike"
    };
};


Constants.prototype.WS =function() {
    return {
            CODIFICACION_PRODUCTOS:{
                   PRUEBA:this.cosmitetUrl+ "ws_documentosBodega.php?wsdl"
            },
            DOCUMENTOS:{
                COSMITET:{
                    E008:this.cosmitetUrl+ "ws_documentosBodega.php?wsdl"
                },
                CARTAGENA:{
                    E008:this.cartagenaUrl+ "ws_documentosBodega.php?wsdl"
                }
            },
            
            DISPENSACION_HC:{
                FECHA_MAXIMA:this.diasHabilesUrl+ "Prueba.php?wsdl"
            }
    };
};


Constants.prototype.llavesCache = function(){
    return {
        USURIO_PARAMETRIZACION : "usuario_parametrizacion"
    }
};


Constants.prototype.className = "Constants";



module.exports.create = function() {
    return new Constants();
};

module.exports._class = Constants;

