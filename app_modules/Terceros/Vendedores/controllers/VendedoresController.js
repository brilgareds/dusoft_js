
var OperariosBodega = function(operarios, pedidos_clientes, pedidos_farmacias) {

    console.log("Modulo Terceros  Cargado ");

    this.m_operarios = operarios;
    this.m_pedidos_clientes = pedidos_clientes;
    this.m_pedidos_farmacias = pedidos_farmacias;

};

OperariosBodega.prototype.listarOperariosBodega = function(req, res) {
    var that = this;

    var args = req.body.data;

    if (args.lista_operarios === undefined) {
        res.send(G.utils.r(req.url, 'Algunos Datos Obligatorios No Estan Definidos', 404, {}));
        return;
    }

    var termino_busqueda = (args.lista_operarios.termino_busqueda === undefined) ? '' : args.lista_operarios.termino_busqueda;
    var estado_registro = (args.lista_operarios.estado_registro === undefined) ? '' : args.lista_operarios.estado_registro;
    var total_pedidos_clientes = 0;
    var total_pedidos_farmacias = 0;

    this.m_operarios.listar_operarios_bodega(termino_busqueda, estado_registro, function(err, lista_operarios) {
        if (err)
            res.send(G.utils.r(req.url, 'Error Listado Los Operarios de Bodega', 500, {}));
        else {
            
            if(lista_operarios.length === 0){
                res.send(G.utils.r(req.url, 'Lista Operarios Bodega', 200, {lista_operarios: lista_operarios}));
                return
            }
            
            var i = lista_operarios.length;

            lista_operarios.forEach(function(operario_bodega) {

                that.m_pedidos_clientes.listar_pedidos_del_operario(operario_bodega.usuario_id, '', '', 1, undefined, function(err, rows, total_registros_clientes) {

                    total_pedidos_clientes = (err) ? 0 : parseInt(total_registros_clientes);

                    operario_bodega.total_pedidos_clientes = total_pedidos_clientes;

                    that.m_pedidos_farmacias.listar_pedidos_del_operario(operario_bodega.usuario_id, '', '', 1, undefined, function(err, rows, total_registros_farmacias) {

                        total_pedidos_farmacias = (err) ? 0 : parseInt(total_registros_farmacias);

                        operario_bodega.total_pedidos_farmacias = total_pedidos_farmacias;

                        total_pedidos = parseInt(total_pedidos_clientes) + parseInt(total_pedidos_farmacias);

                        operario_bodega.total_pedidos_asignados = operario_bodega.total_pedidos_clientes + operario_bodega.total_pedidos_farmacias;

                        if (--i === 0) {
                            res.send(G.utils.r(req.url, 'Lista Operarios Bodega', 200, {lista_operarios: lista_operarios}));
                        }

                    });
                });
            });
        }
    });
};

OperariosBodega.prototype.crearOperariosBodega = function(req, res) {

    var that = this;

    var args = req.body.data;

    if (args.operario === undefined || args.operario.nombre_operario === undefined || args.operario.usuario_id === undefined || args.operario.estado === undefined) {
        res.send(G.utils.r(req.url, 'Algunos Datos Obligatorios No Estan Definidos', 404, {}));
        return;
    }

    if (args.operario.nombre_operario === "" || args.operario.usuario_id === "" || args.operario.estado === "") {
        res.send(G.utils.r(req.url, 'Algunos Datos Obligatorios Estan Vacios', 404, {}));
        return;
    }

    var operario = args.operario;

    this.m_operarios.crear_operarios_bodega(operario.nombre_operario, operario.usuario_id, operario.estado, function(err, rows) {
        if (err)
            res.send(G.utils.r(req.url, 'Error Registrando el Operario', 500, {}));
        else
            res.send(G.utils.r(req.url, 'Operario Bodega Registrado Correctamente', 200, {}));

    });
};

OperariosBodega.prototype.modificarOperariosBodega = function(req, res) {

    var that = this;

    var args = req.body.data;

    if (args.operario === undefined || args.operario.operario_id === undefined || args.operario.nombre_operario === undefined || args.operario.usuario_id === undefined || args.operario.estado === undefined) {
        res.send(G.utils.r(req.url, 'Algunos Datos Obligatorios No Estan Definidos', 404, {}));
        return;
    }

    if (args.operario.operario_id === "" || args.operario.nombre_operario === "" || args.operario.usuario_id === "" || args.operario.estado === "") {
        res.send(G.utils.r(req.url, 'Algunos Datos Obligatorios Estan Vacios', 404, {}));
        return;
    }

    var operario = args.operario;

    this.m_operarios.modificar_operarios_bodega(operario.operario_id, operario.nombre_operario, operario.usuario_id, operario.estado, function(err, rows) {
        if (err)
            res.send(G.utils.r(req.url, 'Error Modificando el Operario', 500, {}));
        else
            res.send(G.utils.r(req.url, 'Operario Bodega Modificado Correctamente', 200, {}));
    });
};


OperariosBodega.$inject = ["m_operarios", "m_pedidos_clientes", "m_pedidos_farmacias"];

module.exports = OperariosBodega;