
define(["angular", "js/controllers", 'includes/slide/slideContent',
    "includes/classes/Empresa",
     "models/Planes",
], function(angular, controllers) {

    controllers.controller('FiltroDrAriasController', [
        
        '$scope', '$rootScope', "Request",
        "$filter", '$state', '$modal', '$modalInstance',
        "API", "AlertService", 'localStorageService',
        "Usuario", "socket", "$timeout",
        "Empresa", "ParametrosBusquedaService",
        "CentroUtilidad", "Bodega","Planes","parametros", 
        function($scope, $rootScope, Request,
                $filter, $state, $modal, $modalInstance,
                API, AlertService, localStorageService,
                Usuario, socket, $timeout,
                Empresa, ParametrosBusquedaService,
                CentroUtilidad, Bodega,Planes,parametros) {

            var that = this;
            $scope.listaEmpresas = [];
            $scope.listaCentroUtilidad = [];
            $scope.listaBodegas = [];
            $scope.listarPlanes = [];
            $scope.filtro = {};
            var fechaActual = new Date();
            
            
            if(parametros!==undefined){
                console.log("aaaaaaa",JSON.parse(parametros.parametros_de_busqueda));
            }
            
            $scope.close = function() {
               $modalInstance.close();
            };

            $scope.seleccion = Usuario.getUsuarioActual().getEmpresa();
            $scope.session = {
                usuario_id: Usuario.getUsuarioActual().getId(),
                auth_token: Usuario.getUsuarioActual().getToken()
            };
            
            $scope.titulo = "Reporte Dr. Arias"; 
            $scope.formatearFecha = function(fecha) {
                return $filter('date')(fecha, 'yyyy-MM-dd');
            };
            
            
             $scope.onKeyPress= function(ev,termino){
                 if (ev.which === 13) {
                     $scope.termino_busqueda_documento='10';
                     $scope.termino_busqueda_codigo=termino;
                     $scope.termino_busqueda_descripcion='12';
//                    $scope.buscarProductos(termino_busqueda);
                }                
             }
            
             $scope.abrirFechaInicial = function($event) {
                $event.preventDefault();
                $event.stopPropagation();
                $scope.abrirfechainicial = true;
                $scope.fechainicial = $filter('date')(new Date("01/01/"  + fechaActual.getFullYear()), "yyyy-MM-dd");
                $scope.fechafinal = $filter('date')(fechaActual, "yyyy-MM-dd");
                $scope.abrirfechafinal = false;
                console.log($scope.fechainicial);
            };

            $scope.abrirFechaFinal = function($event) {
                $event.preventDefault();
                $event.stopPropagation();

                $scope.abrirfechafinal = true;
                $scope.abrirfechainicial = false;
            };

            $scope.fechainicialselected = function() {
                if ($scope.fechainicial > $scope.fechafinal) {
                    console.log($scope.fechafinal);
                    $scope.fechafinal = $scope.fechainicial;
                }
            };

            $scope.fechafinalselected = function() {
                $scope.fechainicial = $scope.fechafinal;
            };
                
           $scope.realizarAsignacion=function(){
                    
                if ($scope.filtro.empresa_seleccion === "" || $scope.filtro.empresa_seleccion === undefined) {
                    AlertService.mostrarMensaje("warning", "Debe seleccionar una empresa");
                    return;
                }
                
                if ($scope.filtro.fechainicial === "" || $scope.filtro.fechainicial === undefined) {
                    AlertService.mostrarMensaje("warning", "Debe Seleccionar la Fecha de Inicio");
                    return;
                }
                
                if ($scope.filtro.fechafinal === "" || $scope.filtro.fechafinal === undefined) {
                    AlertService.mostrarMensaje("warning", "Debe Seleccionar la Fecha de Finalización");
                    return;
                }
                
                if ($scope.filtro.plan_seleccion === "" || $scope.filtro.plan_seleccion === undefined) {
                    $scope.filtro.plan_seleccion= undefined;
                }
                
                if ($scope.filtro.centro_seleccion === "" || $scope.filtro.centro_seleccion === undefined) {
                    $scope.filtro.centro_seleccion= undefined;
                }
                
                if ($scope.filtro.bodega_seleccion === "" || $scope.filtro.bodega_seleccion === undefined) {
                    $scope.filtro.bodega_seleccion= undefined;
                }
                                   
                if ($scope.filtro.descripcion === "" || $scope.filtro.descripcion === undefined) {
                    $scope.filtro.descripcion= undefined;
                }
                
                if ($scope.filtro.codigo === "" || $scope.filtro.codigo === undefined) {
                    $scope.filtro.codigo= undefined;
                }
                    console.log("fechainicial ",$scope.filtro.fechainicial);
                    console.log("fechafinal ",$scope.filtro.fechafinal);
                    console.log("empresa_seleccion ",$scope.filtro.empresa_seleccion);
                    console.log("centro_seleccion ",$scope.filtro.centro_seleccion);
                    console.log("bodega_seleccion ",$scope.filtro.bodega_seleccion);
                    console.log("plan_seleccion ",$scope.filtro.plan_seleccion);
                    console.log("documento ",$scope.filtro.documento);
                    console.log("codigo ",$scope.filtro.codigo);
                    console.log("descripcion ",$scope.filtro.descripcion);
                    that.buscarProductosBloqueados($scope.filtro,1);
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

                Request.realizarRequest(API.REPORTES.LISTAR_EMPRESAS_FARMACIAS, "POST", obj, function(data) {
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

                Request.realizarRequest(API.REPORTES.CENTROS_UTILIDAD_EMPRESAS, "POST", obj, function(data) {

                    if (data.status === 200) {
                        console.log("centros de utilidad ", data);
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

                Request.realizarRequest(API.REPORTES.BODEGAS_EMPRESA, "POST", obj, function(data) {

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
            
            that.consultarListarPlanes = function(callback) {

                $scope.listarPlanes = [];
                
                $scope.filtro.plan_seleccion = "";
                var obj = {
                    session: $scope.session,
                    data: {
                        planes: {
                            empresa_id: $scope.filtro.empresa_seleccion,
                            centro_utilidad_id: $scope.filtro.centro_seleccion
                        }
                    }
                };

                Request.realizarRequest(API.REPORTES.LISTAR_PLANES, "POST", obj, function(data) {

                    if (data.status === 200) {
                        console.log("22consultarListarPlanes>>>>>>>>>>>>>>>",data.obj);
                        for (var i in data.obj.listarPlanes) {
                            var plan = Planes.get(                                 
                                    data.obj.listarPlanes[i].plan_id,
                                    data.obj.listarPlanes[i].plan_descripcion
                            );
                            $scope.listarPlanes.push(plan);                           
                            
                        }
                        console.log(" $scope.listarPlanes>>>>>>>>>>>>>>>", $scope.listarPlanes);
                        if (callback)
                            callback();
                    }
                });
            };

            that.traerEmpresas(function() {
                $timeout(function() {
                    $scope.filtro.empresa_seleccion = '03';
                    /// $scope.buscarProductos("");
                });

            });   

            $scope.onEmpresaSeleccionada = function() {
                that.consultarCentrosUtilidadPorEmpresa();
            };

            $scope.onCentroSeleccionado = function() {
                that.consultarBodegasPorEmpresa();
            };
 
            that.init = function(callback) {
                $scope.root = {};             
                callback();
            };
            
            /**
             * @author Andres M. Gonzalez
             * @fecha 04/02/2016
             * +Descripcion Metodo encargado de invocar el servicio que
             *              listar todos las autorizaciones de productos en pedido
             */
            that.buscarProductosBloqueados = function(termino,paginando) {                    
                if ($scope.ultima_busqueda !== $scope.termino) {
                    $scope.paginaactual = 1;
                }
                
                    console.log("fechainicial ",$scope.filtro.fechainicial);
                    console.log("fechafinal ",$scope.filtro.fechafinal);
                    console.log("empresa_seleccion ",$scope.filtro.empresa_seleccion);
                    console.log("centro_seleccion ",$scope.filtro.centro_seleccion);
                    console.log("bodega_seleccion ",$scope.filtro.bodega_seleccion);
                    console.log("plan_seleccion ",$scope.filtro.plan_seleccion);
                    console.log("documento ",$scope.filtro.documento);
                    console.log("descripcion ",$scope.filtro.descripcion);
                    console.log("producto ",$scope.filtro.producto);
                
              
                var obj = {
                    fecha_inicial: termino.fechainicial,
                    fecha_final: termino.fechafinal,
                    empresa_seleccion: termino.empresa_seleccion===undefined ? null: termino.empresa_seleccion,
                    centro_seleccion: termino.centro_seleccion===undefined ? null:termino.centro_seleccion,
                    bodega_seleccion: termino.bodega_seleccion===undefined ? null:termino.bodega_seleccion,
                    plan_seleccion: termino.plan_seleccion===undefined ? null:termino.bodega_seleccion,
                    documento: termino.documento===undefined ? null:termino.documento,
                    descripcion: termino.descripcion===undefined ? null:termino.descripcion,
                    codigo: termino.codigo===undefined ? null:termino.codigo,
                    pagina_actual: $scope.paginaactual,                    
                    session: $scope.session                    
                };
                
                console.log("entra ",obj);
                
                ParametrosBusquedaService.buscarProductosBloqueados(obj, function(data) {
                    if (data.status === 200) {
                        $scope.ultima_busqueda = $scope.termino;
                       $modalInstance.close();
                    } else {
                        AlertService.mostrarVentanaAlerta("Mensaje del sistema", data.msj);                        
                    }
                });
            };
            
            that.init(function() {
                that.consultarListarPlanes();
            });
                       

        }]);
});