define(["angular"], function (angular) {
    var Url = angular.module('Url', []);

    var BASE_URL = "/api";


    var data = {
        'API': {
            'BASE_URL': BASE_URL,
           
            'FACTURACIONCLIENTES':{
                
                 "LISTAR_TIPOS_TERCEROS": BASE_URL + "/FacturacionClientes/listarTiposTerceros", 
                 "LISTAR_CLIENTES": BASE_URL + "/FacturacionClientes/listarClientes", 
                 "LISTAR_FACTURAS_GENERADAS": BASE_URL + "/FacturacionClientes/listarFacturasGeneradas", 
                

            }
        }

    };

    angular.forEach(data, function (key, value) {
        Url.constant(value, key);
    });


    return Url;
});
