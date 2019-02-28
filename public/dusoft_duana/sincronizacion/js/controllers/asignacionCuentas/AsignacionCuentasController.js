
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
                $scope.root.tipos_categorias = [
                    { 'descripcion': 'Debito',  'id': 0 },
                    { 'descripcion': 'Credito', 'id': 1 }
                ];
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
                    $scope.root.listarTiposCuentas.prefijo_id = prefijo;
                    $scope.documentosCuentas.prefijo_id = prefijo;
                    that.listarTiposServicios(prefijo);
                }
            };

            $scope.categoria_actualizada = function(categoria){
                $scope.documentosCuentas.categoriaId = categoria.id;
                $scope.documentosCuentas.categoriaDescripcion = categoria.descripcion;
            };

            $scope.tipo_cuenta_actualizado = function(tipo_cuenta){
                $scope.documentosCuentas.tipo_cuenta = tipo_cuenta;
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
                var cuentas_actualizadas = JSON.parse(JSON.stringify($scope.root.listarTiposCuentas));
                for(tipo_cuenta in cuentas_actualizadas){
                    if(Array.isArray(cuentas_actualizadas[tipo_cuenta]) && cuentas_actualizadas[tipo_cuenta].length > 0){
                        for(index in cuentas_actualizadas[tipo_cuenta]){
                            if(cuentas_actualizadas[tipo_cuenta][index] !== undefined
                                && (cuentas_actualizadas[tipo_cuenta][index].check === undefined || !cuentas_actualizadas[tipo_cuenta][index].check)){
                                    delete cuentas_actualizadas[tipo_cuenta][index];
                                    console.log('Un elemento borrado!!');
                            }
                        }
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
                        console.log('Prefijos Array: ', data);
                        $scope.root.listarPrefijos = data.obj.listarPrefijos.prefijos;
                        $scope.root.listarPrefijosFiltrados = data.obj.listarPrefijos.prefijosFiltrados;
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
                        console.log("data: ", data.obj.listarTipoCuentaCategoria);
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

                            console.log('cuenta es: ', cuenta);

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
                                $scope.documentosCuentas.categorias[cuenta.categoria_descripcion][tipo_cuenta] = [];
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
                            $scope.documentosCuentas.categorias[cuenta.categoria_descripcion][tipo_cuenta].push(datos_cuenta);
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
                    //console.log('Respuesta del insert desde el controlador Frontend!!: ', data);
                    if (data.status === 200) {
                       AlertService.mostrarVentanaAlerta("Mensaje del sistema: ", "Se Almacenó Correctamente");
                       $scope.documentosCuentas.cuenta = '';
                       that.listarTiposCuentas();
                       that.listarPrefijos(obj.data.empresaId);
                       that.listarTiposServicios(obj.data.prefijoId);
                    } else if(data.obj.insertTiposCuentas !== undefined && data.obj.insertTiposCuentas.length > 0){
                        AlertService.mostrarVentanaAlerta(data.obj.insertTiposCuentas);
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
                                           <input ng-model="documentosCuentas.cuenta" validacion-numero-entero type="text" class="form-control" placeholder="Ingrese cuenta">\
                                        </div>\
                                        <div class="col-md-8">\
                                            <div class="form-group">\
                                                <label class="col-form-label">Tipo Cuenta</label>\
                                                <ui-select ng-model="root.tipo_cuenta2"\
                                                           theme="select2"\
                                                           class="form-control selectgeneral pull-left col-md-2"\
                                                           ng-change="tipo_cuenta_actualizado($select.selected.id)">\
                                                    <ui-select-match placeholder="Seleccionar Tipo Cuenta">{{$select.selected.descripcion}}</ui-select-match>\
                                                    <ui-select-choices repeat="filtro in root.tipos_categorias | filter:$select.search">\
                                                        {{ filtro.descripcion }}\
                                                    </ui-select-choices>\
                                                </ui-select>\
                                                <br>\
                                                <label class="col-form-label" style="margin-top: 5px;">Prefijo</label>\
                                                <ui-select ng-model="root.prefijo2"\
                                                           theme="select2"\
                                                           class="form-control selectgeneral pull-left col-md-4"\
                                                           ng-change="prefijo_actualizado($select.selected.prefijo)">\
                                                    <ui-select-match placeholder="Seleccionar Prefijo">{{ $select.selected.prefijo}}</ui-select-match>\
                                                    <ui-select-choices repeat="filtro in root.listarPrefijos | filter:$select.search">\
                                                        {{ filtro.prefijo }}\
                                                    </ui-select-choices>\
                                                </ui-select>\
                                                <br>\
                                                <label class="col-form-label" style="margin-top: 5px;">Servicio (Funcion)</label>\
                                                <ui-select ng-model="root.listarTiposServicios2"\
                                                           theme="select2"\
                                                           class="form-control selectgeneral pull-left col-md-2"\
                                                           ng-change="servicio_actualizado($select.selected.id)">\
                                                    <ui-select-match placeholder="Seleccionar Servicio">{{$select.selected.descripcion}}</ui-select-match>\
                                                    <ui-select-choices repeat="filtro in root.listarTiposServicios | filter:$select.search">\
                                                        {{ filtro.descripcion }}\
                                                    </ui-select-choices>\
                                                </ui-select>\
                                                <br>\
                                                <label class="col-form-label" style="margin-top: 5px;">Categoria</label>\
                                                <ui-select ng-model="listarTipoCuentaCategoria2"\
                                                           theme="select2"\
                                                           class="form-control selectgeneral pull-left col-md-2"\
                                                           ng-change="categoria_actualizada($select.selected)">\
                                                    <ui-select-match placeholder="Seleccionar Categoria">{{$select.selected.descripcion}}</ui-select-match>\
                                                    <ui-select-choices repeat="filtro in root.listarTipoCuentaCategoria | filter:$select.search">\
                                                        {{ filtro.descripcion }}\
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
                                if($scope.documentosCuentas.prefijo_id === undefined || !$scope.documentosCuentas.prefijo_id.length > 0,
                                    $scope.documentosCuentas.empresa_id === undefined || !$scope.documentosCuentas.empresa_id.length > 0,
                                    $scope.documentosCuentas.centro_id === undefined || !$scope.documentosCuentas.centro_id.length > 0,
                                    $scope.documentosCuentas.bodega_id === undefined || !$scope.documentosCuentas.bodega_id.length > 0,
                                    $scope.documentosCuentas.cuenta === undefined || !$scope.documentosCuentas.cuenta.length > 0,
                                    $scope.documentosCuentas.categoriaId === undefined || !$scope.documentosCuentas.categoriaId.length > 0,
                                    $scope.documentosCuentas.categoriaDescripcion === undefined || !$scope.documentosCuentas.categoriaDescripcion.length > 0,
                                    $scope.documentosCuentas.servicio === undefined || !$scope.documentosCuentas.servicio.length > 0,
                                    $scope.documentosCuentas.tipo_cuenta === undefined || !$scope.documentosCuentas.tipo_cuenta === ''){
                                    return false;
                                }
                                var obj = {
                                    prefijoId: $scope.documentosCuentas.prefijo_id,
                                    empresaId: $scope.documentosCuentas.empresa_id,
                                    centroId: $scope.documentosCuentas.centro_id,
                                    bodegaId: $scope.documentosCuentas.bodega_id,
                                    cuentaId: $scope.documentosCuentas.cuenta,
                                    cuentaCategoriaId: $scope.documentosCuentas.categoriaId,
                                    cuentaCategoriaDescripcion: $scope.documentosCuentas.categoriaDescripcion,
                                    cuentaServicio: $scope.documentosCuentas.servicio,
                                    cuentaTipo: $scope.documentosCuentas.tipo_cuenta
                                };
                                //console.log('objeto en insert Cuenta - Frontend: ', obj);
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
                    $scope.root.listarTiposServicios = data.obj.listarTiposServicios.servicios;
                    $scope.root.listarTiposServiciosFiltrados = data.obj.listarTiposServicios.serviciosFiltrados;
                    console.log('Servicios: ', $scope.root.listarTiposServicios);
                    //console.log('Ajax init!! data: ', data.obj.listarTiposServicios);
                });
            };
                        
            that.init(function () {
                that.listarPrefijos();
                that.listarTiposServicios();
            });
        }]);
});