
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
            this.contactos = [];
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
        
        Tercero.prototype.setNombre = function(nombre){
            this.nombre_tercero = nombre;
            return this;
        };
        
        Tercero.prototype.getPrimerNombre = function(){
            return this.primerNombre;
        };
        
        Tercero.prototype.setPrimerNombre = function(primerNombre){
            this.primerNombre = primerNombre;
            return this;
        };
        
        Tercero.prototype.getSegundoNombre = function(){
            return this.segundoNombre;
        };
        
        Tercero.prototype.setSegundoNombre = function(segundoNombre){
            this.segundoNombre = segundoNombre;
            return this;
        };
        
        Tercero.prototype.getPrimerApellido = function(){
            return this.primerApellido;
        };
        
        Tercero.prototype.setPrimerApellido = function(primerApellido){
            this.primerApellido = primerApellido;
            return this;
        };
        
        Tercero.prototype.getSegundoApellido = function(){
            return this.segundoApellido;
        };
        
        Tercero.prototype.setSegundoApellido = function(segundoApellido){
            this.segundoApellido = segundoApellido;
            return this;
        };
        
        Tercero.prototype.getGenero = function(){
            return this.genero;
        };
        
        Tercero.prototype.setGenero = function(genero){
            this.genero = genero;
            return this;
        };
            
        Tercero.prototype.getFechaExpedicion = function(){
            return this.fechaExpedicion;
        };
        
        Tercero.prototype.setFechaExpedicion = function(fechaExpedicion){
            this.fechaExpedicion = fechaExpedicion;
            return this;
        };
        
        Tercero.prototype.getFechaExpiracion = function(){
            return this.fechaExpiracion;
        };
        
        Tercero.prototype.setFechaExpiracion = function(fechaExpiracion){
            this.fechaExpiracion = fechaExpiracion;
            return this;
        };
        
        Tercero.prototype.getFechaNacimiento = function(){
            return this.fechaNacimiento;
        };
        
        Tercero.prototype.setFechaNacimiento = function(fechaNacimiento){
            this.fechaNacimiento = fechaNacimiento;
            return this;
        };    
        
        Tercero.prototype.getEstadoCivil = function(){
            return this.estadoCivil;
        };
        
        Tercero.prototype.setEstadoCivil = function(estadoCivil){
            this.estadoCivil = estadoCivil;
            return this;
        };    
         
        Tercero.prototype.getNacionalidad = function(){
            return this.nacionalidad;
        };
        
        Tercero.prototype.setNacionalidad = function(nacionalidad){
            this.nacionalidad = nacionalidad;
            return this;
        };
        
        Tercero.prototype.getRazonSocial = function(){
            return this.razonSocial;
        };
        
        Tercero.prototype.setRazonSocial = function(razonSocial){
            this.razonSocial = razonSocial;
            return this;
        };
        
        Tercero.prototype.getDescripcion = function(){
            return this.descripcion;
        };
        
        Tercero.prototype.setDescripcion = function(descripcion){
            this.descripcion = descripcion;
            return this;
        };
        
        Tercero.prototype.getTipoDireccion = function(){
            return this.tipoDireccion;
        };
        
        Tercero.prototype.setTipoDireccion = function(tipoDireccion){
            this.tipoDireccion = tipoDireccion;
            return this;
        };
        
        Tercero.prototype.getTipoId = function(){
            return this.tipo_id_tercero;
        };
        
        Tercero.prototype.getId = function(){
            return this.id;
        };
        
        Tercero.prototype.setId = function(id){
           this.id = id;
           return this;
        };
        
        Tercero.prototype.getIdentificacion = function(){
          
            return this.tipo_id_tercero + " " +this.id;
        };
        
        Tercero.prototype.getDireccion = function(){
            return this.direccion;
        };
        
        Tercero.prototype.setDireccion = function(direccion){
            this.direccion = direccion;
            return this;
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
        Tercero.prototype.setTipoDocumento = function(tipoDocumento) {
            this.tipoDocumento = tipoDocumento;
            return this;
        };

        Tercero.prototype.getTipoDocumento = function() {
            return this.tipoDocumento;
        };  
        
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
        
        Tercero.prototype.setNomenclaturaDescripcion1 = function(nomenclaturaDescripcion1) {
            this.nomenclaturaDescripcion1 = nomenclaturaDescripcion1;
            return this;
        };

        Tercero.prototype.getNomenclaturaDescripcion1 = function() {
            return this.nomenclaturaDescripcion1;
        }; 
        
        Tercero.prototype.setNomenclaturaDescripcion2 = function(nomenclaturaDescripcion2) {
            this.nomenclaturaDescripcion2 = nomenclaturaDescripcion2;
            return this;
        };

        Tercero.prototype.getNomenclaturaDescripcion2 = function() {
            return this.nomenclaturaDescripcion2;
        }; 
               
        Tercero.prototype.setNomenclaturaDireccion1 = function(nomenclaturaDireccion1) {
            this.nomenclaturaDireccion1 = nomenclaturaDireccion1;
            return this;
        };

        Tercero.prototype.getNomenclaturaDireccion1 = function() {
            return this.nomenclaturaDireccion1;
        }; 
        
        
        Tercero.prototype.setNomenclaturaDireccion2 = function(nomenclaturaDireccion2) {
            this.nomenclaturaDireccion2 = nomenclaturaDireccion2;
            return this;
        };

        Tercero.prototype.getNomenclaturaDireccion2 = function() {
            return this.nomenclaturaDireccion2;
        }; 
        
        Tercero.prototype.setNumeroPredio = function(numeroPredio) {
            this.numeroPredio = numeroPredio;
            return this;
        };

        Tercero.prototype.getNumeroPredio = function() {
            return this.numeroPredio;
        }; 
        
        Tercero.prototype.setBarrio = function(barrio) {
            this.barrio = barrio;
            return this;
        };

        Tercero.prototype.getBarrio = function() {
            return this.barrio;
        }; 
        
        Tercero.prototype.agregarTelefono = function(telefono){
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
        
        Tercero.prototype.agregarContacto = function(contacto){
            for(var i in this.contactos){
                var _contacto = this.contactos[i];
                
                
                if(_contacto.getId() === contacto.getId()){
                    _contacto.setNombre(contacto.getNombre()).
                    setTipoContacto(contacto.getTipoContacto()).
                    setTelefono(contacto.getTelefono()).
                    setEmail(contacto.getEmail()).
                    setDescripcion(contacto.getDescripcion());

                    return;
                }
                
                if(_contacto.getEmail().length > 0 && (contacto.getEmail() === _contacto.getEmail())){
                    
                    return;
                }

                if(_contacto.getTelefono().length > 0 && (_contacto.getTelefono() === contacto.getTelefono())){
                    
                    return;
                }
            }
            
            this.contactos.push(contacto);
            
        };
        
        Tercero.prototype.getContactos = function(){
            return this.contactos;
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