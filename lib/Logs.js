var Logs = require('log4js');

Logs.configure = function(){
    
    return Logs.configure({
        appenders: [
            {
                type: "file",
                filename: "facturacion_clientes.log",//"files/Logs/FacturacionClientes/facturacion_clientes.log",
                category: [ 'facturacion_clientes','console' ]
            },
            {
                type: "console"
            }
        ],
        replaceConsole: false
    }); 
    
};
 

module.exports = Logs;

    


 