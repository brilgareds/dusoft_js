var TercerosModel = function() {

};



TercerosModel.prototype.guardarFormularioTerceros = function(parametros, callback){
   var that  = this;
   parametros.crear = true;
   
    G.Q.ninvoke(that,'obtenerTercero', parametros).then(function(resultado) {
        
        if(resultado.length  > 0 && parametros.accion === "0"){
            throw { msj:"Ya existe un tercero con la identificación ingresada", status:403 };
        } else {
            parametros.crear = false;
            parametros.validacion = true;
        }
       
       
       return G.Q.ninvoke(that,'obtenerTerceroPorEmail', parametros);
      
    }).then(function(resultado){
        if(resultado.length > 0){
           throw { msj:"Ya existe un tercero con el email ingresado", status:403 };
           return;
        }
        
        return  G.Q.ninvoke(that,'gestionarTercero', parametros);
        
        
    }).then(function(resultado){
        callback(false, resultado);
        
    }).fail(function(err){
        var msj = err;
        var status = 500;
        
        if(err.status){
            status = err.status;
            msj = err.msj;
        }
        
        callback(err);
    }).done();
   
   
};

TercerosModel.prototype.gestionarTercero = function(parametros, callback){
    var that = this;
    
    G.knex.transaction(function(transaccion) {  
        parametros.transaccion = transaccion;
        G.Q.ninvoke(that,'guardarTercero', parametros).then(function(resultado) {
            transaccion.commit();
        }).fail(function(err){
            transaccion.rollback(err);
        }).done();
        
    }).then(function(){
        callback(false);
    }).catch(function(err){
        console.log("error generado >>>>>>>>>>>>", err);
        callback(err);
    }).
    done();
    
};

TercerosModel.prototype.guardarTercero = function(parametros, callback){
    var that = this;
    var tercero = parametros.tercero;
    var nombre = tercero.primerNombre + " " + tercero.segundoNombre + " " + tercero.primerApellido + " " + tercero.segundoApellido;
    
    var data = {
        tipo_id_tercero : tercero.tipoDocumento.id,
        tercero_id : tercero.id,
        tipo_pais_id : tercero.pais.id,
        tipo_dpto_id : tercero.pais.departamentoSeleccionado.id,
        tipo_mpio_id : tercero.pais.departamentoSeleccionado.ciudadSeleccionada.id,
        direccion    : tercero.direccion,
        email : tercero.email,
        sw_persona_juridica : tercero.tipoNaturaleza.codigo,
        usuario_id : parametros.usuario_id,
        nombre_tercero : nombre.replace(/\s+/g,' ').trim(),
        nombre1 : tercero.primerNombre,
        nombre2 : tercero.segundoNombre,
        apellido1 : tercero.primerApellido,
        apellido2 : tercero.segundoApellido,
        empresa_id : tercero.empresa,
        fecha_expedicion_documento : tercero.fechaExpedicion || null,
        fecha_expiracion : tercero.fechaExpiracion || null,
        genero_id : tercero.genero.id,
        estado_civil_id : tercero.estadoCivil.id,
        fecha_nacimiento : tercero.fechaNacimiento || null,
        razon_social : tercero.razonSocial,
        nombre_comercial : tercero.nombreComercial,
        descripcion : tercero.descripcion,
        tipo_organizacion_id : (tercero.tipoOrganizacion) ? tercero.tipoOrganizacion.id : null,
        nomenclatura_direccion1 : tercero.nomenclaturaDireccion1.id,
        nomenclatura_descripcion1 : tercero.nomenclaturaDescripcion1,
        nomenclatura_direccion2 : (tercero.nomenclaturaDireccion2) ? tercero.nomenclaturaDescripcion2.id : null,
        nomenclatura_descripcion2 : tercero.nomenclaturaDescripcion2,
        numero_predio : tercero.numeroPredio,
        barrio : tercero.barrio, 
        tipo_correo_id : (tercero.tipoCorreo) ? tercero.tipoCorreo.id : null,
        tipo_red_social_id : (tercero.tipoRedSocial) ? tercero.tipoRedSocial.id : null,
        tipo_direccion_id : tercero.tipoDireccion.id,
        tipo_nacionalidad : tercero.nacionalidad.id,
        descripcion_red_social : tercero.descripcionRedSocial
    };
    
    console.log("datos tercero ", data);
    
    var query = G.knex("terceros");
    
    if(parametros.transaccion) query.transacting(parametros.transaccion);
    
    if(parametros.crear){        
        query.insert(data);
    } else {
        query.update(data).
        where("tipo_id_tercero", tercero.tipoDocumento.id).
        andWhere("tercero_id", tercero.id);
    }
            
    query.then(function(resultado){
        return G.Q.ninvoke(that,'gestionarTelefonosTercero', parametros);
        
    }).then(function(resultado){
        return G.Q.ninvoke(that,'gestionarContactosTercero', parametros);
        
    }).then(function(resultado){
        callback(false, resultado);
        
    }).catch(function(err){
        callback(err);       
    });
    
};



