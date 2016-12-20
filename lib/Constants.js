var Constants = function() {
    this.cosmitetUrl = (G.program.prod) ? "http://dusoft.cosmitet.net/dusoft/ws/" :"http://10.0.0.3/pg9/jonier.cabrera/asistencial/ws/";//"http://10.0.0.3/pg9/larry.sanchez/pruebas/ws/";// "http://10.0.0.3/pg9/jonier.cabrera/asistencial/ws/ws_documentosBodega.php?wsdl"; /*"http://10.0.2.170/Pruebas_DUSOFT_DUANA_/ws/";*/  /*"http://10.0.0.3/pg9/larry.sanchez/asistencial/ws/"*/ 
                                                                                 
    this.cartagenaUrl = (G.program.prod) ? "http://dusoft.clinicaelbosque.net/dusoft/ws/" : "http://10.0.0.3/pg9/cartagena/dusoft/ws/";
    this.penitasUrl = (G.program.prod) ? "http://10.60.1.11/dusoft/ws/" : "http://10.0.0.3/pg9/sincelejo/asistencial/ws/";
    this.dumianUrl = (G.program.prod) ? "http://por_definir" : "http://10.0.0.3/pg9/julian.barbosa/asistencial_/ws/";

    this.santaSofiaUrl = (G.program.prod) ? "http://dusoft.cosmitet.net/CSSP/ws/" : "http://10.0.0.3/pg9/CSSP/ws/";
    this.cucutaUrl = (G.program.prod) ? "http://dusoft.clinicamedicalduarte.com/MD/ws/" : "http://10.200.1.22/MD/ws/";
    this.expiracionCache = 21600;  
    this.diasHabilesUrl =   "http://10.0.2.237/APP/DUSOFT_DUANA/classes/CalculoFechas/";
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
                },
                PENITAS:{
                    E008:this.penitasUrl+ "ws_documentosBodega.php?wsdl"
                },
                DUMIAN:{
                    E008:this.dumianUrl+ "ws_remision_medicamentos_insumos.php?wsdl"
                },
                SANTASOFIA:{
                    E008:this.santaSofiaUrl+ "ws_documentosBodega.php?wsdl"
                },
                CUCUTA:{
                    E008:this.cucutaUrl+ "ws_documentosBodega.php?wsdl"
                }
            },
            
            DISPENSACION_HC:{
                FECHA_MAXIMA:this.diasHabilesUrl+ "wsCalculoFecha.php?wsdl"
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

