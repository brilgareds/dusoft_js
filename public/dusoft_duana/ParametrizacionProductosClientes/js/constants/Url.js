define(["angular"], function(angular) {
    var Url = angular.module('Url', []);

    const BASE_URL = "/api";

    let data = {
        'API': {
            'BASE_URL': BASE_URL,
            'PARAMETRIZACION_PRODUCTOS_CLIENTES': {
                'LIST_CONTRACTS': BASE_URL + '/parametrizacionProductosClientes/listContracts',
                'UPDATE_STATUS_CONTRACT': BASE_URL + '/parametrizacionProductosClientes/updateStatusContract',
                'LIST_CONTRACTS_PRODUCTS': BASE_URL + '/parametrizacionProductosClientes/listContractProducts',
                'SUBIR_ARCHIVO' : BASE_URL + '/parametrizacionProductosClientes/subirArchivo',
                'SEARCH_INVENTARY_PRODUCTS': BASE_URL + '/parametrizacionProductosClientes/searchInventaryProducts',
                'ADD_PRODUCTS_CONTRACT': BASE_URL + '/parametrizacionProductosClientes/addProductsContract',
                'DELETE_PRODUCT_CONTRACT': BASE_URL + '/parametrizacionProductosClientes/deleteProductContract',
                'DELETE_PRODUCTS_CONTRACT': BASE_URL + '/parametrizacionProductosClientes/deleteProductsContract',
                'UPDATE_PRODUCT_CONTRACT': BASE_URL + '/parametrizacionProductosClientes/updateProductContract',
                'CREATE_CONTRACT': BASE_URL + '/parametrizacionProductosClientes/createContract',
                'SELLERS': BASE_URL + '/parametrizacionProductosClientes/sellers',
                'BUSINESS_UNITS': BASE_URL + '/parametrizacionProductosClientes/businessUnits',
                'SEARCH_THIRD': BASE_URL + '/parametrizacionProductosClientes/searchThird'
            },
            'FACTURACIONCLIENTES': {
                'SUBIR_ARCHIVO' : BASE_URL + '/FacturacionClientes/subirArchivo'
            }
        }
    };

    angular.forEach(data, (key, value) => {
        Url.constant(value, key);
    });

    return Url;
});