TercerosModel.prototype.gestionarTelefonosTercero = function(parametros, callback){
    
    var that = this;
    //El tercero no tiene telefonos
    if(parametros.tercero.telefonos.length === 0){
        callback(false);
        return;
    }
    
    var query = G.knex("tercero_telefonos");
    
    if(parametros.transaccion) query.transacting(parametros.transaccion);
    
    query.where('tipo_id_tercero', parametros.tercero.tipoDocumento.id).
    andWhere('tercero_id', parametros.tercero.id).
    del().
    then(function(resultado){
        return  G.Q.ninvoke(that,'guardarTelefonosTercero', parametros);
        
    }).then(function(resultado){
        callback(false, resultado);
        
    }).catch(function(err){
        console.log("error sql",err);
        callback(err);       
    }); 
    
};

TercerosModel.prototype.gestionarContactosTercero = function(parametros, callback){
    
    var that = this;
    if(parametros.tercero.contactos.length === 0){
        callback(false);
        return;
    }
    
    var query = G.knex("terceros_contactos");
    
    if(parametros.transaccion) query.transacting(parametros.transaccion);
    
    query.where('tipo_id_tercero', parametros.tercero.tipoDocumento.id).
    andWhere('tercero_id', parametros.tercero.id).
    del().
    then(function(resultado){
        return  G.Q.ninvoke(that,'guardarContactoTercero', parametros);
        
    }).then(function(resultado){
        callback(false, resultado);
        
    }).catch(function(err){
        console.log("error sql",err);
        callback(err);       
    }); 
    
};


TercerosModel.prototype.guardarTelefonosTercero = function(parametros, callback){
    var that = this;
    var tercero = parametros.tercero;
    var telefono = tercero.telefonos[0];
    
    console.log("guardando telefono >>>>>>>>>> ", telefono);
    
    if(!telefono){
        callback(false);
        return;
    }
    
    var data = {
        tipo_id_tercero : tercero.tipoDocumento.id,
        tercero_id : tercero.id,
        tipo_telefono_id : telefono.tipoTelefono.id,
        tipo_linea_telefonica_id : telefono.tipoLineaTelefonica.id,
        numero : telefono.numero
    };
    
    var query = G.knex("tercero_telefonos");
    
    if(parametros.transaccion) query.transacting(parametros.transaccion);
    
    query.insert(data).then(function(resultado){
        
        tercero.telefonos.splice(0,1);
        
        setTimeout(function(){
            that.guardarTelefonosTercero(parametros, callback);
        }, 0);
        
    }).catch(function(err){
        callback(err);       
    });
    
};

TercerosModel.prototype.guardarContactoTercero = function(parametros, callback){
    var that = this;
    var tercero = parametros.tercero;
    var contacto = tercero.contactos[0];
        
    if(!contacto){
        callback(false);
        return;
    }
    
    var data = {
        tipo_id_tercero : tercero.tipoDocumento.id,
        tercero_id : tercero.id,
        tipo_contacto_id : contacto.tipoSeleccionado.id,
        nombre : contacto.nombre,
        telefono : contacto.telefono,
        correo : contacto.email,
        descripcion : contacto.descripcion
    };
    
    var query = G.knex("terceros_contactos");
    
    if(parametros.transaccion) query.transacting(parametros.transaccion);
    
    query.insert(data).then(function(resultado){
        //prueba
        tercero.contactos.splice(0,1);
        
        setTimeout(function(){
            that.guardarContactoTercero(parametros, callback);
        }, 0);
        
    }).catch(function(err){
        callback(err);       
    });
    
};


TercerosModel.prototype.obtenerTercero = function(parametros, callback){
    var columns = [
        "*"
    ];
    
    G.knex.column(columns).
    from("terceros as a").
    where("a.tipo_id_tercero", parametros.tercero.tipoDocumento.id).
    andWhere("a.tercero_id", parametros.tercero.id).
    then(function(resultado){
        callback(false, resultado);
    }).catch(function(error){
        callback(error);
    }).done();
  
};

TercerosModel.prototype.obtenerTerceroPorEmail = function(parametros, callback){
    
    //Al no ser un campo requerido se valida si hay necesidad de buscar usuarios por email
    if(parametros.tercero.email.length === 0){
        callback(false, []);
        return;
    }
   
    var columns = [
        "a.tipo_id_tercero",
        "a.tercero_id",
        "a.email"
    ];
    
    var query =  G.knex.column(columns);
    
    query.from("terceros as a").
    where("a.email", parametros.tercero.email);
    
    //Util para validar que otro tercero tenga en uso el email
    if(parametros.validacion){
        query.andWhere("a.tipo_id_tercero", "<>", parametros.tercero.tipoDocumento.id).
        andWhere("a.tercero_id", "<>", parametros.tercero.id);
    }
    
    query.then(function(resultado){
        callback(false, resultado);
    }).catch(function(error){
        callback(error);
    }).done();
  
};

