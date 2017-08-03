
var Terceros = function(terceros) {

    console.log("Modulo Terceros  Cargado ");

    this.mTerceros = terceros;
};



/**
* @author Eduar Garcia
* +Descripcion consulta los grupos del chat, permite tener un termino de busqueda
* @params obj: {pagina, termino_busqueda}
* @fecha 2017-03-15
*/
Terceros.prototype.obtenerParametrizacionFormularioTerceros = function(req, res) {
    var that = this;

    var args = req.body.data;

    /*if (args.terceros === undefined || args.terceros.empresa_id === undefined) {
        res.send(G.utils.r(req.url, 'empresa_id  no están definidas.', 404, {}));
        return;
    }*/
    G.Q.ninvoke(that.mTerceros,'obtenerParametrizacionFormularioTerceros', args).then(function(resultado) {
        res.send(G.utils.r(req.url, 'Parametrizacion del formulario de terceros', 200, {parametrizacion: resultado}));
      
    }).fail(function(err) {
        console.log("err ", err)
        var msj = err;
        var status = 500;
        
        if(err.status){
            status = err.status;
            msj = err.msj;
        }
        
        
        res.send(G.utils.r(req.url, msj , status, {}));
    }).done();
    

    
};

Terceros.prototype.listarTercerosCiudad = function(req, res) {

    var that = this;

    var args = req.body.data;

    if (args.terceros === undefined || args.terceros.empresa_id === undefined) {
        res.send(G.utils.r(req.url, 'empresa_id no están definidas.', 404, {}));
        return;
    }

    if (args.terceros.pais_id === undefined || args.terceros.departamento_id === undefined || args.terceros.ciudad_id === undefined) {
        res.send(G.utils.r(req.url, 'pais_id, departamento_id o ciudad_id no están definidas.', 404, {}));
        return;
    }

    if (args.terceros.empresa_id === '') {
        res.send(G.utils.r(req.url, 'empresa_id está vacio', 404, {}));
        return;
    }
    if (args.terceros.pais_id === '' || args.terceros.departamento_id === '' || args.terceros.ciudad_id === '') {
        res.send(G.utils.r(req.url, 'pais_id, departamento_id o ciudad_id están vacios.', 404, {}));
        return;
    }


    var empresa_id = args.terceros.empresa_id;
    var pais_id = args.terceros.pais_id;
    var departamento_id = args.terceros.departamento_id;
    var ciudad_id = args.terceros.ciudad_id;

    var termino_busqueda = (args.terceros.termino_busqueda === undefined) ? '' : args.terceros.termino_busqueda;

    that.m_gestion_terceros.listar_terceros_ciudad(empresa_id, pais_id, departamento_id, ciudad_id, termino_busqueda, function(err, listado_terceros) {
        if (err)
            res.send(G.utils.r(req.url, 'Error consultando terceros', 500, {}));
        else
            res.send(G.utils.r(req.url, 'Lista de terceros', 200, {listado_terceros: listado_terceros}));
    });

};

Terceros.prototype.consultarContratoCliente = function(req, res) {

    var that = this;

    var args = req.body.data;

    if (args.contrato_cliente === undefined || args.contrato_cliente.tipo_id_cliente === undefined || args.contrato_cliente.cliente_id === undefined){
        res.send(G.utils.r(req.url, 'tipo_id_tercero o tercero_id no están definidas.', 404, {}));
        return;
    }

    if (args.contrato_cliente.tipo_id_cliente === undefined || args.contrato_cliente.cliente_id === undefined) {
        res.send(G.utils.r(req.url, 'tipo_id_tercero o tercero_id están vacios.', 404, {}));
        return;
    }

    var tipo_id_cliente = args.contrato_cliente.tipo_id_cliente;
    var cliente_id = args.contrato_cliente.cliente_id;

    this.m_gestion_terceros.consultar_contrato_cliente(tipo_id_cliente, cliente_id, function(err, contrato_cliente) {
        if (err)
            res.send(G.utils.r(req.url, 'Error Consultando Contrato Terceros', 500, {}));
        else
            res.send(G.utils.r(req.url, 'Consulta de Contrato Terceros Exitosa', 200, {resultado_consulta: contrato_cliente}));
    });

};

