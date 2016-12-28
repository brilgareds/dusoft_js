
var ValidacionDespachos = function(induccion, imprimir_productos) {

    this.m_ValidacionDespachos = induccion;
    this.m_imprimir_productos = imprimir_productos;

};



/**
 * @author Cristian Ardila
 * @fecha  04/02/2016
 * +Descripcion Metodo encargado de invocar el modelo para listar los despachos
 * aprobados
 */
ValidacionDespachos.prototype.listarDespachosAprobados = function(req, res) {

    var that = this;

    var args = req.body.data;

    if (args.validacionDespachos === undefined) {
        res.send(G.utils.r(req.url, 'Variable (validacionDespachos) no esta definida', 404, {}));
        return;
    }

    if (args.validacionDespachos.empresa_id === undefined) {
        res.send(G.utils.r(req.url, 'El id de la empresa no esta definido ', 404, {}));
        return;
    }

    if (args.validacionDespachos.prefijo === undefined) {
        res.send(G.utils.r(req.url, 'El prefijo no esta definido ', 404, {}));
        return;
    }

    if (args.validacionDespachos.numero === undefined) {
        res.send(G.utils.r(req.url, 'El numero no esta definido', 404, {}));
        return;
    }

    var empresa_id = args.validacionDespachos.empresa_id;
    var prefijo = args.validacionDespachos.prefijo;
    var numero = args.validacionDespachos.numero;
    var fechaInicial = args.validacionDespachos.fechaInicial;
    var fechaFinal = args.validacionDespachos.fechaFinal;
    var paginaActual = args.validacionDespachos.paginaActual;
    var registroUnico = args.validacionDespachos.registroUnico;


    var obj = {fechaInicial: fechaInicial,
        fechaFinal: fechaFinal,
        prefijo: prefijo.toUpperCase(),
        numero: numero,
        empresa_id: empresa_id,
        paginaActual: paginaActual,
        registroUnico: registroUnico
    };

    G.Q.ninvoke(that.m_ValidacionDespachos, 'listarDespachosAprobados', obj).then(function(resultado) {

        return res.send(G.utils.r(req.url, 'Lista de despachos aprobados por seguridad', 200, {validacionDespachos: resultado}));

    }).fail(function(err) {

        res.send(G.utils.r(req.url, 'Error consultado los de despachos', 500, {validacionDespachos: {}}));

    }).done();

};

/**
 * @author Eduar Garcia
 * @fecha  26/12/2016
 * +Descripcion Metodo encargado de listar las imagenes de una aprobacion
 * aprobados
 */
ValidacionDespachos.prototype.listarImagenes = function(req, res) {
   
    var that = this;

    var args = req.body.data;    

    if (args.validacionDespachos === undefined) {
        res.send(G.utils.r(req.url, 'Variable (validacionDespachos) no esta definida', 404, {}));
        return;
    }

    if (args.validacionDespachos.id_aprobacion === undefined) {
        res.send(G.utils.r(req.url, 'El id de la aprobacion no esta definido ', 404, {}));
        return;
    }

    var aprobacion = args.validacionDespachos.id_aprobacion;    
    
    G.Q.ninvoke(that.m_ValidacionDespachos, 'listarImagenes', {id_aprobacion:aprobacion}).then(function(resultado) {

        return res.send(G.utils.r(req.url, 'Listado de imagenes', 200, {imagenes: resultado}));

    }).fail(function(err) {

        res.send(G.utils.r(req.url, 'Error en el registro', 500, {validacionDespachos: {}}));

    }).done();

};

/**
 * @author Eduar Garcia
 * @fecha  26/12/2016
 * +Descripcion Metodo encargado de invocar el modelo para listar los despachos
 * aprobados
 */