TercerosModel.prototype.obtenerParametrizacionFormularioTerceros = function(parametros, callback) {
    var that = this;
    var datos = {};
    
    G.Q.ninvoke(that,'obtenerGeneros', parametros).then(function(generos) {
        datos.generos = generos;
        return G.Q.ninvoke(that,'obtenerTiposDocumentos', parametros);
      
    }).then(function(tiposDocumentos){
        datos.tiposDocumentos = tiposDocumentos;
        return G.Q.ninvoke(that,'obtenerTiposEstoCivil', parametros);
        
    }).then(function(tiposEstadoCivil){
        datos.tiposEstadoCivil = tiposEstadoCivil;
        return G.Q.ninvoke(that,'obtenerTiposNacionalidad', parametros);
        
    }).then(function(tiposNacionalidad){
        datos.tiposNacionalidad = tiposNacionalidad;
        return G.Q.ninvoke(that,'obtenerTiposDireccion', parametros);
        
    }).then(function(tiposDireccion){
        datos.tiposDireccion = tiposDireccion;
        return G.Q.ninvoke(that,'obtenerTiposTelefono', parametros);
        
    }).then(function(tiposTelefeno){
        datos.tiposTelefeno = tiposTelefeno;
        return G.Q.ninvoke(that,'obtenerTiposLineaTelefonica', parametros);
        
    }).then(function(tiposLineaTefelonica){
        datos.tiposLineaTefelonica = tiposLineaTefelonica;
        return G.Q.ninvoke(that,'obtenerTiposCorreo', parametros);
        
    }).then(function(tiposCorreo){
        datos.tiposCorreo = tiposCorreo;
        return G.Q.ninvoke(that,'obtenerTiposRedSocial', parametros);
        
    }).then(function(tiposRedSocial){
        datos.tiposRedSocial = tiposRedSocial;
        return G.Q.ninvoke(that,'obtenerTiposContacto', parametros);
        
    }).then(function(tiposContacto){
        datos.tiposContacto = tiposContacto;
        return G.Q.ninvoke(that,'obtenerTiposOrganizacion', parametros);
        
    }).then(function(tiposOrganizacion){
        datos.tiposOrganizacion = tiposOrganizacion;
        return G.Q.ninvoke(that,'obtenerNomenclaturasDireccion', parametros);
        
    }).then(function(nomenclaturasDireccion){
        datos.nomenclaturasDireccion = nomenclaturasDireccion;
        callback(false, datos);
        
    }).fail(function(err) {
        
        var msj = err;
        var status = 500;
        
        if(err.status){
            status = err.status;
            msj = err.msj;
        }
        
        
        callback(err);
    }).done();
    
};

/**
* @author Eduar Garcia
* +Descripcion: Obtiene los generos disponibles
* @params obj: {params, callback}
* @fecha 2017-03-16
*/
TercerosModel.prototype.obtenerGeneros = function(parametros, callback) {
    var columns = [
        "a.id",
        "a.descripcion"
    ];
    
    G.knex.column(columns).
    from("genero as a").then(function(generos){
        callback(false, generos);
    }).catch(function(error){
        callback(error);
    }).done();
    
    
};

/**
* @author Eduar Garcia
* +Descripcion: Obtiene los tipos de documentos disponibles
* @params obj: {params, callback}
* @fecha 2017-03-16
*/
TercerosModel.prototype.obtenerTiposDocumentos = function(parametros, callback) {
    var columns = [
        "a.tipo_id_tercero as id",
        "a.descripcion"
    ];
    
    G.knex.column(columns).
    from("tipo_id_terceros as a").
    orderBy("a.indice_de_orden", "desc").then(function(tiposDocumentos){
        callback(false, tiposDocumentos);
    }).catch(function(error){
        callback(error);
    }).done();

};

/**
* @author Eduar Garcia
* +Descripcion: Obtiene los tipos de estado civil disponibles
* @params obj: {params, callback}
* @fecha 2017-03-16
*/
TercerosModel.prototype.obtenerTiposEstoCivil = function(parametros, callback) {
    var columns = [
        "a.id",
        "a.descripcion"
    ];
    
    G.knex.column(columns).
    from("tipo_estado_civil as a").
    orderBy("a.indice_de_orden", "desc").then(function(tiposDocumentos){
        callback(false, tiposDocumentos);
    }).catch(function(error){
        callback(error);
    }).done();

};

