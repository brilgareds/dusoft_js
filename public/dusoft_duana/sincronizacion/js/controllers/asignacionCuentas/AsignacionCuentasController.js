
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
            $scope.root = {
                prefijo: {},
                init: {
                    entries: {
                        types: [
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
                        rows: {}
                    }
                },
                listarTiposServicios: [],
                entries: {},
                tipos_categorias: [
                    { 'descripcion': 'Debito',  'id': 0 },
                    { 'descripcion': 'Credito', 'id': 1 }
                ]
            };
            $scope.credito_debito = false;
            $scope.debito_credito = false;

            that.init = () => {
                // Inicialización de variables
                $scope.root.entries = JSON.parse(JSON.stringify($scope.root.init.entries));
                $scope.contador_checked = 0;
                $scope.seccion_1 = false;
                $scope.seccion_2 = false;
                $scope.servicios = false;
                $scope.boton = false;
                $scope.root.listarTiposCuentas = {};
                $scope.root.tipos_categorias = [
                    { 'descripcion': 'Debito',  'id': 0 },
                    { 'descripcion': 'Credito', 'id': 1 }
                ];
                $scope.documentosCuentas = {
                    empresa_id: Usuario.getUsuarioActual().getEmpresa().codigo,
                    centro_id: Usuario.getUsuarioActual().getEmpresa().centroUtilidad.codigo,
                    bodega_id:  Usuario.getUsuarioActual().getEmpresa().centroUtilidad.bodega.codigo,
                    prefijo_id: '',
                    servicio: '',
                    cuentas: [],
                    categorias: {}
                };

                // Funciones a ejecutar al iniciar
                that.listarPrefijos();
                that.listarTiposServicios();
            };


            $scope.post = (url, obj, callback) => {
                Request.realizarRequest(url, "POST", obj, data => { callback(data) });
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

            $scope.servicio_actualizado = function(servicio) {
                console.log('Servicio es: ', servicio);
                if (servicio && servicio != '' && servicio != ' ') {
                    $scope.seccion_1 = true;
                    $scope.seccion_2 = true;
                    $scope.boton = true;
                    $scope.documentosCuentas.servicio = servicio;
                    that.listarTiposCuentas();
                }
            };

            $scope.cleanNoSelected = () => {
                let entry = {};
                let entries = {};
                let index = 0;
                let countEntries = 0;
                let tipos_cuenta = {};
                let cuentas_actualizadas = JSON.parse(JSON.stringify($scope.root.entries));

                for (tipos_cuenta of cuentas_actualizadas.types) {
                    index = 0;
                    entries = cuentas_actualizadas.rows[tipos_cuenta.name];
                    countEntries = cuentas_actualizadas.rows[tipos_cuenta.name].length;
                    if (Array.isArray(entries) && entries.length > 0) {
                        while (index <= countEntries) {
                            if (entries[index] && !entries[index].check) { entries.splice(index, 1); index = 0; }
                            else { index++; }
                        }
                    }
                }

                return cuentas_actualizadas;
            };
                                    
            $scope.guardar_cuentas = () => {
                let cuentas_actualizadas = $scope.cleanNoSelected();
                console.log('Cuentas_actualizadas: ', cuentas_actualizadas);

                const obj = {
                    session: $scope.session,
                    data: {
                        tipesEntries: cuentas_actualizadas.types,
                        debito: cuentas_actualizadas.rows.debito,
                        credito: cuentas_actualizadas.rows.credito
                    }
                }; // console.log('El objeto enviado es ', obj.data);
                $scope.post(API.SINCRONIZACION_DOCUMENTOS.GUARDAR_CUENTAS, obj, data => {
                    if (data.status === 200) { AlertService.mostrarVentanaAlerta("Actualizacion de cuentas", data.msj);}
                    else { AlertService.mostrarVentanaAlerta("Error Mensaje del sistema: ", data.msj); }
                });
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
                const obj = {
                    session: $scope.session,
                    data: {
                        empresaId: Usuario.getUsuarioActual().getEmpresa().codigo
                    }
                };
                $scope.post(API.SINCRONIZACION_DOCUMENTOS.LISTAR_PREFIJOS, obj, data => {
                    console.log('Ajax!!, url: ', API.SINCRONIZACION_DOCUMENTOS.LISTAR_PREFIJOS, 'obj: ', obj);

                    if (data.status === 200) {
                        $scope.root.listarPrefijos = data.obj.listarPrefijos.prefijos;
                        $scope.root.listarPrefijosFiltrados = data.obj.listarPrefijos.prefijosFiltrados;
                    } else { console.log('data: ', data); AlertService.mostrarVentanaAlerta("Error Mensaje del sistema: ", data.msj); }
                });
            };
            
            that.listarTipoCuentaCategoria = callback => {
                const obj = {
                    session: $scope.session,
                    data: {}
                };
                $scope.post(API.SINCRONIZACION_DOCUMENTOS.LISTAR_TIPO_CUENTA_CATEGORIA, obj, data => {
                    if (data.status === 200) {
                        console.log("data: ", data.obj.listarTipoCuentaCategoria);
                        callback(data.obj.listarTipoCuentaCategoria);
                    } else { AlertService.mostrarVentanaAlerta("Error Mensaje del sistema: ", data.msj); }
                });
            };
            
            that.listarDocumentosCuentas = () => {
                const obj = {
                    session: $scope.session,
                    data: {}
                };
                $scope.post(API.SINCRONIZACION_DOCUMENTOS.LISTAR_DOCUMENTOS_CUENTAS, obj, data => {
                    if (data.status === 200) {
                        console.log("data",data.obj);
                    } else { AlertService.mostrarVentanaAlerta("Error Mensaje del sistema: ", data.msj); }
                });
            };
            
            that.listarTiposCuentas = () => {

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

                $scope.post(API.SINCRONIZACION_DOCUMENTOS.LISTAR_TIPOS_CUENTAS, obj, data => {
                    $scope.root.entries = JSON.parse(JSON.stringify($scope.root.init.entries));
                    $scope.documentosCuentas.categorias = {};

                    if (data.status === 200) {
                        let resultado = data.obj.entries;
                        let tipo_cuenta = '';
                        let categoria_nueva = '';
                        let cuentas_count = 0;
                        let cuentas_total = resultado.length;
                        let entry = {};

                        for (let key in resultado) {
                            cuentas_count++;
                            entry = resultado[key];
                            categoria_nueva = entry.categoria_descripcion; // console.log('cuenta es: ', entry);

                            tipo_cuenta = (entry.sw_cuenta === '0') ? 'debito':'credito';

                            if ($scope.documentosCuentas.categorias[categoria_nueva] === undefined) {
                                $scope.documentosCuentas.categorias[categoria_nueva] = {};
                            }
                            if ($scope.documentosCuentas.categorias[categoria_nueva][tipo_cuenta] === undefined) {
                                $scope.documentosCuentas.categorias[categoria_nueva][tipo_cuenta] = [];
                            }
                            if ($scope.root.entries.rows.debito === undefined) {
                                $scope.root.entries.rows.debito = [];
                            }
                            if ($scope.root.entries.rows.credito === undefined) {
                                $scope.root.entries.rows.credito = [];
                            }

                            $scope.documentosCuentas.categorias[categoria_nueva][tipo_cuenta].push(entry);
                            $scope.root.entries.rows[tipo_cuenta].push(entry);
                        }; // console.log('Cuentas son: ', $scope.root.entries);
                    } else { AlertService.mostrarVentanaAlerta("Error Mensaje del sistema: ", data.msj); }
                });
            };
            
           $scope.insertarTipoCuenta = cuenta => {
               console.log('Eyyyyy');
                const obj = {
                    session: $scope.session,
                    data: cuenta
                };

                $scope.post(API.SINCRONIZACION_DOCUMENTOS.INSERTAR_TIPO_CUENTA, obj, data => {
                    if (data.status === 200) {
                       AlertService.mostrarVentanaAlerta("Mensaje del sistema: ", "Se Almacenó Correctamente");
                       $scope.documentosCuentas.cuenta = '';
                       that.listarTiposCuentas();
                       that.listarPrefijos(obj.data.empresaId);
                       that.listarTiposServicios(obj.data.prefijoId);
                    } else { AlertService.mostrarVentanaAlerta(data.msj); }
                });
           };
            
            $scope.validarCuenta=function(data, tipo){
                //console.log('Data en validacion: ', data);
                if (tipo === 'debito') {

                } else if (tipo === 'credito') {

                }
                let response = false;
                for (cuenta in data) {
                    if ((data.cuenta_id+"").slice(0, 2) === compara){
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

                            that.listarTipoCuentaCategoria(data => {
                                $scope.root.listarTipoCuentaCategoria = data;
                            });

                            $scope.validaterFieldsInsert = campos => {
                                let response = false;

                                if (campos.prefijo_id   && (campos.prefijo_id.length > 0) &&
                                    campos.empresa_id   && (campos.empresa_id.length > 0) &&
                                    campos.centro_id    && (campos.centro_id.length  > 0) &&
                                    campos.bodega_id    && (campos.bodega_id.length  > 0) &&
                                    campos.cuenta       && (campos.cuenta.length     > 0) &&
                                    campos.servicio     && (campos.servicio          > 0) &&
                                    campos.categoriaId  && (campos.categoriaId       > 0) &&
                                    campos.tipo_cuenta !== undefined  && (campos.tipo_cuenta !== '') &&
                                    campos.categoriaDescripcion && (campos.categoriaDescripcion.length > 0) ) {

                                    response = true;
                                }

                                return response;
                            };

                            $scope.guardar = function () {
                                console.log('Eooooooooooooo');
                                if (!$scope.validaterFieldsInsert($scope.documentosCuentas)) { console.log('Errorrrr'); return false; }

                                const obj = {
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
                                $scope.insertarTipoCuenta(obj);
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

                $scope.post(API.SINCRONIZACION_DOCUMENTOS.LISTAR_TIPOS_SERVICIOS, obj, data => {
                    $scope.root.listarTiposServicios = data.obj.listarTiposServicios.servicios;
                    $scope.root.listarTiposServiciosFiltrados = data.obj.listarTiposServicios.serviciosFiltrados;;
                });
            };
                        
            that.init();
        }]);
});
