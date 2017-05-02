
var I002Events = function(socket, m_i002) {
    console.log("Eventos I002 Cargado ");
    this.io = socket;
    this.m_i002 = m_i002;
};

// Consultar el tiempo de separacion del pedido de clientes
I002Events.prototype.onObtenerTiempoSeparacionCliente = function(socket_id, datos) {

    var that = this;

    var fecha_actual = new Date();

    if (datos !== undefined && datos.numero_pedido !== undefined && datos.numero_pedido !== '') {

        var numero_pedido = datos.numero_pedido;

        that.m_i002.consultar_documento_temporal_clientes(numero_pedido, function(err, rows) {

            if (!err && rows.length > 0) {

                var documento_temporal = rows[0];

                // Calcular el tiempo de separacion del pedido
                var fecha_separacion = 0;

                var tiempo_separacion = 0;

                if (documento_temporal.fecha_registro) {

                    fecha_separacion = new Date(documento_temporal.fecha_registro);

                    tiempo_separacion = fecha_separacion.getSecondsBetween(fecha_actual);

                    //tiempo_separacion = fecha_actual.getSecondsBetween(fecha_separacion);

                    console.log('============================ CL tiempo ============================');
                    console.log(fecha_actual);
                    console.log(fecha_separacion);
                    console.log(tiempo_separacion);
                    console.log('=======================================================================');
                }

                that.io.to(socket_id).emit('onTiempoSeparacionCliente', {numero_pedido: numero_pedido, tiempo_separacion: tiempo_separacion});
            }
        });
    }
};

// Consultar el tiempo de separacion de pedidos de farmacias 
I002Events.prototype.onObtenerTiempoSeparacionFarmacias = function(socket_id, datos) {

    var that = this;

    var fecha_actual = new Date();

    if (datos.numero_pedido !== undefined && datos.numero_pedido !== '') {

        var numero_pedido = datos.numero_pedido;

        that.m_i002.consultar_documento_temporal_farmacias(numero_pedido, function(err, rows) {

            if (!err && rows.length > 0) {

                var documento_temporal = rows[0];

                // Calcular el tiempo de separacion del pedido
                var fecha_separacion = 0;
                var tiempo_separacion = 0;

                if (documento_temporal.fecha_separacion_pedido) {

                    fecha_separacion = new Date(documento_temporal.fecha_separacion_pedido);

                    tiempo_separacion = fecha_separacion.getSecondsBetween(fecha_actual);

                    //tiempo_separacion = fecha_actual.getSecondsBetween(fecha_separacion);
                    console.log('============================ Facias tiempo ============================');
                    console.log(fecha_actual);
                    console.log(fecha_separacion);
                    console.log(tiempo_separacion);
                    console.log('=======================================================================');
                }
                that.io.to(socket_id).emit('onTiempoSeparacionFarmacias', {numero_pedido: numero_pedido, tiempo_separacion: tiempo_separacion});
            }
        });
    }
};

// Notificar Lista Documentos Temporales Clientes
I002Events.prototype.onNotificarDocumentosTemporalesClientes = function(datos) {

    var that = this;

    that.m_i002.consultar_documento_temporal_clientes(datos.numero_pedido, function(err, documento_temporal) {

        var response = G.utils.r('onListarDocumentosTemporalesClientes', 'Lista Documentos Temporales Clientes', 200, {documento_temporal_clientes: documento_temporal});

        that.io.sockets.emit('onListarDocumentosTemporalesClientes', response);
    });
};

// Notificar Lista Documentos Temporales Farmacias
I002Events.prototype.onNotificarDocumentosTemporalesFarmacias = function(datos) {
    
    var that = this;

    that.m_i002.consultar_documento_temporal_farmacias(datos.numero_pedido, function(err, documento_temporal) {

        var response = G.utils.r('onListarDocumentosTemporalesFarmacias', 'Lista Documentos Temporales Farmacias', 200, {documento_temporal_farmacias: documento_temporal});

        that.io.sockets.emit('onListarDocumentosTemporalesFarmacias', response);
    });
};


I002Events.$inject = ["socket", "m_i002"];

module.exports = I002Events;