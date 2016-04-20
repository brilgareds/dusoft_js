//Controlador de la View verpedidosfarmacias.html

define(["angular",
    "js/controllers",
    'includes/Constants/Url', 'includes/classes/Lote'], function(angular, controllers) {

    controllers.controller('TrasladoExistenciasController', [
        '$scope', '$rootScope', 'Request',
        'Empresa', 'CentroUtilidad', 'Bodega',
        'API', "socket", "AlertService",
        '$state', "Usuario", "localStorageService", "$modal", "$modalInstance", 'URL','Lote',
        'producto', 'centroUtilidad', 'bodega', 'empresaId','$filter',
        function($scope, $rootScope, Request,
                Empresa, CentroUtilidad, Bodega,
                API, socket, AlertService, $state, Usuario,
                localStorageService, $modal, $modalInstance, URL, Lote, producto, centroUtilidad,
                bodega, empresaId,  $filter) {

            var self = this;
            var fechaActual = new Date();
            console.log(" producto ", producto, " centroUtilidad ", centroUtilidad, " bodega ", bodega, " empresaId ", empresaId);
            
            /*
             * @Author: Eduar
             * +Descripcion: Definicion del objeto que contiene los parametros del controlador
             */
            $scope.rootExistencias = {
                loteNuevo: Lote.get(),
                fechaLote : $filter('date')(new Date("01/01/"  + fechaActual.getFullYear()), "yyyy-MM-dd"),
                minFecha : $filter('date')(new Date("01/01/"  + fechaActual.getFullYear()), "yyyy-MM-dd"),
                abrirFecha : false,
                lotes : [],
                cantidadLotes: 0,
                session: {
                    usuario_id: Usuario.getUsuarioActual().getId(),
                    auth_token: Usuario.getUsuarioActual().getToken()
                },
                producto:producto
            };
            
            
            $scope.rootExistencias.listadoExistencias = {
                data: 'rootExistencias.lotes',
                enableColumnResize: true,
                enableRowSelection: false,
                showFilter: true,
                enableHighlighting:true,
                size:'sm',
                columnDefs: [
                    {field: 'codigo_lote', displayName: 'Lote', cellClass: "txt-center"},
                    {field: 'cantidad', displayName: 'Cantidad'},
                    {field: 'fecha_vencimiento', displayName: 'Fecha Vencimiento'},
                    {field: 'cantidadNueva', displayName: 'Nueva Cantidad', 
                        cellTemplate: ' <div class="col-xs-12">\
                                            <input  type="text" ng-model="row.entity.cantidadNueva" validacion-numero-entero class="form-control grid-inline-input" />\
                                        </div>'
                    }

                ]

            };
            
            /*
             * @Author: Eduar
             * @param {object} $event
             * +Descripcion: Handler del boton del calendario
             */
            $scope.abrirFecha = function($event){
                $event.preventDefault();
                $event.stopPropagation();
                $scope.rootExistencias.abrirFecha = true;
                console.log("abrir fecha ", $scope.rootExistencias.abrirFecha);
            };
            
            /*
             * @Author: Eduar
             * @param {function} callback
             * +Descripcion: Permite traer del API los lotes del productos
             */
            self.traerExistencias = function(callback) {

                $scope.rootExistencias.lotes = [];
                $scope.rootExistencias.cantidadLotes = 0;

                var obj = {
                    session: $scope.rootExistencias.session,
                    data: {
                        productos:{
                            empresa_id:empresaId,
                            codigo_producto:producto.getCodigoProducto(),
                            centro_utilidad_id :centroUtilidad,
                            bodega_id : bodega 
                        }
                    }
                };
                Request.realizarRequest(URL.CONSTANTS.API.PRODUCTOS.CONSULTAR_EXISTENCIAS, "POST", obj, function(data) {
                    var valido = false;
                    if (data.status === 200) {
                        for (var i in data.obj.existencias) {
                            var empresa = Lote.get(
                                    data.obj.existencias[i].lote,
                                    data.obj.existencias[i].fecha_vencimiento,
                                    data.obj.existencias[i].existencia_actual
                            );

                            $scope.rootExistencias.lotes.push(empresa);
                            $scope.rootExistencias.cantidadLotes += parseInt(data.obj.existencias[i].existencia_actual);
                        }
                        
                        valido = true;
                    }
                    
                    if (callback)
                         callback(valido);

                });

            };
            
            /*
             * @Author: Eduar
             * @param {function} callback
             * +Descripcion: Permite crear un lote nuevo para el producto
             */
            self.guardarExistenciasBodega = function(callback){
                var obj = {
                    session: $scope.rootExistencias.session,
                    data: {
                        productos:{
                            empresa_id:empresaId,
                            codigo_producto:producto.getCodigoProducto(),
                            centro_utilidad_id :centroUtilidad,
                            bodega_id : bodega,
                            codigo_lote: $scope.rootExistencias.loteNuevo.getCodigo(),
                            fecha_vencimiento: $filter('date')($scope.rootExistencias.loteNuevo.getFechaVencimiento(), "yyyy-MM-dd")
                        }
                    }
                };
                Request.realizarRequest(URL.CONSTANTS.API.PRODUCTOS.GUARDAR_EXISTENCIA_BODEGA, "POST", obj, function(data) {
                    if (data.status === 200) {
                       self.traerExistencias();
                        
                    } else {
                        var msj = "Ha ocurrido un error guardando el lote";
                        if(data.status === 403){    
                            msj = data.msj;
                        }
                        AlertService.mostrarVentanaAlerta("Mensaje del sistema", msj);
                    }

                });
            };
            
            /*
             * @Author: Eduar
             * @param {function} callback
             * +Descripcion: Permite guardar los cambios de los lotes modificados en el grid
             */
            self.actualizarExistenciasProducto = function(callback){
                var lotes = $scope.rootExistencias.lotes;

                var obj = {
                    session: $scope.rootExistencias.session,
                    data: {
                        productos:{
                            empresa_id:empresaId,
                            codigo_producto:producto.getCodigoProducto(),
                            centro_utilidad_id :centroUtilidad,
                            bodega_id : bodega,
                            existencias : lotes
                        }
                    }
                };
                Request.realizarRequest(URL.CONSTANTS.API.PRODUCTOS.ACTUALIZAR_EXISTENCIAS, "POST", obj, function(data) {
                    if (data.status !== 200)  {
                        AlertService.mostrarVentanaAlerta("Mensaje del sistema", data.msj);
                    } else {
                        //$scope.onCerrar();
                        AlertService.mostrarVentanaAlerta("Mensaje del sistema", "Se actualizaron las existencias correctamente");
                        self.traerExistencias();
                    }                   

                });
                
                
            };
            
            /*
             * @Author: Eduar
             * +Descripcion: Libera recursos del watch de angular
             */
            self.finalizar = function(){
               console.log("finalizando ventana");
               $scope.rootExistencias = {};
               $scope.$$watchers = null;
            };
            
            /*
             * @Author: Eduar
             * +Descripcion: Handler del boton de cerrar y cancelar
             */
            $scope.onCerrar = function(){
                $modalInstance.close();
            };
            
            /*
             * @Author: Eduar
             * +Descripcion: Handler del boton para crear un lote
             */
            $scope.onGuardarExistenciaBodega = function(){
                var lote = $scope.rootExistencias.loteNuevo;
                if(!lote.getFechaVencimiento() || !lote.getCodigo() || lote.getCodigo().length === 0){
                    AlertService.mostrarVentanaAlerta("Mensaje del sistema", "La fecha de vencimiento y el código son requeridos");
                    return;
                }
                self.guardarExistenciasBodega(function(){
                    
                });
            };
            
            /*
             * @Author: Eduar
             * +Descripcion: Handler del boton de actualizar las existencias del grid
             */
            $scope.onActualizarExistenciasProducto = function(){
                AlertService.mostrarVentanaAlerta("Mensaje del sistema", "Seguro que desea modificar las existencias el producto", function(confirmar){
                    if(confirmar){
                        self.actualizarExistenciasProducto(function(){
                            
                        });
                    }
                });
            };
            
            /*
             * @Author: Eduar
             * +Descripcion: Listeners de la ventana al abrir y cerrar
             */
            $modalInstance.opened.then(function() {
                            
                self.traerExistencias(function(valido){
                    if(valido){

                    } else {
                        AlertService.mostrarVentanaAlerta("Mensaje del sistema", "Ha ocurrido un error consultando las existencias");
                    }
                });

            });
            

            $modalInstance.result.then(function() {
               self.finalizar();
            }, function() {
                self.finalizar();
            });

        }]);

});
