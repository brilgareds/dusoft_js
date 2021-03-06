var SincronizacionModel = function () {};
 

/**
 * @author Andres Mauricio Gonzalez
 * +Descripcion  funcion privada de crear realizar la sincronizacion con la funcion sincronizarFi                               
 * @fecha 2017-05-08 (YYYY-MM-DD)
 */
SincronizacionModel.prototype.sincronizarCuentasXpagarFi=function(obj, callback) {
console.log("***************sincronizarCuentasXpagarFi******************");
    var url = G.constants.WS().FI.DUSOFT_FI;

    obj.parametros = {
        function: obj.funcion,
        parametros: obj.param
    };
//console.log("------------",obj.parametros);
    obj.error = false;

    G.Q.nfcall(G.soap.createClient, url).then(function(client) {
     
        return G.Q.ninvoke(client, "sincronizarFi", obj.parametros);

    }).spread(function(result, raw, soapHeader) {
  
//  console.log("sincronizarCuentasXpagarFi__result ",result);
        if (!result.return.msj["$value"]) {
            throw {msj: "Se ha generado un error", status: 403, obj: {}};
        } else {
            obj.resultado = JSON.parse(result.return.msj["$value"]);
        }

    }).then(function() {
        callback(false, obj);

    }).fail(function(err) {
//        console.log("Error __sincronizarCuentasXpagarFi Model: ", err);
        obj.error = true;
        obj.tipo = '0';
        callback(err);

    }).done();
};

              
  



module.exports = SincronizacionModel;
