
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
                $scope.root.listarTiposFacturas = [
                    { descripcion: 'Factura Talonario', id: 213 },
                    { descripcion: 'Factura 2', id: 5871 },
                    { descripcion: 'Factura 3', id: 3125 }
                ];
                $scope.contador_checked = 0;
                $scope.seccion_1 = false;
                $scope.seccion_2 = false;
                $scope.boton = false;
                $scope.cuentas = [];
                callback();
            };
            
            $scope.prefijo_actualizado = function(prefijo){
                console.log('prefijo es:', prefijo);                
                if(prefijo != undefined && prefijo != '' && prefijo != ' '){
                    $scope.seccion_1 = true;
                    $scope.seccion_2 = true;
                    $scope.boton = true;
                    $scope.cuentas.prefijo = prefijo;
                }
            };     
                                    
            $scope.guardar_cuentas = function(){
                var obj = {
                    session: $scope.session,
                    data: $scope.cuentas
                };
                console.log('El objeto enviado es ',$scope.cuentas);                                
                
                //prefijo,
                //emrpesa_id,
                //centro_id,
                //bodega_id,
                //cuenta_debito,
                //cuenta_credito,
                //centro_costos_asientos,
                //centro_utiliad_asiento,
                //cod_linea_costo_asiento,
                //id_tercero_asiento,
                //observacion_asiento
                
                ServerServiceDoc.guardarCuentas(obj, function (data) {                    
                    if (data.status === 200) {
                        console.log('Ajax fine');
                        console.log("data",data.obj.listarTiposCuentas);
                        $scope.root.listarTiposCuentas=data.obj.listarTiposCuentas;
                    } else {
                        AlertService.mostrarVentanaAlerta("Error Mensaje del sistema: ", data.msj);
                    }
                });
                //console.log('Funcion del submit!!');
                console.log('Cuentas son: ',$scope.cuentas);
            };
            
            $scope.validarDebito=function(cuenta, checked, seccion, origen){      
                var categoria_id = cuenta.categoria_id;
                var categoria_string = 'categoria_'+categoria_id;
                var cuenta_id = cuenta.cuenta_id;                
                
                if(checked){
                    $scope.contador_checked++;
                    
                    if($scope.cuentas[categoria_string] === undefined){
                        $scope.cuentas[categoria_string] = [];
                    }                      
                    $scope.cuentas[categoria_string][origen] = cuenta_id;      
                                        
                    if(seccion === 'seccion_1'){                       
                       $scope.seccion_2 = false;
                    }else if(seccion === 'seccion_2'){
                       $scope.seccion_1 = false;
                    }                       
                }else{
                    $scope.contador_checked--;                     
                    $scope.cuentas[categoria_string][origen] = '';                                    
                    
                    if($scope.contador_checked === 0){
                        $scope.seccion_1 = true;
                        $scope.seccion_2 = true;
                    }
                }                                                  
                //console.log('Total cuentas: ',$scope.cuentas);
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
                                    cuentaId: $scope.cuantaId,
                                    cuentaCategoria: $scope.cuentaCategoriaId.selectedItem.categoria_id
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
            that.listarTiposFacturas = function(){
                var obj = {
                    session: $scope.session,
                    data: {
                        empresaId: Usuario.getUsuarioActual().getEmpresa().codigo
                    }
                };
                ServerServiceDoc.listarTiposFacturas(obj, function(data){
                    $scope.root.listarTiposFacturas = data.obj.listarTiposFacturas;
                    //console.log('Ajax init!! data: ', data.obj.listarTiposFacturas);
                });
            };
                        
            that.init(function () {
                that.listarPrefijos();
                that.listarTiposFacturas();
            });
        }]);
});