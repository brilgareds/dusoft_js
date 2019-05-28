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
};
