define(["angular", "js/models", "includes/classes/Empresa"], function(angular, models) {

    models.factory('EmpresaPlanillaDespacho', ["Empresa", "$filter", function(Empresa, $filter) {

            var EmpresaPlanillaDespacho = Object.create(Empresa.getClass().prototype)

            EmpresaPlanillaDespacho.transportadoras = [];
            EmpresaPlanillaDespacho.ciudades = [];
            EmpresaPlanillaDespacho.planillas = [];
            EmpresaPlanillaDespacho.clientes = [];
            EmpresaPlanillaDespacho.farmacias = [];
            EmpresaPlanillaDespacho.lista_empresas = [];
            EmpresaPlanillaDespacho.lista_documentos = [];

            // Transportadoras
            EmpresaPlanillaDespacho.set_transportadoras = function(transportadora) {
                this.transportadoras.push(transportadora);
            };

            EmpresaPlanillaDespacho.get_transportadoras = function() {
                return this.transportadoras;
            };

            EmpresaPlanillaDespacho.limpiar_transportadoras = function() {
                this.transportadoras = [];
            };

            // Ciudades
            EmpresaPlanillaDespacho.set_ciudades = function(ciudad) {
                this.ciudades.push(ciudad);
            };

            EmpresaPlanillaDespacho.get_ciudades = function() {
                return this.ciudades;
            };

            EmpresaPlanillaDespacho.limpiar_ciudades = function() {
                this.ciudades = [];
            };

            //Planillas
            EmpresaPlanillaDespacho.set_planillas = function(planilla) {
                this.planillas.push(planilla);
            };

            EmpresaPlanillaDespacho.get_planillas = function() {
                return this.planillas;
            };

            EmpresaPlanillaDespacho.limpiar_planillas = function() {
                this.planillas = [];
            };

            // Clientes
            EmpresaPlanillaDespacho.set_clientes = function(cliente) {
                this.clientes.push(cliente);
            };

            EmpresaPlanillaDespacho.get_clientes = function() {
                return this.clientes;
            };

            EmpresaPlanillaDespacho.limpiar_clientes = function() {
                this.clientes = [];
            };

            // Farmacias
            EmpresaPlanillaDespacho.set_farmacias = function(farmacia) {
                this.farmacias.push(farmacia);
            };

            EmpresaPlanillaDespacho.get_farmacias = function() {
                return this.farmacias;
            };

            EmpresaPlanillaDespacho.limpiar_farmacias = function() {
                this.farmacias = [];
            };


            // Empresas
            EmpresaPlanillaDespacho.set_empresas = function(empresa) {
                this.lista_empresas.push(empresa);
            };

            EmpresaPlanillaDespacho.get_empresas = function() {
                return this.lista_empresas;
            };

            EmpresaPlanillaDespacho.limpiar_empresas = function() {
                this.lista_empresas = [];
            };

            //LISTA DOCUMENTOS

            EmpresaPlanillaDespacho.set_lista_documentos = function(documentos) {
                this.lista_documentos.push(documentos);
            };

            EmpresaPlanillaDespacho.get_lista_documentos = function() {
                return this.lista_documentos;
            };

            EmpresaPlanillaDespacho.limpiar_lista_documentos = function() {
                this.lista_documentos = [];
            }; 
            
            EmpresaPlanillaDespacho.eliminarDocumento = function(documento){
               var index = this.lista_documentos.indexOf(documento);
               this.lista_documentos.splice(index,1);
            };
            
            EmpresaPlanillaDespacho.obtenerEmpresasFiltradasCodigo = function(codigoEmpresa){
                
             
                var empresas = [];
                
                for(var i in this.lista_empresas){
                   var empresa = this.lista_empresas[i]; 
                   if(codigoEmpresa !== empresa.getCodigo()){
                       empresas.push(empresa);
                   }
                }
                
                return empresas;
            };
            
             /**
              * +Descripcion: metodo para obtener la empresa y visualizarla en 
              * el modelo del dropdown Empresas de la siguiente forma 
              * scope.planilla.set_empresa(Empresa.obtenerEmpresaPorCodigo(datos.id_empresa_destino))
              * @param {type} codigoEmpresa
              * @returns {_L1._L3.EmpresaPlanillaDespacho.obtenerEmpresaPorCodigo.empresa}
              */
             EmpresaPlanillaDespacho.obtenerEmpresaPorCodigo = function(codigoEmpresa){
                
             
                for(var i in this.lista_empresas){
                    
                   var empresa = this.lista_empresas[i]; 
                 
                   if(codigoEmpresa === empresa.getCodigo()){
                      
                       return empresa;
                       
                   }
                }
                
               
            };
            
            return EmpresaPlanillaDespacho;
        }]);
});