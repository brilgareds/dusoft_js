define(["angular", "js/controllers", 'includes/slide/slideContent', "includes/classes/Empresa"], function(angular, controllers) {
    
    controllers.controller('FormulacionExternaPendientesController', ['$scope', '$rootScope', "Request", "$filter", '$state', '$modal', "API", "AlertService", 'localStorageService', "Usuario", "socket", "$timeout", "Empresa", "formulaExternaService", "Usuario", formulacionExternaPendientesController]);
    controllers.controller('ProductosController', ['$scope', '$rootScope', "Request", "$filter", '$state', '$modal', '$modalInstance',"API", "AlertService", 'localStorageService', "Usuario", "socket", "$timeout", "Empresa", "formulaExternaService", "Usuario", productosController]);
    controllers.controller('CambioCantidadPendienteController', ['$scope', '$rootScope', "Request", "$filter", '$state', '$modal', '$modalInstance',"API", "AlertService", 'localStorageService', "Usuario", "socket", "$timeout", "Empresa", "formulaExternaService", "Usuario", cambioCantidadController]);

    function formulacionExternaPendientesController($scope, $rootScope, Request, $filter, $state, $modal, API, AlertService, localStorageService, Usuario, socket, $timeout, Empresa, formulaExternaService, Usuario) {
        $scope.root = {
            medicamentosPendientes : [],
            medicamentosTemporales : []
        };

        $scope.volver = volver;
        $scope.eliminarProductoTemporal = eliminarProductoTemporal;
        $scope.abrirModalLotesMedicamentosFormulados = abrirModalLotesMedicamentosFormulados;
        $scope.abrirModalGenerarEntrega = abrirModalGenerarEntrega;
        $scope.imprimirMedicamentosPendientesDispensados = imprimirMedicamentosPendientesDispensados;
        $scope.abrirModalDescartarPendiente = abrirModalDescartarPendiente;
        $scope.abrirModalCambioCantidadPendiente = abrirModalCambioCantidadPendiente;
        $scope.abrirModalProductos = abrirModalProductos;

        $scope.listaPendientes = {
            data: 'root.medicamentosPendientes',
            enableColumnResize: true,
            enableRowSelection: false,
            enableCellSelection: true,
            enableHighlighting: true,
            columnDefs: [
                {
                  field: '#Codigo', 
                  width: "10%", 
                  displayName: '#Codigo', 
                  cellTemplate: '<div class="col-xs-16" style="padding-left:1em;"><p class="text-uppercase">{{row.entity.codigo_producto}}</p></div>'
                },
                {
                  displayName: 'Medicamento',
                  width: "60%",   
                  cellTemplate: '<div class="col-xs-16"><p class="text-lowercase" style="padding-left:1em;">{{row.entity.molecula}}</p> </div>'
                },   
                {
                  displayName: 'Cantidad',
                  width: "20%",   
                  cellTemplate: '<div class="col-xs-16 " style="padding-left:1em;"><p class="text-lowercase">{{row.entity.cantidad}}</p> </div>'
                },   
                {
                    displayName: "Opc", 
                    width:"10%", 
                    cellClass: "txt-center dropdown-button",
                    cellTemplate:'<div class="btn-group">\
                              <button class="btn btn-default btn-xs dropdown-toggle"  data-toggle="dropdown">Accion<span class="caret"></span></button>\
                              <ul class="dropdown-menu dropdown-options">\
                                <li>\n\
                                  <a href="javascript:void(0);" ng-click="abrirModalLotesMedicamentosFormulados(row.entity)" class="glyphicon glyphicon-tasks">&nbsp;Dispensar</a>\
                                </li>\
                                <li>\n\
                                  <a href="javascript:void(0);" ng-click="abrirModalDescartarPendiente(row.entity.esm_pendiente_dispensacion_id)" class="glyphicon glyphicon-minus">&nbsp;Descartar</a>\
                                </li>\
                                <li ng-if="sw_cambio_codigo_pendiente">\
                                  <a href="javascript:void(0);" ng-click="abrirModalProductos(row.entity)" class="glyphicon glyphicon-transfer">&nbsp;Cambiar</a>\
                                </li>\
                                <li>\
                                  <a href="javascript:void(0);" ng-click="abrirModalCambioCantidadPendiente(row.entity)" class="glyphicon glyphicon-wrench">&nbsp;Cantidad</a>\
                                </li>\
                              </ul>\
                            </div>'

                }
            ]
        };

        $scope.listaTemporales = {
            data: 'root.medicamentosTemporales',
            enableColumnResize: true,
            enableRowSelection: false,
            enableCellSelection: true,
            enableHighlighting: true,
            columnDefs: [
                {
                  field: '#Codigo', 
                  width: "10%", 
                  displayName: '#Codigo', 
                  cellTemplate: '<div class="col-xs-16" style="padding-left:1em;"><p class="text-uppercase">{{row.entity.codigo_producto}}</p></div>'
                },
                {
                  displayName: 'Medicamento',
                  width: "50%",   
                  cellTemplate: '<div class="col-xs-16"><p class="text-lowercase" style="padding-left:1em;">{{row.entity.molecula}}</p> </div>'
                },   
                {
                  displayName: 'Cantidad',
                  width: "10%",   
                  cellTemplate: '<div class="col-xs-16 " style="padding-left:1em;"><p class="text-lowercase">{{row.entity.cantidad_despachada}}</p> </div>'
                },
                {
                  displayName: 'Fecha vencimiento',
                  width: "10%",   
                  cellTemplate: '<div class="col-xs-16 " style="padding-left:1em;"><p class="text-lowercase">{{row.entity.fecha_vencimiento}}</p> </div>'
                },
                {
                  displayName: 'Lote',
                  width: "10%",   
                  cellTemplate: '<div class="col-xs-16 " style="padding-left:1em;"><p class="text-lowercase">{{row.entity.lote}}</p> </div>'
                },   
                {
                    displayName: "Opc", 
                    width:"10%", 
                    cellClass: "txt-center",
                    cellTemplate:'<div class="col-xs-12">\
                          <button type="submit" class="btn btn-danger" ng-click="eliminarProductoTemporal(row.entity.esm_dispen_tmp_id)" style="padding: 3px 7px;"><i class="glyphicon glyphicon-remove"></i></button>\
                    </div>'
                }
            ]
        };

        function imprimirMedicamentosPendientesDispensados(formula_id, imprimir_actual){
            formulaExternaService.imprimirMedicamentosPendientesDispensados(formula_id, imprimir_actual, function(error, resultado){
                $scope.visualizarReporte("/reports/" + resultado.listar_medicamentos_pendientes.nombre_pdf, resultado.listar_medicamentos_pendientes.nombre_pdf, "_blank");
            });
        }

        function eliminarProductoTemporal(esm_dispen_tmp_id){
            formulaExternaService.eliminarDispensacionMedicamentoTmp(esm_dispen_tmp_id, function(error, resultado){
                if(error){
                    AlertService.mostrarMensaje("warning", 'Ocurrio un error mientras se eliminaba el producto en temporal.');
                    return;
                }
                cargarGrillas($scope.root.formula.formula_id);
            });
        }

        function volver(){
            $state.go("FormulacionExterna");
            return;
        }

        function abrirModalLotesMedicamentosFormulados(producto){
            $scope.opts = {
                backdropClick: true,
                dialogFade: false,
                keyboard: true,
                windowClass: 'app-modal-window-xlg',
                templateUrl: 'views/formulacionExterna/modal/lotesMedicamentosFormulados.html',
                scope: $scope,
                controller: "ModalLotesMedicamentosFormuladosController"
            };

            //datos para compartir con el controlador del modal
            formulaExternaService.shared = {
                producto: producto,
                tipo_id_paciente: $scope.root.formula.tipo_id_paciente,
                paciente_id: $scope.root.formula.paciente_id,
                formula_id : $scope.root.formula.formula_id
            };

            var modalInstance = $modal.open($scope.opts);
            modalInstance.result.then(function(item){
                cargarGrillas($scope.root.formula.formula_id);
            },function(){
                cargarGrillas($scope.root.formula.formula_id);
            });
        } 


        function abrirModalDescartarPendiente(esm_pendiente_dispensacion_id){
            AlertService.mostrarVentanaAlerta("Confirmar",  "¿Desea descartar el pendiente?",
                function(estado){
                    if(estado){
                        formulaExternaService.inactivarPendiente(esm_pendiente_dispensacion_id, function(error, data){
                            if(error){
                                AlertService.mostrarMensaje("warning", 'Ocurrio un error mientras se descartaba el pendiente.');
                                return;
                            }

                            AlertService.mostrarMensaje("success", 'Medicamento pendiente descartado.');

                            formulaExternaService.listarMedicamentosPendientes($scope.root.formula.formula_id, function(error, medicamentosPendientes){
                                if(error){
                                    AlertService.mostrarMensaje("warning", 'Ocurrio un error mientras se recuperaban los medicamentos pendientes.');
                                    return;
                                }
                                $scope.root.medicamentosPendientes = medicamentosPendientes;
                                if($scope.root.medicamentosPendientes.length <= 0){
                                    AlertService.mostrarMensaje("success", 'No existen más medicamentos pendientes.');
                                    $scope.volver(); 
                                }
                            });  
                        });
                    } 
                }
            ); 
        } 
        
        function abrirModalProductos(medicamento){
            $scope.opts = {
                backdropClick: true,
                dialogFade: false,
                keyboard: true,
                windowClass: 'app-modal-window-xlg',
                templateUrl: 'views/formulacionExterna/modal/cambiarMedicamento.html',
                scope: $scope,
                controller: "ProductosController"
            };

            //datos para compartir con el controlador del modal
            formulaExternaService.shared = {
                medicamentoACambiar : medicamento,
                formula_id : $scope.root.formula.formula_id
            };

            var modalInstance = $modal.open($scope.opts);
            modalInstance.result.then(function(item){
                cargarGrillas($scope.root.formula.formula_id);
            },function(){
                cargarGrillas($scope.root.formula.formula_id);
            });
        }

        function abrirModalCambioCantidadPendiente(medicamento){
            $scope.opts = {
                backdropClick: true,
                dialogFade: false,
                keyboard: true,
                windowClass: 'app-modal-window-sm',
                templateUrl: 'views/formulacionExterna/modal/cambioCantidadPendiente.html',
                scope: $scope,
                controller: "CambioCantidadPendienteController"
            };

            //datos para compartir con el controlador del modal
            formulaExternaService.shared = {
                medicamento: medicamento,
                formula_id : $scope.root.formula.formula_id
            };

            var modalInstance = $modal.open($scope.opts);
            modalInstance.result.then(function(item){
                cargarGrillas($scope.root.formula.formula_id);
            },function(){
                cargarGrillas($scope.root.formula.formula_id);
            });
        
        }

        function abrirModalGenerarEntrega(){
            $scope.root.productosLotesSeleccionados = $scope.root.medicamentosTemporales;
            $scope.opts = {
                backdropClick: true,
                dialogFade: false,
                keyboard: true,
                windowClass: 'app-modal-window-sm',
                templateUrl: 'views/formulacionExterna/modal/dispensacionRealizarEntrega.html',
                scope: $scope,
                controller: "ModalGenerarEntregaController"
            };
            //datos para compartir con el controlador del modal
            /*formulaExternaService.shared = {
                tipoEntrega: tipoEntrega
            };*/

            var modalInstance = $modal.open($scope.opts);
            modalInstance.result.then(function(item){
                //cierra el modal
            },function(){
            });
        }

        function cargarGrillas(formula_id){
            formulaExternaService.listarMedicamentosPendientes(formula_id, function(error, medicamentosPendientes){
                if(error){
                    AlertService.mostrarMensaje("warning", 'Ocurrio un error mientras se recuperaban los medicamentos pendientes.');
                    return;
                }

                $scope.root.medicamentosPendientes = medicamentosPendientes;
            });

            formulaExternaService.obtenerDispensacionMedicamentosTmp(null, formula_id,  function(error, medicamentosLotesDispensacion){
                if(error){
                    AlertService.mostrarMensaje("warning", 'Ocurrio un error mientras se recuparaban los medicamentos en temporal.');
                    return;
                }

                $scope.root.medicamentosTemporales = medicamentosLotesDispensacion;
            });
        }


        function init(){


            //si no se han pasado los datos, se regresa a la pagina principal 
            if(!formulaExternaService.shared){
                $scope.volver();
                return;
            }

            $scope.empresa_id = Usuario.getUsuarioActual().getEmpresa().getCodigo();
            $scope.centro_utilidad = Usuario.getUsuarioActual().getEmpresa().getCentroUtilidadSeleccionado().getCodigo();
            $scope.bodega = Usuario.getUsuarioActual().getEmpresa().getCentroUtilidadSeleccionado().getBodegaSeleccionada().getCodigo();
            $scope.plan_id = formulaExternaService.shared.plan_id;

            formulaExternaService.usuarioPrivilegios($scope.empresa_id, $scope.centro_utilidad, $scope.bodega, function(error, privilegios){
                if(error){

                }
                $scope.sw_cambio_codigo_pendiente = privilegios.sw_cambio_codigo_pendiente;
            });
            //obtiene los datosprovenientes de la pagina principal data{formula_id, formula_papel, tipo_id_paciente, paciente_id, plan, nombre_paciente, fecha_formula}
            $scope.root.formula = formulaExternaService.shared;
            //Inicializa el service con los datos de session de usuario para poder realizar peticiones
            formulaExternaService.session = {
                usuario_id: Usuario.getUsuarioActual().getId(),
                auth_token: Usuario.getUsuarioActual().getToken()
            };

            //Se cargan los datos de las grillas
            cargarGrillas($scope.root.formula.formula_id);
        }

        init();
    }

    function productosController ($scope, $rootScope, Request, $filter, $state, $modal, $modalInstance, API, AlertService, localStorageService, Usuario, socket, $timeout, Empresa, formulaExternaService, Usuario) {
        $scope.buscarProductos = buscarProductos;
        $scope.cambiarCodigoMedicamento = cambiarCodigoMedicamento;
        $scope.medicamentoACambiar = {};
        $scope.cerrar = cerrar;
        //$scope.nuevoMedicamento = {};
        $scope.productos = [];
        $scope.root = {
            busquedaProductos : {
                pagina : 1
            }
        };

        function cambiarCodigoMedicamento(formula_id, esm_pendiente_dispensacion_id, codigo_cambiar, codigo_nuevo){
            AlertService.mostrarVentanaAlerta("Confirmar",  "¿Desea cambiar el medicamento?",
                function(estado){
                    if(estado){
                        formulaExternaService.cambiarCodigoPendiente(formula_id ,esm_pendiente_dispensacion_id, codigo_cambiar, codigo_nuevo, function(error, data){
                            if(error){
                                AlertService.mostrarMensaje("warning", 'Ocurrio un error mientras se realizaba el cambio.');
                                return;
                            }

                            AlertService.mostrarMensaje("success", 'Medicamento cambiado.');
                            $modalInstance.close();
                        });
                    } 
                }
            );
        }

        function cerrar(){
            $modalInstance.close();
        }

        function buscarProductos(pagina){
            formulaExternaService.buscarProductosPorPrincipioActivo($scope.empresa_id, $scope.centro_utilidad, $scope.bodega, $scope.medicamentoACambiar.principio_activo, pagina, function(error, productos){
                if(!error){
                    $scope.productos = productos;
                }
            });
        }

        function init(){
            $scope.medicamentoACambiar = formulaExternaService.shared.medicamentoACambiar;
            $scope.formula_id = formulaExternaService.shared.formula_id;

            buscarProductos(1);

            //inicializa grilla
            $scope.lista_productos = {
                data: 'productos',
                enableColumnResize: true,
                enableRowSelection: false,
                columnDefs: [
                    {field: 'codigo_producto', displayName: 'Codigo producto', width: "10%"},
                    {field: 'descripcion', displayName: 'Descripcion', width : '30%'},
                    {field: 'existencia', displayName: 'Existencia', width: "10%", cellClass: "txt-center"},
                    {field: 'molecula', displayName: 'Molecula', width: "40%"},
                    {field: 'opciones', displayName : 'Opciones', width : '10%' , cellClass: "txt-center", cellTemplate : '<div class="col-xs-12"><button type="submit" class="btn btn-success" ng-click="cambiarCodigoMedicamento(formula_id, medicamentoACambiar.esm_pendiente_dispensacion_id, medicamentoACambiar.codigo_producto, row.entity.codigo_producto)" style="padding: 3px 7px;"><i class="glyphicon glyphicon-transfer"></i></button></div>'}
                ]
            };
        }
        init();
    }
    //cambioCantidadController
    function cambioCantidadController($scope, $rootScope, Request, $filter, $state, $modal, $modalInstance, API, AlertService, localStorageService, Usuario, socket, $timeout, Empresa, formulaExternaService, Usuario) {

       $scope.cerrar = cerrar;
       $scope.guardarNuevaCantidadPendiente = guardarNuevaCantidadPendiente;

       function cerrar(){
            $modalInstance.close();
       }

       function guardarNuevaCantidadPendiente(esm_pendiente_dispensacion_id, cantidad){
            var cantidad = parseInt(cantidad);
            console.log(cantidad);
            if(cantidad == 0){
                AlertService.mostrarMensaje("warning", 'Digite una cantidad mayor a cero');
                return;
            }

            formulaExternaService.guardarNuevaCantidadPendiente(esm_pendiente_dispensacion_id, cantidad, function(error, resultado){
                if(error) {
                    AlertService.mostrarMensaje("warning", 'Ocurrió un error mientras se modificaba la cantidad, intente de nuevo.');
                    return;
                }

                $modalInstance.close();
            });
       }


       function init(){
            $scope.cantidad = 0;
            $scope.medicamento = formulaExternaService.shared.medicamento;
       }

       init();
    }
});