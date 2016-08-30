define(["angular", "js/services"], function(angular, services) {


    services.factory('dispensacionHcService', 
                    ['$rootScope', 'Request', 'API',
                     "Usuario","$modal","localStorageService",
                     "FormulaHc","PacienteHc","EpsAfiliadosHc","PlanesRangosHc","PlanesHc","TipoDocumentoHc","ProductosFOFO","LoteHc","ProductosHc","TipoDocumentoHc",
        function($rootScope, Request, API,
                $modal,Usuario,localStorageService,
                FormulaHc,PacienteHc,EpsAfiliadosHc,PlanesRangosHc,PlanesHc,TipoDocumentoHc,ProductosFOFO,LoteHc,ProductosHc,TipoDocumentoHc) {

            var self = this;
            
           
                
           
              
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
              * @fecha  20/05/2016
              * +Descripcion Servicio que lista los tipos de documentos
              */
            self.listarTipoDocumentos = function(obj, callback){
              
                Request.realizarRequest(API.DISPENSACIONHC.LISTAR_TIPO_DOCUMENTO,"POST", obj, function(data){
                    
                        callback(data);
                });
            };
             
             
            /**
              * @author Cristian Ardila
              * @fecha  20/05/2016
              * +Descripcion Servicio que lista los tipos de documentos
              */
            self.listarTipoFormula = function(obj, callback){
              
                Request.realizarRequest(API.DISPENSACIONHC.LISTAR_TIPO_FORMULA,"POST", obj, function(data){
                    
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
                   callback(data);
                });
            };
            
            /**
              * @author Cristian Ardila
              * @fecha  21/05/2016
              * +Descripcion Consulta todas las formulas
              */
            self.consultarMedicamentosDespachados = function(obj,callback){
               
                Request.realizarRequest(API.DISPENSACIONHC.CONSULTAR_MEDICAMENTOS_DESPACHADOS,"POST", obj, function(data){
                   callback(data);
                });
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
              * @fecha  07/06/2016
              * +Descripcion Consulta los lotes disponibles para el FOFO
              */
            self.temporalLotes = function(obj,callback){
               
                Request.realizarRequest(API.DISPENSACIONHC.TEMPORAL_LOTES,"POST", obj, function(data){
                    callback(data);
                });
            };
            
            /**
              * @author Cristian Ardila
              * @fecha  07/06/2016
              * +Descripcion Consulta los medicamentos separados que se encuentran
              *              en las tablas de temporales
              */
            self.medicamentosTemporales = function(obj,callback){
               
                Request.realizarRequest(API.DISPENSACIONHC.LISTAR_MEDICAMENTOS_TEMPORALES,"POST", obj, function(data){                       
                   callback(data);
                });
            };
            
            /**
              * @author Cristian Ardila
              * @fecha  07/06/2016
              * +Descripcion Consulta los medicamentos separados que se encuentran
              *              en las tablas de temporales
              */
            self.eliminarMedicamentosTemporales = function(obj,callback){
               
                Request.realizarRequest(API.DISPENSACIONHC.ELIMINAR_MEDICAMENTOS_TEMPORALES,"POST", obj, function(data){     
                    callback(data);
                });
            };
            
            
            
           /**
              * @author Cristian Ardila
              * @fecha  07/06/2016
              * +Descripcion Servicio encargado de realizar la dispensacion de
              *              los medicamentos
              */
            self.realizarEntregaFormula = function(obj,callback){
               
                Request.realizarRequest(API.DISPENSACIONHC.REALIZAR_ENTREGA_FORMULA,"POST", obj, function(data){     
                    callback(data);
                });
            };
            
            /**
              * @author Cristian Ardila
              * @fecha  07/06/2016
              * +Descripcion Servicio encargado de realizar la dispensacion de
              *              los medicamentos pendientes
              */
            self.realizarEntregaFormulaPendientes = function(obj,callback){
               
                Request.realizarRequest(API.DISPENSACIONHC.REALIZAR_ENTREGA_FORMULA_PENDIENTES,"POST", obj, function(data){     
                    callback(data);
                });
            };
            
            /**
              * @author Cristian Ardila
              * @fecha  07/06/2016
              * +Descripcion Servicio encargado de obtener los medicamentos que
              *              quedaron pendientes por dispensar en la entrega
              */
            self.listarMedicamentosFormuladosPendientes = function(obj,callback){
               
                Request.realizarRequest(API.DISPENSACIONHC.LISTAR_MEDICAMENTOS_FORMULADOS_PENDIENTES,"POST", obj, function(data){     
                    callback(data);
                });
            };
            
            /**
              * @author Cristian Ardila
              * @fecha  07/06/2016
              * +Descripcion Servicio encargado de obtener los medicamentos que
              *              quedaron pendientes por dispensar para visualizarlos en 
              *              en reporte
              */
            self.listarMedicamentosPendientesPorDispensar = function(obj,callback){
               
                Request.realizarRequest(API.DISPENSACIONHC.LISTAR_MEDICAMENTOS_PENDIENTES_POR_DISPENSAR,"POST", obj, function(data){     
                    callback(data);
                });
            };
            
            /**
              * @author Cristian Ardila
              * @fecha  07/06/2016
              * +Descripcion Servicio encargado de obtener los medicamentos
              *              dispensados
              */
            self.listarMedicamentosDispensados = function(obj,callback){
               
                Request.realizarRequest(API.DISPENSACIONHC.LISTAR_MEDICAMENTOS_DISPENSADOS,"POST", obj, function(data){     
                    callback(data);
                });
            };
            
            /**
              * @author Cristian Ardila
              * @fecha  27/07/2016
              * +Descripcion Servicio encargado de consultar los privilegios de
              *              dispensacion del usuario de la session
              */
            self.usuarioPrivilegios = function(obj,callback){
               
                Request.realizarRequest(API.DISPENSACIONHC.USUARIO_PRIVILEGIOS,"POST", obj, function(data){     
                    callback(data);
                });
            };
            
            /**
              * @author Cristian Ardila
              * @fecha  07/06/2016
              * +Descripcion Servicio encargado autorizar la dispensacion de un
              *              medicamento
              */
            self.autorizarDispensacionMedicamento = function(obj,callback){
               
                Request.realizarRequest(API.DISPENSACIONHC.AUTORIZAR_DISPENSACION_MEDICAMENTO,"POST", obj, function(data){     
                    callback(data);
                });
            };
            
            
            /**
              * @author Cristian Ardila
              * @fecha  07/06/2016
              * +Descripcion Servicio encargado de registrar la eventualidad
              *              del paciente para dispensarle los productos pendientes
              */
            self.registrarEvento = function(obj,callback){
               
                Request.realizarRequest(API.DISPENSACIONHC.REGISTRAR_EVENTO,"POST", obj, function(data){     
                    callback(data);
                });
            };
            
            
            /**
              * @author Cristian Ardila
              * @fecha  07/06/2016
              * +Descripcion Servicio encargado de guardar los medicamentos
              *              como todo pendiente
              */
            self.guardarTodoPendiente = function(obj,callback){
               
                Request.realizarRequest(API.DISPENSACIONHC.GUARDAR_TODO_PENDIENTES,"POST", obj, function(data){     
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
                     
                for(var i in formulas.listar_formulas) {
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
                            formula.setEstadoEntrega( _formula.estado_entrega);
                                
                    }
                          
                    if(estadoFormula === 0){
                            paciente.setEdad(_formula.edad);
                            paciente.setResidenciaDireccion(_formula.residencia_direccion);
                            paciente.setResidenciaTelefono(_formula.residencia_telefono);
                            paciente.setSexo(_formula.sexo);  
                        var formula = FormulaHc.get(_formula.evolucion_id,_formula.numero_formula,'', '','', '', '','');   
                        formula.setEstadoEntrega( _formula.estado_entrega);
                        var Productos  = ProductosFOFO.get(_formula.codigo_medicamento,_formula.descripcion, _formula.cantidad);                               
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
               * +Descripcion Funcion encargada de serializar los datos de los
               *              medicamentos formulados contra los modelos
               * @fecha 25/05/2016
               */
            self.renderListarMedicamentosFormulados = function(producto, pendiente){
               
                var productos = [];
                for(var i in producto){
                    
                    var _productos = producto[i];
                   // console.log("_productos ", _productos)
                    var Productos  = ProductosFOFO.get(_productos.codigo_medicamento,_productos.descripcion_prod, _productos.cantidad);  
                        Productos.setPerioricidadEntrega(_productos.perioricidad_entrega);
                        Productos.setTiempoTotal(_productos.tiempo_total);
                        Productos.setPrincipioActivo(_productos.cod_principio_activo);
                        Productos.setCantidadEntrega(_productos.cantidad_entrega);
                        Productos.setAutorizado(_productos.sw_autorizado);
                        
                        Productos.setCodigoFormaFarmacologica(_productos.cod_forma_farmacologica);
                        
                    productos.push(Productos);
                }
                     
                  return productos;
            };
             /**
               * @author Cristian Ardila
               * +Descripcion Funcion encargada de serializar los datos de los
               *              lotes formulados contra los modelos
               * @fecha 25/05/2016
               */
            self.renderListarProductosLotes = function(productoLote){
                   
                var lotes = [];
                for(var i in productoLote.existenciasBodegas){
                    
                    var _lote = productoLote.existenciasBodegas[i];
                   
                    var Lote  = LoteHc.get(_lote.lote,_lote.fecha_vencimiento, _lote.existencia_actual);  
                    var Producto = ProductosHc.get(_lote.codigo_producto,_lote.producto, 0);  
                        Producto.setConcentracion(_lote.concentracion);
                        Producto.setMolecula(_lote.molecula);
                        Producto.setCodigoFormaFarmacologico(_lote.forma_farmacologica);
                        Producto.setLaboratorio(_lote.laboratorio);
                        Producto.setPrincipioActivo(_lote.cod_principio_activo);
                        Producto.agregarLotes(Lote);
                       
                       
                    lotes.push(Producto);
                }
                     
                  return lotes;
            };
            
            /**
               * @author Cristian Ardila
               * +Descripcion Funcion encargada de serializar los datos de los
               *              lotes formulados contra los modelos
               * @fecha 08/06/2016 (DD-MM-YYYY)
               */
            self.renderMedicamentosTemporales = function(productoLote){
                
                var lotes = [];
                for(var i in productoLote){
                    
                    var _lote = productoLote[i];                   
                    var Lote  = LoteHc.get(_lote.lote,_lote.fecha_vencimiento, _lote.cantidad_despachada);  
                    var Producto = ProductosHc.get(_lote.codigo_producto,_lote.descripcion_prod, 0);  
                        Producto.setSerialId(_lote.hc_dispen_tmp_id)
                        Producto.agregarLotes(Lote);                       
                        lotes.push(Producto);
                }                        
                return lotes;
            };
            
            /**
               * @author Cristian Ardila
               * +Descripcion Funcion encargada de serializar el resultado de la
               *              consulta que ontiene los tipos de documentos
               * @fecha 08/06/2016 (DD-MM-YYYY)
               */
            self.renderListarTipoDocumento = function(tipoDocumento){
                
                var tipoDocumentos = [];                
                for(var i in tipoDocumento){                
                     var _tipoDocumento = TipoDocumentoHc.get(tipoDocumento[i].id, tipoDocumento[i].descripcion);
                     tipoDocumentos.push(_tipoDocumento);
                }                  
                return tipoDocumentos;
            };
            
        return this;
    }]);
         
});



