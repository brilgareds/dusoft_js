
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
                $scope.root.listarTiposServicios = [];
                $scope.contador_checked = 0;
                $scope.seccion_1 = false;
                $scope.seccion_2 = false;
                $scope.servicios = false;
                $scope.boton = false;
                $scope.tipos_categorias = ['debito', 'credito'];
                $scope.root.listarTiposCuentas = {};
                $scope.documentosCuentas = {
                    empresa_id: Usuario.getUsuarioActual().getEmpresa().codigo,
                    centro_id: Usuario.getUsuarioActual().getEmpresa().centroUtilidad.codigo,
                    bodega_id:  Usuario.getUsuarioActual().getEmpresa().centroUtilidad.bodega.codigo,
                    prefijo_id: '',
                    servicio: '',
                    cuentas: [],
                    categorias: {}
                };
                callback();
            };
            
            $scope.prefijo_actualizado = function(prefijo){
                console.log('prefijo es:', prefijo);                
                if(prefijo != undefined && prefijo != '' && prefijo != ' '){
                    $scope.servicios = true;
                    $scope.documentosCuentas.categorias = {};
                    $scope.root.listarTiposCuentas = '';
                    $scope.root.listarTiposServicios2 = '';
                    $scope.documentosCuentas.prefijo_id = prefijo;
                    that.listarTiposServicios(prefijo);
                }
            };

            $scope.servicio_actualizado = function(servicio){
                console.log('Servicio es: ', servicio);
                if(servicio != undefined && servicio != '' && servicio != ' '){
                    $scope.seccion_1 = true;
                    $scope.seccion_2 = true;
                    $scope.boton = true;
                    $scope.documentosCuentas.servicio = servicio;
                    that.listarTiposCuentas();
                }
            };
                                    
            $scope.guardar_cuentas = function(){
                //var respuestaUsuario = confirm('¿Esta seguro de actualizar los valores de esas cuentas?');
                var cuentas_actualizadas = JSON.parse(JSON.stringify($scope.documentosCuentas));
                for(categoria in cuentas_actualizadas.categorias){
                    if(cuentas_actualizadas.categorias[categoria].debito !== undefined
                        && (cuentas_actualizadas.categorias[categoria].debito.check === undefined || !cuentas_actualizadas.categorias[categoria].debito.check)){
                        delete cuentas_actualizadas.categorias[categoria].debito;
                    }
                    if(cuentas_actualizadas.categorias[categoria].credito !== undefined
                        && (cuentas_actualizadas.categorias[categoria].credito.check === undefined || !cuentas_actualizadas.categorias[categoria].credito.check)){
                        delete cuentas_actualizadas.categorias[categoria].credito;
                    }

                    if(cuentas_actualizadas.categorias[categoria].debito === undefined
                        && cuentas_actualizadas.categorias[categoria].credito === undefined){
                        delete cuentas_actualizadas.categorias[categoria];
                    }
                }
                var obj = {
                    session: $scope.session,
                    data: cuentas_actualizadas
                };
                console.log('El objeto enviado es ', obj.data);
                ServerServiceDoc.guardarCuentas(obj, function (data) {
                    if (data.status === 200) {
                        AlertService.mostrarVentanaAlerta("Actualizacion de cuentas", data.msj);
                        //$scope.root.listarTiposCuentas = data.obj.listarTiposCuentas;
                    } else {
                        AlertService.mostrarVentanaAlerta("Error Mensaje del sistema: ", data.msj);
                    }
                });
                //console.log('Funcion del submit!!');
                console.log('Cuentas son: ',$scope.documentosCuentas);
            };
            /*
            $scope.validarDebito=function(cuenta, checked, seccion, origen){      
                var categoria_id = cuenta.categoria_id;
                var categoria_string = 'categoria_'+categoria_id;
                var cuenta_id = cuenta.cuenta_id;

                if(checked){
                    $scope.contador_checked++;
                    //var datosCuenta = {
                    //    categoria_id: categoria_id
                    //};
                    //$scope.documentosCuentas['cuentas'][cuenta_id] = datosCuenta;
                    $scope.documentosCuentas['empresa_id'] = Usuario.getUsuarioActual().getEmpresa().codigo;
                    $scope.documentosCuentas['centro_id'] = Usuario.getUsuarioActual().getEmpresa().centroUtilidad.codigo;
                    $scope.documentosCuentas['bodega_id'] = Usuario.getUsuarioActual().getEmpresa().centroUtilidad.bodega.codigo;
                    $scope.documentosCuentas['prefijo_id'] = $scope.documentosCuentas.prefijo_id;

                    //$scope.documentosCuentas[cuenta_id]['sw_cuentas'] = 1;
                    //$scope.documentosCuentas[cuenta_id]['centro_costos_asientos'] = 0;
                    //$scope.documentosCuentas[cuenta_id]['centro_utilidad_asiento'] = 0;
                    //$scope.documentosCuentas[cuenta_id]['cod_linea_costo_asiento'] = 0;
                    //$scope.documentosCuentas[cuenta_id]['id_tercero_asiento'] = null;
                    //$scope.documentosCuentas[cuenta_id]['observacion_asiento'] = null;
                    console.log('documentosCuentas: ',$scope.documentosCuentas);

                    if(seccion === 'seccion_1'){                       
                       $scope.seccion_2 = false;
                    }else if(seccion === 'seccion_2'){
                       $scope.seccion_1 = false;
                    }                       
                }else{
                    $scope.contador_checked--;                     
                    $scope.documentosCuentas[categoria_string][origen] = '';
                    
                    if($scope.contador_checked === 0){
                        $scope.seccion_1 = true;
                        $scope.seccion_2 = true;
                    }
                }                                                  
                //console.log('Total cuentas: ',$scope.documentosCuentas);
                //console.log('contador de checked: ', $scope.contador_checked);
                //console.log('seccion 1: ', $scope.seccion_1);
                //console.log('seccion 2: ', $scope.seccion_2);
            };
            */

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
                    session: $scope.session,
                    data: {
                        empresa_id: $scope.documentosCuentas.empresa_id,
                        centro_id: $scope.documentosCuentas.centro_id,
                        bodega_id: $scope.documentosCuentas.bodega_id,
                        prefijo_id: $scope.documentosCuentas.prefijo_id,
                        servicio: $scope.documentosCuentas.servicio
                    }
                };
                ServerServiceDoc.listarTiposCuentas(obj, function (data) {
                    if (data.status === 200) {
                        console.log("data: ",data.obj.listarTiposCuentas);
                        var resultado = data.obj.listarTiposCuentas;
                        var tipo_cuenta = '';
                        var datos_cuenta = {};
                        var datos_cuenta_vacio = {};
                        var categoria_nueva = '';
                        var categoria_vieja = '';
                        var cuentas_count = 0;
                        var cuentas_total = resultado.length;
                        var cuenta = {};
                        $scope.root.listarTiposCuentas = {};

                        for(key in resultado){
                            cuentas_count++;
                            cuenta = resultado[key];
                            categoria_nueva = cuenta.categoria_descripcion;
                            //console.log('cuenta es: ', cuenta);
                            datos_cuenta = {
                                cuenta_id: cuenta.cuenta,
                                categoria_id: cuenta.categoria_id,
                                categoria_descripcion: cuenta.categoria_descripcion,
                                centro_costos_asientos: cuenta.centro_costos_asientos,
                                centro_utilidad_asiento: cuenta.centro_utilidad_asiento,
                                cod_linea_costo_asiento: cuenta.cod_linea_costo_asiento,
                                id_tercero_asiento: cuenta.id_tercero_asiento,
                                observacion_asiento: cuenta.observacion_asiento,
                                sw_cuenta: cuenta.sw_cuenta,
                                parametrizacion_ws_fi: cuenta.parametrizacion_ws_fi
                            };

                            if(cuenta.sw_cuenta === '0'){
                                tipo_cuenta = 'debito';
                            }else if(cuenta.sw_cuenta === '1'){
                                tipo_cuenta = 'credito';
                            }
                            if($scope.documentosCuentas.categorias[cuenta.categoria_descripcion] === undefined){
                                $scope.documentosCuentas.categorias[cuenta.categoria_descripcion] = {};
                            }
                            if($scope.documentosCuentas.categorias[cuenta.categoria_descripcion][tipo_cuenta] === undefined) {
                                $scope.documentosCuentas.categorias[cuenta.categoria_descripcion][tipo_cuenta] = {};
                            }
                            if($scope.root.listarTiposCuentas['debito'] === undefined){
                                $scope.root.listarTiposCuentas['debito'] = [];
                            }
                            if($scope.root.listarTiposCuentas['credito'] === undefined){
                                $scope.root.listarTiposCuentas['credito'] = [];
                            }

                            /*******  BLOQUE1 PARA LLENAR LAS CUENTAS FALTANTES CON DATOS VACIOS *******/
                            //  if(categoria_vieja !== ''){
                            //     if(categoria_vieja !== categoria_nueva){
                            //         console.log('Categoria vieja es: ', categoria_vieja);
                            //         console.log('Objeto anterior es: ', $scope.documentosCuentas.categorias[categoria_vieja]);
                            //
                            //         datos_cuenta_vacio = {
                            //             cuenta_id: '',
                            //             categoria_id: '',
                            //             categoria_descripcion: categoria_vieja,
                            //             centro_costos_asientos: '',
                            //             centro_utilidad_asiento: '',
                            //             cod_linea_costo_asiento: '',
                            //             id_tercero_asiento: '',
                            //             observacion_asiento: '',
                            //             sw_cuenta: ''
                            //         };
                            //
                            //         if($scope.documentosCuentas.categorias[categoria_vieja]['debito'] === undefined){
                            //             $scope.root.listarTiposCuentas['debito'].push(datos_cuenta_vacio);
                            //         }else if($scope.documentosCuentas.categorias[categoria_vieja]['credito'] === undefined){
                            //             $scope.root.listarTiposCuentas['credito'].push(datos_cuenta_vacio);
                            //         }
                            //         categoria_vieja = categoria_nueva;
                            //     }
                            // }else{
                            //     categoria_vieja = categoria_nueva;
                            // }
                            $scope.documentosCuentas.categorias[cuenta.categoria_descripcion][tipo_cuenta] = datos_cuenta;
                            $scope.root.listarTiposCuentas[tipo_cuenta].push(datos_cuenta);
                            //console.log('Array en ciclo: ', $scope.documentosCuentas);

                            /*******  BLOQUE2 PARA LLENAR LAS CUENTAS FALTANTES CON DATOS VACIOS *******/
                            // if(cuentas_total === cuentas_count){
                            //     datos_cuenta_vacio = {
                            //         cuenta_id: '',
                            //         categoria_id: '',
                            //         categoria_descripcion: cuenta.categoria_descripcion,
                            //         centro_costos_asientos: '',
                            //         centro_utilidad_asiento: '',
                            //         cod_linea_costo_asiento: '',
                            //         id_tercero_asiento: '',
                            //         observacion_asiento: '',
                            //         sw_cuenta: ''
                            //     };
                            //     if($scope.documentosCuentas.categorias[cuenta.categoria_descripcion]['debito'] === undefined){
                            //         $scope.root.listarTiposCuentas['debito'].push(datos_cuenta_vacio);
                            //     }else if($scope.documentosCuentas.categorias[cuenta.categoria_descripcion]['credito'] === undefined){
                            //         $scope.root.listarTiposCuentas['credito'].push(datos_cuenta_vacio);
                            //     }
                            // }
                        };
                        //$scope.root.listarTiposCuentas = $scope.documentosCuentas;
                        console.log('Cuentas1 es: ', $scope.root.listarTiposCuentas);
                        console.log('Cuentas2 es: ', $scope.documentosCuentas);
                    } else {
                        AlertService.mostrarVentanaAlerta("Error Mensaje del sistema: ", data.msj);
                    }
                });
            };
            
           that.insertarTipoCuenta = function (obj) {
                var obj = {
                    session: $scope.session,
                    data: obj
                };
                ServerServiceDoc.insertarTipoCuenta(obj, function (data) {
                    if (data.status === 200) {
                       AlertService.mostrarVentanaAlerta("Mensaje del sistema: ", "Se Almacena Correctamente");
                    } else {
                        AlertService.mostrarVentanaAlerta("Error Mensaje del sistema: ", data.msj);
                    }
                });
            };
            
            $scope.validarCuenta=function(data, tipo){
                //console.log('Data en validacion: ', data);
                if(tipo === 'debito'){

                }else if(tipo === 'credito'){

                }
                var response = false;
                for(cuenta in data){
                    if((data.cuenta_id+"").slice(0, 2) === compara){
                        response = true;
                    }
                }
                return response;
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
            that.listarTiposServicios = function(prefijo){
                var obj = {
                    session: $scope.session,
                    data: {
                        prefijo: prefijo
                    }
                };
                ServerServiceDoc.listarTiposServicios(obj, function(data){
                    $scope.root.listarTiposServicios = data.obj.listarTiposServicios;
                    console.log('Servicios: ', $scope.root.listarTiposServicios);
                    //console.log('Ajax init!! data: ', data.obj.listarTiposServicios);
                });
            };
                        
            that.init(function () {
                that.listarPrefijos();
            });
        }]);
});