ValidacionDespachos.prototype.adjuntarImagen = function(req, res) {
   

    var that = this;

    var args = req.body.data;    

    if (args.validacionDespachos === undefined) {
        res.send(G.utils.r(req.url, 'Variable (validacionDespachos) no esta definida', 404, {}));
        return;
    }

    if (!args.validacionDespachos.id_aprobacion || !args.validacionDespachos.prefijo || !args.validacionDespachos.numero) {
        res.send(G.utils.r(req.url, 'Algunos campos obligatorios estan vacios ', 404, {}));
        return;
    }

    var aprobacion = args.validacionDespachos.id_aprobacion; 
    var prefijo = args.validacionDespachos.prefijo;
    var numero = args.validacionDespachos.numero;
    var file = req.files.file;
    var rutaTmp = file.path;
    var rutaNueva = G.dirname + G.settings.carpeta_aprobacion_despachos + prefijo + "-" + numero  + "/" + file.name;

    if (G.fs.existsSync(rutaTmp)) {
        G.Q.nfcall(G.fs.copy, rutaTmp, rutaNueva).then(function() {
            return  G.Q.nfcall(G.fs.unlink, rutaTmp);
        }).then(function() {
            
            var obj = {
                id_aprobacion : aprobacion,
                path : prefijo + "-" + numero + "/" + file.name
            };
            
            return G.Q.ninvoke(that.m_ValidacionDespachos, 'agregarImagen', obj)
            
        }).then(function(){
            res.send(G.utils.r(req.url, 'Imagen guardada', 200, {validacionDespachos: {}}));
            
        }).fail(function(err) {
            G.fs.unlinkSync(rutaNueva);
            res.send(G.utils.r(req.url, 'Error guardando la imagen', 500, {validacionDespachos: {}}));
        }).done();

    } else {
        res.send(G.utils.r(req.url, 'Error guardando la imagen', 500, {validacionDespachos: {}}));
    }

};


/**
 * @author Eduar Garcia
 * @fecha  26/12/2016
 * +Descripcion Metodo para eliminar una imagen de la aprobacion
 */
ValidacionDespachos.prototype.eliminarImagen = function(req, res) {
   

    var that = this;

    var args = req.body.data;    

    if (args.validacionDespachos === undefined) {
        res.send(G.utils.r(req.url, 'Variable (validacionDespachos) no esta definida', 404, {}));
        return;
    }

    if (!args.validacionDespachos.id || !args.validacionDespachos.path) {
        res.send(G.utils.r(req.url, 'Algunos campos obligatorios estan vacios ', 404, {}));
        return;
    }

    var id = args.validacionDespachos.id; 
    var path = args.validacionDespachos.path;

    G.Q.ninvoke(that.m_ValidacionDespachos, 'eliminarImagen', {id:id}).then(function(resultado) {
        var rutaNueva = G.dirname + G.settings.carpeta_aprobacion_despachos + path;
        G.fs.unlinkSync(rutaNueva);
        return res.send(G.utils.r(req.url, 'Eliminacion exitosa', 200, {imagenes: resultado}));

    }).fail(function(err) {
        console.log("error generado ", err);
        res.send(G.utils.r(req.url, 'Error al eliminar la imagen', 500, {validacionDespachos: {}}));

    }).done();

};


/*
 * funcion para consultar empresas
 * @param {type} req
 * @param {type} res
 * @returns {datos de consulta}
 */
ValidacionDespachos.prototype.listarEmpresas = function(req, res) {

    var that = this;
    var args = req.body.data;
    var empresa = args.listar_empresas.empresaName;
    if (empresa === undefined) {
        res.send(G.utils.r(req.url, 'empresa, No esta definida', 404, {}));
        return;
    }
    that.m_ValidacionDespachos.listarEmpresas(empresa, function(err, empresas) {

        if (err) {
            res.send(G.utils.r(req.url, 'Error listando las empresas', 500, {listar_empresas: err}));
        } else {
            res.send(G.utils.r(req.url, 'Lista de empresas OK', 200, {listar_empresas: empresas}));
        }
    });
};


