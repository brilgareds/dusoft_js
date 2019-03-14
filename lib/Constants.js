var Constants = function() {
    this.cosmitetUrl = (G.program.prod) ? "http://dusoft.cosmitet.net/dusoft/ws/" :"http://10.0.0.3/pg9/ana.manoska/asistencial/ws/";//"http://10.0.0.3/pg9/larry.sanchez/pruebas/ws/";// "http://10.0.0.3/pg9/jonier.cabrera/asistencial/ws/ws_documentosBodega.php?wsdl"; /*"http://10.0.2.170/Pruebas_DUSOFT_DUANA_/ws/";*/  /*"http://10.0.0.3/pg9/larry.sanchez/asistencial/ws/"*/

    //
    //    cosmitetUrl anterior de pruebas Cosmitet :  "http://10.0.0.3/pg9/jonier.cabrera/asistencial"
    //    cosmitetUrl mandada el 12/03/2019           "http://10.0.0.3/pg9/ana.manoska/asistencial/index.php"
    //
    //      http://10.0.0.3/pg9/oscar.osorio/asistencial/ws/

    this.cartagenaUrl = (G.program.prod) ? "http://10.245.1.140/dusoft/ws/" : "http://10.0.0.3/pg9/cartagena/dusoft/ws/";
    this.penitasUrl = (G.program.prod) ? "http://10.60.1.11/dusoft/ws/" : "http://10.0.0.3/pg9/sincelejo/asistencial/ws/";
    this.dumianUrl = (G.program.prod) ? "http://10.0.0.44/dusoft/ws/" : "http://10.0.0.3/pg9/ana.manoska/asistencial/ws/";//"http://10.0.0.3/pg9/julian.barbosa/asistencial_/ws/";

    //   dumianUrl anterior era:       http://10.0.0.3/pg9/oscar.osorio/asistencial/ws/

    this.santaSofiaUrl = (G.program.prod) ? "http://dusoft.clinicasantasofia.com/CSSP/ws/" : "http://10.0.0.3/pg9/CSSP/ws/";
    this.cucutaUrl = (G.program.prod) ? "http://dusoft.clinicamedicalduarte.com/MD/ws/" : "http://10.200.1.22/MD/ws/";
    this.expiracionCache = 21600;  
    this.diasHabilesUrl =   "http://10.0.2.237/APP/DUSOFT_DUANA/classes/CalculoFechas/"; //"http://10.0.2.229:8082/CalculoFechas/";
    this.fi = (G.program.prod) ? "http://10.0.2.237/APP/PRUEBAS_ANDRES_GONZALEZ/":"http://10.0.2.237/APP/PRUEBAS_GABRIEL_ANGARITA/"; //"http://10.0.2.237/APP/PRUEBAS_ANDRES_GONZALEZ/classes/SincronizacionDusoftFI/";
    this.formulasDispensadas = (G.program.prod) ? "http://10.0.0.3/pg9/larry.sanchez/dispensacion/asistencial/ws/":"http://10.0.0.3/pg9/larry.sanchez/dispensacion/asistencial/ws/"; 
    this.codificacionProductos = (G.program.prod) ? "http://10.0.0.3/pg9/larry.sanchez/asistencial/ws/":"http://10.0.0.3/pg9/larry.sanchez/asistencial/ws/"; 
    this.certicamara = (G.program.prod) ? "https://v4.certifactura.co/":"https://preproduccionv4.certifactura.co/"; 
    this.finaciero = (G.program.prod) ? "http://10.0.2.229:8080/SinergiasFinanciero3-ejb/getGestionInformacionContableWS/":"http://10.0.2.229:8080/SinergiasFinanciero3-ejb/getGestionInformacionContableWS/"; 
    
};

Constants.prototype.db = function(){
    return{
        LIKE:"ilike"
    };
};


Constants.prototype.PUSH = function(){
    return {
        
            SERVER:{
                KEY:"AAAARq4YdFU:APA91bEa6TGihN86mHWW6bAP1amZOoSY5GCOH1LLw_QlMCzYQgh1UemlomE7mpONo_dFau3zQvsNg_9_NqHTkq0dmD8yIXjUGZj1VUTfY_d6MPT7eeYRD5-s8RFXjNmpEDDbhoCjOmVg",
                COLLAPSE_KEY: "demo"
            }
            
    };
};

Constants.prototype.APPS = function(){
    return {
        
        DUSOFT_CHAT:"dusoft-chat"
            
    };
};
Constants.prototype.CREDENCIALESCERTICAMARA = function(){
    return {
        
        USUARIO:(G.program.prod) ? "admin_duana":"admin_duana",
        CONTRASENA:(G.program.prod) ? "duana649":"duana649" 
            
    };
};

Constants.prototype.IDENTIFICADOR_DIAN = function(){
    return {
        
        DESDE:(G.program.prod) ? 1:1,
        DESDE_BQ:(G.program.prod) ? 1:1,
        HASTA:(G.program.prod) ? 24000:24000,
        HASTA_BQ:(G.program.prod) ? 15000:15000,
        IDENTIFICADOR_RESOLUCION:(G.program.prod) ? "18762009954764":"1234567", 
        IDENTIFICADOR_RESOLUCION_BQ:(G.program.prod) ? "18762010038740":"654321" 
            
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
                FECHA_MAXIMA:this.diasHabilesUrl+ "wsCalculoFecha.php?wsdl",
                FORMULAS_DISPENSADAS:this.formulasDispensadas+"Dispensation/WebServices.php?wsdl",
                CODIFICACION_PRODUCTOS:this.codificacionProductos+"codificacion_productos/ws_producto.php?wsdl"
            },
                    
            FI:{
                DUSOFT_FI:this.fi+ "wsSincronizacionDusoftFI.php?wsdl"
            },
            
            FINANCIERO:{
                DUANA:this.finaciero+ "getGestionInformacionContableWS?wsdl"  
            },
            FACTURACION_ELECTRONICA:{
                ADQUIRIENTE:this.certicamara+ "CertiFacturaServicios/ServiciosAdquiriente?wsdl",
                FACTURA:this.certicamara+ "CertiFacturaServicios/ServiciosEmitirFacturaElectronica?wsdl",
                NOTA_CREDITO:this.certicamara+ "CertiFacturaServicios/ServiciosEmitirNotaCreditoElectronica?wsdl",
                NOTA_DEBITO:this.certicamara+ "CertiFacturaServicios/ServiciosEmitirNotaDebitoElectronica?wsdl",
                CONSULTA_FACTURA:this.certicamara+ "consulta-documentos/consulta-documentos.wsdl"
                
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

