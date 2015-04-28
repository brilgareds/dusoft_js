
var PlanillasDespachos = function(planillas_despachos) {

    console.log("Modulo Planillas Despachos Cargado ");

    this.m_planillas_despachos = planillas_despachos;
};


PlanillasDespachos.prototype.listarPlanillasDespachos = function(req, res) {

    var that = this;


    var args = req.body.data;

    if (args.planillas_despachos === undefined || args.planillas_despachos.fecha_inicial === undefined || args.planillas_despachos.fecha_final === undefined || args.planillas_despachos.termino_busqueda === undefined) {
        res.send(G.utils.r(req.url, 'fecha_inicial, fecha_final o termino_busqueda no esta definido', 404, {}));
        return;
    }

    if (args.planillas_despachos.fecha_inicial === '' || args.planillas_despachos.fecha_final === '') {
        res.send(G.utils.r(req.url, 'fecha_inicial o fecha_final estan vacíos', 404, {}));
        return;
    }

    var fecha_inicial = args.planillas_despachos.fecha_inicial;
    var fecha_final = args.planillas_despachos.fecha_final;
    var termino_busqueda = args.planillas_despachos.termino_busqueda;

    that.m_planillas_despachos.listar_planillas_despachos(fecha_inicial, fecha_final, termino_busqueda, function(err, lista_planillas_despachos) {

        if (err) {
            res.send(G.utils.r(req.url, 'Error listando las planillas_despachos', 500, {planillas_despachos: {}}));
        } else {
            res.send(G.utils.r(req.url, 'Lista de planillas_despachos', 200, {planillas_despachos: lista_planillas_despachos}));
        }
    });
};

PlanillasDespachos.prototype.consultarPlanillaDespacho = function(req, res) {

    var that = this;


    var args = req.body.data;

    if (args.planillas_despachos === undefined || args.planillas_despachos.planilla_id === undefined) {
        res.send(G.utils.r(req.url, 'planilla_id no esta definido', 404, {}));
        return;
    }

    var planilla_id = args.planillas_despachos.planilla_id;

    that.m_planillas_despachos.consultar_planilla_despacho(planilla_id, function(err, planilla_despacho) {

        if (err) {
            res.send(G.utils.r(req.url, 'Error consultado la planilla', 500, {planillas_despachos: {}}));
        } else {
            res.send(G.utils.r(req.url, 'Planilla despacho', 200, {planillas_despachos: planilla_despacho}));
        }
    });
};

PlanillasDespachos.prototype.consultarDocumentosPlanillaDespacho = function(req, res) {

    var that = this;

    var args = req.body.data;

    if (args.planillas_despachos === undefined || args.planillas_despachos.planilla_id === undefined || args.planillas_despachos.termino_busqueda === undefined) {
        res.send(G.utils.r(req.url, 'planilla_id no esta definido', 404, {}));
        return;
    }

    if (args.planillas_despachos.planilla_id === '') {
        res.send(G.utils.r(req.url, 'planilla_id esta vacio', 404, {}));
        return;
    }

    var planilla_id = args.planillas_despachos.planilla_id;
    var termino_busqueda = args.planillas_despachos.termino_busqueda;

    that.m_planillas_despachos.consultar_documentos_planilla_despacho(planilla_id, termino_busqueda, function(err, planilla_despacho) {

        if (err) {
            res.send(G.utils.r(req.url, 'Error consultado los documentos de la  planilla', 500, {planillas_despachos: {}}));
        } else {
            res.send(G.utils.r(req.url, 'Documentos planilla despacho', 200, {planillas_despachos: planilla_despacho}));
        }
    });
};

PlanillasDespachos.prototype.generarPlanillaDespacho = function(req, res) {

    var that = this;

    var args = req.body.data;

    if (args.planillas_despachos === undefined || args.planillas_despachos.pais_id === undefined || args.planillas_despachos.departamento_id === undefined || args.planillas_despachos.ciudad_id === undefined) {
        res.send(G.utils.r(req.url, 'pais_id, departamento_id o ciudad_id no esta definido', 404, {}));
        return;
    }

    if (args.planillas_despachos.transportador_id === undefined || args.planillas_despachos.nombre_conductor === undefined || args.planillas_despachos.observacion === undefined) {
        res.send(G.utils.r(req.url, 'transportador_id, nombre_conductor u observacion no esta definido', 404, {}));
        return;
    }

    if (args.planillas_despachos.pais_id === '' || args.planillas_despachos.departamento_id === '' || args.planillas_despachos.ciudad_id === '') {
        res.send(G.utils.r(req.url, 'pais_id, departamento_id o ciudad_id  estan vacias', 404, {}));
        return;
    }

    if (args.planillas_despachos.transportador_id === '' || args.planillas_despachos.nombre_conductor === '' || args.planillas_despachos.observacion === '') {
        res.send(G.utils.r(req.url, 'transportador_id, nombre_conductor u observacion esta vacia', 404, {}));
        return;
    }

    var pais_id = args.planillas_despachos.pais_id;
    var departamento_id = args.planillas_despachos.departamento_id;
    var ciudad_id = args.planillas_despachos.ciudad_id;
    var transportador_id = args.planillas_despachos.transportador_id;
    var nombre_conductor = args.planillas_despachos.nombre_conductor;
    var observacion = args.planillas_despachos.observacion;
    var usuario_id = req.session.user.usuario_id;

    that.m_planillas_despachos.ingresar_planilla_despacho(pais_id, departamento_id, ciudad_id, transportador_id, nombre_conductor, observacion, usuario_id, function(err, rows, result) {

        if (err) {
            res.send(G.utils.r(req.url, 'Error Interno', 500, {planillas_despachos: []}));
            return;
        } else {

            var numero_guia = (rows.length > 0) ? rows[0].id : 0;

            res.send(G.utils.r(req.url, 'Planilla despacho regitrada correctamente', 200, {numero_guia: numero_guia}));
            return;
        }
    });

};


