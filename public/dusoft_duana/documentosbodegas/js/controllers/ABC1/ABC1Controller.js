
/* global entregado, si, $flow, that, $http, echo, subirArchivo, flow, data, modalInstancesy, form, backdrop, parametros, parametros, parametros, archivo */

define(["angular", "js/controllers", 'includes/slide/slideContent',
    "includes/classes/Empresa",
], function (angular, controllers) {
    controllers.controller('ABC1Controller', [
        '$scope', '$rootScope', "Request",
        "$filter", '$state', '$modal',
        "API", "AlertService", 'localStorageService',
        "Usuario", "socket", "$timeout",
        "Empresa", "CentroUtilidad", "Bodega",
        function ($scope, $rootScope, Request, $filter, $state, $modal, API, AlertService, localStorageService, Usuario, socket, $timeout, Empresa, CentroUtilidad, Bodega) {
            var that = this;
            $scope.radicacion = '';
            $scope.desactivar = '0';
            var fecha_actual = new Date();
            $scope.abrir_fecha = false;
            $scope.buscar_radicacion_id = '';
            $scope.fecha_vencimiento = $filter('date')(fecha_actual, "yyyy-MM-dd"),
                $scope.session = {
                    usuario_id: Usuario.getUsuarioActual().getId(),
                    auth_token: Usuario.getUsuarioActual().getToken()
                };
            $scope.root = {
                farmaciaSeleccionada: "",
                conceptoSeleccionado: "",
                numeroFactura: "",
                precioSeleccionado: "",
                fecha_vencimiento: "",
                progresoArchivo: "",
                descripcion: "",
                buscar_radicacion_id: ''
            };
            $scope.root.concepto = [];
            $scope.filtro = {};
            var infoEmpresa=Usuario.getUsuarioActual().empresa;
            $scope.filtro.empresa_seleccion = infoEmpresa.codigo;
            $scope.Empresa = Empresa.get(infoEmpresa.nombre, infoEmpresa.codigo);

            console.log('Tu empresa es: ',infoEmpresa);

            $scope.abrir_fecha_inicial = function ($event) {
                $event.preventDefault();
                $event.stopPropagation();
                $scope.abrir_fecha = $scope.abrir_fecha ? false : true;
            };

            $scope.cancelar_documento = function(){
                location.href ="#/DocumentosBodegas";
            };

            $scope.consultarMunicipio = function (termino) {
                if (termino.length <3){
                    return;
                }

                var obj = {
                    session: $scope.session,
                    data: {
                        ciudades : {
                            termino_busqueda : termino
                        }
                    }

                };

                Request.realizarRequest(
                    API.PARAMETRIZACION.LISTAR_MUNICIPIO,
                    "POST",
                    obj,
                    function (data) {
                        if (data.status === 200){
                            $scope.root.farmaciaSeleccionada = [];
                            //that.render(data.obj.farmaciaSeleccionada);
                            $scope.root.municipio = data.obj.ciudades;
                        }

                    });
            };


            that.consultarConcepto = function () {
                var obj = {
                    session: $scope.session,
                    data: {}
                };

                Request.realizarRequest(
                    API.RADICACION.LISTAR_CONCEPTO,
                    "POST",
                    obj,
                    function (data) {
                        if (data.status === 200) {
                            $scope.root.concepto = [];
//                                $scope.root.conceptoSeleccionado = [];
                            that.render(data.obj.listarConcepto);
                        }
                    }
                );
            };

            that.render = function (lista) {
                lista.forEach(function (data) {
                    var concepto = {concepto_radicacion_id: data.concepto_radicacion_id, observacion: data.observacion};
                    $scope.root.concepto.push(concepto);
                });
            };

            that.listarFactura = function () {
                var obj = {
                    session: $scope.session,
                    data: {}
                };

                Request.realizarRequest(
                    API.RADICACION.LISTAR_FACTURA,
                    "POST",
                    obj,
                    function (data) {
                        if (data.status === 200) {
                            $scope.root.listarFactura = data.obj.listarFactura;
                        }
                    }
                );

            };

            that.listarAgrupar = function (parametro, callback) {
                var empresa_id = $scope.session.empresaId;
                if(parametro.radicacion_id == undefined){ parametro.radicacion_id = ''; }
                if($scope.root.buscar_radicacion_id !== parametro.radicacion_id ||
                    $scope.fecha_ini != parametro.fecha_ini ||
                    $scope.fecha_fin != parametro.fecha_fin){

                    $scope.root.buscar_radicacion_id = parametro.radicacion_id;
                    $scope.fecha_ini = parametro.fecha_ini;
                    $scope.fecha_fin = parametro.fecha_fin;
                    var fecha_ini = parametro.fecha_ini;
                    var fecha_fin = parametro.fecha_fin;
                    if(fecha_ini && fecha_ini.lenght > 9){
                        fecha_ini = fecha_ini.substring(0, 10);
                    }
                    if(fecha_fin && fecha_fin.lenght > 9){
                        fecha_fin = fecha_fin.substring(10);
                    }
                    var infoEmpresa=Usuario.getUsuarioActual().empresa;
                    $scope.Empresa = Empresa.get(infoEmpresa.nombre, infoEmpresa.codigo);

                    var obj = {
                        session: $scope.session,
                        data: {
                            filtro: $scope.filtroBusqueda,
                            relacion_id: $scope.root.buscar_radicacion_id,
                            fecha_ini: fecha_ini,
                            fecha_fin: fecha_fin,
                            prefijo: 'ABC'
                        }
                    };
                    //console.log('Objeto --> ',obj);
                    //console.log('Antes del Ajax');

                    Request.realizarRequest(
                        API.RADICACION.LISTAR_AGRUPAR,
                        "POST",
                        obj,
                        function (data) {
                            //console.log('Ajax realizado!!');
                            //console.log("data",data);
                            if (data.status === 200) {
                                // $scope.root.listarAgrupar = data.obj.listarAgrupar;
                                // console.log("data.obj.listarAgrupar",data.obj.listarAgrupar);
                                parametro = {};
                                callback(data.obj);
                            }
                        }
                    );
                }
            };

            that.guardarConcepto = function (nombreConcepto, callback) {
                var obj = {
                    session: $scope.session,
                    data: {
                        nombre: nombreConcepto.toUpperCase()
                    }
                };
                Request.realizarRequest(
                    API.RADICACION.GUARDAR_CONCEPTO,
                    "POST",
                    obj,
                    function (data) {

                        if (data.status === 200) {
                            that.consultarConcepto();
                            $scope.root.nombreConcepto = "";
                            AlertService.mostrarVentanaAlerta("Mensaje del sistema", "Proveedor guardado correctamente");
                            callback(true);
                            return;
                        } else {
                            callback(false);
                            return;
                        }
                    }
                );
            };
            that.guardarArchivo = function (nombreConcepto, callback) {
                var obj = {
                    session: $scope.session,
                    data: {
                        nombre: nombreConcepto.toUpperCase()
                    }
                };
                Request.realizarRequest(
                    API.RADICACION.GUARDAR_CONCEPTO,
                    "POST",
                    obj,
                    function (data) {
                        if (data.status === 200) {
                            that.consultarConcepto();
                            $scope.root.nombreConcepto = "";
                            AlertService.mostrarVentanaAlerta("Mensaje del sistema", "Concepto guardado correctamente");
                            callback(true);
                            return;
                        } else {
                            callback(false);
                            return;
                        }
                    }
                );
            };








            that.modificarFactura = function (parametros) {
                var obj = {
                    session: $scope.session,
                    data: {
                        factura_id: parametros.factura_id,
                        sw_entregado: '1',

                        concepto_radicacion_id: parametros.concepto_radicacion_id,
                        numero_factura: parametros.numeroFactura,
                        fecha_entrega: 'now()',
                        precio: parametros.precio,
                        tipo_mpio_id: parametros.tipo_mpio_id,
                        municipio: parametros.nombre_ciudad,
                        ruta: parametros.ruta
                    }
                };


                Request.realizarRequest(
                    API.RADICACION.MODIFICAR_FACTURA, //Radicacion/guardarFactura
                    "POST",
                    obj,
                    function (data) {
                        if (data.status === 200) {
                            that.listarFactura();


                            AlertService.mostrarVentanaAlerta("Mensaje del sistema", "factura modificada correctamente");
                            return;
                        }

                        AlertService.mostrarVentanaAlerta("Mensaje del sistema", "Error al modificar la Factura");
                    }
                );
            };

            $scope.formatDate = function(date){
                if(date == 0 || date == undefined){
                    date = new Date();
                }
                var mes = parseInt(date.getMonth()+1);
                if(mes<10){ mes = '0'+mes; }
                var response = '01-'+(mes)+'-'+date.getFullYear()+' 00:00:00';
                return new Date(response);
            };

            $scope.buscarProductos = function(){
                //console.log('Before....fecha ini es : ', $scope.producto_fecha1, 'Y fecha2 es: ', $scope.producto_fecha2);
                var fecha1 = $scope.producto_fecha1;
                var fecha2 = $scope.producto_fecha2;
                //console.log('After.....fecha ini es : ', fecha1, 'Y fecha2 es: ', fecha2);
                var codigoProductosBuscar = {radicacion_id: $scope.producto, fecha_ini: fecha1, fecha_fin: fecha2};

                that.listarAgrupar(codigoProductosBuscar, function (dato) {
                    //console.log("Los datos devueltos son:  -->",dato);
                    dato.documentosAjustes.forEach(function(element) {
                        var fecha0 = new Date(element.fecha);
                        //element.fecha = fecha[0]+' '+fecha[1].substring(0, 8);
                        //element.fecha = $scope.formatDate(fecha);
                        var day = fecha0.getDate();
                        var month = parseInt(fecha0.getMonth())+1;
                        var year = fecha0.getFullYear();
                        var hour = fecha0.getHours();
                        var minute = fecha0.getMinutes();
                        var seconds = fecha0.getSeconds();

                        if(month<10){ month = '0'+month; }
                        if(day<10){ day = '0'+day; }
                        if(hour<10){ hour = '0'+hour; }
                        if(minute<10){ minute = '0'+minute; }
                        if(seconds<10){ seconds = '0'+seconds; }

                        element.fecha = year+'-'+month+'-'+day+' '+hour+':'+minute+':'+seconds;
                    });
                    $scope.root.listarAgrupar = dato.listarAgrupar;
                    var magnitudMinima = 15;
                    var cantidadProductos = dato.documentosAjustes.length;
                    for(var i=cantidadProductos; i<magnitudMinima; i++){
                        dato.documentosAjustes.push('');
                    }
                    $scope.root.listarDocumentosProductos = dato.documentosAjustes;
                    console.log('Nueva lista -->',$scope.root.listarAgrupar);
                });
            };

            that.agrupar = function (form) {
                $scope.opts = {
                    backdrop: 'static',
                    backdropClick: true,
                    dialogFade: false,
                    windowClass: 'app-modal-window-ls-xlg-ls',
                    keyboard: false,
                    showFilter: true,
                    templateUrl: 'views/ABC1/modificarEntregado.html',
                    scope: $scope,
                    controller: ['$scope', '$modalInstance', function ($scope, $modalInstance) {
                        $scope.modificar = {};
                        $scope.modificar.sw_entregado = form.sw_entregado;
                        $scope.modificar.factura_id = form.factura_id;
                        $scope.modificar.facturaSeleccionada = form.factura_id;
                        $scope.modificar.archivo = form.archivo;




                        $scope.onVisualizarAgrupar = function (listado) {

                            that.subirArchivoEntregado(listado, $modalInstance);

                        };

                        that.limpiarGuardar=function(){
                            $scope.root.cargarFormato='';

                        }

                        $scope.guardarEntregado = function () {

                            that.guardarEntregado($scope.modificar.facturaSeleccionada, function (data) {

                            });
                        };
                        $scope.cerrar = function () {
                            $scope.root.activarBoton=true;
                            $modalInstance.close();
                            $scope.producto = '';
                            $scope.listar_agrupar = '';
                            $scope.root.buscar_radicacion_id = '';
                            $scope.fecha_ini = '';
                            $scope.fecha_fin = '';
                            $scope.buscarProductos();
                            console.log("227");
                        };
                    }]
                };
                //var modalInstance = $modal.open($scope.opts);
                var modalInstance = $modal.open($scope.opts);
                modalInstance.result.then(function () {
                    that.listarAgrupar({radicacion_id: ""}, function (dato) {
                        $scope.root.listarAgrupar = dato;
                    });
                }, function () {});

            };





            that.modificarEntregado = function (parametros) {
                var obj = {
                    session: $scope.session,
                    data: {
                        factura_id: parametros.factura_id,
                        sw_entregado: '1',

                    }
                };


                Request.realizarRequest(
                    API.RADICACION.MODIFICAR_ENTREGADO, //Radicacion/guardarFactura
                    "POST",
                    obj,
                    function (data) {
                        if (data.status === 200) {
                            that.listarFactura();


                            AlertService.mostrarVentanaAlerta("Mensaje del sistema", "factura modificada entregada correctamente");
                            return;
                        }

                        AlertService.mostrarVentanaAlerta("Mensaje del sistema", "Error al modificar la Factura entregada");
                    }
                );
            };


            that.listarFacturaEntregado = function () {
                var obj = {
                    session: $scope.session,
                    data: {}

                };

                Request.realizarRequest(
                    API.RADICACION.LISTAR_FACTURA_ENTREGADO,
                    "POST",
                    obj,
                    function (data) {
                        if (data.status === 200) {
                            $scope.root.listarFacturaEntregado = data.obj.listarFacturaEntregado;
                        }
                    }
                );

            };

            that.agregarFacturaEntregado = function () {
                var obj = {
                    session: $scope.session,
                    data: {
                        numeroFactura: $scope.root.listarFacturaEntregado.factura_id,
                        numeroRadicacion: $scope.radicacion,
                        sw_entregado: '1'
                    }

                };
                Request.realizarRequest(
                    API.RADICACION.AGREGAR_FACTURA_ENTREGADO,
                    "POST",
                    obj,
                    function (data) {
                        if (data.status === 200) {
                            that.listarFacturaEntregado();
                            // $scope.root.agregarFacturaEntregado = data.obj.listarFacturaEntregado;

                        }
                    }
                );

            };



            that.planillaRadicacion = function (parametro) {
                var obj = {
                    session: $scope.session,
                    data: {

                        relacion_id: parametro.relacion_id,
                    }

                };

                Request.realizarRequest(
                    API.RADICACION.PLANILLA_RADICACION,
                    "POST",
                    obj,
                    function (data) {
                        if (data.status === 200) {
                            setTimeout(function () {
                                that.listarAgrupar({radicacion_id: ""}, function (dato) {
                                    $scope.root.listarAgrupar = dato;
                                });
                            }, 500);
                            $scope.visualizarReporte("/reports/" + data.obj.nomb_pdf, data.obj.nomb_pdf, "_blank");
                        }
                    }
                );
            };



            that.guardarFactura = function (ruta) {
                // return;
//                var fecha = new Date($scope.root.fecha_vencimiento);
//
//                var fecha_vencimiento = (fecha.getMonth() + 1) + '-' + fecha.getDate() + '-' + fecha.getFullYear() + ' 00:00:00';

                var obj = {
                    session: $scope.session,
                    data: {
                        numeroFactura: $scope.root.numeroFactura,
                        conceptoRadicacionId: $scope.root.conceptoSeleccionado.concepto_radicacion_id,
                        swEntregado: '1',
                        precio: $scope.root.precioSeleccionado,
                        fechaVencimiento: $scope.root.fecha_vencimiento,
                        descripcion: $scope.root.descripcion,
                        ruta: ruta,
                        municipio: $scope.root.farmaciaSeleccionada.nombre_ciudad,
                        tipo_mpio_id: $scope.root.farmaciaSeleccionada.id,
                        tipo_pais_id: $scope.root.farmaciaSeleccionada.pais_id,
                        tipo_dpto_id:$scope.root.farmaciaSeleccionada.departamento_id
                    }


                };


                //aqui

                Request.realizarRequest(
                    API.RADICACION.GUARDAR_FACTURA,
                    "POST",
                    obj,
                    function (data) {
                        if (data.status === 200) {
                            that.listarFactura();
                            $scope.root.numeroFactura = '';
                            // $scope.root.conceptoSeleccionado = [];
                            //$scope.root.farmaciaSeleccionada = [];
                            $scope.root.farmaciaSeleccionada = "";
                            $scope.root.conceptoSeleccionado = "";
                            $scope.root.precioSeleccionado = '';
                            $scope.root.descripcion = '';
                            $scope.root.fecha_vencimiento = [];
                            $scope.root.farmaciaSeleccionada.id="";
                            $scope.root.farmaciaSeleccionada.pais_id="";
                            $scope.root.farmaciaSeleccionada.departamento_id="";
                            $scope.root.progresoArchivo = 0;
                            $scope.root.files = [];
                            $scope.files = [];
                            var fd = new FormData();
                            AlertService.mostrarVentanaAlerta("Mensaje del sistema", "Factura guardada correctamente");
                            return;
                        }

                        AlertService.mostrarVentanaAlerta("Mensaje del sistema", "Error al guardar la Factura");
                    }
                );
            };

            that.agruparFactura = function () {
//                var fecha = new Date($scope.root.fecha_vencimiento);
//                var fecha_vencimiento = (fecha.getMonth() + 1) + '-' + fecha.getDate() + '-' + fecha.getFullYear() + ' 00:00:00';
                var obj = {
                    session: $scope.session,
                    data: {
                        facturas: $scope.listaFacturaPendiente
                    }
                };


                Request.realizarRequest(
                    API.RADICACION.AGRUPAR_FACTURA,
                    "POST",
                    obj,
                    function (data) {
                        if (data.status === 200) {
                            AlertService.mostrarVentanaAlerta("Mensaje del sistema", "Factura agrupada correctamente");
                            return;
                        }
                        AlertService.mostrarVentanaAlerta("Mensaje del sistema", "Error al guardar la Factura");
                    }
                );
            };

            that.eliminarGrupoFactura = function (parametro, callback) {

                var obj = {
                    session: $scope.session,
                    data: {
                        agrupar_factura_id: parametro.relacion_id,
                        factura_id: parametro.factura_id
                    }
                };

                Request.realizarRequest(
                    API.RADICACION.ELIMINAR_GRUPO_FACTURA,
                    "POST",
                    obj,
                    function (data) {
                        if (data.status === 200) {
                            that.listarAgrupar(parametro, function (listado) {
                                $scope.listaFacturaPendienteModificar = [];

                                listado.forEach(function (element) {

                                    $scope.listaFacturaPendienteModificar.push(element);

                                });
                                that.listarAgrupar({radicacion_id: ""}, function (dato) {
                                    $scope.root.listarAgrupar = dato;
                                    that.listarFactura();
                                });
                            });
                            callback(true);
                            return;
                        } else {
                            AlertService.mostrarVentanaAlerta("Mensaje del sistema", "Error al guardar la Factura");
                            callback(false);
                        }
                    }
                );
            };



            that.verConcepto = function () {
                $scope.opts = {
                    backdrop: true,
                    backdropClick: true,
                    dialogFade: false,
                    windowClass: 'app-modal-window-smlg',
                    keyboard: true,
                    showFilter: true,
                    cellClass: "ngCellText",
                    templateUrl: 'views/PreciosProductos/vistaConceptos.html',
                    scope: $scope,
                    controller: ['$scope', '$modalInstance', function ($scope, $modalInstance) {

                        $scope.guardarConcepto = function () {
                            that.guardarConcepto($scope.root.nombreConcepto, function (data) {
                                if (data) {

                                    $scope.cerrar();
                                }
                            });
                        };

                        $scope.cerrar = function () {
                            console.log("11");
                            $modalInstance.close();
                        };
                    }]
                };
                var modalInstance = $modal.open($scope.opts);
            };

            $scope.onVistaAgrupar = function () {
                $scope.listaFacturaPendiente = [];

                $scope.root.listarFactura.forEach(function (element) {
                    if (element.sw_entregado === '0') {
                        $scope.listaFacturaPendiente.push(element);
                    }

                });
                that.verAgruparFactura();
            };
            //mañana
            that.factura = function (form) {
                $scope.opts = {
                    backdrop

                }
            }




            that.verAgruparFactura = function (form) {
                $scope.opts = {
                    backdrop: true,
                    backdropClick: true,
                    dialogFade: false,
                    windowClass: 'app-modal-window-xlg',
                    keyboard: true,
                    showFilter: true,
                    cellClass: "ngCellText",
                    templateUrl: 'views/PreciosProductos/agrupaFactura.html',
                    scope: $scope,
                    controller: ['$scope', '$modalInstance', function ($scope, $modalInstance) {
                        $scope.agrupar = {};
                        // $scope.agrupar.relacion_id = form.relacion_id;
                        /// $scope.agrupar.archivo= form.archivo;
                        //$scope.agrupar.agrupar_factura_id=form.agrupar_factura_id;
                        // $scope.agrupar.fecha_registro=form.fecha_registro;
                        // $scope.agrupar.usuario_id=form.usuario_id;
                        // $scope.agrupar.factura_id = form.factura_id;


                        $scope.guardarAgruparFactura = function () {

                            if (listaAgrupados.length > 0) {
                                var obj = {
                                    session: $scope.session,
                                    data: {
                                        facturas: listaAgrupados
                                    }
                                };

                                Request.realizarRequest(
                                    API.RADICACION.AGRUPAR_FACTURA,
                                    "POST",
                                    obj,
                                    function (data) {
                                        if (data.status === 200) {
                                            that.listarFactura();
                                            that.listarAgrupar({radicacion_id: ""}, function (dato) {
                                                $scope.root.listarAgrupar = dato;
                                            });

                                            AlertService.mostrarVentanaAlerta("Mensaje del sistema", "Factura agrupada correctamente");
                                            $scope.cerrar();
                                            return;
                                        }
                                        AlertService.mostrarVentanaAlerta("Mensaje del sistema", "Error al agrupar la Factura");
                                    }
                                );
                            } else {
                                var mensaje = "";
                                if (listaAgrupados.length === 0) {
                                    mensaje = "Debe seleccionar una factura";
                                }

                                AlertService.mostrarVentanaAlerta("Mensaje del sistema", mensaje);
                                return;
                            }

                        };


                        $scope.onArchivoSeleccionadoFormato = function (files) {
                            $scope.files = files;

                        };

                        $scope.selected = [];
                        var listaAgrupados = [];
                        $scope.onAgruparFactura = function (item, list) {
                            var idx = list.indexOf(item);
                            if (idx > -1) {
                                list.splice(idx, 1);
                            } else {
                                list.push(item);
                            }
                            listaAgrupados = list;

                        };
                        $scope.exists = function (item, list) {
                            return list.indexOf(item) > -1;
                        };

                        $scope.cerrar = function () {
                            console.log("11eee");
                            $modalInstance.close();
                        };

                    }]
                };
                var modalInstance = $modal.open($scope.opts);
            };

            that.verModificar = function (form) {
                $scope.opts = {
                    backdrop: true,
                    backdropClick: true,
                    dialogFade: false,
                    windowClass: 'app-modal-window-ls-xlg-ls',
                    keyboard: true,
                    showFilter: true,
                    cellClass: "ngCellText",
                    templateUrl: 'views/PreciosProductos/vistaModificarFactura.html',
                    scope: $scope,
                    controller: ['$scope', '$modalInstance', function ($scope, $modalInstance) {
                        $scope.editar = {};
                        $scope.editar.sw_entregado = form.sw_entregado;
                        $scope.editar.factura_id = form.factura_id;
                        $scope.editar.numeroFactura = form.numero_factura;
                        $scope.editar.precioSeleccionado = form.precio;
                        $scope.editar.conceptooSeleccionado = form.descripcion;
                        $scope.editar.fecha_entrega = form.fecha_vencimiento;
                        $scope.editar.cargarArchivo = form.ruta;
                        $scope.editar.farmacias = form.farmacias;
                        $scope.editar.concepto = form.concepto;
                        $scope.editar.conceptoSeleccionado = {concepto_radicacion_id: form.concepto_radicacion_id, observacion: form.proveedor};
                        $scope.editar.farmaciaSeleccionada = {tipo_mpio_id: form.tipo_mpio_id, nombre_ciudad: form.municipio};
                        $scope.abrir_fecha_editar = false;

                        $scope.onEditarFactura = function () {
                            if ($scope.editar.numeroFactura === '') {
                                AlertService.mostrarVentanaAlerta("Mensaje del sistema", "Debe digitar el numero de la Factura");
                                return;
                            }
                            editarFactura();
                        };

                        $scope.cancelar = function () {
                            console.log("11sss");
                            $modalInstance.close();
                        };

                        function editarFactura() {
                            //formateo de fecha
                            var data = {
                                fechaEntrega: $filter('date')($scope.editar.fecha_entrega, "yyyy-MM-dd"),
                                factura_id: $scope.editar.factura_id,
                                sw_entregado: '1',
                                conceptoSeleccionado: $scope.editar.conceptoSeleccionado.concepto_radicacion_id,
                                numeroFactura: $scope.editar.numeroFactura,
                                precio: $scope.editar.precioSeleccionado,
                                conceptooSeleccionado: $scope.editar.conceptooSeleccionado,
                                tipo_mpio_id: $scope.editar.farmaciaSeleccionada.id,
                                tipo_dpto_id:  $scope.editar.farmaciaSeleccionada.departamento_id,
                                ruta: $scope.editar.cargarArchivo,
                                nombre_ciudad: $scope.editar.farmaciaSeleccionada.nombre_ciudad
                            }
                            that.subirArchivo(2, data, $modalInstance);
                        };

                        $scope.abrir_fecha_inicial_editar = function ($event) {
                            $event.preventDefault();
                            $event.stopPropagation();
                            $scope.abrir_fecha_editar = $scope.abrir_fecha_editar ? false : true;
                        };
                    }]
                };
                var modalInstance = $modal.open($scope.opts);
                modalInstance.result.then(function () {
                    that.listarFactura();
                }, function () {});
            };


//1
            $scope.listar_factura = {
                data: 'root.listarFactura',
                multiSelect: false,
                enableHighlighting: true,
                showFilter: true,
                enableRowSelection: false,
                columnDefs: [
                    {field: 'municipio', displayName: "Ciudad", width: "25%"},
                    {field: 'numero_factura', displayName: 'No. Producto', width: "7%"},
                    {field: 'proveedor', displayName: 'Proveedor', width: "10%"},
                    {field: 'descripcion', displayName: 'Descripcion', width: "16%"},
                    {field: 'precio', displayName: 'Precio', width: "8%"},
                    {field: 'fecha_entrega', displayName: 'Radicacion', width: "8%"},
                    {field: 'fecha_vencimiento', displayName: 'Vencimiento', width: "8%"},
                    {displayName: 'Accion', cellClass: "txt-center dropdown-button", width: "7%",
                        cellTemplate: ' <div class="row">\
                                          <div class= "txt-center dropdown-button" "checkbox" ng-if="row.entity.sw_entregado==0">\
                                            <label> \
                                              <span class="glyphicon glyphicon-remove"></span>\
                                            </label>\
                                         </div>\
                                          <div class=  "txt-center dropdown-button" "checkbox" ng-if="row.entity.sw_entregado==1">\
                                            <label> \
                                              <span class="glyphicon glyphicon-ok"></span>\
                                            </label>\
                                         </div>\
                                       </div>'


                    },

                    {displayName: "Descargas", cellClass: "txt-center dropdown-button", width: "7%",
                        cellTemplate: '<div class="ngCellText" ng-class="col.colIndex()" style="text-align:center;">\
                                        <button ng-click="onDescargarArchivo(row.entity)" class="btn btn-default btn-xs"><span class="glyphicon glyphicon-download-alt"></span></button>\
                                     </div>'
                    },
                    {displayName: "Modificar", cellClass: "txt-center dropdown-button", width: "6%",
                        cellTemplate: '<div class="ngCellText" ng-class="col.colIndex()" style="text-align:center;">\
                                        <button ng-click="onModificar(row.entity)" class="btn btn-default btn-xs"><span class="glyphicon glyphicon-edit"></span></button>\
                                     </div>'
                    }



                ]
            };

            $scope.listarProductos = function(data){
                console.log('input -->',data);
            };

            /*
             $scope.aqui = function(){
             console.log("Eyyyyy caliche!!");
             }
             */
            $scope.tab = function(tab){
                if(tab == '2'){
                    $scope.dateShow = false;
                }else{
                    $scope.dateShow = true;
                }
            };
//2
            $scope.listar_documentos_ajuste = {
                data: 'root.listarDocumentosProductos',
                multiSelect: false,
                enableHighlighting: true,
                showFilter: true,
                enableRowSelection: false,
                columnDefs: [
                    {field: 'fecha', displayName: 'Fecha del Ajuste', width: "8.33333333%"},
                    {field: 'producto_id', displayName: 'Codigo Producto', width: "8.33333333%"}, //
                    {field: 'descripcion', displayName: 'Descripción Completa', width: "25%"},
                    {field: 'costo_anterior', displayName: 'Costo Anterior', width: "8%"},
                    {field: 'costo_asignado', displayName: 'Costo Asignado', width: "8%"},
                    {field: 'producto_cantidad', displayName: 'Existencia Producto', width: "8.33333333%"},
                    {field: 'total_diferencia', displayName: 'Diferencia Total', width: "8.33333333%"},
                    {field: 'justificacion', displayName: 'Justificación del Ajuste', width: "17%"},
                    {field: 'aprobacion', displayName: 'Aprobación del Ajuste', width: "10%"}
                ]
            };

            $scope.listar_agrupar = {
                data: 'root.listarAgrupar',
                multiSelect: false,
                enableHighlighting: true,
                showFilter: true,
                enableRowSelection: false,
                columnDefs: [
                    {field: 'codigo_producto', displayName: 'Codigo', width: "15%"},
                    {field: 'descripcion', displayName: 'Producto', width: "36%"}, //
                    {field: 'costo', displayName: 'Costo', width: "16%"},
                    {field: 'costo_ultima_compra', displayName: 'Ultima Compra', width: "16%"},
                    {field: 'existencia', displayName: 'Stock', width: "10%"},
                    {displayName: "Modificar", cellClass: "txt-center dropdown-button", width: "7%",
                        cellTemplate: '<div class="ngCellText" ng-class="col.colIndex()" style="text-align:center;">\
                                        <button ng-click="onModificarAgrupacion(row.entity)" class="btn btn-default btn-xs">\
                                            <span class="glyphicon glyphicon-edit"></span>\
                                        </button>\
                                       </div>'
                    }
                ]
            };
            // agrupar  hoy

            $scope.listarFactura = {
                data: 'listaFacturaPendiente',
                multiSelect: false,
                enableHighlighting: true,
                showFilter: true,
                enableRowSelection: false,
                columnDefs: [
                    {field: 'numero_factura', displayName: 'No. Producto', width: "30%"},
                    {field: 'descripcion', displayName: 'bodega', width: "30%"},
                    {displayName: 'Entregado', cellClass: "txt-center dropdown-button", width: "40%",
                        cellTemplate: ' <div class="row">\
                                        <div class= "txt-center dropdown-button" "checkbox" ng-if="row.entity.sw_entregado==0">\
                                          <label> \
                                             <input type="checkbox" ng-checked="exists(row.entity, selected)" ng-click="onAgruparFactura(row.entity, selected)" value="">\
                                             </label>\
                                         </div>\
                                       </div>'


                    }
                ]
            };

            //modificar entregado
            $scope.listarFacturaAgrupada = {
                data: 'listaFacturaPendienteModificar',
                multiSelect: false,
                enableHighlighting: true,
                showFilter: true,
                enableRowSelection: false,
                columnDefs: [
                    {field: 'numero_factura', displayName: 'Stock', width: "20%"},
                    {field: 'numero_factura1', displayName: 'Precio Anterior', width: "20%"},
                    {field: 'numero_factura2', displayName: 'Precio Nuevo', width: "20%"},
                    {field: 'numero_factura3', displayName: 'Diferencia', width: "20%"},
                    {field: 'numero_factura4', displayName: 'Total Diferencia', width: "40%"}
                    /*
                     {displayName: 'Entregado', cellClass: "txt-center dropdown-button", width: "20%",
                     cellTemplate: ' <div class="row">\
                     <label> \
                     <button ng-click="onEliminarFacturaAgrupada(row.entity)" class="btn btn-default btn-xs"><span class="glyphicon glyphicon-remove"></span></button>\
                     </label>\
                     </div>\
                     </div>'
                     }
                     */
                ]
            };

            $scope.onModificar = function (modificar) {
                modificar.concepto = $scope.root.concepto;
                modificar.farmacias = $scope.root.farmacias;

                that.verModificar(modificar);
            };


            $scope.onDeshabilitar = function (impresion) {

                var disabled = true;
                if (impresion.archivo === undefined || impresion.archivo === null) {
                    disabled = false;

                }

                return disabled;
            };

            $scope.onDesactivar = function () {
                var disabled = false;
                if ($scope.desactivar === '1') {
                    disabled = true;
                }
                return disabled;

            };

            $scope.onEliminarFacturaAgrupada = function (parametro) {
                that.eliminarGrupoFactura(parametro, function () {
                    that.listarAgrupar(parametro, function () {

                    });
                });

            };

            $scope.productoSelec = {
                cod: '',
                costo: '',
                descripcion: '',
                existencia: '',
                totalDiferencia: '',
                newPrice: '',
                diferencia: ''
            };
            /*
             $scope.btn_update_producto = function (){
             console.log("Submit!!!");
             this.cerrar();
             };
             */

            //Funcion para crear documentos copiada desde otro controlador!!!
            $scope.crearDocumento = function () {

                var obj = {
                    session: $scope.session,
                    data: {
                        empresa_envia: Usuario.getUsuarioActual().getEmpresa().centroUtilidad.bodega.codigo,
                        doc_tmp_id: $scope.doc_tmp_id,
                        usuario_id: Usuario.getUsuarioActual().getId(),
                        bodega_destino: $scope.documento_ingreso.get_bodega_destino()
                    }
                };

                E017Service.crearDocumento(obj, function (data) {
                    if (data.status === 200) {

                        AlertService.mostrarMensaje("warning", data.msj);

                        that.borrarVariables();

                        var nombre = data.obj.nomb_pdf;
                        setTimeout(function () {
                            $scope.visualizarReporte("/reports/" + nombre, nombre, "_blank");
                        }, 0);
                    }

                    if (data.status === 500) {
                        AlertService.mostrarMensaje("warning", data.msj);

                    }
                });
            };

            $scope.product_update_fine = function(){

            };

            $scope.filtro = {};

            $scope.filtros = [
                {nombre : "Descripcion", tipo_busqueda:0},
                {nombre : "Molecula", tipo_busqueda:1},
                {nombre : "Codigo", tipo_busqueda:2}
            ];

            $scope.onSeleccionarEmpresa = function(){
                $scope.opts = {
                    backdrop: 'static',
                    keyboard: true,
                    size: 'lg',
                    templateUrl:'views/ABC1/seleccionEmpresa.html',
                    scope: $scope,
                    controller: ["$scope", "$modalInstance", function($scope, $modalInstance) {
                        $scope.onCerrar = function(acepto) {
                            $modalInstance.close();
                        };
                    }]
                };

                var modalInstance = $modal.open($scope.opts);

                modalInstance.result.then(function() {
                    $scope.paginaactual = 1;
                    $scope.buscarProductos($scope.termino_busqueda);

                }, function() {

                });
            };

            that.traerEmpresas = function(callback) {

                $scope.listaEmpresas = [];
                $scope.listaCentroUtilidad = [];
                $scope.listaBodegas = [];


                var obj = {
                    session: $scope.session,
                    data: {
                        pedidos_farmacias:{
                            permisos_kardex:true
                        }
                    }
                };

                Request.realizarRequest(API.KARDEX.LISTAR_EMPRESAS_FARMACIAS, "POST", obj, function(data) {
                    if (data.status === 200) {
                        for (var i in data.obj.empresas) {
                            var empresa = Empresa.get(
                                data.obj.empresas[i].razon_social,
                                data.obj.empresas[i].empresa_id
                            );

                            $scope.listaEmpresas.push(empresa);
                        }

                        if (callback)
                            callback();
                    }

                });

            };

            that.consultarCentrosUtilidadPorEmpresa = function(callback) {

                $scope.listaCentroUtilidad = [];
                $scope.listaBodegas = [];
                $scope.filtro.centro_seleccion = "";
                $scope.filtro.bodega_seleccion = "";

                var obj = {
                    session: $scope.session,
                    data: {
                        centro_utilidad: {
                            empresa_id: $scope.filtro.empresa_seleccion
                        }
                    }
                };

                Request.realizarRequest(API.KARDEX.CENTROS_UTILIDAD_EMPRESAS, "POST", obj, function(data) {

                    if (data.status === 200) {

                        for (var i in data.obj.centros_utilidad) {
                            var centroUtilidad = CentroUtilidad.get(
                                data.obj.centros_utilidad[i].descripcion,
                                data.obj.centros_utilidad[i].centro_utilidad_id
                            );

                            $scope.listaCentroUtilidad.push(centroUtilidad);
                        }
                        if (callback)
                            callback();
                    }

                });
            };


            that.consultarBodegasPorEmpresa = function(callback) {

                $scope.listaBodegas = [];
                var obj = {
                    session: $scope.session,
                    data: {
                        bodegas: {
                            empresa_id: $scope.filtro.empresa_seleccion,
                            centro_utilidad_id: $scope.filtro.centro_seleccion
                        }
                    }
                };

                Request.realizarRequest(API.KARDEX.BODEGAS_EMPRESA, "POST", obj, function(data) {

                    if (data.status === 200) {
                        for (var i in data.obj.bodegas) {
                            var bodega = Bodega.get(
                                data.obj.bodegas[i].descripcion,
                                data.obj.bodegas[i].bodega_id
                            );

                            $scope.listaBodegas.push(bodega);
                        }
                        if (callback)
                            callback();
                    }
                });
            };

            $scope.onEmpresaSeleccionada = function() {
                that.consultarCentrosUtilidadPorEmpresa();
            };

            $scope.onCentroSeleccionado = function() {
                that.consultarBodegasPorEmpresa();
            };

            $scope.onSeleccionFiltro = function(filtro){
                //console.log('Filtro: ', filtro.nombre);
                if(filtro.nombre == 'Descripcion'){
                    $scope.filtroProducto = $scope.filtros[0];
                }else if(filtro.nombre == 'Molecula'){
                    $scope.filtroProducto = $scope.filtros[1];
                }else if(filtro.nombre == 'Codigo'){
                    $scope.filtroProducto = $scope.filtros[2];
                }
                $scope.filtroBusqueda = filtro.nombre;
            };

            $scope.filtroProducto = $scope.filtros[0];

            $scope.form_update_producto = function(){
                var callback = 'product_update_fine';
                var parametro = $scope.productoSelec;

                if(parametro.aprobacion == undefined){
                    alert('Debe seleccionar quien aprobo el ajuste!!');
                    return false;
                }

                var usuario_nombre = Usuario.getUsuarioActual().nombre;
                var empresa_nombre = Usuario.getUsuarioActual().empresa.nombre;
                var usuario_sessions = Usuario;
                console.log('Producto seleccionado -->',parametro);
                parametro.empresa_id = $scope.session.empresaId;
                parametro.centro_id = $scope.session.centroUtilidad;
                parametro.bodega_id = $scope.session.bodega;
                parametro.usuario_id = $scope.session.usuario_id;

                var obj = {
                    session: $scope.session,
                    data: {
                        usuario_id: parametro.usuario_id,
                        usuario_nombre: usuario_nombre,
                        empresa_id: parametro.empresa_id,
                        empresa_nombre: empresa_nombre,
                        centro_id: parametro.centro_id,
                        bodega_id: parametro.bodega_id,
                        producto_id: parametro.cod,
                        anterior_precio: parametro.costo,
                        nuevo_precio: parametro.newPrice,
                        total_diferencia: parametro.totalDiferencia,
                        justificacion: parametro.justificacion,
                        aprobacion: parametro.aprobacion,
                        tipo_doc_general_id: 'ABC1',
                        titulo: 'AJUSTE BAJE COSTO'
                    }
                };
                // console.log('Objeto --> ',obj);
                Request.realizarRequest(
                    API.PRODUCTOS.SUBE_COSTO,
                    "POST",
                    obj,
                    function (data) {
                        console.log("data",data);
                        if (data.status === 200) {
                            // $scope.root.listarAgrupar = data.obj.listarAgrupar;
                            // console.log("data.obj.listarAgrupar",data.obj.listarAgrupar);
                            //console.log('Todo bien!!');
                            parametro = {};
                            $scope.root.buscar_radicacion_id = '';
                            $scope.fecha_ini = 'empty';
                            $scope.fecha_fin = 'empty';
                            $scope.buscarProductos();
                            //callback(data.obj.listarAgrupar);
                        }
                    }
                );
                this.cerrar();
            };

            $scope.newUpdatedPrice = function (){
                $scope.productoSelec.diferencia = parseFloat($scope.productoSelec.newPrice) - parseFloat($scope.productoSelec.costo);
                if($scope.productoSelec.existencia != parseFloat('0.00')){
                    $scope.productoSelec.totalDiferencia = parseFloat(parseFloat($scope.productoSelec.existencia)*($scope.productoSelec.diferencia)).toFixed(2);
                }else{
                    $scope.productoSelec.totalDiferencia = parseFloat($scope.productoSelec.diferencia).toFixed(2);
                }
                $scope.productoSelec.diferencia = (parseFloat($scope.productoSelec.newPrice) - parseFloat($scope.productoSelec.costo)).toFixed(2);
            };

            $scope.onModificarAgrupacion = function (parametro) {
                if(parametro == undefined || parametro.codigo_producto == undefined){
                    return false;
                } else if(parametro.costo == 0){
                    alert('No puede bajar el costo a producto con costo igual a "0"');
                    return false;
                } else {
                    $scope.productoSelec = {
                        cod: '',
                        costo: '',
                        descripcion: '',
                        existencia: '',
                        totalDiferencia: '',
                        newPrice: '',
                        diferencia: ''
                    };
                    $scope.productoSelec.cod = parametro.codigo_producto;

                    if (parametro.costo != undefined) {
                        $scope.productoSelec.costo = parseFloat(parametro.costo);
                        $scope.productoSelec.costoMax = parseFloat((parseFloat($scope.productoSelec.costo) - parseFloat(0.01)).toFixed(2));
                        $scope.productoSelec.newPrice = parseFloat($scope.productoSelec.costoMax);
                        $scope.productoSelec.diferencia = parseFloat(parseFloat($scope.productoSelec.newPrice) - parseFloat($scope.productoSelec.costo)).toFixed(2);
                    } else {
                        $scope.productoSelec.newPrice = parseFloat('0.00');
                        $scope.productoSelec.diferencia = parseFloat('0.00');
                    }
                    if (parametro.descripcion != undefined) {
                        $scope.productoSelec.descripcion = parametro.descripcion;
                    } else {
                        $scope.productoSelec.descripcion = '';
                    }
                    if (parametro.existencia != undefined) {
                        $scope.productoSelec.existencia = (parseFloat(parametro.existencia)).toFixed(2);
                    } else {
                        $scope.productoSelec.existencia = parseFloat('0.00');
                    }
                    if ($scope.productoSelec.existencia != parseFloat('0.00') && $scope.productoSelec.diferencia != parseFloat('0.00')) {
                        $scope.productoSelec.totalDiferencia = (parseFloat(parametro.existencia) * parseFloat($scope.productoSelec.diferencia)).toFixed(2);
                    } else {
                        $scope.productoSelec.totalDiferencia = $scope.productoSelec.diferencia;
                    }
                    $scope.radicacion_id = parametro.relacion_id;
                    $scope.desactivar = parametro.imprimir;
                    console.log(parametro, "<--");

                    that.listarAgrupar(parametro, function (dato) {
                        // $scope.root.listarAgrupar = dato;
                        dato.relacion_id = parametro.relacion_id;
                        $scope.listaFacturaPendienteModificar = [];
                        dato.listarAgrupar.forEach(function (element) {
                            $scope.listaFacturaPendienteModificar.push(element);
                        });
                        $scope.root.botonAgregar = true;
                        if (parametro.archivo === null) {
                            console.log("parametro", parametro.archivo);
                            $scope.root.botonAgregar = false;
                        }
                        that.agrupar(dato);
                    });
                    $scope.buscarProductos();
                }
            };

            $scope.onModificarFactura = function (factura) {
                that.modificarFactura(factura);
            };

            $scope.onDescargarArchivo = function (archivo) {
                $scope.visualizarReporte("/Facturas/Sistemas/" + archivo.ruta, archivo.ruta, "blank");
            };
//          $scope.onDescargarArchivoFactura = function (archivo) {
//              $scope.visualizarReporte("/Facturas/Sistemas/" + archivo.ruta, archivo.ruta, "blank");
//          };
            $scope.onDescargarArchivoFormato = function (formato) {
                if (formato.archivo === null || formato.archivo === "") {
                    that.planillaRadicacion(formato);
                } else {
                    $scope.visualizarReporte("/Facturas/Sistemas/" + formato.archivo, formato.archivo, "blank");
                    that.listarAgrupar({radicacion_id: ""}, function (dato) {
                        $scope.root.listarAgrupar = dato;
                    });
                }
            };

            $scope.modalConcepto = function () {
                that.verConcepto();
            };
            $scope.onSeleccionMunicipio = function () {
            };
            $scope.onSeleccionFacturaEntregado = function () {
                that.listarFacturaEntregado();
            };

            $scope.onAgregarFactura = function () {

                that.agregarFacturaEntregado();
                var time = setTimeout(function () {
                    that.listarAgrupar({relacion_id: $scope.radicacion}, function (listado) {
                        $scope.listaFacturaPendienteModificar = [];

                        listado.forEach(function (element) {

                            $scope.listaFacturaPendienteModificar.push(element);

                        });
                        that.listarAgrupar({radicacion_id: ""}, function (dato) {
                            $scope.root.listarAgrupar = dato;
                            that.listarFactura();
                        });
                    });
                    clearTimeout(time);
                }, 500);

                that.limpiarAgregar();

            };

            that.limpiarAgregar = function () {
                $scope.root.listarFacturaEntregado = '';
                $scope.root.cargarFormato = '';
            };



            $scope.onSeleccionConcepto = function () {
                $scope.root.concepto = [];
                that.consultarConcepto();
            };

//            $scope.onSeleccionFarmacia = function (){
//                $scope.root.municipio = [];
//                that.consultarMunicipio();
//
//            };

            $scope.onSeleccionFactura = function () {

            };

            $scope.onGuardarFactura = function () {

                if ($scope.root.numeroFactura === '') {
                    AlertService.mostrarVentanaAlerta("Mensaje del sistema", "Debe digitar el numero de la Factura");
                    return;
                }

                if ($scope.root.conceptoSeleccionado === '') {
                    AlertService.mostrarVentanaAlerta("Mensaje del sistema", "Debe seleccionar el proveedor de la Factura");
                    return;
                }
                if ($scope.root.farmaciaSeleccionada === '') {
                    AlertService.mostrarVentanaAlerta("Mensaje del sistema", "Debe seleccionar la ciudad de la Factura");
                    return;
                }
                if ($scope.root.precioSeleccionado === '') {
                    AlertService.mostrarVentanaAlerta("Mensaje del sistema", "Debe digitar el precio de la Factura");
                    return;
                }
//                if ($scope.root.fecha_vencimiento === '') {
//                    AlertService.mostrarVentanaAlerta("Mensaje del sistema", "Debe seleccionar la fecha de la Factura");
//                    return;
//                }
                if ($scope.root.descripcion === '') {
                    AlertService.mostrarVentanaAlerta("Mensaje del sistema", "Debe digitar el concepto de la Factura");
                    return;
                }

                that.subirArchivo(1, {}, {});
            };

            $scope.respuestaSubirArchivo = function (file, message) {
                var data = (message !== undefined) ? JSON.parse(message) : {};
                $scope.root.flow.cancel();
                if (data.status === 200) {
                    that.subirArchivo();
                    $scope.visualizarReporte("/reports/" + data.obj.pdf, data.obj.pdf, "download");

                } else {
                    var msj = data.msj;
                    if (msj.msj) {
                        msj = msj.msj;
                    }
                    AlertService.mostrarVentanaAlerta(String.CONSTANTS.ALERTA_TITULO, msj);
                }
            };

            $scope.close = function () {
                // $modalInstance.close();
            };
            //////////////////////////////
            $scope.root.activarBoton=true;
            $scope.onArchivoSeleccionado = function (files) {

                if(files[0].name===''){
                    console.log("fileee333333",files)
                    $scope.root.activarBoton=true;
                    return;
                }else{console.log("fileee22222",files)
                    $scope.root.activarBoton=false;
                    $scope.root.files = files;
                    that.limpiarArchivoo();
                }
            };

            that.limpiarArchivoo = function () {
                $scope.root.archivo = '';
            }

//            $scope.onArchivoSeleccionadoFactura = function (files) {
//                $scope.root.files = files;
//            };


            that.subirArchivoEntregado = function (data, modalInstance) {
                var fd = new FormData();
                var ruta;

//                if (!$scope.root.files) {
//                    $scope.root.files = [{lastModified: '', lastModifiedDate: '', name: "", size: '', type: '', webkitRelativePath: ''}];
//                }

                fd.append("file", $scope.root.files[0]);
                fd.append("session", JSON.stringify($scope.root.session));
                fd.append("data", JSON.stringify({
                    data: {
                        empresa_id: Usuario.getUsuarioActual().getEmpresa().getCodigo(),
                        ruta: $scope.root.files[0]
                    }
                }));

                Request.subirArchivo(API.RADICACION.SUBIR_ARCHIVO, fd, function (respuesta) {
                    if (respuesta) {
                        ruta = respuesta.obj.data.split('/');
                        ruta = ruta[ruta.length - 1];
                    } else {
                        ruta = respuesta;

                    }

                    var obj = {
                        session: $scope.session,
                        data: {
                            relacion_id: $scope.radicacion,
                            archivo: ruta

                        }
                    };


                    Request.realizarRequest(
                        API.RADICACION.MODIFICAR_NOMBRE_ARCHIVO, //Radicacion/guardarFactura
                        "POST",
                        obj,
                        function (data) {
                            if (data.status === 200) {

                                modalInstance.close();
                                AlertService.mostrarVentanaAlerta("Mensaje del sistema", "factura modificada correctamente");
                                return;
                            }

                            AlertService.mostrarVentanaAlerta("Mensaje del sistema", "Error al modificar la Factura");
                        }
                    );
                });
            };



            that.subirArchivo = function (modo, data, modalInstance) {
                var fd = new FormData();
                var ruta;

                if (!$scope.root.files) {
                    $scope.root.files = [{lastModified: '', lastModifiedDate: '', name: "", size: '', type: '', webkitRelativePath: ''}];
                }

                fd.append("file", $scope.root.files[0]);
                fd.append("session", JSON.stringify($scope.root.session));
                fd.append("data", JSON.stringify({
                    data: {
                        empresa_id: Usuario.getUsuarioActual().getEmpresa().getCodigo(),
                        ruta: $scope.root.files[0]
                    }
                }));
                Request.subirArchivo(API.RADICACION.SUBIR_ARCHIVO, fd, function (respuesta) {
                    if (respuesta) {
                        ruta = respuesta.obj.data.split('/');
                        ruta = ruta[ruta.length - 1];
                    } else {
                        ruta = respuesta;
                    }

                    if (modo == 1) {
                        that.guardarFactura(ruta);
                    } else {

                        var obj = {
                            session: $scope.session,
                            data: {
                                factura_id: data.factura_id,
                                sw_entregado: '1',
                                conceptoSeleccionado: data.conceptoSeleccionado,
                                numeroFactura: data.numeroFactura,
                                precio: data.precio,
                                conceptooSeleccionado: data.conceptooSeleccionado,
                                tipo_mpio_id: data.tipo_mpio_id,
                                ruta: ruta,
                                fecha_entrega: data.fechaEntrega,
                                tipo_dpto_id: data.tipo_dpto_id
                            }
                        };

                        Request.realizarRequest(
                            API.RADICACION.MODIFICAR_FACTURA, //Radicacion/guardarFactura
                            "POST",
                            obj,
                            function (data) {
                                if (data.status === 200) {
                                    AlertService.mostrarVentanaAlerta("Mensaje del sistema", "Factura modificada correctamente");
                                    modalInstance.close();
                                    return;
                                }
                                AlertService.mostrarVentanaAlerta("Mensaje del sistema", "Error al modificar la Factura");
                            }
                        );
                    }

                    //$scope.close();
                });
            };

            that.subirArchivoFactura = function () {
                var fd = new FormData();
                fd.append("file", $scope.root.files[0]);
                fd.append("session", JSON.stringify($scope.root.session));
                fd.append("data", JSON.stringify(
                    {
                        data: {
                            empresa_id: Usuario.getUsuarioActual().getEmpresa().getCodigo()
                        }
                    }
                ));

                Request.subirArchivo(API.RADICACION.SUBIR_ARCHIVO_FACTURA, fd, function (respuesta) {
                    $scope.close();
                });
            };
///////////////////
            $scope.cargarArchivo = function ($flow) {
                $scope.root.flow = $flow;
            };

            $scope.onDescagarArchivo = function ($flow) {
                $scope.root.flow = $flow;
            };

            $scope.abrirFechaInicial = function($event) {
                $event.preventDefault();
                $event.stopPropagation();

                $scope.abrirfechainicial = true;
                $scope.abrirfechafinal = false;

            };

            $scope.abrirFechaFinal = function($event) {
                $event.preventDefault();
                $event.stopPropagation();

                $scope.abrirfechafinal = true;
                $scope.abrirfechainicial = false;
            };

            $scope.fechainicialselected = function() {
                if ($scope.fechainicial > $scope.fechafinal) {
                    $scope.fechafinal = $scope.fechainicial;
                }
            };

            $scope.fechafinalselected = function() {
                $scope.fechainicial = $scope.fechafinal;
            };

            that.init = function () {
//                that.consultarFarmacia();
                //that.consultarMunicipio();
                that.consultarConcepto();
                that.listarFactura();

                $scope.documentos_productos = { };

                that.listarAgrupar({relacion_id: ""}, function (dato) {
                    //console.log("Eyyy -->",dato);
                    //console.log('Before Fecha: ', dato.documentosAjustes.fecha);
                    var fecha = dato.documentosAjustes.fecha.split('T');
                    dato.documentosAjustes.fecha = fecha[0]+' '+fecha[1].substring(0, 8);
                    //console.log('Fecha: ', dato.documentosAjustes.fecha);
                    $scope.root.listarAgrupar = dato.listarAgrupar;
                    $scope.root.listarDocumentosProductos = dato.documentosAjustes;
                });

                $scope.root.session = {
                    usuario_id: Usuario.getUsuarioActual().getId(),
                    auth_token: Usuario.getUsuarioActual().getToken()
                };
                $scope.root.flow = new Flow();
                $scope.root.flow.target = API.RADICACION.SUBIR_ARCHIVO;
                $scope.root.flow.testChunks = false;
                $scope.root.flow.singleFile = true;
                $scope.root.flow.query = {
                    session: JSON.stringify($scope.root.session)
                };
                $scope.productoSelec = {
                    cod: '',
                    costo: '',
                    descripcion: ''
                };
                $scope.productoSelec.newPrice = 0;
                $scope.dateShow = true;
                var dateNow = new Date();
                $scope.producto_fecha1 = $filter('date')(new Date("01/01/"  + dateNow.getFullYear()), "yyyy-MM-dd");
                $scope.producto_fecha2 = $filter('date')(dateNow, "yyyy-MM-dd");
                //$scope.producto_fecha1 = new Date('now', "yyyy-MM-dd");
                //$scope.producto_fecha2 = '2018-10-07 10:15:00';
                $scope.fecha_ini = '';
                $scope.fecha_fin = '';
                $scope.root.listarDocumentosProductos = {'1':'', '2':'', '3':'', '4':'', '5':'', '6':'', '7':'', '8':'', '9':'', '10':'', '11':'', '12':'', '13':'','14':''};
                $scope.root.listarAgrupar = {'1':'', '2':'', '3':'', '4':'', '5':'', '6':'', '7':'', '8':'', '9':'', '10':'', '11':'', '12':'', '13':'','14':''};
                //console.log('Fecha en el init es: ',$scope.producto_fecha1);
                $scope.filtroBusqueda = 'Descripcion';
                var infoEmpresa=Usuario.getUsuarioActual().empresa;
                $scope.Empresa = Empresa.get(infoEmpresa.nombre, infoEmpresa.codigo);
                //console.log('infoEmpresa: ',infoEmpresa);
                $scope.filtro.empresa_seleccion = infoEmpresa.codigo;
                console.log('$scope.filtro.empresa_seleccion: ->',$scope.filtro.empresa_seleccion);

                that.traerEmpresas(function() {
                    $timeout(function() {
                        $scope.filtro.empresa_seleccion = infoEmpresa.codigo;
                        that.consultarCentrosUtilidadPorEmpresa(function() {

                            $timeout(function() {
                                $scope.filtro.centro_seleccion = infoEmpresa.centroUtilidad.codigo;
                                that.consultarBodegasPorEmpresa(function() {

                                    $timeout(function() {

                                        $scope.filtro.bodega_seleccion = infoEmpresa.centroUtilidad.bodega.codigo;
                                        console.log('filtro empresa: ', $scope.filtro);
                                        $scope.buscarProductos("");
                                    });

                                });
                            });


                        });

                    });

                });
            };
            that.init();
        }])
});