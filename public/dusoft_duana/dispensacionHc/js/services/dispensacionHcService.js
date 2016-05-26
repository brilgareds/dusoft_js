define(["angular", "js/services"], function(angular, services) {


    services.factory('dispensacionHcService', 
                    ['$rootScope', 'Request', 'API',
                     "Usuario","$modal","localStorageService",
                     "FormulaHc","PacienteHc","EpsAfiliadosHc","PlanesRangosHc","PlanesHc","TipoDocumentoHc","ProductosHc","LoteHc",
        function($rootScope, Request, API,
                 $modal, Usuario,localStorageService,
             FormulaHc,PacienteHc,EpsAfiliadosHc,PlanesRangosHc,PlanesHc,TipoDocumentoHc,ProductosHc,LoteHc) {

            var self = this;
            
           
                
            /*
             * @Author: Cristian Ardila
             * @fecha 05/02/2016
             * +Descripcion: consulta todas las empresas de acuerdo al texto
             *               ingresado
             */   
            self.listarEmpresas = function(session,termino_busqueda_empresa,callback) {
                   var obj = {
                       session: session,
                       data: {
                           listar_empresas: {
                               pagina: 1,
                               empresaName: termino_busqueda_empresa
                           }
                       }
                   };
                   Request.realizarRequest(API.VALIDACIONDESPACHOS.LISTAR_EMPRESAS, "POST", obj, function(data) {
                           
                           callback(data);                 
                   });
               };
               
               
              
             /**
              * @author Cristian Ardila
              * @fecha  21/05/2016
              * +Descripcion Consulta todas las formulas
              */
             self.listarFormulas = function(obj, callback){
                 
                 Request.realizarRequest(API.DISPENSACIONHC.LISTAR_FORMULAS,"POST", obj, function(data){
                      
                        callback(data);
                        
                 });
             };
              /**
               * @author Cristian Ardila
               * +Descripcion Funcion encargada de serializar los datos de la
               *              formula medica contra los modelos
               * @fecha 25/05/2016
               */
              self.renderListarFormulasMedicas = function(formulas, estadoFormula){
                    
                      var resultado = [];
                     
                          for (var i in formulas.listar_formulas) {
                            var _formula = formulas.listar_formulas[i];
                            //Se crea el objeto afiliados
                            var afiliados = EpsAfiliadosHc.get(_formula.tipo_id_paciente,_formula.paciente_id,_formula.plan_id)
                            //Se crea el objeto paciente
                            var paciente = PacienteHc.get(_formula.tipo_id_paciente,_formula.paciente_id,_formula.apellidos,_formula.nombres)
                            
                            //Se crea el objeto formula
                         if(estadoFormula === 1){
                           
                           var plan = PlanesHc.get(_formula.plan_id,_formula.plan_descripcion);
                           var planesAtencion  = PlanesRangosHc.get('','');
                               planesAtencion.agregarPlanes(plan);
                               paciente.setMedico(_formula.nombre);
                               paciente.setTipoBloqueoId(_formula.tipo_bloqueo_id);  
                               paciente.setBloqueo(_formula.bloqueo);  
                           var formula = FormulaHc.get(_formula.evolucion_id,_formula.numero_formula,_formula.tipo_formula, 
                                                      _formula.transcripcion_medica,
                                                     _formula.descripcion_tipo_formula,
                                                   _formula.fecha_registro,
                                                  _formula.fecha_finalizacion,
                                                _formula.fecha_formulacion);
                                                
                               formula.setEstado( _formula.sw_estado);
                                
                          }
                          
                          if(estadoFormula === 0){
                               paciente.setEdad(_formula.edad);
                               paciente.setResidenciaDireccion(_formula.residencia_direccion);
                               paciente.setResidenciaTelefono(_formula.residencia_telefono);
                               paciente.setSexo(_formula.sexo);  
                           var formula = FormulaHc.get(_formula.evolucion_id,_formula.numero_formula,'', '','', '', '','');                             
                           var Productos  = ProductosHc.get(_formula.codigo_medicamento,_formula.descripcion, _formula.cantidad);                               
                               formula.agregarProductos(Productos);           
                          }
                         //El paciente tiene su formula
                         paciente.agregarFormulas(formula);
                         
                         //debe ser afiliado el paciente
                         afiliados.agregarPacientes(paciente);
                         afiliados.agregarPlanAtencion(planesAtencion);
                         
                         //Se almacenan los afiliados
                         resultado.push(afiliados);
                        }
                        return resultado;
                 };
             
             /**
              * @author Cristian Ardila
              * @fecha  20/05/2016
              * +Descripcion Servicio que lista los tipos de documentos
              */
             self.listarTipoDocumentos = function(session, callback){
                 
                var obj = {
                     session: session,
                              data: {
                        listar_formulas:{
                           
                        }
                     }
                };
                
                Request.realizarRequest(API.DISPENSACIONHC.LISTAR_TIPO_DOCUMENTO,"POST", obj, function(data){
                      
                        callback(data);
                });
             };
             
             
             /**
              * @author Cristian Ardila
              * @fecha  21/05/2016
              * +Descripcion Consulta todas las formulas
              */
             self.listarFormulasPendientes = function(session, terminoBusqueda, callback){
               
                 var obj = {
                     session: session,
                     data: {
                           listar_formulas: {
                               pagina: 1,
                               empresaName: terminoBusqueda
                           }
                       }
                     
                 };
                 Request.realizarRequest(API.DISPENSACIONHC.LISTAR_FORMULAS_PENDIENTES,"POST", obj, function(data){
                     
                        callback(data);
                 });
             };
             
             
            /**
              * @author Cristian Ardila
              * @fecha  21/05/2016
              * +Descripcion Consulta todas las formulas
              */
             self.listarMedicamentosFormulados = function(obj,callback){
               
                 Request.realizarRequest(API.DISPENSACIONHC.LISTAR_MEDICAMENTOS_FORMULADOS,"POST", obj, function(data){
                       console.log("AAAAA ", data)
                        callback(data);
                 });
             };
             
             /**
               * @author Cristian Ardila
               * +Descripcion Funcion encargada de serializar los datos de los
               *              medicamentos formulados contra los modelos
               * @fecha 25/05/2016
               */
            self.renderListarMedicamentosFormulados = function(producto){
                
                var productos = [];
                for(var i in producto.listar_medicamentos_formulados){
                    
                    var _productos = producto.listar_medicamentos_formulados[i];
                    //console.log("_productos ", _productos)
                    var Productos  = ProductosHc.get(_productos.codigo_medicamento,_productos.descripcion_prod, _productos.cantidad);  
                        Productos.setPerioricidadEntrega(_productos.perioricidad_entrega);
                        Productos.setTiempoTotal(_productos.tiempo_total);
                        Productos.setPrincipioActivo(_productos.cod_principio_activo);
                        Productos.setCantidadEntrega(_productos.cantidad_entrega);
                    productos.push(Productos);
                }
                       
                  return productos;
            };
            
            
            /**
              * @author Cristian Ardila
              * @fecha  21/05/2016
              * +Descripcion Consulta todas las formulas
              */
             self.cantidadProductoTemporal = function(obj,callback){
               
                 Request.realizarRequest(API.DISPENSACIONHC.CANTIDAD_PRODUCTO_TEMPORAL,"POST", obj, function(data){

                        callback(data);
                 });
             };
            
            
             /**
              * @author Cristian Ardila
              * @fecha  21/05/2016
              * +Descripcion Consulta los lotes disponibles para el FOFO
              */
             self.existenciasBodegas = function(obj,callback){
               
                 Request.realizarRequest(API.DISPENSACIONHC.EXISTENCIAS_BODEGAS,"POST", obj, function(data){
                        
                        callback(data);
                 });
             };
            
           /**
               * @author Cristian Ardila
               * +Descripcion Funcion encargada de serializar los datos de los
               *              lotes formulados contra los modelos
               * @fecha 25/05/2016
               */
            self.renderListarLotes = function(lote){
                
              
                var lotes = [];
                for(var i in lote.existenciasBodegas){
                    
                    var _lote = lote.existenciasBodegas[i];
                    
                    var Lote  = LoteHc.get(_lote.lote,_lote.fecha_vencimiento, _lote.existencia_actual);  
                       /* Lote.setPerioricidadEntrega(_lote.perioricidad_entrega);
                        Lote.setTiempoTotal(_lote.tiempo_total);
                        Lote.setPrincipioActivo(_lote.cod_principio_activo);
                        Lote.setCantidadEntrega(_lote.cantidad_entrega);*/
                    lotes.push(Lote);
                }
                       
                  return lotes;
            };
            
             
                 return this;
        }]);
});



