module.exports = function(app, di_container) {
    let c_parametrizacionProductosClientes = di_container.get("c_parametrizacionProductosClientes");
    const base = "/api";

    app.post(base + '/parametrizacionProductosClientes/listContracts', (req, res) => {
        c_parametrizacionProductosClientes.listContracts(req, res);
    });
    app.post(base + '/parametrizacionProductosClientes/updateStatusContract', (req, res) => {
        c_parametrizacionProductosClientes.updateStatusContract(req, res);
    });
    app.post(base + '/parametrizacionProductosClientes/listContractProducts', (req, res) => {
        c_parametrizacionProductosClientes.listContractProducts(req, res);
    });
    app.post(base + '/parametrizacionProductosClientes/subirArchivo', (req, res) => {
        c_parametrizacionProductosClientes.subirArchivo(req, res);
    });
    app.post(base + '/parametrizacionProductosClientes/searchInventaryProducts', (req, res) => {
        c_parametrizacionProductosClientes.searchInventaryProducts(req, res);
    });
    app.post(base + '/parametrizacionProductosClientes/addProductsContract', (req, res) => {
        c_parametrizacionProductosClientes.addProductsContract(req, res);
    });
    app.post(base + '/parametrizacionProductosClientes/deleteProductContract', (req, res) => {
        c_parametrizacionProductosClientes.deleteProductContract(req, res);
    });
    app.post(base + '/parametrizacionProductosClientes/updateProductContract', (req, res) => {
        c_parametrizacionProductosClientes.updateProductContract(req, res);
    });
};
