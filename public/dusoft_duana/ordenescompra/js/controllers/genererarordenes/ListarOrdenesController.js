
define(["angular", "js/controllers",
    "models/OrdenCompraPedido",
    "models/EmpresaOrdenCompra",
    "models/ProveedorOrdenCompra",
    "models/UnidadNegocio",
    "models/ProductoOrdenCompra",
    "models/NovedadOrdenCompra",
    "models/ObservacionOrdenCompra",
    "models/ArchivoNovedadOrdenCompra",
    "models/UsuarioOrdenCompra",
    "controllers/genererarordenes/VentanaArchivoOrdenesController",
    "controllers/genererarordenes/ListaPendientesController"
], function(angular, controllers) {

    controllers.controller('ListarOrdenesController', [
        '$scope', '$rootScope', 'Request',
        '$modal', 'API', "socket", "$timeout",
        "AlertService", "localStorageService", "$state", "$filter",
        "OrdenCompraPedido",
        "EmpresaOrdenCompra",
        "ProveedorOrdenCompra",
        "UnidadNegocio",
        "ProductoOrdenCompra",
        "UsuarioOrdenCompra",
        "Usuario",
        function($scope, $rootScope, Request, $modal, API, socket, $timeout, AlertService, localStorageService, $state, $filter, OrdenCompra, Empresa, Proveedor, UnidadNegocio, Producto, Usuario, Sesion) {

            var that = this;

            $scope.Empresa = Empresa;

            // Variables de Sesion
            $scope.session = {
                usuario_id: Sesion.getUsuarioActual().getId(),
                auth_token: Sesion.getUsuarioActual().getToken()
            };


            // numero de orden compra
            localStorageService.add("numero_orden", 0);

            // Vista Previa 
            localStorageService.add("vista_previa", '0'); //false

            // Variables
            var fecha_actual = new Date();
            $scope.fecha_inicial = $filter('date')(new Date("01/01/" + fecha_actual.getFullYear()), "yyyy-MM-dd");
            $scope.fecha_final = $filter('date')(fecha_actual, "yyyy-MM-dd");

            $scope.orden_compra_seleccionada = '';
            $scope.mensaje_sistema = "";
            $scope.datepicker_fecha_final = false;

            // Variable para paginacion
            $scope.paginas = 0;
            $scope.cantidad_items = 0;
            $scope.termino_busqueda = "";
            $scope.ultima_busqueda = "";
            $scope.pagina_actual = 1;
            $scope.opciones = Sesion.getUsuarioActual().getModuloActual().opciones;

            $scope.datos_view = {
                email_to: '',
                email_subject: '',
                email_message: '',
                email_attachment_name: '',
                orden_compra_seleccionada: OrdenCompra.get()
            };

            var estados = ["btn btn-primary btn-xs",
                "btn btn-success btn-xs",
                "btn btn-danger btn-xs", 
                "btn btn-warning btn-xs", 
                "btn btn-info btn-xs",
                "btn btn-warning btn-xs", 
                "btn btn-warning btn-xs"];
            
            $scope.filtros = [
                {nombre : "Orden", numeroOrden:true},                
                {nombre : "Proveedor", proveedor:true},
                {nombre : "Empresa", empresa:true}
            ];
            
            $scope.filtro  = $scope.filtros[0];


            $scope.buscar_ordenes_compras = function(termino, paginando) {

                var termino = termino || "";

                if ($scope.ultima_busqueda !== $scope.termino_busqueda) {
                    $scope.pagina_actual = 1;
                }

                var obj = {
                    session: $scope.session,
                    data: {
                        ordenes_compras: {
                            fecha_inicial: $filter('date')($scope.fecha_inicial, "yyyy-MM-dd") + " 00:00:00",
                            fecha_final: $filter('date')($scope.fecha_final, "yyyy-MM-dd") + " 23:59:00",
                            termino_busqueda: termino,
                            pagina_actual: $scope.pagina_actual,
                            filtro:$scope.filtro
                        }
                    }
                };

                Request.realizarRequest(API.ORDENES_COMPRA.LISTAR_ORDENES_COMPRAS, "POST", obj, function(data) {

                    $scope.ultima_busqueda = $scope.termino_busqueda;

                    if (data.status === 200) {

                        $scope.cantidad_items = data.obj.ordenes_compras.length;

                        if (paginando && $scope.cantidad_items === 0) {
                            if ($scope.pagina_actual > 0) {
                                $scope.pagina_actual--;
                            }
                            AlertService.mostrarMensaje("warning", "No se encontraron mas registros");
                            return;
                        }

                        that.render_ordenes_compras(data.obj.ordenes_compras);
                    }
                });
            };


            $scope.cambiarEstadoOrden = function(estado) {

                var obj = {
                    session: $scope.session,
                    data: {
                        ordenes_compras: {
                            numero_orden: $scope.orden_compra_seleccionada.get_numero_orden(),
                            estado:estado
                        }
                    }
                };

                Request.realizarRequest(API.ORDENES_COMPRA.CAMBIAR_ESTADO, "POST", obj, function(data) {

                    AlertService.mostrarMensaje("warning", data.msj);

                    if (data.status === 200) {

                       /* $scope.orden_compra_seleccionada.set_estado(estado);
                        $scope.orden_compra_seleccionada.set_descripcion_estado((estado === '2') ?'Anulado':'Bloqueada');*/
                        $scope.buscar_ordenes_compras();

                        $scope.orden_compra_seleccionada = null;
                    }
                });


            };

            that.render_ordenes_compras = function(ordenes_compras) {

                $scope.Empresa.limpiar_ordenes_compras();

                ordenes_compras.forEach(function(orden) {

                    $scope.Empresa.set_ordenes_compras(that.render_orden_compra(orden));
                });
            };

            that.render_orden_compra = function(orden) {

                var orden_compra = OrdenCompra.get(orden.numero_orden, orden.estado, orden.observacion, orden.fecha_registro);

                orden_compra.set_proveedor(Proveedor.get(orden.tipo_id_proveedor, orden.nit_proveedor, orden.codigo_proveedor_id, orden.nombre_proveedor, orden.direccion_proveedor, orden.telefono_proveedor));

                orden_compra.set_unidad_negocio(UnidadNegocio.get(orden.codigo_unidad_negocio, orden.descripcion_unidad_negocio, orden.imagen));

                orden_compra.set_usuario(Usuario.get(orden.usuario_id, orden.nombre_usuario));

                orden_compra.set_descripcion_estado(orden.descripcion_estado);

                orden_compra.set_ingreso_temporal(orden.tiene_ingreso_temporal);

                orden_compra.set_estado_digitacion(orden.sw_orden_compra_finalizada, orden.estado_digitacion);

                orden_compra.set_fechas_recepcion(orden.fecha_recibido, orden.fecha_verificado);
                
                orden_compra.setFechaIngreso(orden.fecha_ingreso);
                
                orden_compra.setNombreBodega(orden.nombre_bodega);

                return orden_compra;
            };

            $scope.buscador_ordenes_compras = function(ev, termino_busqueda) {
                if (ev.which === 13) {
                    $scope.buscar_ordenes_compras(termino_busqueda);
                }
            };

            $scope.lista_ordenes_compras = {
                data: 'Empresa.get_ordenes_compras()',
                enableColumnResize: true,
                enableRowSelection: false,
                enableCellSelection: true,
                enableHighlighting: true,
                columnDefs: [
                    {field: 'numero_orden_compra', displayName: '# Orden', width: "60"},
                    {field: 'proveedor.get_nombre()', displayName: 'Proveedor', width: "300"},
                    {field: 'descripcion_estado', displayName: "Estado", cellClass: "txt-center", width:200,
                        cellTemplate: "<button type='button' ng-class='agregar_clase_btn(row.entity.estado)'>{{row.entity.descripcion_estado}} </button>"},
                    {field: 'observacion', displayName:"Observacion"},
                    {field: 'getNombreBodega()', displayName:"Bodega"},
                    {field: 'estado_digitacion', displayName: "Digitacion", width:100},
                    {field: 'fecha_registro', displayName: "F. Registro", width: "80"},
                    {field: 'fecha_recibido', displayName: "F. Recibida", width: "7%",
                        cellTemplate: '<div class="ngCellText {{ agregar_indicador_fechas(row.entity) }}" ng-class="col.colIndex()">{{row.entity.fecha_recibido}}</div>'},
                    {field: 'fecha_verificacion', displayName: "F. Verificacion", width: "7%",
                        cellTemplate: '<div class="ngCellText {{ agregar_indicador_fechas(row.entity) }}" ng-class="col.colIndex()">{{row.entity.fecha_verificacion}}</div>'},
                    {field: 'fechaIngreso', displayName: "F. Ingreso", width: "7%"},
                    {displayName: "Opciones", cellClass: "txt-center dropdown-button", width:80,
                        cellTemplate: '<div class="btn-group">\
                                            <button class="btn btn-default btn-xs dropdown-toggle" data-toggle="dropdown">Acción<span class="caret"></span></button>\
                                            <ul class="dropdown-menu dropdown-options">\
                                                <li ng-if="row.entity.estado != 5"><a href="javascript:void(0);" ng-click="vista_previa(row.entity);" >Vista Previa</a></li>\
                                                <li ng-if="row.entity.estado != 5"><a href="javascript:void(0);" ng-click="gestionar_acciones_orden_compra(row.entity,0)" >Modificar</a></li>\
                                                <li ng-if="row.entity.estado == 6"><a href="javascript:void(0);" ng-click="onMostrarPendientes(row.entity)" >Ver pendientes</a></li>\
                                                <li ng-if="row.entity.estado != 5"><a href="javascript:void(0);" ng-click="generar_reporte(row.entity,0)" >Ver PDF</a></li>\
                                                <li ng-if="row.entity.estado != 5"><a href="javascript:void(0);" ng-disabled="true" ng-click="ventana_enviar_email(row.entity,0)" >Enviar por Email</a></li>\
                                                <li ng-if="row.entity.estado != 5"><a href="javascript:void(0);" ng-click="gestionar_acciones_orden_compra(row.entity,1)" >Novedades</a></li>\
                                                    <li ng-if="opciones.sw_bloquear_orden && row.entity.estado != 5"><a href="javascript:void(0);" \
                                                        ng-click="onCambiarEstadoOrden(row.entity, 5)">Bloquear OC</a></li>\
                                                <li ng-if="opciones.sw_bloquear_orden && row.entity.estado == 5"><a href="javascript:void(0);" \
                                                    ng-click="onCambiarEstadoOrden(row.entity, 1)">Desbloquear OC</a></li>\
                                                <li ng-if="row.entity.estado != 5"><a href="javascript:void(0);" ng-click="onCambiarEstadoOrden(row.entity, 2)">Anular OC</a></li>\
                                            </ul>\
                                        </div>'
                    }
                ]
            };

            // Agregar Clase de acuerdo al estado del pedido
            $scope.agregar_clase_btn = function(estado) {

                return estados[estado];
            };

            $scope.agregar_indicador_fechas = function(orden) {

                //NOTA ESTO TOCA ARREGLARLO CON MOMENT JS 
                //
                // The number of milliseconds in one day
                var ONE_DAY = 1000 * 60 * 60 * 24;

                // Convert both dates to milliseconds
                var date1_ms = (orden.fecha_recibido === "") ? new Date().getTime() : new Date(orden.fecha_recibido.replace(/(\d{2})-(\d{2})-(\d{4})/, "$2/$1/$3")).getTime();
                var date2_ms = new Date(orden.fecha_registro.replace(/(\d{2})-(\d{2})-(\d{4})/, "$2/$1/$3")).getTime();

                // Calculate the difference in milliseconds
                var difference_ms = Math.abs(date1_ms - date2_ms);

                // Convert back to days and return
                var days = Math.round(difference_ms / ONE_DAY);

                if (days >= 3 || orden.fecha_recibido === "")
                    return "ng-cell-red";
                else
                    return "ng-cell-green";
            };

            $scope.onMostrarPendientes = function(ordenCompra){
                console.log("compra ", ordenCompra);
                
                that.mostrarVentanaPendientes(ordenCompra);
            };
            
            that.mostrarVentanaPendientes = function(ordenCompra){
                $scope.opts = {
                    backdrop: true,
                    backdropClick: true,
                    dialogFade: true,
                    keyboard: true,
                    templateUrl: 'views/genererarordenes/listarPendientes.html',
                    scope: $scope,                  
                    controller: "ListaPendientesController",
                    resolve: {
                        ordenCompra: function() {
                            return ordenCompra;
                        }
                    }           
                };
                var modalInstance = $modal.open($scope.opts);   

                modalInstance.result.then(function(){ 
                },function(){});
            };

            $scope.pagina_anterior = function() {
                $scope.pagina_actual--;
                $scope.buscar_ordenes_compras($scope.termino_busqueda, true);
            };

            $scope.pagina_siguiente = function() {
                $scope.pagina_actual++;
                $scope.buscar_ordenes_compras($scope.termino_busqueda, true);
            };

            $scope.abrir_fecha_inicial = function($event) {

                $event.preventDefault();
                $event.stopPropagation();

                $scope.datepicker_fecha_inicial = true;
                $scope.datepicker_fecha_final = false;

            };

            $scope.abrir_fecha_final = function($event) {

                $event.preventDefault();
                $event.stopPropagation();

                $scope.datepicker_fecha_inicial = false;
                $scope.datepicker_fecha_final = true;

            };

            $scope.crear_orden_compra = function() {
                localStorageService.add("numero_orden", 0);
                $state.go('OrdenCompra');
            };


            $scope.vista_previa = function(orden_compra) {

                localStorageService.add("numero_orden", orden_compra.get_numero_orden());
                localStorageService.add("vista_previa", '1'); // true
                $state.go('OrdenCompra');
            };


            $scope.gestionar_acciones_orden_compra = function(orden_compra, opcion) {

                // Opcion => 0 = Modificar
                // Opcion => 1 = Novedades


                if (orden_compra.get_estado() === '0' || orden_compra.get_estado() === '2' || /*orden_compra.get_estado() === '3' ||
                        orden_compra.get_estado() === '4' ||*/ orden_compra.get_ingreso_temporal()) {

                    if (orden_compra.get_estado() === '0')
                        $scope.mensaje_sistema = "La Orden de Compra [ OC #" + orden_compra.get_numero_orden() + " ] ya fue Ingresada en bodega";
                    else if (orden_compra.get_estado() === '2')
                        $scope.mensaje_sistema = "La Orden de Compra [ OC #" + orden_compra.get_numero_orden() + " ] está anulada.";
                    else if (orden_compra.get_estado() === '3')
                        $scope.mensaje_sistema = "La Orden de Compra [ OC #" + orden_compra.get_numero_orden() + " ] ya fue recibida en bodega.";
                    else if (orden_compra.get_estado() === '4')
                        $scope.mensaje_sistema = "La Orden de Compra [ OC #" + orden_compra.get_numero_orden() + " ] ya fue verificada.";
                    else if (orden_compra.get_ingreso_temporal())
                        $scope.mensaje_sistema = "La Orden de Compra [ OC #" + orden_compra.get_numero_orden() + " ] esta siendo Ingresa en Bodega";

                    $scope.opts = {
                        backdrop: true,
                        backdropClick: true,
                        dialogFade: false,
                        keyboard: true,
                        template: ' <div class="modal-header">\
                                        <button type="button" class="close" ng-click="close()">&times;</button>\
                                        <h4 class="modal-title">Mensaje del Sistema</h4>\
                                    </div>\
                                    <div class="modal-body">\
                                        <h4> {{ mensaje_sistema }} </h4>\
                                    </div>\
                                    <div class="modal-footer">\
                                        <button class="btn btn-primary" ng-click="close()">Aceptar</button>\
                                    </div>',
                        scope: $scope,
                        controller: ["$scope", "$modalInstance", function($scope, $modalInstance) {

                            $scope.close = function() {
                                $modalInstance.close();
                            };
                        }],
                        resolve: {
                            mensaje_sistema: function() {
                                return $scope.mensaje_sistema;
                            }
                        }
                    };
                    var modalInstance = $modal.open($scope.opts);
                } else {

                    localStorageService.add("numero_orden", orden_compra.get_numero_orden());

                    if (opcion === 0)
                        $state.go('OrdenCompra');
                    else if (opcion === 1)
                        $state.go('Novedades');
                }

            };

            $scope.generar_reporte = function(orden_compra) {

                //branch ordenes de compras
                $scope.orden_compra_seleccionada = orden_compra;

               // if (orden_compra.get_sw_estado_digitacion() === '1') {

                    var obj = {
                        session: $scope.session,
                        data: {
                            ordenes_compras: {
                                numero_orden: $scope.orden_compra_seleccionada.get_numero_orden()
                            }
                        }
                    };

                    Request.realizarRequest(API.ORDENES_COMPRA.REPORTE_ORDEN_COMPRA, "POST", obj, function(data) {
                        
                        if (data.status === 200) {
                            var nombre_reporte = data.obj.ordenes_compras.nombre_reporte;

                            $scope.visualizarReporte("/reports/" + nombre_reporte, "OrdenCompra" + $scope.orden_compra_seleccionada.get_numero_orden(), "_blank");
                        } else {

                        }
                    });

              /*  } else {
                    AlertService.mostrarMensaje("warning", "La ordend de compra No. " + orden_compra.get_numero_orden() + " no ha sido finalizada!!.");
                    return;
                }*/
            };


            $scope.ventana_enviar_email = function(orden_compra) {

                $scope.orden_compra_seleccionada = orden_compra;

                if (orden_compra.get_sw_estado_digitacion() === '1') {

                    $scope.datos_view.orden_compra_seleccionada = orden_compra;
                    $scope.datos_view.email_subject = 'Orden de Compra de DUANA Y CIA LTDA - COSMITET LTDA No-' + $scope.datos_view.orden_compra_seleccionada.get_numero_orden();
                    $scope.datos_view.email_message = 'Orden de Compra No-' + $scope.datos_view.orden_compra_seleccionada.get_numero_orden() + '.\nPara el Proveedor ' + $scope.datos_view.orden_compra_seleccionada.get_proveedor().get_nombre();
                    $scope.datos_view.email_attachment_name = "OrdenCompraNo-" + $scope.datos_view.orden_compra_seleccionada.get_numero_orden() + '.pdf';

                    $scope.opts = {
                        backdrop: true,
                        backdropClick: true,
                        dialogFade: false,
                        keyboard: true,
                        templateUrl: 'views/genererarordenes/redactaremail.html',
                        scope: $scope,
                        controller: ["$scope", "$modalInstance", function($scope, $modalInstance) {

                            $scope.validar_envio_email = function() {

                                var expresion = /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i;
                                var emails = $scope.datos_view.email_to.split(',');
                                var continuar = true;

                                emails.forEach(function(email) {
                                    if (!expresion.test(email.trim())) {
                                        continuar = false;
                                    }
                                });

                                if (continuar) {
                                    $scope.enviar_email(function(continuar) {
                                        if (continuar) {
                                            $scope.datos_view.orden_compra_seleccionada = OrdenCompra.get();
                                            $scope.datos_view.email_to = '';
                                            $scope.datos_view.email_subject = '';
                                            $scope.datos_view.email_message = '';
                                            $scope.datos_view.email_attachment_name = '';
                                            $modalInstance.close();
                                        }
                                    });
                                } else {
                                    AlertService.mostrarMensaje("warning", 'Direcciones de correo electrónico inválidas!.');
                                }
                            };

                            $scope.cancelar_enviar_email = function() {
                                $modalInstance.close();
                            };
                        }]
                    };
                    var modalInstance = $modal.open($scope.opts);
                } else {
                    AlertService.mostrarMensaje("warning", "La ordend de compra No. " + orden_compra.get_numero_orden() + " no ha sido finalizada!!.");
                    return;
                }
            };

            $scope.enviar_email = function(callback) {

                var obj = {
                    session: $scope.session,
                    data: {
                        ordenes_compras: {
                            numero_orden: $scope.datos_view.orden_compra_seleccionada.get_numero_orden(),
                            enviar_email: true,
                            emails: $scope.datos_view.email_to,
                            subject: $scope.datos_view.email_subject,
                            message: $scope.datos_view.email_message
                        }
                    }
                };

                Request.realizarRequest(API.ORDENES_COMPRA.REPORTE_ORDEN_COMPRA, "POST", obj, function(data) {

                    AlertService.mostrarMensaje("warning", data.msj);

                    if (data.status === 200) {
                        callback(true);
                    } else {
                        callback(false);
                    }

                });
            };
            
            $scope.onSubirArchivoOrdenes = function(){
                 var opts = {
                        backdropClick: true,
                        backdrop: 'static',
                        dialogFade: false,
                        keyboard: true,
                        templateUrl: 'views/genererarordenes/ventanaarchivoordenes.html',
                        scope: $scope,
                        controller:'VentanaArchivoOrdenesController'
                    };
                    var modalInstance = $modal.open(opts);
                    
                    
                modalInstance.result.then(function() {
                    $scope.buscar_ordenes_compras("");

                }, function() {
                    
                });
            };

            $scope.onCambiarEstadoOrden = function(orden_compra, estado) {

                var template = "";
                var controller = "";

                $scope.orden_compra_seleccionada = orden_compra;


                if (orden_compra.estado === '1' && !orden_compra.get_ingreso_temporal() || estado === 1) {
                    template = ' <div class="modal-header">\
                                    <button type="button" class="close" ng-click="close()">&times;</button>\
                                    <h4 class="modal-title">Mensaje del Sistema</h4>\
                                </div>\
                                <div class="modal-body">\
                                    <h4>Desea Modificar el estado de la OC #' + orden_compra.get_numero_orden() + '?? </h4> \
                                </div>\
                                <div class="modal-footer">\
                                    <button class="btn btn-warning" ng-click="close()">No</button>\
                                    <button class="btn btn-primary" ng-click="anular()" ng-disabled="" >Si</button>\
                                </div>';
                    controller = ["$scope", "$modalInstance", function($scope, $modalInstance) {

                        $scope.anular = function() {
                            $scope.cambiarEstadoOrden(estado);
                            $modalInstance.close();
                            $scope.orden_compra_seleccionada = null;
                        };

                        $scope.close = function() {
                            $modalInstance.close();
                            $scope.orden_compra_seleccionada = null;
                        };
                    }];

                } else {
                    template = ' <div class="modal-header">\
                                        <button type="button" class="close" ng-click="close()">&times;</button>\
                                        <h4 class="modal-title">Mensaje del Sistema</h4>\
                                    </div>\
                                    <div class="modal-body">\
                                        <h4> La orden de compra [OC #' + orden_compra.get_numero_orden() + '] no puede ser modificada !!.</h4>\
                                    </div>\
                                    <div class="modal-footer">\
                                        <button class="btn btn-primary" ng-click="close()">Aceptar</button>\
                                    </div>';
                    controller = ["$scope", "$modalInstance", function($scope, $modalInstance) {

                        $scope.close = function() {
                            $modalInstance.close();
                        };
                    }];
                }


                $scope.opts = {
                    backdrop: true,
                    backdropClick: true,
                    dialogFade: false,
                    keyboard: true,
                    template: template,
                    scope: $scope,
                    controller: controller
                };
                var modalInstance = $modal.open($scope.opts);

            };

            socket.on("onListarOrdenesCompras", function(datos) {

                if (datos.status === 200) {

                    var datos = datos.obj.ordenes_compras[0];

                    var orden_compra = that.render_orden_compra(datos);

                    for (var i in $scope.Empresa.get_ordenes_compras()) {

                        var orden = $scope.Empresa.get_ordenes_compras()[i];

                        if (orden.numero_orden_compra === orden_compra.numero_orden_compra) {
                            $scope.Empresa.get_ordenes_compras()[i].set_estado(orden_compra.estado);
                            $scope.Empresa.get_ordenes_compras()[i].set_descripcion_estado(orden_compra.descripcion_estado);
                            $scope.Empresa.get_ordenes_compras()[i].set_fechas_recepcion(orden_compra.fecha_recibido, orden_compra.fecha_verificacion);
                            break;
                        }
                    }

                    AlertService.mostrarMensaje("success", "Orden Compra Actualizada");
                }
            });

            $scope.buscar_ordenes_compras();
            
            $scope.onSeleccionFiltro = function(filtro){
                $scope.filtro = filtro;
            };

            $scope.$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams) {
                $scope.$$watchers = null;
                socket.remove(["onListarOrdenesCompras"]);
            });

        }]);
});