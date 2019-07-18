
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

            that.init = callback => {
                $scope.root = {
                    prefijo: {},
                    listarTiposServicios: [],
                    tipesEntries: [
                        {
                            title: 'Debito',
                            name: 'debito',
                            entries: {}
                        },
                        {
                            title: 'Credito',
                            name: 'credito',
                            entries: {}
                        }
                    ],
                    tipos_categorias: [
                        { 'descripcion': 'Debito',  'id': 0 },
                        { 'descripcion': 'Credito', 'id': 1 }
                    ]
                };

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
            
            that.listarTiposCuentas = () => {
                console.log("listarTiposCuentas");

                const obj = {
                    session: $scope.session,
                    data: {
                        empresa_id: $scope.documentosCuentas.empresa_id,
                        centro_id: $scope.documentosCuentas.centro_id,
                        bodega_id: $scope.documentosCuentas.bodega_id,
                        prefijo_id: $scope.documentosCuentas.prefijo_id,
                        servicio: $scope.documentosCuentas.servicio
                    }
                };
                ServerServiceDoc.listarTiposCuentas(obj, data => {
                    if (data.status === 200) {
                        console.log("data: ", data.obj);
                        var resultado = data.obj.entries;
                        var tipo_cuenta = '';
                        var datos_cuenta = {};
                        var datos_cuenta_vacio = {};
                        var categoria_nueva = '';
                        var categoria_vieja = '';
                        var cuentas_count = 0;
                        var cuentas_total = resultado.length;
                        let entry = {};
                        $scope.root.listarTiposCuentas = {};

                        for (let key in resultado) {
                            cuentas_count++;
                            entries = resultado[key];
                            categoria_nueva = entries.categoria_descripcion;

                            console.log('cuenta es: ', entries);

                            tipo_cuenta = (entry.sw_cuenta === '0') ? 'debito':'credito';

                            if($scope.documentosCuentas.categorias[entries.categoria_descripcion] === undefined) {
                                $scope.documentosCuentas.categorias[entries.categoria_descripcion] = {};
                            }
                            if($scope.documentosCuentas.categorias[entries.categoria_descripcion][tipo_cuenta] === undefined) {
                                $scope.documentosCuentas.categorias[entries.categoria_descripcion][tipo_cuenta] = [];
                            }
                            if($scope.root.tipesEntries['debito'] === undefined){
                                $scope.root.tipesEntries['debito'] = [];
                            }
                            if($scope.root.tipesEntries['credito'] === undefined){
                                $scope.root.tipesEntries['credito'] = [];
                            }

                            $scope.documentosCuentas.categorias[entries.categoria_descripcion][tipo_cuenta].push(entries);
                            $scope.root.tipesEntries[tipo_cuenta].push(entries);
                            //console.log('Array en ciclo: ', $scope.documentosCuentas);
                        };
                        //$scope.root.listarTiposCuentas = $scope.documentosCuentas;
                        console.log('Cuentas1 es: ', $scope.root.tipesEntries);
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