/**
 * @author Cristian Ardila
 * @fecha  04/02/2016
 * +Descripcion: Controlador encargado de invocar el modelo que registrara la 
 *               aprobacion del personal de seguridad sobre un despacho
 * @returns {unresolved}
 */
ValidacionDespachos.prototype.registrarAprobacion = function(req, res) {

    var that = this;

    var args = req.body.data;

    if (args.validacionDespachos === undefined) {
        res.send(G.utils.r(req.url, 'Variable (validacionDespachos) no esta definida', 404, {}));
        return;
    }


    if (args.validacionDespachos.empresa_id === undefined || args.validacionDespachos.empresa_id === '') {
        res.send(G.utils.r(req.url, 'El id de la empresa no esta definido o esta vacio', 404, {}));
        return;
    }

    if (args.validacionDespachos.prefijo === undefined || args.validacionDespachos.prefijo === '') {
        res.send(G.utils.r(req.url, 'El prefijo no esta definido o esta vacio', 404, {}));
        return;
    }

    if (args.validacionDespachos.numero === undefined || args.validacionDespachos.numero === '') {
        res.send(G.utils.r(req.url, 'El numero no esta definido o esta vacio', 404, {}));
        return;
    }
    if (args.validacionDespachos.cantidad_cajas === undefined || args.validacionDespachos.cantidad_cajas === '') {
        res.send(G.utils.r(req.url, 'La cantidad de cajas no esta definido o esta vacio', 404, {}));
        return;
    }
    if (args.validacionDespachos.cantidad_cajas === '0' && args.validacionDespachos.cantidad_neveras === '0') {
        res.send(G.utils.r(req.url, 'La cantidad de cajas y neveras no deben estar en cero', 404, {}));
        return;
    }
    
    if (args.validacionDespachos.cantidad_neveras === undefined || args.validacionDespachos.cantidad_neveras === '') {
        res.send(G.utils.r(req.url, 'La cantidad de neveras no esta definido o esta vacio', 404, {}));
        return;
    }
    
    
    if (args.validacionDespachos.observacion === undefined || args.validacionDespachos.observacion === '') {
        res.send(G.utils.r(req.url, 'La observacion no esta definido o esta vacio', 404, {}));
        return;
    }
    if (args.validacionDespachos.estado === undefined || args.validacionDespachos.estado === '') {
        res.send(G.utils.r(req.url, 'El estado no esta definido o esta vacio', 404, {}));
        return;
    }

    var empresa_id = args.validacionDespachos.empresa_id;
    var prefijo = args.validacionDespachos.prefijo;
    var numero = args.validacionDespachos.numero;
    var cantidad_cajas = args.validacionDespachos.cantidad_cajas;
    var cantidad_neveras = args.validacionDespachos.cantidad_neveras;
    var observacion = args.validacionDespachos.observacion;
    var estado = args.validacionDespachos.estado;

    var obj = {
        empresa_id: empresa_id,
        prefijo: prefijo.toUpperCase(),
        numero: numero,
        cantidad_cajas: cantidad_cajas,
        cantidad_neveras: cantidad_neveras,
        observacion: observacion,
        estado: estado,
        usuario_id: req.session.user.usuario_id
    };


    G.Q.ninvoke(that.m_ValidacionDespachos, 'registrarAprobacion', obj).then(function(resultado) {

        return res.send(G.utils.r(req.url, 'Aprobacion con registro exitoso', 200, {validacionDespachos: resultado}));

    }).fail(function(err) {

        res.send(G.utils.r(req.url, 'Error en el registro', 500, {validacionDespachos: {}}));

    }).done();

};


