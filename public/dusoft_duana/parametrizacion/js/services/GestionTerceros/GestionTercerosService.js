
define(["angular", "js/services"], function(angular, services) {

    services.factory('GestionTercerosService', 
    ['$rootScope','Modulo','Request','API','Genero',
     'TipoDocumento','EstadoCivil','TipoNacionalidad','TipoDireccion','Pais',
     'Departamento','Ciudad','NomenclaturaDireccion','TipoCorreo','TipoRedSocial',
    function($rootScope, Modulo, Request, API, Genero,
             TipoDocumento, EstadoCivil, TipoNacionalidad, TipoDireccion, Pais,
             Departamento, Ciudad, NomenclaturaDireccion, TipoCorreo, TipoRedSocial) {
        
        var self = this;

        self.obtenerParametrizacionTerceros = function(parametros, callback ){

             Request.realizarRequest(API.TERCEROS.OBTENER_PARAMETRIZACION_FORMULARIO, "POST", parametros, function(data) {
                    
                callback(data);

             });
        };
        
        self.obtenerPaises = function(parametros, callback ){

             Request.realizarRequest(API.UBICACION.LISTAR_PAISES, "POST", parametros, function(data) {
                   
                callback(data);

             });
        };
        
        self.obtenerDepartamentosPorPais = function(parametros, callback ){

             Request.realizarRequest(API.UBICACION.LISTAR_DEPARTAMENTOS_POR_PAIS, "POST", parametros, function(data) {
                   
                callback(data);

             });
        };
        
        self.obtenerCiudadesPorDepartamento = function(parametros, callback ){

             Request.realizarRequest(API.UBICACION.LISTAR_CIUDADES_POR_DEPARTAMENTO, "POST", parametros, function(data) {
                   
                callback(data);

             });
        };
        
        self.submitformularioTerceros = function(parametros, callback ){

             Request.realizarRequest(API.TERCEROS.GUARDAR_FORMULARIO_TERCERO, "POST", parametros, function(data) {
                   
                callback(data);

             });
        };
        
        self.obtenerTercero = function(parametros, callback ){

             Request.realizarRequest(API.TERCEROS.OBTENER_TERCERO, "POST", parametros, function(data) {
                   
                callback(data);

             });
        };
        
        self.listarTerceros = function(parametros, callback ){

             Request.realizarRequest(API.TERCEROS.LISTAR_TERCEROS, "POST", parametros, function(data) {
                   
                callback(data);

             });
        };
        
        self.listarTiposDocumentos = function(parametros, callback ){

             Request.realizarRequest(API.TERCEROS.LISTAR_TIPOS_DOCUMENTOS, "POST", parametros, function(data) {
                   
                callback(data);

             });
        };
        
        self.serializarTercero = function(data, tercero){
                                        
            var genero = Genero.get(data.genero_id, data.descripcion_genero);
            var tipoDocumento = TipoDocumento.get(data.tipo_documento_id, data.descripcion_tipo_documento);
            var estadoCivil = EstadoCivil.get(data.tipo_estado_civil_id, data.descripcion_estado_civil);
            var tipoNacionalidad = TipoNacionalidad.get(data.nacionalidad_id, data.descripcion_nacionalidad);
            var tipoDireccion = TipoDireccion.get(data.tipo_direccion_id, data.descripcion_tipo_direccion);
            var pais = Pais.get(data.tipo_pais_id, data.pais);
            var departamento = Departamento.get(data.tipo_dpto_id, data.departamento);
            var ciudad = Ciudad.get(data.tipo_mpio_id, data.municipio);           
            departamento.setCiudadSeleccionada(ciudad);
            pais.setDepartamentoSeleccionado(departamento);
            var nomenclatura1 = NomenclaturaDireccion.get(data.id_nomenclatura1, data.descripcion_nomenclatura1);
            var nomenclatura2 = NomenclaturaDireccion.get(data.id_nomenclatura2, data.descripcion_nomenclatura2);
            var tipoCorreo = TipoCorreo.get(data.tipo_correo_id, data.descripcion_tipo_correo);
            var tipoRedSocial = TipoRedSocial.get(data.tipo_red_social_id, data.descripcion_red_social);
            
            tercero.setPrimerNombre(data.nombre1).setSegundoNombre(data.nombre2).setPrimerApellido(data.apellido1).setSegundoApellido(data.apellido2).
            setGenero(genero).setTipoDocumento(tipoDocumento).setId(data.tercero_id).setFechaExpedicion(data.fecha_expedicion_documento).
            setFechaExpiracion(data.fecha_expiracion).setFechaNacimiento(data.fecha_nacimiento).setEstadoCivil(estadoCivil).
            setNacionalidad(tipoNacionalidad).setRazonSocial(data.razon_social).setDescripcion(data.descripcion).setTipoDireccion(tipoDireccion).
            setPais(pais).setNomenclaturaDireccion1(nomenclatura1).setNomenclaturaDireccion2(nomenclatura2).setNomenclaturaDescripcion1(data.nomenclatura_descripcion1).
            setNomenclaturaDescripcion2(data.nomenclatura_descripcion2).setNumeroPredio(data.numero_predio).setBarrio(data.barrio).setTipoCorreo(tipoCorreo).setCorreo(data.email).
            setTipoRedSocial(tipoRedSocial).setDescripcionRedSocial(data.descripcion_red_social);
    
            console.log("estado civil ", nomenclatura2);
        };
        
        
        

        return this;

     }]);
});