Terceros.prototype.obtenerTercero = function(req, res){
    var that = this;
    var args = req.body.data;
    
    if(!args.tercero){
        res.send(G.utils.r(req.url, 'No se pudo validar el formulario', 401, {}));
        return;
    }
    
    if (!args.tercero.tipoDocumento  || args.tercero.tipoDocumento.length === 0){
        res.send(G.utils.r(req.url, 'Se requiere el tipo de documento', 404, {}));
        return;
    }
    
    if (!args.tercero.id  || args.tercero.id.length === 0){
        res.send(G.utils.r(req.url, 'Se requiere el número de documento', 404, {}));
        return;
    }
    
    G.Q.ninvoke(that.mTerceros,'obtenerTercero', args).then(function(resultado) {
        
        res.send(G.utils.r(req.url, 'Consulta de tercero', 200, {tercero: resultado}));
        
    }).fail(function(err){
        res.send(G.utils.r(req.url, 'Ha ocurrido un error consultando el tercero', 404, {}));
    }).done();
};



Terceros.prototype.listarTerceros = function(req, res){
    var that = this;
    var args = req.body.data;
    
    if(!args.tercero){
        res.send(G.utils.r(req.url, 'No se pudo listar los terceros', 404, {}));
        return;
    }
    
    if (!args.tercero.empresa_id  || args.tercero.empresa_id.length === 0){
        res.send(G.utils.r(req.url, 'Se requiere la empresa', 404, {}));
        return;
    }
    
    G.Q.ninvoke(that.mTerceros,'listarTerceros', args).then(function(resultado) {
        
        res.send(G.utils.r(req.url, 'Consulta de tercero', 200, {terceros: resultado}));
        
    }).fail(function(err){
	console.log("terceros ",err);
        res.send(G.utils.r(req.url, 'Ha ocurrido un error consultando los terceros', 404, {}));
    }).done();
};

Terceros.prototype.obtenerTiposDocumentos = function(req, res){
    var that = this;
    var args = req.body.data;
    
    if(!args.tercero){
        res.send(G.utils.r(req.url, 'No se pudo listar los tipos de documento', 404, {}));
        return;
    }
    
    G.Q.ninvoke(that.mTerceros,'obtenerTiposDocumentos', args).then(function(resultado) {
        
        res.send(G.utils.r(req.url, 'Consulta de tipos de documento', 200, {tiposDocumento: resultado}));
        
    }).fail(function(err){
        res.send(G.utils.r(req.url, 'Ha ocurrido un error consultando los tipos de documentos', 404, {}));
    }).done();
};