ValidacionDespachos.prototype.listarDocumentosOtrasSalidas = function(req,res){
    var that = this;
    var args = req.body.data;
    
    var obj = {
        termino_busqueda:args.validacionDespachos.termino_busqueda || ""
    };
   
    
    G.Q.ninvoke(that.m_ValidacionDespachos, 'listarDocumentosOtrasSalidas', obj).then(function(resultado) {

        return res.send(G.utils.r(req.url, 'Aprobacion con registro exitoso', 200, {documentos: resultado}));

    }).fail(function(err) {

        res.send(G.utils.r(req.url, 'Error en el registro', 500, {documentos: {}}));

    }).done();
};

ValidacionDespachos.prototype.listarNumeroPrefijoOtrasSalidas = function(req, res){
    var that = this;
    var args = req.body.data;
    
    if (args.validacionDespachos === undefined) {
        res.send(G.utils.r(req.url, 'Variable (validacionDespachos) no esta definida', 404, {}));
        return;
    }
    
    if (args.validacionDespachos.prefijo === undefined || args.validacionDespachos.prefijo === '') {
        res.send(G.utils.r(req.url, 'El Prefijo no esta definido o esta vacio', 404, {}));
        return;
    }
    
   
    var prefijo = args.validacionDespachos.prefijo.toUpperCase();

    
    G.Q.ninvoke(that.m_ValidacionDespachos, 'listarNumeroPrefijoOtrasSalidas', {prefijo:prefijo}).then(function(resultado) {
        
        return res.send(G.utils.r(req.url, 'Aprobacion con registro exitoso', 200, {planillas_despachos: resultado}));

    }).fail(function(err) {

        res.send(G.utils.r(req.url, 'Error en el registro', 500, {planillas_despachos: {}}));

    }).done();
};



/**
 * @author Cristian Ardila 
 * @fecha  10/02/2016
 * +Descripcion Controlador que se encarga de ejecutar el modelo para validar la existencia
 *              de un documento
 * @returns {unresolved} */
ValidacionDespachos.prototype.validarExistenciaDocumento = function(req, res){

    var that = this;

    var args = req.body.data;

    if (args.validacionDespachos === undefined) {
        res.send(G.utils.r(req.url, 'Variable (validacionDespachos) no esta definida', 404, {}));
        return;
    }


    if (args.validacionDespachos.empresa_id === undefined || args.validacionDespachos.empresa_id === '') {
        res.send(G.utils.r(req.url, 'El id de la empresa no esta definida o esta vacia', 404, {}));
        return;
    }

    if (args.validacionDespachos.prefijo === undefined || args.validacionDespachos.prefijo === '') {
        res.send(G.utils.r(req.url, 'El prefijo no esta definido o esta vacio', 404, {}));
        return;
    }

    if (args.validacionDespachos.numero === undefined || args.validacionDespachos.numero === '') {
        res.send(G.utils.r(req.url, 'El numero no esta definido o esta vacio', 404, {}));
        return;
    }
   
    var obj = {
                empresa_id:args.validacionDespachos.empresa_id,
                prefijo:args.validacionDespachos.prefijo.toUpperCase(), 
                numero:args.validacionDespachos.numero
              };
    
    var status = {};   
    
    G.Q.ninvoke(that.m_ValidacionDespachos, 'validarExistenciaDocumento', obj).then(function(resultado) {
       
          var def = G.Q.defer();  
     
        if(resultado.length > 0){
             
             status.codigo = 200;
             status.mensaje = 'El documento ya se encuentra aprobado por el personal de seguridad';
           
         }else{
            
             status.codigo = 403;
             status.mensaje = 'El documento NO se encuentra aprobado por el personal de seguridad';
             def.resolve();
        }
        res.send(G.utils.r(req.url, status.mensaje, status.codigo, {validacionDespachos: resultado}));

     }).fail(function(err) {
        
        res.send(G.utils.r(req.url, 'Error en la consulta', 404, {validacionDespachos: {err:err}}));

    }).done();
};


ValidacionDespachos.$inject = ["m_ValidacionDespachos"];

module.exports = ValidacionDespachos;