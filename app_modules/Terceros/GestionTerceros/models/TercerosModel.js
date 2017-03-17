var TercerosModel = function() {

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
        "a.tipo_id_tercero",
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
        "a.tipo_estado_civil_id",
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
    from("tipo_contacto as a").then(function(tiposContacto){
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