Terceros.prototype.guardarFormularioTerceros = function(req, res){
    var that = this;
    
    var args = req.body.data;
    
    if(!args.tercero){
        res.send(G.utils.r(req.url, 'No se pudo validar el formulario', 401, {}));
        return;
    }
    
    /*** Primer formulario de datos basicos **/
    
    if(args.tercero.tipoNaturaleza.codigo === '0'){
        

        if (!args.tercero.primerNombre  || args.tercero.primerNombre.length === 0){
            res.send(G.utils.r(req.url, 'Se requiere el primer nombre', 404, {}));
            return;
        }

        if (!args.tercero.primerApellido  || args.tercero.primerApellido.length === 0){
            res.send(G.utils.r(req.url, 'Se requiere el primer apellido', 404, {}));
            return;
        }
        
        if (!args.tercero.genero  || args.tercero.genero.id.length === 0){
            res.send(G.utils.r(req.url, 'Se requiere el genero', 404, {}));
            return;
        }
        
        if (!args.tercero.estadoCivil  || args.tercero.estadoCivil.id.length === 0){
            res.send(G.utils.r(req.url, 'Se requiere el estado civil', 404, {}));
            return;
        }
    }
    
    
    if (!args.tercero.tipoDocumento  || args.tercero.tipoDocumento.id.length === 0){
        res.send(G.utils.r(req.url, 'Se requiere el tipo de documento', 404, {}));
        return;
    }
    
    if (!args.tercero.id  || args.tercero.id.length === 0){
        res.send(G.utils.r(req.url, 'Se requiere el número de documento', 404, {}));
        return;
    }
    
    
    if (!args.tercero.nacionalidad  || args.tercero.nacionalidad.id.length === 0){
        res.send(G.utils.r(req.url, 'Se requiere la nacionalidad', 404, {}));
        return;
    }
    
    /*** Segundo formulario de datos de ubicacion ***/
    
    if (!args.tercero.tipoDireccion  || args.tercero.tipoDireccion.id.length === 0){
        res.send(G.utils.r(req.url, 'Se requiere el tipo de direccion', 404, {}));
        return;
    }

    if (!args.tercero.pais){
        res.send(G.utils.r(req.url, 'Se requiere el pais', 404, {}));
        return;
    }
    
    if(!args.tercero.pais && !args.tercero.pais.departamentoSeleccionado || args.tercero.pais.departamentoSeleccionado.id.length === 0){
        res.send(G.utils.r(req.url, 'Se requiere el departamento', 404, {}));
        return;
        
    } else if(!args.tercero.pais.departamentoSeleccionado.ciudadSeleccionada || args.tercero.pais.departamentoSeleccionado.ciudadSeleccionada.id.length === 0){
        res.send(G.utils.r(req.url, 'Se requiere la ciudad', 404, {}));
        return;
    }
    
    
    if(!args.tercero.nomenclaturaDireccion1 || args.tercero.nomenclaturaDireccion1.id.length === 0){
        res.send(G.utils.r(req.url, 'Se requiere la via principal', 404, {}));
        return;
    }
    
    
    if(!args.tercero.nomenclaturaDescripcion1 ||  args.tercero.nomenclaturaDescripcion1.length === 0){
        res.send(G.utils.r(req.url, 'Se requiere la descripcion de la via principal', 404, {}));
        return;
    }
    
    if(!args.tercero.numeroPredio ||  args.tercero.numeroPredio.length === 0){
        res.send(G.utils.r(req.url, 'Se requiere el número de predio', 404, {}));
        return;
    }
    
    if(!args.tercero.direccion ||  args.tercero.direccion.length === 0){
        res.send(G.utils.r(req.url, 'Se requiere la direccion', 404, {}));
        return;
    }
    
    if(!args.tercero.telefonos ||  args.tercero.telefonos.length === 0){
        res.send(G.utils.r(req.url, 'Se requiere al menos un teléfono', 404, {}));
        return;
    }
    
    if(args.accion === null || args.accion === undefined){
        res.send(G.utils.r(req.url, 'Se requiere la acción', 404, {}));
        return;
    }
    
    if(!args.empresa_id){
        res.send(G.utils.r(req.url, 'Se requiere la empresa', 404, {}));
        return;
    }
    
    var obj = {tercero:args.tercero, usuario_id : req.session.user.usuario_id, empresa : args.empresa_id, accion:args.accion}; 
    
    G.Q.ninvoke(that.mTerceros,'guardarFormularioTerceros', obj).then(function(resultado) {
        
        res.send(G.utils.r(req.url, 'Tercero guardado correctamente', 200, {tercero: {}}));
        
    }).fail(function(err){
        
        var msj = (err.msj) ? err.msj : "Ha ocurrido un error guardando el tercero";
        
        res.send(G.utils.r(req.url, msj, 404, {}));
    }).done();
    
    
};

Terceros.$inject = ["m_gestion_terceros"];

module.exports = Terceros;