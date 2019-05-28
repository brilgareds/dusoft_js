/* global entregado, si, $flow, that, $http, echo, subirArchivo, flow, data, modalInstancesy, form, backdrop, parametros, parametros, parametros, archivo */

define(
    ["angular", "js/controllers", 'includes/slide/slideContent', "includes/classes/Empresa"],
    function (angular, controllers) {
        controllers.controller('ParametrizacionProductosClientesController', [
            '$scope', '$rootScope', "Request",
            "$filter", '$state', '$modal',
            "API", "AlertService", 'localStorageService',
            "Usuario", "socket", "$timeout",
            "Empresa", "CentroUtilidad", "Bodega", "$location", "ParametrizacionProductosClientesService",
            function ($scope, $rootScope, Request, $filter, $state, $modal, API, AlertService, localStorageService, Usuario, socket, $timeout, Empresa, CentroUtilidad, Bodega, $location, ParametrizacionProductosClientesService) {
                /******* Initialize *****/
                let that = this;
                let modalInstance = {};

                that.init = () => {
                    $scope.session = {
                        usuario_id: Usuario.getUsuarioActual().getId(),
                        auth_token: Usuario.getUsuarioActual().getToken()
                    };
                    $scope.checkbox = '';
                    $scope.root = {
                        init: {
                            contractTypes: ['Generico', 'No Generico'],
                            checkbox: true
                        },
                        form: {
                            searchContract: {
                                generic: false,
                                numberContract: '',
                                businessUnit: '',
                                thirdPartyNames: ''
                            }
                        },
                        data: {
                            contract: {},
                            contractProducts: {}
                        }
                    };
                };

                /******* Format Functions ******/
                const number_money = (price) => {
                    let number = price.replace(/(\D)/g, "").toString();
                    price = new Intl.NumberFormat("de-DE").format(price);
                    price = '$' + price
                            .replace(/(,)/g, "coma")
                            .replace(/(\.)/g, "punto")
                            .replace(/(coma)/g, ".")
                            .replace(/(punto)/g, ",");
                    return price;
                };

                /******* AJAX functions *******/
                $scope.get = (url, obj, callback) => {
                    if (!url || !obj || !callback) { console.log('Formato invalido para Ajax!'); }
                    else { Request.realizarRequest(url, "GET", obj, data => callback(data) ); }
                };
                $scope.post = (url, obj, callback) => {
                    if (!url || !obj || !callback) { console.log('Formato invalido para Ajax!'); }
                    else { Request.realizarRequest(url, "POST", obj, data => callback(data) ); }
                };

                /******* Generals Functions ******/
                $scope.listContracts = () => {
                    let obj = {
                        session: $scope.session,
                        data: {
                            filter: $scope.root.form.searchContract
                        }
                    };

                    $scope.post(API.PARAMETRIZACION_PRODUCTOS_CLIENTES.LIST_CONTRACTS, obj, data => {
                        if (data.status === 200) {
                            $scope.root.data.contracts = data.obj;
                        } else {
                            AlertService.mostrarVentanaAlerta("Mensaje del sistema: ", data.msj);
                        }
                    });
                };

                $scope.updateStatusContract = (index, contratoId, newStatus) => {
                    const tipeUpdate = newStatus === true ? 'ACTIVAR':'DESACTIVAR';
                    const respuestaUsuario = confirm(`¿Esta seguro que desea ${tipeUpdate} el contrato #${contratoId}?`);

                    if (respuestaUsuario) {
                        const obj = {
                            session: $scope.session,
                            data: {
                                contratoId: contratoId,
                                newStatus: newStatus
                            }
                        };
                        $scope.post(API.PARAMETRIZACION_PRODUCTOS_CLIENTES.UPDATE_STATUS_CONTRACT, obj, data => {
                            if (data.status !== 200) {
                                $scope.root.data.contracts[index].check = !newStatus;
                                AlertService.mostrarVentanaAlerta("Mensaje del sistema: ", data.msj);
                            }
                        });
                    } else {
                        $scope.root.data.contracts[index].check = !newStatus;
                    }
                };

                $scope.listContractProducts = (Contract, modal=true) => {
                    $scope.lastListContractProducts = Contract;
                    console.log('Contract is: ', Contract);

                    let obj = {
                        session: $scope.session,
                        data: Contract
                    };

                    $scope.post(API.PARAMETRIZACION_PRODUCTOS_CLIENTES.LIST_CONTRACTS_PRODUCTS, obj, data => {
                        if (data.status === 200) {
                            $scope.root.data.contractProducts = data.obj;
                            if (modal){
                                $scope.modal($scope.root.data.contractProducts, 1);
                            }
                        } else { console.log('Error: ', data.obj.err); }
                    });
                };

                /****************************/
                /*** FUNCTIONS FOR MODAL ***/
                /**************************/
                $scope.modal = function (obj, templateId) {
                    if (obj || templateId) {
                        let template = '';
                        if(templateId === 1){
                            template = 'views/modals/listContractProducts.html';
                        }

                        $scope.opts = {
                            backdrop: true,
                            backdropClick: true,
                            dialogFade: true,
                            keyboard: true,
                            templateUrl: template,
                            scope: $scope,
                            // controller: "VentanaMensajeSincronizacionController",
                            resolve: {
                                mensaje: function() {
                                    return obj;
                                }
                            }
                        };
                        modalInstance = $modal.open($scope.opts);

                        modalInstance.result.then(function(){},function(){});
                    } else {
                        alert('Error: Formato incorrecto para modal!!');
                    }
                };

                $scope.cerrarVentana = function(){
                    modalInstance.close();
                };

                /************************/
                /*** GRIDS (GRILLAS) ***/
                /**********************/
                $scope.ParametrizacionProductosClientes = {
                    data: 'root.data.contracts',
                    multiSelect: false,
                    enableHighlighting: true,
                    showFilter: true,
                    enableRowSelection: false,
                    enableColumnResize: true,
                    columnDefs: [
                        { field: 'contrato_numero', displayName: "Contrato", width: "7%" },
                        { field: 'contrato_tipo', displayName: "Cliente/Unidad Negocio/Generico", width: "22%" },
                        { field: 'contrato_fecha_i', displayName: "Fecha I.", width: "8%" },
                        { field: 'contrato_fecha_f', displayName: "Fecha F.", width: "8%" },
                        { field: 'contrato_valor', displayName: "Valor", width: "10%" },
                        { field: 'contrato_vendedor', displayName: "Vendedor", width: "15%" },
                        { field: 'contrato_descripcion', displayName: "Descripcion - Contrato", width: "17%" },
                        { displayName: 'Mod.', width: "5%", cellTemplate: `
                            <div style="text-align: center;">
                                <i ng-click="listContractProducts(row.entity, true)" class="glyphicon glyphicon-list-alt" aria-hidden="true" style="color: #0c99d0; font-size: 20px;"></i>
                            </div>` },
                        { displayName: 'Estado', width: "8%", cellTemplate: `
                            <div class="switch1">
                                <input type="checkbox" ng-model='row.entity.check' ng-change="updateStatusContract(row.rowIndex, row.entity.contrato_numero, row.entity.check)" ng-checked="{{row.entity.check}}" name="switch1" class="switch1-checkbox" id="{{row.entity.contrato_numero}}">
                                <label class="switch1-label" for="{{row.entity.contrato_numero}}">
                                <span class="switch1-inner"></span>
                                <span class="switch1-switch"></span>
                                </label>
                            </div>` }
                        // { field: 'contrato_op', displayName: "Op", width: "10%" },
                        // { field: 'contrato_prod', displayName: "Prod", width: "10%" },
                        // { field: 'contrato_est', displayName: "Est", width: "10%" }
                        // { displayName: 'Crear', width: "5%", cellTemplate: '<div style="text-align: center;"><i ng-click="crearNotaTemporal(row.entity)" class="fa fa-plus-circle fa-2x" aria-hidden="true" style="color: #0c99d0;"></i></div>' }
                    ]
                };

                $scope.contractProducts = {
                    data: 'root.data.contractProducts',
                    multiSelect: false,
                    enableHighlighting: true,
                    showFilter: true,
                    enableRowSelection: false,
                    enableColumnResize: true,
                    columnDefs: [
                        { field: 'producto_codigo', displayName: "Codigo", width: "20%" },
                        { field: 'producto_descripcion', displayName: "Descripcion", width: "50%" },
                        { field: 'producto_precio_pactado', displayName: "Precio Venta", width: "20%" },
                        // { field: 'contrato_fecha_f', displayName: "Costo Venta", width: "20%" },
                        { displayName: 'Modificar', width: "5%", cellTemplate: `
                            <div style="text-align: center;">
                                <i class="glyphicon glyphicon-list-alt" aria-hidden="true" style="color: #0c99d0; font-size: 20px;"></i>
                            </div>` },
                        { displayName: 'Borrar', width: "5%", cellTemplate: `
                            <div style="text-align: center;">
                                <i class="glyphicon glyphicon-list-alt" aria-hidden="true" style="color: #0c99d0; font-size: 20px;"></i>
                            </div>` }
                    ]
                };
                that.init();
            }
        ]);
    }
);
