
define(["angular", "js/controllers",
    "models/ProductoOrdenCompra",
    "models/OrdenCompraPedido",
    "models/ProductoOrdenCompra",
    "includes/classes/Empresa",
    "models/AutorizacionOrdenCompra",
    "models/LoteOrdenCompra",
    "models/EmpresaOrdenCompra",
    "controllers/autorizaciones/AutorizarOrdenesComprasController"
], function(angular, controllers) {
    controllers.controller('ListarActasController', [
        '$scope', '$rootScope', 'Request',
        '$modal', 'API', "socket",
        "OrdenCompraPedido",
        "ProductoOrdenCompra",
        "Usuario",
        "EmpresaOrdenCompra",
        "LoteOrdenCompra",
        "AutorizacionOrdenCompra",
        "EmpresaOrdenCompra",
        "ProveedorOrdenCompra",
        function($scope, $rootScope, Request,
                $modal, API, socket,
                OrdenCompra, Producto, Usuario, Empresa, Lote, Autorizacion, empresaOrdenCompra,Proveedor) {

            var that = this;  
            $scope.Empresa = Empresa;
             
            $scope.datos_view = {
                termino_busqueda: ""
            };

            $scope.session = {
                usuario_id: Usuario.getUsuarioActual().getId(),
                auth_token: Usuario.getUsuarioActual().getToken()
            };

            /*
             * Inicializacion de variables
             * @param {type} empresa
             * @param {type} callback
             * @returns {void}
             */
            that.init = function() {
                $scope.root = {};
                $scope.root.termino_busqueda_proveedores="";
                $scope.root.Empresa = Empresa;  
                $scope.root.terminoBusqueda="";
            };
            
             /*
             * @Author: AMGT
             * +Descripcion: lista para escoger busqueda, por numero orden de pedido o por producto.
             */
            $scope.filtros = [
                {nombre: "Orden", selec: '0'}
            ];
            /*
             * @Author: AMGT
             * +Descripcion: metodo que selecciona el filtro
             */
            $scope.filtro = $scope.filtros[0];
            $scope.onSeleccionFiltro = function(filtro) {
                $scope.filtro = filtro;
            };
            
            $scope.seleccion = Usuario.getUsuarioActual().getEmpresa();



            /*
             * @Author: AMGT
             * +Descripcion: selecciona la lista de proveedores
             */
            $scope.listar_proveedores = function(termino_busqueda) {

                if (termino_busqueda.length < 3) {
                    return;
                }

                $scope.root.termino_busqueda_proveedores = termino_busqueda;

                that.buscar_proveedores(function(proveedores) {

                    that.render_proveedores(proveedores);
                });
            };    
            
            /*
             * @Author: AMGT
             * +Descripcion: selecciona el buscador de proveedores
             */
             that.buscar_proveedores = function(callback) {

                var obj = {
                    session: $scope.session,
                    data: {
                        proveedores: {
                            termino_busqueda: $scope.root.termino_busqueda_proveedores
                        }
                    }
                };

                Request.realizarRequest(API.PROVEEDORES.LISTAR_PROVEEDORES, "POST", obj, function(data) {

                    if (data.status === 200) {

                        if ($scope.numero_orden > 0)
                            that.render_proveedores(data.obj.proveedores);

                        //callback(true);
                        callback(data.obj.proveedores);
                    }
                });
            };
            
            /*
             * @Author: AMGT
             * +Descripcion: aplica el render al modelo
             */
            that.render_proveedores = function(proveedores) {

                $scope.Empresa.limpiar_proveedores();
                proveedores.forEach(function(data) {

                    var proveedor = Proveedor.get(data.tipo_id_tercero, data.tercero_id, data.codigo_proveedor_id, data.nombre_proveedor, data.direccion, data.telefono);

                    $scope.Empresa.set_proveedores(proveedor);
                });
            };
            
            
            $scope.onBuscarOrden = function(event,proveedor) {
                if (event.which === 13 || proveedor !== undefined) {
                    if(proveedor !== undefined){
                     $scope.proveedor= proveedor;
                    }
                    if($scope.proveedor===undefined){
                       $scope.proveedor = {codigo_proveedor_id:""} 
                    }
                  
                  var parametros={
                      codigoProveedor:$scope.proveedor.codigo_proveedor_id, 
                      terminoBusqueda:$scope.root.terminoBusqueda
                  };
                  that.buscarOrdenesProveedoresActas(parametros,function(data){
                      console.log("data   ",data);
                      $scope.root.ordenProveedorActa=data;
                  });
                 }
            };
            
            
            /*
             * @Author: AMGT
             * +Descripcion: selecciona el buscador de proveedores
             */
             that.buscarOrdenesProveedoresActas = function(parametros,callback) {

                var obj = {
                    session: $scope.session,
                    data: {
                        proveedores: {
                            terminoBusqueda: parametros.terminoBusqueda,
                            codigoProveedor: parametros.codigoProveedor
                        }
                    }
                };

                Request.realizarRequest(API.ACTAS_TECNICAS.LISTAR_ORDENES_PARA_ACTAS, "POST", obj, function(data) {

                    if (data.status === 200) {

                        //if ($scope.numero_orden > 0)
                           // that.render_proveedores(data.obj.proveedores);

                        
                        callback(data.obj.listarOrdenesParaActas);
                    }
                });
            };
            
            /*
             * @Author: AMGT
             * +Descripcion: selecciona el buscador de proveedores
             */
             that.buscarOrdenesProductosActas = function(parametros,callback) {

                var obj = {
                    session: $scope.session,
                    data: {
                        orden: {
                            ordenPedido: parametros.numero_orden
                        }
                    }
                };

                Request.realizarRequest(API.ACTAS_TECNICAS.LISTAR_PRODUCTOS_PARA_ACTAS, "POST", obj, function(data) {

                    if (data.status === 200) {

                        //if ($scope.numero_orden > 0)
                           // that.render_proveedores(data.obj.proveedores);

                        
                        callback(data.obj.listarProductosParaActas);
                    }
                });
            };
            
            $scope.onSeleccionarProducto=function(datos){
                
                 $scope.root.proveedor=datos.nombre_tercero;
                 $scope.root.numeoOrden=datos.numero_orden;
                 
                 that.buscarOrdenesProductosActas(datos,function(obj){
                     console.log("AAAAAA",obj);
                     $scope.root.ordenProductosActa=obj;
                 });                     
            };

            /*
             * @Author: AMGT
             * +Descripcion: grilla donde se encuentran las ordenes para autorizar
             */
            $scope.listaOrdenesProveedoresActas = {
                data: 'root.ordenProveedorActa',
                enableColumnResize: true,
                enableRowSelection: true,
                enableCellSelection: true,
                enableHighlighting: true,
                columnDefs: [
                    {field: 'numero_orden', displayName: '# Orden', width: "10%"},
                    {field: 'fecha_registro', displayName: 'F. Ingreso', cellFilter: "date:\'yyyy-MM-dd\'", width: "10%"},
                    {field: 'nombre_tercero', displayName: "Proveedor", width: "30%"},
                    {field: 'tercero_id', displayName: "Nit", width: "10%"},
                    {field: 'observaciones', displayName: "Observación", width: "30%"},
                    {displayName: "Detalle de la Orden", cellClass: "txt-center dropdown-button",
                        cellTemplate: '<div class="btn-group">\
                                            <button class="btn btn-success btn-xs dropdown-toggle" ng-click="onSeleccionarProducto(row.entity)" data-toggle="dropdown"><span class="glyphicon glyphicon-list-alt"></span></button>\
                                        </div>'
                    }
                ]
            };
            
            
            /*
             * @Author: AMGT
             * +Descripcion: grilla donde se encuentran las ordenes para autorizar
             */
            $scope.listaProductosActas = {
                data: 'root.ordenProductosActa',
                enableColumnResize: true,
                enableRowSelection: true,
                enableCellSelection: true,
                enableHighlighting: true,
                columnDefs: [
                    {field: 'codigo_producto', displayName: 'Codigo', width: "10%"},
                    {field: 'descripcion', displayName: 'Descripción', cellFilter: "date:\'yyyy-MM-dd\'", width: "60%"},
                    {field: 'numero_unidades', displayName: "Cantidad", width: "10%"},
                    {displayName: "Generar Acta Tecnica", cellClass: "txt-center dropdown-button",
                        cellTemplate: '<div class="btn-group">\
                                            <button class="btn btn-primary btn-xs" ng-click="onAbrirVentana(row.entity)" dropdown-toggle" data-toggle="dropdown"><span class="glyphicon glyphicon-edit"></span></button>\
                                        </div>'
                    }
                ]
            };
            
            
            $scope.onAbrirVentana=function(entity){
                console.log("onAbrirVentana");
                that.ventanaActaTecnica(entity);
            };
            
                 /**
                  * @author Andres Mauricio Gonzalez
                  */
                that.ventanaActaTecnica = function(entity){

                    $scope.opts = {
                        backdrop: true,
                        backdropClick: true,
                        dialogFade: true,
                        keyboard: true,
                        templateUrl: 'views/actas/actaTecnica.html',
                        scope: $scope,                  
                        controller: "ActaTecnicaController",
                        windowClass: 'app-modal-window-xlg-xlg',
                        resolve: {
                                identificadorProductoPendiente: function() {
                                    return entity;
                                }
                            }
                    };
                    var modalInstance = $modal.open($scope.opts);   

                        modalInstance.result.then(function(){
                          //  that.listarFormulasMedicas({estado:0}); 
                           // that.listarFormulasMedicasPendientes();
                            
                        },function(){});  
                };


            that.init();
            
             $scope.$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams) {
                $scope.$$watchers = null;
                $scope.root = {};
            });
            
        }]);
});