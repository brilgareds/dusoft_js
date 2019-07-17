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

                $scope.copyJson = obj => JSON.parse(JSON.stringify(obj));
                $scope.abrirfechainicial = false;
                $scope.abrirfechafinal = false;
                $scope.abrirfechainicial2 = false;
                $scope.abrirfechafinal2 = false;

                that.init = () => {
                    window.scrollTo(0, 0);
                    $scope.session = {
                        usuario_id: Usuario.getUsuarioActual().getId(),
                        auth_token: Usuario.getUsuarioActual().getToken()
                    };
                    $scope.usuarioName = Usuario.UsuarioActual.usuario;
                    $scope.checkbox = '';
                    $scope.abrirfechainicial = false;
                    $scope.abrirfechafinal = false;
                    $scope.currentDocument = {};
                    $scope.opciones_archivo = new Flow();
                    $scope.opciones_archivo.target = API.PARAMETRIZACION_PRODUCTOS_CLIENTES.SUBIR_ARCHIVO;
                    $scope.opciones_archivo.testChunks = false;
                    $scope.opciones_archivo.singleFile = true;
                    $scope.opciones_archivo.query = { session: JSON.stringify($scope.session) };

                    $scope.root = {
                        init: {
                            contractTypes: [
                                { cod: 1,  name: 'Cliente Especifico' },
                                { cod: 2, name: 'Unidad de Negocio' },
                                { cod: 3, name: 'Contrato Generico' }],
                            docTypes: ['CC', 'NIT'],
                            checkbox: true,
                            searchContract: {
                                generic: false,
                                numberContract: '',
                                businessUnit: '',
                                thirdPartyNames: ''
                            },
                            newContract: {
                                type: { name: '-Seleccione uno-' },
                                docType: 'NIT',
                                checkInIva: true,
                                facturacionAgrupada: true,
                                sincronizar: false,
                                generic: false,
                                authorizeWallet: true,
                                seller: { nombre: '-Seleccione uno-' },
                                businessUnit: { name: '-Seleccione una-' }
                            },
                            addProducts: { mode: false }
                        },
                        form: {}
                    };

                    $scope.root.form.searchContract = $scope.root.init.searchContract;
                    $scope.root.form.addProducts = $scope.root.init.addProducts;
                    $scope.root.form.newContract = $scope.copyJson($scope.root.init.newContract);

                    $scope.root.data = {
                        currentContract: {
                            products: []
                        },
                        contracts: [],
                        contractProducts: [],
                        searchProducts: [{}]
                    };
                    $scope.root.permits = {
                        createContract: Usuario.getUsuarioActual().getModuloActual().opciones.sw_permiso_crear_contrato,
                        updateContractProducts: Usuario.getUsuarioActual().getModuloActual().opciones.sw_permiso_modificar_productos_contratos,
                        updateStatusContract: Usuario.getUsuarioActual().getModuloActual().opciones.sw_permiso_cambiar_estado_contrato,
                        authorizeWallet: Usuario.getUsuarioActual().getModuloActual().opciones.sw_boton_autorizar_cartera,
                        updateContract: Usuario.getUsuarioActual().getModuloActual().opciones.sw_permiso_actualizar_contrato,
                        addProductsContract: Usuario.getUsuarioActual().getModuloActual().opciones.sw_permiso_agregar_productos_contrato
                    };
                    $scope.listContracts();
                    $scope.sellers();
                    $scope.businessUnits();
                    // $scope.root.form.newContract.type = $scope.root.init.contractTypes[0];
                };
                $scope.updateContractType = (newType) => {
                    $scope.root.form.newContract.type = newType;
                    if (newType === '') { }
                };
                $scope.updateDocType = (newType) => { $scope.root.form.newContract.docType = newType; };
                $scope.currentContract_updateDocType = (newType) => { $scope.root.data.currentContract.docType = newType; };
                $scope.updateBusinessUnit = (newUnit) => { $scope.root.form.newContract.businessUnit = newUnit; };
                $scope.updateSeller = (seller) => { $scope.root.form.newContract.seller = seller; };
                $scope.currentContract_updateBusinessUnit = (newUnit) => { $scope.root.data.currentContract.businessUnit = newUnit; };
                $scope.currentContract_updateSeller = (seller) => { $scope.root.data.currentContract.seller = seller; };
                $scope.currentContract_updateType = (newType) => { $scope.root.data.currentContract.type = newType; };

                $scope.abrirFechaInicial = function($event) {
                    $event.preventDefault();
                    $event.stopPropagation();

                    $scope.abrirfechafinal = false;
                    $scope.abrirfechainicial = true;
                };
                $scope.abrirFechaInicial2 = function($event) {
                    $event.preventDefault();
                    $event.stopPropagation();

                    $scope.abrirfechafinal2 = false;
                    $scope.abrirfechainicial2 = true;
                };

                $scope.close = function () {
                    $scope.abrirfechafinal = false;
                    $scope.abrirfechainicial = false;
                    $scope.abrirfechafinal2 = false;
                    $scope.abrirfechainicial2 = false;
                };

                $scope.abrirFechaFinal = function($event) {
                    $event.preventDefault();
                    $event.stopPropagation();

                    $scope.abrirfechafinal = true;
                    $scope.abrirfechainicial = false;
                };
                $scope.abrirFechaFinal2 = function($event) {
                    $event.preventDefault();
                    $event.stopPropagation();

                    $scope.abrirfechafinal2 = true;
                    $scope.abrirfechainicial2 = false;
                };

                $scope.cerrar = function () {
                    $scope.root.activarBoton=true;
                    modalInstance.close();
                    $scope.abrirfechainicial = false;
                    $scope.abrirfechafinal = false;
                    $scope.abrirfechainicial2 = false;
                    $scope.abrirfechafinal2 = false;
                    console.log("224");
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
                $scope.listContracts = (ordenar=true) => {
                    window.scrollTo(0, 0);

                    let obj = {
                        session: $scope.session,
                        data: $scope.root.form.searchContract,
                        ordenar: ordenar
                    };

                    $scope.post(API.PARAMETRIZACION_PRODUCTOS_CLIENTES.LIST_CONTRACTS, obj, data => {
                        if (data.status === 200) {
                            $scope.root.data.contracts = data.obj;
                        } else {
                            AlertService.mostrarVentanaAlerta("Mensaje del sistema: ", data.msj);
                        }
                    });
                };

                $scope.sellers = () => {
                    const obj = {
                        session: $scope.session,
                        data: {}
                    };
                    $scope.post(API.PARAMETRIZACION_PRODUCTOS_CLIENTES.SELLERS, obj, data => {
                        if (data.status === 200) { $scope.root.init.sellers = data.obj; }
                        else { AlertService.mostrarVentanaAlerta("Mensaje del sistema: ", data.msj); }
                    });
                };

                $scope.businessUnits = () => {
                    const obj = {
                        session: $scope.session,
                        data: {}
                    };
                    $scope.post(API.PARAMETRIZACION_PRODUCTOS_CLIENTES.BUSINESS_UNITS, obj, data => {
                        if (data.status === 200) { $scope.root.init.businessUnits = data.obj; }
                        else { AlertService.mostrarVentanaAlerta("Mensaje del sistema: ", data.msj); }
                    });
                };

                $scope.updateStatusContract = (index, contrato) => {
                    const tipeUpdate = contrato.check === true ? 'ACTIVAR':'DESACTIVAR';
                    const respuestaUsuario = confirm(`¿Esta seguro que desea ${tipeUpdate} el contrato #${contrato.contrato_numero}?`);

                    if (respuestaUsuario) {
                        const obj = {
                            session: $scope.session,
                            data: {
                                contrato: contrato
                            }
                        };
                        $scope.post(API.PARAMETRIZACION_PRODUCTOS_CLIENTES.UPDATE_STATUS_CONTRACT, obj, data => {
                            console.log('Data is: ', data);
                            if (data.status !== 200) {
                                AlertService.mostrarMensaje('danger', data.msj);
                                if (data.status === 300) {
                                    $scope.root.data.contracts = data.obj.contracts;
                                } else if (data.status === 500) {
                                    $scope.root.data.contracts[index].check = !contrato.check;
                                }
                            }
                        });
                    } else {
                        $scope.root.data.contracts[index].check = !contrato.check;
                    }
                };

                $scope.listContractProducts = (Contract, modal=true) => {
                    $scope.root.data.currentContract = Contract;
                    const contratoId = $scope.root.data.currentContract.contrato_numero;
                    $scope.root.form.addProducts.contratoClienteId = contratoId;
                    $scope.root.data.searchProducts = [];

                    let obj = {
                        session: $scope.session,
                        data: {
                            contratoId: contratoId
                        }
                    };

                    $scope.post(API.PARAMETRIZACION_PRODUCTOS_CLIENTES.LIST_CONTRACTS_PRODUCTS, obj, data => {
                        if (data.status === 200) {
                            $scope.root.data.currentContract.products = data.obj;
                            console.log('Contrato is: ', $scope.root.data.currentContract);
                            // $scope.root.data.contractProducts = data.obj;
                            if (modal) {
                                $scope.modal($scope.root.data.currentContract.products, 1);
                                $scope.searchThird($scope.root.data.currentContract);
                            }
                        } else { console.log('Error: ', data.obj.err); }
                    });
                };

                $scope.searchInventaryProducts = () => {
                    let obj = {
                        session: $scope.session,
                        data: $scope.root.form.addProducts
                    };

                    $scope.post(API.PARAMETRIZACION_PRODUCTOS_CLIENTES.SEARCH_INVENTARY_PRODUCTS, obj, data => {
                        if (data.status === 200) {
                            $scope.root.data.searchProducts = data.obj;
                            $scope.searchProducts.data = 'root.data.searchProducts';
                        } else {
                            AlertService.mostrarMensaje('Hubo un error!!', data.msj);
                        }
                    });
                };

                $scope.cargar_archivo_plano = $flow => {
                    $scope.opciones_archivo = $flow;
                };
                $scope.cerrar = () => {
                    if ($scope.root.data.searchProducts !== undefined) {
                        $scope.root.data.searchProducts = [];
                    }
                    $scope.abrirfechainicial = false;
                    $scope.abrirfechafinal = false;
                    modalInstance.close();
                };

                $scope.subir_archivo_plano = function () {
                    let usuario = Usuario.getUsuarioActual();
                    $scope.root.progresoArchivo = 10;
                    $scope.opciones_archivo.opts.query.data = JSON.stringify({
                        data: {
                            empresa_id: usuario.empresa.codigo,
                            centro_id: usuario.empresa.centroUtilidad.codigo,
                            bodega_id: usuario.empresa.centroUtilidad.bodega.codigo
                        }
                    });
                    $scope.opciones_archivo.upload();
                };

                $scope.respuesta_archivo_plano = function (file, message) {
                    $scope.root.progresoArchivo = 60;
                    let data = (message !== undefined) ? JSON.parse(message) : {};

                    if (data.status === 200) {
                        $scope.root.progresoArchivo = 100;
                        AlertService.mostrarMensaje("success", data.msj);
                        $scope.root.data.searchProducts = data.obj.productos.validos;
                        for (let producto_invalido of data.obj.productos.invalidos) {
                            AlertService.mostrarMensaje("danger", producto_invalido.mensajeError);
                        }
                        $scope.opciones_archivo.cancel();
                        $scope.root.progresoArchivo = 0;
                    } else {
                        console.log('Error: ', data.obj);
                        AlertService.mostrarMensaje("danger", data.msj);
                    }
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
                $scope.test = () => {

                };

                $scope.addProductsContract = () => {
                    let productosChecks = [];
                    let countChecks = 0;
                    let errJustify = 0;
                    let errPrice = 0;
                    let requireJustify = false;
                    let justifyValid = false;

                    for (let producto of $scope.root.data.searchProducts) {
                        if (producto.check) {
                            countChecks++;
                            productosChecks.push(producto);
                            requireJustify = producto.precio_venta < producto.costo_ultima_compra;
                            justifyValid = producto.justificacion !== undefined && producto.justificacion.length > 20;
                            if (producto.precio_venta === undefined) { errPrice++; }
                            if (requireJustify && !justifyValid) { errJustify++; }
                        }
                    }
                    if (countChecks === 0) {
                        AlertService.mostrarMensaje('danger', 'Debe seleccionar al menos un producto!!');
                    } else {
                        $scope.root.data.searchProducts = productosChecks;
                        if (errJustify > 0) {
                            AlertService.mostrarMensaje('danger', 'La justificación debe contener al menos 20 caracteres!!');
                        } else if (errPrice > 0) {
                            AlertService.mostrarMensaje('danger', 'Hay productos sin precio venta!!');
                        } else {
                            const obj = {
                                session: $scope.session,
                                data: {
                                    contrato: $scope.root.data.currentContract,
                                    productos: productosChecks
                                }
                            };
                            $scope.post(API.PARAMETRIZACION_PRODUCTOS_CLIENTES.ADD_PRODUCTS_CONTRACT, obj, data => {
                                if (data.status === 200) {
                                    $scope.listContractProducts($scope.root.data.currentContract, false);
                                    $scope.root.data.searchProducts = [];
                                    AlertService.mostrarMensaje('success', data.msj);
                                } else {
                                    AlertService.mostrarMensaje('warning', data.msj);
                                }
                            });
                        }
                    }
                };

                $scope.deleteProductContract = (contratoId, productoId) => {
                    let responseUser = confirm('¿Esta seguro de eliminar el producto "' + productoId + '" del contrato #' + contratoId + '?');
                    if (responseUser) {
                        const obj = {
                            session: $scope.session,
                            data: {
                                productoId: productoId,
                                contratoId: contratoId
                            }
                        };

                        $scope.post(API.PARAMETRIZACION_PRODUCTOS_CLIENTES.DELETE_PRODUCT_CONTRACT, obj, data => {
                            if (data.status === 200) {
                                $scope.listContractProducts($scope.root.data.currentContract, false);
                                AlertService.mostrarMensaje('success', data.msj);
                            } else {
                                AlertService.mostrarMensaje('danger', data.msj);
                            }
                        });
                    } else { AlertService.mostrarMensaje('warning', 'El producto no fue eliminado'); }
                };

                $scope.updateProductContract = (Contract, Product) => {
                    Product.producto_precio_pactado = parseFloat(Product.producto_precio_pactado.toString());
                    console.log('Updating....');
                    console.log('Contract: ', Contract);
                    console.log('Product: ', Product);

                    if (false) {
                        AlertService.mostrarMensaje('warning', 'Nuevo precio es igual al anterior!');
                    } else {
                        const obj = {
                            session: $scope.session,
                            data: {
                                contract: Contract,
                                product: Product
                            }
                        };

                        $scope.post(API.PARAMETRIZACION_PRODUCTOS_CLIENTES.UPDATE_PRODUCT_CONTRACT, obj, data => {
                            if (data.status === 200) {
                                AlertService.mostrarMensaje('success', data.msj);
                            } else {
                                AlertService.mostrarMensaje('danger', data.msj);
                            }
                        });
                    }
                };

                $scope.permitInvalid = (permisoNombre) => {
                    console.log(`El usuario no tiene el permiso "${permisoNombre}"!!`);
                    AlertService.mostrarMensaje('danger', 'No tiene permisos para realizar esa funcion!!');
                };

                /************************/
                /*** GRIDS (GRILLAS) ***/
                /**********************/
                $scope.searchProducts = {
                    data: 'root.data.searchProducts',
                    multiSelect: false,
                    enableHighlighting: true,
                    showFilter: true,
                    enableRowSelection: false,
                    enableColumnResize: true,
                    columnDefs: [
                        { field: 'codigo', displayName: 'Codigo', width: '12%' },
                        { field: 'descripcion', displayName: 'Descripcion', width: '30%' },
                        { field: 'requiere_autorizacion', displayName: 'Autorizacion', width: '8%' },
                        { field: 'costo_ultima_compraString', displayName: 'Costo ultima compra', width: '12%' },
                        { displayName: 'Precio venta', width: "13%", cellTemplate: `
                            <div style="text-align: center; display: flex; justify-content: center;">
                                <input ng-if="row.entity.withOutDocument" ng-model="row.entity.precio_venta" class="form-control" style="width: 90%; height: 30px;" type="number" placeholder="Inserte precio venta" required>
                                <label ng-if="!row.entity.withOutDocument" style="width: 90%; height: 30px; display: flex; align-items: center; justify-content: center;">
                                    {{row.entity.precio_ventaString}}
                                </label>
                            </div>`},
                        { displayName: 'Justificación', width: "20%", cellTemplate: `
                            <div style="text-align: center; display: flex; justify-content: center;">
                                <input ng-disabled="row.entity.precio_venta > row.entity.costo_ultima_compra" ng-model="row.entity.justificacion" minlength="20" class="form-control" style="width: 90%; height: 30px;" type="text" placeholder="Justificación del precio de venta" title="Justifique cuando precio venta sea menor al costo">
                            </div>`},
                        { displayName: 'Agregar', width: "5%", cellTemplate: `
                            <div style="text-align: center;">
                                <input ng-click="test()" ng-model="row.entity.check" type="checkbox" id={{row.entity.codigo}} class="checkbox3">
                                <label for={{row.entity.codigo}} class="label3">
                                    <i class="glyphicon glyphicon-check"></i>
                                </label>
                            </div>`}]
                };

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
                        { field: 'contrato_fecha_i', displayName: "Fecha Inicio", width: "8%" },
                        { field: 'contrato_fecha_f', displayName: "Fecha Fin", width: "8%" },
                        { field: 'contrato_valor', displayName: "Valor", width: "10%" },
                        { field: 'contrato_vendedor', displayName: "Vendedor", width: "15%" },
                        { field: 'contrato_descripcion', displayName: "Descripcion - Contrato", width: "16%" },
                        { displayName: 'Mod.', width: "5%", cellTemplate: `
                            <div style="text-align: center;" ng-if="root.permits.updateContractProducts || root.permits.updateContract || root.permits.addProductsContract">
                                <i ng-if='row.entity.check' ng-click="listContractProducts(row.entity, true)" class="glyphicon glyphicon-list-alt" style="color: #0c99d0; font-size: 20px;"></i>
                                <i ng-if='!row.entity.check' class="glyphicon glyphicon-list-alt" style="cursor:initial; color: #a9a9a9; font-size: 20px;"></i>
                            </div>
                            <div style="text-align: center;" ng-if="(!root.permits.updateContractProducts && !root.permits.updateContract && !root.permits.addProductsContract)">
                                <i ng-if='row.entity.check' ng-click="permitInvalid('sw_permiso_modificar_productos_contratos')" class="glyphicon glyphicon-list-alt" style="color: #0c99d0; font-size: 20px;"></i>
                                <i ng-if='!row.entity.check' class="glyphicon glyphicon-list-alt" style="cursor:initial; color: #a9a9a9; font-size: 20px;"></i>
                            </div>
                        ` },
                        { displayName: 'Estado', width: "9%", cellTemplate: `
                            <div class="switch1" ng-if="root.permits.updateStatusContract">
                                <input type="checkbox" ng-model='row.entity.check' ng-change="updateStatusContract(row.rowIndex, row.entity, row.entity.check)" ng-checked="{{row.entity.check}}" name="switch1" class="switch1-checkbox" id="{{row.entity.contrato_numero}}">
                                <label class="switch1-label" for="{{row.entity.contrato_numero}}">
                                    <span class="switch1-inner"></span>
                                    <span class="switch1-switch"></span>
                                </label>
                            </div>
                            <div class="switch1" ng-if="!root.permits.updateStatusContract">
                                <input type="checkbox" ng-model='row.entity.check' name="switch1" class="switch1-checkbox" id="{{row.entity.contrato_numero}}" disabled>
                                <label class="switch1-label" for="{{row.entity.contrato_numero}}" ng-click="permitInvalid('sw_permiso_cambiar_estado_contrato')">
                                    <span class="switch1-inner"></span>
                                    <span class="switch1-switch"></span>
                                </label>
                            </div>
                        ` }
                        // { field: 'contrato_op', displayName: "Op", width: "10%" },
                        // { field: 'contrato_prod', displayName: "Prod", width: "10%" },
                        // { field: 'contrato_est', displayName: "Est", width: "10%" }
                        // { displayName: 'Crear', width: "5%", cellTemplate: '<div style="text-align: center;"><i ng-click="crearNotaTemporal(row.entity)" class="fa fa-plus-circle fa-2x" aria-hidden="true" style="color: #0c99d0;"></i></div>' }
                    ]
                };

                const validCreateContract = obj => {
                    let error = {count: 0, msg: 'Formato incorrecto en los campos:\n'};

                    obj.sellerDocType = obj.seller.sellerDocType;
                    obj.sellerDocNum = obj.seller.sellerDocNum;
                    obj.businessUnitCod = obj.businessUnit.codigo_unidad_negocio;

                    if (!obj.type.cod) {
                        error.count++; error.msg += '"Tipo Contrato", ';
                    }
                    if (obj.type.cod === 1 && !obj.docType) {
                        error.count++; error.msg += '"Tipo Documento Cliente", ';
                    }
                    if (obj.type.cod === 1 && !obj.docNum) {
                        error.count++; error.msg += '"Numero Documento Cliente", ';
                    }
                    if (obj.type.cod === 2 && !obj.businessUnit.cod && obj.businessUnit.cod !== 0) {
                        error.count++; error.msg += '"Unidad de Negocio", ';
                    }
                    if (!obj.description) {
                        error.count++; error.msg += '"Descripción", ';
                    }
                    if (!obj.dateInit) {
                        error.count++; error.msg += '"Fecha Inicial", ';
                    }
                    if (!obj.dateExpired) {
                        error.count++; error.msg += '"Fecha Vencimiento", ';
                    }
                    if (!obj.terms) {
                        error.count++; error.msg += '"Condiciones", ';
                    }
                    if (!obj.observations) {
                        error.count++; error.msg += '"Observaciones", ';
                    }
                    if (!obj.percGeneric) {
                        error.count++; error.msg += '"Porcentaje Generico", ';
                    }
                    if (!obj.percBrand) {
                        error.count++; error.msg += '"Porcentaje Marca", ';
                    }
                    if (!obj.percSupplies) {
                        error.count++; error.msg += '"Porcentaje Insumos", ';
                    }
                    if (!obj.value) {
                        error.count++; error.msg += '"Valor Contrato", ';
                    }
                    if (!obj.seller.sellerDocType || !obj.seller.sellerDocNum) {
                        error.count++; error.msg += '"Vendedor", ';
                    }
                    error.msg = error.msg.substring(0, error.msg.length - 2);

                    return error;
                };

                $scope.searchThird = (Contract) => {
                    // console.log('Helloo!! Is my!!');
                    if (Contract.docNum) {
                        const obj = {
                            session: $scope.session,
                            data: {
                                docType: Contract.docType,
                                docNum: Contract.docNum
                            }
                        };
                        console.log('Contract is: ', Contract);
                        console.log('obj is: ', obj.data);

                        $scope.post(API.PARAMETRIZACION_PRODUCTOS_CLIENTES.SEARCH_THIRD, obj, data => {
                            if (data.status === 200) {
                                Contract.name = data.obj.nombre_tercero;
                                Contract.address = data.obj.direccion;
                                Contract.phone = data.obj.telefono;
                                Contract.email = data.obj.email;

                                // console.log('The Third parties is: ', data.obj);
                            } else { console.log(data.obj); AlertService.mostrarMensaje('danger', data.msj); }
                        });
                    }
                };

                $scope.createContract = (Contract, update=false) => {
                    let error = validCreateContract(Contract);

                    if (error.count > 0) {
                        AlertService.mostrarMensaje('danger', error.msg);
                        return false;
                    } else {
                        Contract.generic = (Contract.type === 'Contrato Generico');
                        Contract.sellerDocType = Contract.seller.sellerDocType;
                        Contract.sellerDocNum = Contract.seller.sellerDocNum;
                        Contract.businessUnitCod = Contract.businessUnit.cod;
                        Contract.typeCod = Contract.type.cod;

                        let obj = {
                            session: $scope.session,
                            data: {
                                contract: Contract,
                                update: update
                            }
                        };

                        $scope.post(API.PARAMETRIZACION_PRODUCTOS_CLIENTES.CREATE_CONTRACT, obj, data => {
                            if (data.status !== 500) {
                                if (data.status === 200) { AlertService.mostrarMensaje('success', data.msj); }
                                else { AlertService.mostrarMensaje('warning', data.msj); }
                                $scope.root.form.searchContract = $scope.root.init.searchContract;

                                if (Contract.type.cod === 1) {
                                    $scope.root.form.searchContract.thirdPartyNames = $scope.root.form.newContract.name;
                                } else if (Contract.type.cod === 2) {
                                    $scope.root.form.searchContract.businessUnit = $scope.root.form.newContract.businessUnit.descripcion;
                                } else if (Contract.type.cod === 3) {
                                    $scope.root.form.searchContract.generic = true;
                                }
                                if (!update) {
                                    $scope.root.data.currentContract = $scope.copyJson($scope.root.init.newContract);
                                }
                                $scope.root.form.newContract = $scope.copyJson($scope.root.init.newContract);
                                $scope.listContracts(false); $scope.listContracts(false);
                            } else {
                                console.log('Error:', data.obj);
                                AlertService.mostrarMensaje('danger', data.msj);
                            }
                        });
                    }
                };

                $scope.updatePrice = (Contract, Product) => {
                    console.log('Updating');
                    console.log('Product: ', Product);
                };

                $scope.contractProducts = {
                    data: 'root.data.currentContract.products',
                    multiSelect: false,
                    enableHighlighting: true,
                    showFilter: true,
                    enableRowSelection: false,
                    enableColumnResize: true,
                    columnDefs: [
                        { field: 'producto_codigo', displayName: 'Codigo', width: '12%' },
                        { field: 'producto_descripcion', displayName: 'Descripcion', width: '30%' },
                        { field: 'requiere_autorizacion', displayName: 'Autorización', width: '8%' },
                        { field: 'costo_ultima_compraString', displayName: 'Costo Ultima Compra', width: '10%' },
                        { field: 'producto_precio_pactado', displayName: 'Precio Venta', enableCellEdit: true, width: '11%' },
                        { field: 'justificacion', displayName: 'Justificación', enableCellEdit: true, width: '19%' },
                        { displayName: 'Actualizar', width: '5%', cellTemplate: `
                            <div style="text-align: center; height: 36px;">
                                <i ng-click="updateProductContract(root.data.currentContract, row.entity)" class="glyphicon glyphicon-floppy-disk" style="color: #236094; font-size: 20px; height: 37px;"></i>
                            </div>` },
                        { displayName: 'Borrar', width: '5%', cellTemplate: `
                            <div style="text-align: center;">
                                <i ng-click="deleteProductContract(root.data.currentContract.contrato_numero, row.entity.producto_codigo)" class="glyphicon glyphicon-trash" style="color: #bd3838; font-size: 20px;"></i>
                            </div>` }
                            /*
                                { displayName: 'Precio Venta', enableCellEdit: true, width: '10%', cellTemplate: `
                                    <div class="email" ng-edit-cell-if="isFocused && row.entity.canEdit" style="height: 31px;">
                                        <input ng-class={{row.entity.producto_codigo}} ng-model="row.entity.producto_precio_pactado" style="height: 32px;"/>
                                    </div>
                                    <div ng-edit-cell-if="isFocused" style="height: 33px;">
                                        <div class="ngCellText" ng-class="col.colIndex()" style="height: 34px;">
                                            <span ng-cell-text style="height: 35px;">{{row.entity.producto_precio_pactado}}</span>
                                        </div>
                                    </div>` },
                            */
                    ]
                };
                that.init();
            }
        ]);
    }
);
