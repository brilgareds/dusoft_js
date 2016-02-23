var Constants = function() {
    this.cosmitetUrl = (G.program.prod) ? "http://dusoft.cosmitet.net/SIIS/ws/" : "http://10.0.0.3/pg9/steven.rojas/asistencial/ws/";
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
            }
    };
};


Constants.prototype.className = "Constants";



module.exports.create = function() {
    return new Constants();
};

module.exports._class = Constants;

