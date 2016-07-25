
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
                 var parametros =JSON.parse(parametros.parametros_de_busqueda);
                 console.log(">>>>>>>>>>>>>>>>>",parametros);
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
                that.buscarProductosBloqueados("");
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
                    that.buscarProductosBloqueados(terminoBusqueda,true);
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
                listaReportesGenerados = [];
                for (var i in data.obj.reportes) {
                    var objt = data.obj.reportes[i];
                    var reportesGenerados = ReportesGenerados.get(objt.estado_reportes_id);
                    reportesGenerados.setNombreReporte(objt.nombre_reporte);
                    reportesGenerados.setNombreArchivo(objt.nombre_archivo);
                    reportesGenerados.setFechaInicio(objt.fecha_inicio);
                    reportesGenerados.setFechaFin(objt.fecha_fin);
                    reportesGenerados.setEstado(objt.estado);
                    reportesGenerados.setUsuarioId(objt.usuario_id);
                    //var json = JSON.parse(objt.parametros_de_busqueda);
                    reportesGenerados.setParametrosBusqueda(objt.parametros_de_busqueda);
                    listaReportesGenerados.push(reportesGenerados);
                }              
                $scope.listaReportesGenerados = listaReportesGenerados;
            };
            
            $scope.onAbrirVentana=function(json){
                
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
                    {field: 'Estado del Reporte', displayName: "Estado del Reporte", cellClass: "txt-center dropdown-button", width: "10%",
                        cellTemplate: ' <div class="row">\
                                                <button ng-if="row.entity.getEstado()==0" class="btn btn-primary btn-xs" >\
                                                    <i class="glyphicon glyphicon-hourglass"></i>\n\
                                                        <span> En Proceso </span>\
                                                </button>\
                                                <button ng-if="row.entity.getEstado()==1" class="btn btn-success btn-xs" >\
                                                    <i class="glyphicon glyphicon-ok"></i>\
                                                    <span> Generado </span>\
                                                </button>\
                                                <button ng-if="row.entity.getEstado()==2" class="btn btn-danger btn-xs" >\
                                                    <i class="glyphicon glyphicon-remove"></i>\
                                                    <span> Error </span>\
                                                </button>\
                                                <button ng-if="row.entity.getEstado()==3" class="btn btn-warning btn-xs" >\
                                                    <i class="glyphicon glyphicon-warning-sign"></i>\
                                                    <span> 0 Registros </span>\
                                                </button>\
                                            </div>'
                    },                    
                    {field: 'getNombreReporte()', displayName: 'Nombre', width: "60%"},
                    {field: 'Fecha de Generación', displayName: "Fecha de Generación", cellClass: "txt-center dropdown-button", width: "10%",
                        cellTemplate: ' <div class="row">\
                                                <div>{{row.entity.getFechaInicio()| date:"yyyy-MM-dd HH:mm:ss"}}</div>\
                                            </div>'
                    },
                    {displayName: "Parametros de Busqueda", cellClass: "txt-center dropdown-button", width: "10%",
                        cellTemplate: ' <div class="row">\n\
                                         <button class="btn btn-default btn-xs" ng-click="abrirModalParametros(row.entity)" >\n\
                                             <span class="glyphicon glyphicon-search"></span>\
                                         </button>\
                                       </div>'
                    },
                    {displayName: "Descarga", cellClass: "txt-center dropdown-button", width: "10%",
                        cellTemplate: ' <div class="row">\n\
                                         <button class="btn btn-default btn-xs" ng-click="onDescagarArchivo(row.entity.getNombreArchivo())" >\n\
                                             <span class="glyphicon glyphicon-download-alt"></span>\
                                         </button>\
                                       </div>'
                    }//ng-click="onAbrirVentana(row.entity)"ng-click="onAbrirVentana(row.entity)"
                ]

            };

            that.init(function() {
                that.buscarReportesBloqueados();
            });
                       

        }]);
});