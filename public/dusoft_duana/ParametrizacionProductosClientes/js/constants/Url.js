define(["angular"], function(angular) {
    var Url = angular.module('Url', []);

    const BASE_URL = "/api";

    let data = {
        'API': {
            'BASE_URL': BASE_URL,
            'PARAMETRIZACION_PRODUCTOS_CLIENTES': {
                'LIST_CONTRACTS': BASE_URL + '/parametrizacionProductosClientes/listContracts',
                'UPDATE_STATUS_CONTRACT': BASE_URL + '/parametrizacionProductosClientes/updateStatusContract',
                'LIST_CONTRACTS_PRODUCTS': BASE_URL + '/parametrizacionProductosClientes/listContractProducts'
            }
        }
    };

    angular.forEach(data, (key, value) => {
        Url.constant(value, key);
    });

    return Url;
});