PlanillasDespachos.prototype.ingresarDocumentosPlanillaDespacho = function(req, res) {

    var that = this;

    var args = req.body.data;

    if (args.planillas_despachos === undefined || args.planillas_despachos.planilla_id === undefined || args.planillas_despachos.empresa_id === undefined || args.planillas_despachos.prefijo === undefined || args.planillas_despachos.numero === undefined) {
        res.send(G.utils.r(req.url, 'planilla_id, empresa_id, prefijo o numero no esta definido', 404, {}));
        return;
    }

    if (args.planillas_despachos.cantidad_cajas === undefined || args.planillas_despachos.cantidad_neveras === undefined || args.planillas_despachos.temperatura_neveras === undefined || args.planillas_despachos.observacion === undefined) {
        res.send(G.utils.r(req.url, 'cantidad_cajas, cantidad_neveras, temperatura_neveras u observacion no esta definido', 404, {}));
        return;
    }

    if (args.planillas_despachos.tipo === undefined) {
        res.send(G.utils.r(req.url, 'tipo no esta definido', 404, {}));
        return;
    }

    if (args.planillas_despachos.planilla_id === undefined || args.planillas_despachos.empresa_id === undefined || args.planillas_despachos.prefijo === undefined || args.planillas_despachos.numero === undefined) {
        res.send(G.utils.r(req.url, 'planilla_id, empresa_id, prefijo o numero esta vacios', 404, {}));
        return;
    }

    if (args.planillas_despachos.cantidad_cajas === '') {
        res.send(G.utils.r(req.url, 'cantidad_cajas esta vacio', 404, {}));
        return;
    }

    if (args.planillas_despachos.tipo === '') {
        res.send(G.utils.r(req.url, 'tipo esta vacio', 404, {}));
        return;
    }

    var tipo = args.planillas_despachos.tipo; // 0= farmacias 1 = clientes 2 = Otras empresas    
    var tabla = ["inv_planillas_detalle_farmacias", "inv_planillas_detalle_clientes", "inv_planillas_detalle_empresas"];

    tabla = tabla[tipo];

    if (tabla === undefined) {
        res.send(G.utils.r(req.url, 'el tipo no es valido', 404, {}));
        return;
    }

    var planilla_id = args.planillas_despachos.planilla_id;
    var empresa_id = args.planillas_despachos.empresa_id;
    var prefijo = args.planillas_despachos.prefijo;
    var numero = args.planillas_despachos.numero;
    var cantidad_cajas = args.planillas_despachos.cantidad_cajas;
    var cantidad_neveras = (args.planillas_despachos.cantidad_neveras == '') ? 0 : args.planillas_despachos.cantidad_neveras;
    var temperatura_neveras = (args.planillas_despachos.temperatura_neveras == '') ? null : args.planillas_despachos.temperatura_neveras;
    var observacion = args.planillas_despachos.observacion;
    var usuario_id = req.session.user.usuario_id;

    that.m_planillas_despachos.ingresar_documentos_planilla(tabla, planilla_id, empresa_id, prefijo, numero, cantidad_cajas, cantidad_neveras, temperatura_neveras, observacion, usuario_id, function(err, rows, result) {

        if (err || result.rowCount === 0) {
            res.send(G.utils.r(req.url, 'Error Interno', 500, {planillas_despachos: []}));
            return;
        } else {
            res.send(G.utils.r(req.url, 'documento regitrado correctamente', 200, {planillas_despachos: {}}));
            return;
        }
    });
};

PlanillasDespachos.prototype.despacharPlanilla = function(req, res) {

    var that = this;

    var args = req.body.data;

    if (args.planillas_despachos === undefined || args.planillas_despachos.planilla_id === undefined) {
        res.send(G.utils.r(req.url, 'planilla_id no esta definido', 404, {}));
        return;
    }

    if (args.planillas_despachos.planilla_id === '') {
        res.send(G.utils.r(req.url, 'planilla_id esta vacio', 404, {}));
        return;
    }

    var planilla_id = args.planillas_despachos.planilla_id;
    var estado = '2'; // 0 = Anulada, 1 = Activa, 2 = Desachada

    that.m_planillas_despachos.modificar_estado_planilla_despacho(planilla_id, estado, function(err, rows, result) {

        if (err || result.rowCount === 0) {
            res.send(G.utils.r(req.url, 'Error Interno', 500, {planillas_despachos: []}));
            return;
        } else {
            res.send(G.utils.r(req.url, 'Planilla despachada correctamente', 200, {planillas_despachos: {}}));
            return;
        }
    });
};

PlanillasDespachos.$inject = ["m_planillas_despachos"];

module.exports = PlanillasDespachos;