/**
* @author Eduar Garcia
* +Descripcion: Obtiene los tipos de nacionalidad disponibles
* @params obj: {params, callback}
* @fecha 2017-03-16
*/
TercerosModel.prototype.obtenerTiposNacionalidad = function(parametros, callback) {
    var columns = [
        "a.id",
        "a.descripcion"
    ];
    
    G.knex.column(columns).
    from("nacionalidad as a").then(function(tiposNacionalidad){
        callback(false, tiposNacionalidad);
    }).catch(function(error){
        callback(error);
    }).done();

};

/**
* @author Eduar Garcia
* +Descripcion: Obtiene los tipos de direccion disponibles
* @params obj: {params, callback}
* @fecha 2017-03-16
*/
TercerosModel.prototype.obtenerTiposDireccion = function(parametros, callback) {
    var columns = [
        "a.id",
        "a.descripcion"
    ];
    
    G.knex.column(columns).
    from("tipo_direccion as a").then(function(tipoDireccion){
        callback(false, tipoDireccion);
    }).catch(function(error){
        callback(error);
    }).done();

};

/**
* @author Eduar Garcia
* +Descripcion: Obtiene los tipos de telefono disponibles
* @params obj: {params, callback}
* @fecha 2017-03-16
*/
TercerosModel.prototype.obtenerTiposTelefono = function(parametros, callback) {
    var columns = [
        "a.id",
        "a.descripcion"
    ];
    
    G.knex.column(columns).
    from("tipos_telefono as a").then(function(tiposTelefono){
        callback(false, tiposTelefono);
    }).catch(function(error){
        callback(error);
    }).done();

};

/**
* @author Eduar Garcia
* +Descripcion: Obtiene los tipos de linea telefonica disponibles
* @params obj: {params, callback}
* @fecha 2017-03-16
*/
TercerosModel.prototype.obtenerTiposLineaTelefonica = function(parametros, callback) {
    var columns = [
        "a.id",
        "a.descripcion"
    ];
    
    G.knex.column(columns).
    from("tipos_linea_telefonica as a").then(function(tiposTelefono){
        callback(false, tiposTelefono);
    }).catch(function(error){
        callback(error);
    }).done();

};

/**
* @author Eduar Garcia
* +Descripcion: Obtiene los tipos de correo disponibles
* @params obj: {params, callback}
* @fecha 2017-03-16
*/
TercerosModel.prototype.obtenerTiposCorreo = function(parametros, callback) {
    var columns = [
        "a.id",
        "a.descripcion"
    ];
    
    G.knex.column(columns).
    from("tipos_correo as a").then(function(tiposCorreo){
        callback(false, tiposCorreo);
    }).catch(function(error){
        callback(error);
    }).done();

};

/**
* @author Eduar Garcia
* +Descripcion: Obtiene los tipos de red social disponibles
* @params obj: {params, callback}
* @fecha 2017-03-16
*/
TercerosModel.prototype.obtenerTiposRedSocial = function(parametros, callback) {
    var columns = [
        "a.id",
        "a.descripcion"
    ];
    
    G.knex.column(columns).
    from("tipos_redes_sociales as a").then(function(tiposCorreo){
        callback(false, tiposCorreo);
    }).catch(function(error){
        callback(error);
    }).done();

};


/**
* @author Eduar Garcia
* +Descripcion: Obtiene los tipos de organizacion disponibles
* @params obj: {params, callback}
* @fecha 2017-03-17
*/
TercerosModel.prototype.obtenerTiposOrganizacion = function(parametros, callback) {
    var columns = [
        "a.id",
        "a.descripcion"
    ];
    
    G.knex.column(columns).
    from("tipo_organizacion as a").then(function(tiposCorreo){
        callback(false, tiposCorreo);
    }).catch(function(error){
        callback(error);
    }).done();

};

/**
* @author Eduar Garcia
* +Descripcion: Obtiene los tipos de contacto disponibles
* @params obj: {params, callback}
* @fecha 2017-03-16
*/
TercerosModel.prototype.obtenerTiposContacto = function(parametros, callback) {
    var columns = [
        "a.id",
        "a.descripcion"
    ];
    
    G.knex.column(columns).
    from("tipos_contacto as a").then(function(tiposContacto){
        callback(false, tiposContacto);
    }).catch(function(error){
        callback(error);
    }).done();

};

/**
* @author Eduar Garcia
* +Descripcion: Obtiene las nomenclaturas de direcciones disponibles
* @params obj: {params, callback}
* @fecha 2017-03-17
*/
TercerosModel.prototype.obtenerNomenclaturasDireccion = function(parametros, callback) {
    var columns = [
        "a.id",
        "a.descripcion",
        "a.codigo"
    ];
    
    G.knex.column(columns).
    from("nomenclatura_direccion as a").then(function(tiposContacto){
        callback(false, tiposContacto);
    }).catch(function(error){
        callback(error);
    }).done();

};

module.exports = TercerosModel;