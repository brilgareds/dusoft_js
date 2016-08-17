
define(["angular", "js/controllers", 'includes/slide/slideContent',
    "includes/classes/Empresa",
    'controllers/drArias/FiltroDrAriasController',
    "models/ReportesGenerados",
], function(angular, controllers) {

    controllers.controller('DrAriasController', [
        '$scope', '$rootScope', "Request",
        "$filter", '$state', '$modal',
        "API", "AlertService", 'localStorageService',
        "Usuario", "socket", "$timeout","ReportesGenerados",
        "Empresa", "ParametrosBusquedaService",
        function($scope, $rootScope, Request,
                $filter, $state, $modal,
                API, AlertService, localStorageService,
                Usuario, socket, $timeout,ReportesGenerados,
               Empresa, ParametrosBusquedaService) {

            var that = this;
            var listaTerceros = [];

            $scope.seleccion = Usuario.getUsuarioActual().getEmpresa();
            $scope.session = {
                usuario_id: Usuario.getUsuarioActual().getId(),
                auth_token: Usuario.getUsuarioActual().getToken()
            };           
             

            that.init = function(callback) {
                $scope.root = {};
                $scope.abrirModalDrArias();            
                callback();
            };
            
            
            
             $scope.abrirModalParametros= function(parametros) {  
                 var parametros =parametros.parametros_de_busqueda;
                $scope.opts = {
                    backdrop: true,
                    backdropClick: true,
                    dialogFade: false,
                    keyboard: true,
                    templateUrl: 'views/drArias/modal-parametros.html',
                    controller:['$scope',function($scope){
                      $scope.titulo="Parametros de Busqueda";
                      $scope.filtro={};
                      $scope.filtro.fechainicial=parametros.fecha_inicial;
                      $scope.filtro.fechafinal=parametros.fecha_final;
                      $scope.filtro.empresa=parametros.empresa_seleccion;
                      $scope.filtro.bodega=parametros.bodega_seleccion;
                      $scope.filtro.centroUtilidad=parametros.centro_seleccion;
                      $scope.filtro.documento=parametros.documento;
                      $scope.filtro.codigoProducto=parametros.codigo;
                      $scope.filtro.descripcion=parametros.descripcion;
                      $scope.filtro.plan=parametros.plan_seleccion;
                      $scope.close = function() {
                         modalInstancesy.close();
                      };
                    }]                    
                }
                
                var modalInstancesy = $modal.open($scope.opts);
            };
            
             $scope.abrirModalConsolidado= function(parametros) {  
                 var consolidados =parametros.consolidado;
                 var objtBodega=parametros.bodegaDetalle;
                $scope.opts = {
                    backdrop: true,
                    backdropClick: true,
                    dialogFade: false,
                    keyboard: true,
                    templateUrl: 'views/drArias/modal-consolidado.html',
                    controller:['$scope',function($scope){
                      $scope.titulo="Consolidado del Reporte";
                      $scope.consolidado={};
                      $scope.consolidado.cantidadDespachoUnidades=consolidados.cantidadDespachoUnidades;
                      $scope.consolidado.cantidadFomulas=consolidados.cantidadFomulas;
                      $scope.consolidado.cantidadPacientes=consolidados.cantidadPacientes;
                      $scope.consolidado.total=consolidados.total.toFixed(2);
                      $scope.consolidado.precio=consolidados.precio.toFixed(2);
                      $scope.consolidado.consolidadoBodegas=objtBodega;
                      $scope.close = function() {
                         modalInstancesy.close();
                      };
                    }]                    
                }
                
                var modalInstancesy = $modal.open($scope.opts);
            };
            
            
            /*
             * @Author: Andres M.
             * +Descripcion: Evento que actualiza la vista 
             */
           socket.on("onNotificarEstadoDescargaReporte", function(datos) {
               if(datos.estado ==='ok'){
                that.buscarReportesBloqueados();
               }
            }); 
            
             $scope.abrirModalDrArias= function(parametros) {
                 
                $scope.opts = {
                    backdrop: true,
                    backdropClick: true,
                    dialogFade: false,
                    keyboard: true,
                    templateUrl: 'views/drArias/modal-drArias.html',
                    controller: "FiltroDrAriasController",
                    resolve: {
                        parametros: function() {
                            return parametros;
                        }
                    }                     
                };

                var modalInstance = $modal.open($scope.opts);
            };
            
            $scope.cerrar=function($scope, $modalInstance) {
                $scope.onCerrar = function(acepto) {
                    $modalInstance.close();
                };
             }
             
             
             $scope.onDescagarArchivo=function(nombre_reporte){
              $scope.visualizarReporte("/reports/" + nombre_reporte, nombre_reporte, "download");
             }
             
            /**
             * +Descripcion: funcion que realiza la busqueda de los pedidos
             * @author Andres M Gonzalez
             * @fecha: 11/05/2016
             * @params terminoBusqueda
             */
            $scope.onAutorizacionTab = function(termino) {
                $scope.tipoPedido = termino;
                $scope.listarPedido = [];
               // listaTerceros = [];
                $scope.empresa_seleccion = $scope.seleccion.codigo;
                that.buscarReporteDrArias("");
            };

            /**
             * +Descripcion: evento busca pedido
             * @author Andres M Gonzalez
             * @fecha: 11/05/2016
             * @params terminoBusqueda
             */
            $scope.onBuscarPedido = function(ev, terminoBusqueda) {
                if (ev.which === 13) {
                    $scope.termino = terminoBusqueda;
                    $scope.paginaactual = 1;
                    that.buscarReporteDrArias(terminoBusqueda,true);
                    //listaTerceros = [];
                    // that.buscarPedidos(terminoBusqueda);
                }
            };

            
            /**
             * @author Andres M. Gonzalez
             * @fecha 22/07/2016
             * +Descripcion Metodo encargado de invocar el servicio que
             *              listar todos los reportes generados
             */
            that.buscarReportesBloqueados = function() {
                var obj = {
                    session: $scope.session
                };
                ParametrosBusquedaService.reportesGenerados(obj, function(data) {
                    if (data.status === 200) {
                        that.renderReportesBloqueados(data);                        
                    } else {
                        AlertService.mostrarVentanaAlerta("Mensaje del sistema ReportesBloqueados: ", data.msj);
                    }
                });
            };
            
            /**
             * +Descripcion:renderizar la consulta al modelo
             * @author Andres M Gonzalez
             * @fecha: 11/05/2016
             * @returns {objeto}
             */
            that.renderReportesBloqueados = function(data) {               
                var listaReportesGenerados = [];
                var llist = [];
                for (var i in data.obj.reportes) {
                    var objt = data.obj.reportes[i];
                    var reportesGenerados = ReportesGenerados.get(objt.estado_reportes_id);
                    reportesGenerados.setNombreReporte(objt.nombre_reporte);
                    reportesGenerados.setNombreArchivo(objt.nombre_archivo);
                    reportesGenerados.setFechaInicio(objt.fecha_inicio);
                    reportesGenerados.setFechaFin(objt.fecha_fin);
                    reportesGenerados.setEstado(objt.estado);
                    reportesGenerados.setUsuarioId(objt.usuario_id);
                    reportesGenerados.setParametrosBusqueda(JSON.parse(objt.parametros_de_busqueda));
                    reportesGenerados.setConsolidado(JSON.parse(objt.consolidado));
                    reportesGenerados.setBodegaDetalle(JSON.parse(objt.bodegas));
                    listaReportesGenerados.push(reportesGenerados);
                }   
                $scope.listaReportesGenerados = listaReportesGenerados;
            };
            
            
            /**
             * +Descripcion: objeto ng-grid
             * @author Andres M Gonzalez
             * @fecha: 11/05/2016
             * @returns {objeto}
             */
            $scope.lista_reportesGenerados = {
                data: 'listaReportesGenerados',
                enableColumnResize: true,
                enableRowSelection: false,
                enableHighlighting: true,
                columnDefs: [
                    {field: 'Estado del Reporte', displayName: "Estado del Reporte", cellClass: "txt-center dropdown-button", width: "8%",
                        cellTemplate: ' <div class="row">\
                                                <button ng-if="row.entity.getEstado()==0" style="width: 100px"; class="btn btn-default btn-xs" > \
                                                <img style="width: 15px";  src="/stylesheets/jtree/themes/default/throbber.gif"/> \
                                                        <span> En Proceso </span> \
                                                </button>\
                                                <button ng-if="row.entity.getEstado()==1" style="width: 100px"; class="btn btn-success btn-xs" >\
                                                    <i class="glyphicon glyphicon-ok"></i>\
                                                    <span> Generado </span>\
                                                </button>\
                                                <button ng-if="row.entity.getEstado()==2" style="width: 100px"; class="btn btn-danger btn-xs" >\
                                                    <i class="glyphicon glyphicon-remove"></i>\
                                                    <span> Error </span>\
                                                </button>\
                                                <button ng-if="row.entity.getEstado()==3" style="width: 100px"; class="btn btn-warning btn-xs" >\
                                                    <i class="glyphicon glyphicon-warning-sign"></i>\
                                                    <span> 0 Registros </span>\
                                                </button>\
                                            </div>'
                    },   
                    {field: 'Fecha de Generación', displayName: "Fecha de Generación", cellClass: "txt-center dropdown-button", width: "10%",
                        cellTemplate: ' <div class="row">\
                                                <div>{{row.entity.getFechaInicio()| date:"yyyy-MM-dd HH:mm:ss"}}</div>\
                                            </div>'
                    },
                    {field: 'getNombreReporte()', displayName: 'Nombre Reporte', width: "10%"},
                    {field: 'getParametrosBusqueda().fecha_inicial', displayName: 'Fecha Inicio', width: "5%"},
                    {field: 'getParametrosBusqueda().fecha_final', displayName: 'Fecha Fin', width: "5%"},
                    {field: 'getParametrosBusqueda().empresa_seleccion.nombre', displayName: 'Empresa', width: "16%"},
                    {field: 'getParametrosBusqueda().centro_seleccion.nombre', displayName: 'Centro Utilidad', width: "15%"},
                    {field: 'getParametrosBusqueda().bodega_seleccion.nombre', displayName: 'Bodega', width: "13%"},                   
                    {displayName: "Busqueda", cellClass: "txt-center dropdown-button", width: "7%",
                        cellTemplate: ' <div class="row">\
                                         <button class="btn btn-default btn-xs" ng-click="abrirModalParametros(row.entity)" >\
                                             <span class="glyphicon glyphicon-search"></span>\
                                         </button>\
                                       </div>'
                    },
                    {displayName: "Consolidado", cellClass: "txt-center dropdown-button", width: "7%",
                        cellTemplate: '<div class="row" >\
                                            <button class="btn btn-default btn-xs" ng-disabled="row.entity.getEstado()==3 || row.entity.getEstado()==2 || row.entity.getEstado()==0" ng-click="abrirModalConsolidado(row.entity)" >\
                                                <span class="glyphicon glyphicon-search"></span>\
                                            </button>\
                                       </div>'
                    }, 
                    {displayName: "Descargas", cellClass: "txt-center dropdown-button", width: "5%",
                        cellTemplate: '<div class="row">\
                                            <button class="btn btn-default btn-xs" ng-disabled="row.entity.getEstado()==3 || row.entity.getEstado()==2 || row.entity.getEstado()==0" ng-click="onDescagarArchivo(row.entity.getNombreArchivo())" >\
                                                <span class="glyphicon glyphicon-download-alt"></span>\
                                            </button>\
                                       </div>'
                    }
                    
                ]

            };

            that.init(function() {
                that.buscarReportesBloqueados();
            });
                       

        }]);
});