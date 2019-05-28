/* global G */
let that;

let ParametrizacionProductosClientes = function (m_parametrizacionProductosClientes) {
    that = this;
    that.m_parametrizacionProductosClientes = m_parametrizacionProductosClientes;
};

/****************************************/
/********* FUNCIONES Secundarias ******/
/************************************/
const promesa = new Promise((resolve, reject) => { resolve(true); });

/****************************************/
/********* FUNCIONES PRINCIPALES ******/
/************************************/
ParametrizacionProductosClientes.prototype.listContracts = (req, res) => {
    console.log('In controller "listContracts"');
    let params = req.body.data;
    params.number_money = number_money;

    promesa
        .then(response => {
            return G.Q.ninvoke(that.m_parametrizacionProductosClientes, 'listContracts', params);
        }).then(response => {
            res.send(G.utils.r(req.url, 'Listando Contratos!', 200, response));
        }).catch(err => {
            console.log('Hubo un error: ', err);
            res.send(G.utils.r(req.url, err.msg, 500, {}));
        });
};

ParametrizacionProductosClientes.prototype.updateStatusContract = (req, res) => {
    console.log('In controller "updateStatusContract"');

    let params = req.body.data;

    if (params.newStatus) {
        params.newStatus = 1;
    } else {
        params.newStatus = 0;
    }

    promesa
        .then(response => {
            return G.Q.ninvoke(that.m_parametrizacionProductosClientes, 'updateStatusContract', params);
        }).then(response => {
            res.send(G.utils.r(req.url, 'Contrato actualizado con exito!', 200, response));
        }).catch(err => {
            res.send(G.utils.r(req.url, err.msg, 500, {}));
        });
};

ParametrizacionProductosClientes.prototype.listContractProducts = (req, res) => {
    console.log('In controller "listContractProducts"');

    let params = req.body.data;

    promesa
        .then(response => {
            return G.Q.ninvoke(that.m_parametrizacionProductosClientes, 'listContractProducts', params);
        }).then(response => {
            console.log('Almost in the end');
            res.send(G.utils.r(req.url, '', 200, response));
        }).catch(err => {
           res.send(G.utils.r(req.url, err.msg, 500, err));
        });
};


/*************************************/
/********* FUNCIONES FORMATO ********/
/***********************************/

const number_money = (price) => {
    let newPrice = new Intl.NumberFormat("de-DE").format(price);
    newPrice = '$' + newPrice
        .replace(/(,)/g, "coma")
        .replace(/(\.)/g, "punto")
        .replace(/(coma)/g, ".")
        .replace(/(punto)/g, ",");
    return newPrice;
};

/****************************************/
/********* FUNCIONES RECURSIVAS ********/
/***************************************/

ParametrizacionProductosClientes.$inject = ["m_parametrizacionProductosClientes"];
module.exports = ParametrizacionProductosClientes;
