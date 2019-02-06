
define(["angular", "js/controllers"
], function (angular, controllers) {
    controllers.controller('AsignacionCuentasController', [
        '$scope', '$rootScope', "Request",
        "$filter", '$state', '$modal',
        "API", "AlertService", 'localStorageService',
        "Usuario", "socket", "Empresa", "ServerServiceDoc",
        function ($scope, $rootScope, Request,
                $filter, $state, $modal,
                API, AlertService, localStorageService,
                Usuario, socket, Empresa, ServerServiceDoc) {

            var that = this;
            $scope.session = {
                usuario_id: Usuario.getUsuarioActual().getId(),
                auth_token: Usuario.getUsuarioActual().getToken()
            };
            $scope.credito_debito=false;
            $scope.debito_credito=false;
            that.init = function (callback) {
                $scope.root = {prefijo: {}};
                $scope.cuentas = [];
                $scope.cuentas.seccion_1 = [];
                $scope.cuentas.seccion_2 = [];
                $scope.contador_checked = 0;
                $scope.seccion_1 = false;
                $scope.seccion_2 = false;
                $scope.boton = false;
                callback();
            };
            

            $scope.prefijo_actualizado = function(prefijo){
                console.log('prefijo es:', prefijo);                
                if(prefijo != undefined && prefijo != '' && prefijo != ' '){
                    $scope.seccion_1 = true;
                    $scope.seccion_2 = true;
                    $scope.boton = true;
                }
            };
            
            $scope.validarDebito=function(cuenta, checked, otro){                
                //console.log('cuenta: ',cuenta);
                //console.log('checked es: ',checked);
                //console.log('otro es: ',otro);
                
                if(checked){
                    $scope.contador_checked++;     
                    
                    if(otro === 'seccion_1'){
                       $scope.cuentas.seccion_1.push(cuenta.cuenta_id);
                       $scope.seccion_2 = false;
                    }else if(otro === 'seccion_2'){
                       $scope.cuentas.seccion_2.push(cuenta.cuenta_id);
                       $scope.seccion_1 = false;
                    }                       
                }else{
                    $scope.contador_checked--;   
                    
                    if(otro === 'seccion_1'){
                        $scope.cuentas.seccion_1.splice($scope.cuentas.seccion_1.indexOf(cuenta.cuenta_id), 1);
                    }else if(otro === 'seccion_2'){
                        $scope.cuentas.seccion_1.splice($scope.cuentas.seccion_2.indexOf(cuenta.cuenta_id), 1);
                    }
                    
                    if($scope.contador_checked === 0){
                        $scope.seccion_1 = true;
                        $scope.seccion_2 = true;
                    }
                }                                                  
                console.log('Total cuentas: ',$scope.cuentas);
                //console.log('contador de checked: ', $scope.contador_checked);
                //console.log('seccion 1: ', $scope.seccion_1);
                //console.log('seccion 2: ', $scope.seccion_2);

            };

            that.listarPrefijos = function () {
                var obj = {
                    session: $scope.session,
                    data: {
                        empresaId: Usuario.getUsuarioActual().getEmpresa().codigo
                    }
                };
//                console.log("ServerService",ServerServiceDoc);
                ServerServiceDoc.listarPrefijos(obj, function (data) {
                    if (data.status === 200) {
                        $scope.root.listarPrefijo = data.obj.listarPrefijos;
                    } else {
                        AlertService.mostrarVentanaAlerta("Error Mensaje del sistema: ", data.msj);
                    }
                });
            };

            that.listarTipoCuentaCategoria = function (callback) {
                console.log("listarTipoCuentaCategoria");
                var obj = {
                    session: $scope.session
                };
                ServerServiceDoc.listarTipoCuentaCategoria(obj, function (data) {
                    if (data.status === 200) {
                        console.log("data", data.obj.listarTipoCuentaCategoria);
                        callback(data.obj.listarTipoCuentaCategoria);
                    } else {
                        AlertService.mostrarVentanaAlerta("Error Mensaje del sistema: ", data.msj);
                    }
                });
            };
            
            that.listarDocumentosCuentas = function () {
                console.log("listarDocumentosCuentas");
                var obj = {
                    session: $scope.session
                };
                ServerServiceDoc.listarDocumentosCuentas(obj, function (data) {
                    if (data.status === 200) {
                        console.log("data",data.obj);
                    } else {
                        AlertService.mostrarVentanaAlerta("Error Mensaje del sistema: ", data.msj);
                    }
                });
            };
            
            that.listarTiposCuentas = function () {
                console.log("listarTiposCuentas");
                var obj = {
                    session: $scope.session
                };
                ServerServiceDoc.listarTiposCuentas(obj, function (data) {
                    if (data.status === 200) {
                        console.log("data",data.obj.listarTiposCuentas);
                        $scope.root.listarTiposCuentas=data.obj.listarTiposCuentas;
                    } else {
                        AlertService.mostrarVentanaAlerta("Error Mensaje del sistema: ", data.msj);
                    }
                });
            };
            
            that.listarTiposCuentas();
            
           that.insertarTipoCuenta = function (obj) {
                var obj = {
                    session: $scope.session,
                    data:obj
                };
                ServerServiceDoc.insertarTipoCuenta(obj, function (data) {
                    if (data.status === 200) {
                       AlertService.mostrarVentanaAlerta("Mensaje del sistema: ", "Se Almacena Correctamente");
                    } else {
                        AlertService.mostrarVentanaAlerta("Error Mensaje del sistema: ", data.msj);
                    }
                });
            };
            
            $scope.validarCuenta=function(data,compara){
                if((data.cuenta_id+"").slice(0, 2)===compara){
                   return true; 
                }
              return false;  
            };

            $scope.crearCuenta = function () {
                that.modalCrearCuenta();
            };

            that.modalCrearCuenta = function () {

                $scope.opts = {
                    backdrop: true,
                    backdropClick: true,
                    dialogFade: false,
                    keyboard: true,
                    template: ' <div class="modal-header">\
                                           <button type="button" class="close" ng-click="close()">&times;</button>\
                                           <h4 class="modal-title">Crear Cuenta</h4>\
                                       </div>\
                                       <div class="modal-body">\
                                        <div class="row">\
                                          <div class="col-md-4">\
                                           <label>Cuenta No: </label>\
                                           <input ng-model="cuantaId" validacion-numero-entero type="text" class="form-control">\
                                          </div>\
                                          <div class="col-md-8">\
                                            <div class="form-group">\
                                                <label  class="col-form-label">Categoria Cuenta</label>\
                                                <ui-select ng-model="cuentaCategoriaId.selectedItem"\
                                                           theme="select2"\
                                                           class="form-control selectgeneral pull-left col-md-2">\
                                                    <ui-select-match  placeholder="Seleccionar Prefijo">{{ $select.selected.categoria_descripcion}}</ui-select-match>\
                                                    <ui-select-choices repeat="filtro in root.listarTipoCuentaCategoria | filter:$select.search">\
                                                        {{ filtro.categoria_descripcion}}\
                                                    </ui-select-choices>\
                                                </ui-select>\
                                            </div>\
                                          </div>\
                                        </div>\
                                       </div>\
                                       <div class="modal-footer">\
                                           <button class="btn btn-success" ng-click="guardar()">Aceptar</button>\
                                           <button class="btn btn-danger" ng-click="close()">Cancelar</button>\
                                       </div>',
                    scope: $scope,
                    controller: ["$scope", "$modalInstance", function ($scope, $modalInstance) {
                            $scope.cuentaCategoriaId={categoria_id:0,categoria_descripcion:"------"};
                            
                            that.listarTipoCuentaCategoria(function (data) {
                                $scope.root.listarTipoCuentaCategoria = data;
                            });


                            $scope.guardar = function () {                          
                               if($scope.cuentaCategoriaId.selectedItem.categoria_id===0 && $scope.cuantaId===undefined){
                                   return true;
                               }
                                var obj={
                                    cuentaId:$scope.cuantaId,
                                    cuentaCategoria:$scope.cuentaCategoriaId.selectedItem.categoria_id
                                };
                                that.insertarTipoCuenta(obj);
                                $modalInstance.close();
                            };

                            $scope.close = function () {
                                $modalInstance.close();
                            };
                        }]
                };
                var modalInstance = $modal.open($scope.opts);
            };


            that.init(function () {
                that.listarPrefijos();
            });
        }]);
});