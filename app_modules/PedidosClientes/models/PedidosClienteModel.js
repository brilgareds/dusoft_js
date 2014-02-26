var PedidosClienteModel = function() {

};


PedidosClienteModel.prototype.sayHello = function(callback) {

    var str = "Saludando desde Pedidos Cliente...";
    callback(str);
};

module.exports = PedidosClienteModel;