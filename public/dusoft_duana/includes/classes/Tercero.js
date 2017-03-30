
define(["angular", "js/models"], function(angular, models) {

    models.factory('Tercero', function() {

        function Tercero(nombre, tipo_id_tercero, id, direccion, telefono) {

            this.nombre_tercero = nombre || "";
            this.tipo_id_tercero = tipo_id_tercero || "";
            this.id = id || "";
            this.direccion = direccion || "";
            this.telefono = telefono || "";
            this.tipo_pais_id = "";
            this.tipo_departamento_id = "";
            this.tipo_municipio_id = "";
            this.pais = "";
            this.departamento = "";
            this.municipio = "";
            
            /*** Gestion terceros se optimiza propiedades atravez de clases eje pais, departamento ***/
            this.genero = null;
            this.tipoDocumento = null;
            this.estadoCivil = null;
            this.nacionalidad = null;
            this.tipoOrganizacion = null;
            this.tipoDireccion = null;
            this.nomenclaturaDireccion1 = null;
            this.nomenclaturaDireccion2 = null;
            this.tipoCorreo = null;
            this.tipoRedSocial = null;
            this.contacto = null;
            this.pais = null;
            this.fechaExpedicion = "";
            this.fechaExpiracion = "";
            this.fechaNacimiento = "";
            this.tipoNaturaleza = null;
            this.primerNombre = "";
            this.segundoNombre = "";
            this.primerApellido = "";
            this.segundoApellido = "";
            this.razonSocial = "";
            this.descripcion = "";
            this.nombreComercial = "";
            this.nomenclaturaDescripcion1 = "";
            this.nomenclaturaDescripcion2 = "";
            this.numeroPredio = "";
            this.barrio = "";
            this.email = "";
            this.descripcionRedSocial = "";
            this.telefonos = [];
            this.telefonoSeleccionado = null;
            
        };
        
        //Operaciones Get de parámetros iniciales de creación de Tercero
        Tercero.prototype.getNombre = function(){
            return this.nombre_tercero;
        };
        
        Tercero.prototype.getTipoId = function(){
            return this.tipo_id_tercero;
        };
        
        Tercero.prototype.getId = function(){
            return this.id;
        };
        
        Tercero.prototype.getDireccion = function(){
            return this.direccion;
        };
        
        Tercero.prototype.getTelefono = function(){
            return this.telefono;
        };
        
        //Operaciones Set y Get de atributos adicionales
        Tercero.prototype.setTipoPaisId = function(tipo_pais_id) {
            this.tipo_pais_id = tipo_pais_id;
        };

        Tercero.prototype.getTipoPaisId = function() {
            return this.tipo_pais_id;
        };

        Tercero.prototype.setTipoDepartamentoId = function(tipo_departamento_id) {
            this.tipo_departamento_id = tipo_departamento_id;
        };

        Tercero.prototype.getTipoDepartamentoId = function() {
            return this.tipo_departamento_id;
        };
        
        Tercero.prototype.setTipoMunicipioId = function(tipo_municipio_id) {
            this.tipo_municipio_id = tipo_municipio_id;
        };

        Tercero.prototype.getTipoMunicipioId = function() {
            return this.tipo_municipio_id;
        };
        
        Tercero.prototype.setPais = function(pais) {
            this.pais = pais;
        };

        Tercero.prototype.getPais = function() {
            return this.pais;
        };

        Tercero.prototype.setDepartamento = function(departamento) {
            this.departamento = departamento;
        };

        Tercero.prototype.getDepartamento = function() {
            return this.departamento;
        };
        
        Tercero.prototype.setMunicipio = function(municipio) {
            this.municipio = municipio;
        };

        Tercero.prototype.getMunicipio = function() {
            return this.municipio;
        };    
        
        //GestionTerceros
        Tercero.prototype.setContacto = function(contacto) {
            this.contacto = contacto;
            return this;
        };

        Tercero.prototype.getContacto = function() {
            return this.contacto;
        };  
        
        Tercero.prototype.setPais = function(pais) {
            this.pais = pais;
            return this;
        };

        Tercero.prototype.getPais = function() {
            return this.pais;
        };  
        
        Tercero.prototype.setTelefonoSeleccionado = function(telefonoSeleccionado) {
            this.telefonoSeleccionado = telefonoSeleccionado;
            return this;
        };

        Tercero.prototype.getTelefonoSeleccionado = function() {
            return this.telefonoSeleccionado;
        }; 
        
        Tercero.prototype.agregarTelefono = function(telefono){
            console.log("agregar telefono ", telefono)
            if(telefono.getNumero().length === 0 || telefono.getTipoLineaTelefonica().getId().length === 0 ||
               telefono.getTipoTelefono().getId().length === 0){
                
                return false;
            }
            
          
            for(var i in this.telefonos){
                var _telefono = this.telefonos[i];
                
                if(_telefono.getNumero() === telefono.getNumero() && _telefono.getTipoLineaTelefonica().getId() === telefono.getTipoLineaTelefonica().getId()){
                    this.telefonos[i] = telefono;
                    return true;
                }
                
            }
            
            this.telefonos.push(telefono);
            return true;
            
        };
        
        Tercero.prototype.getTelefonos = function() {
            return this.telefonos;
        }; 

        this.get = function(nombre, tipo_id_tercero, id, direccion, telefono, pais, departamento, municipio) {
            return new Tercero(nombre, tipo_id_tercero, id, direccion, telefono, pais, departamento, municipio);
        };

        this.getClass = function() {
            return Tercero;
        };

        return this;

    });
});