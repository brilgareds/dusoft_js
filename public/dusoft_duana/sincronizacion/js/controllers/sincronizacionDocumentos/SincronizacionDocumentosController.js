
define(["angular", "js/controllers"
], function (angular, controllers) {

    controllers.controller('SincronizacionDocumentosController', [
        '$scope', '$rootScope', "Request",
        "$filter", '$state', '$modal',
        "API", "AlertService", 'localStorageService',
        "Usuario", "socket", "$timeout",
        "Empresa", "ServerServiceDoc",
        function ($scope, $rootScope, Request,
                $filter, $state, $modal,
                API, AlertService, localStorageService,
                Usuario, socket, $timeout,
                Empresa, ServerServiceDoc) {

            var that = this;
            $scope.seleccion = Usuario.getUsuarioActual().getEmpresa();
            $scope.session = {
                usuario_id: Usuario.getUsuarioActual().getId(),
                auth_token: Usuario.getUsuarioActual().getToken()
            };
            $scope.root = {
                prefijo: {},
                estado:true
            };
            
 
            that.init = function(callback) {
                $scope.root = {};         
                callback();
            };                       

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
                        $scope.root.listarPrefijo = data.obj.listarPrefijos;
                    } else {
                        AlertService.mostrarVentanaAlerta("Error Mensaje del sistema: ", data.msj);
                    }
                });
            };


            $scope.prefijo_actualizado = function (prefijo) {
                $scope.root.prefijo = prefijo;
            };
            
            

            $scope.sincronizar = function () {
                that.consulta(1);
            };
            
            $scope.buscar = function () {
               that.consulta(0); 
            };
            
            that.consulta= function (sw) {
                
                var prefijo = $scope.root.prefijo;
                var numero = $scope.root.numero;                
                var obj={
                    prefijo: prefijo.prefijo,
                    facturaFiscal: numero,
                    sincronizar:sw
                };
                that.sincronizacionDocumentos(obj);
            };


            that.sincronizacionDocumentos = function (parametros) {
                $scope.root.estado=false;
                $scope.color_boton="";
                $scope.iconos="";
                $scope.encabezado={};
                $scope.root.asientosContables={};
                var obj = {
                    session: $scope.session,
                    data: {
                        empresaId: Usuario.getUsuarioActual().getEmpresa().codigo,
                        prefijo: parametros.prefijo,
                        facturaFiscal: parametros.facturaFiscal,
                        sincronizar: parametros.sincronizar
                    }
                };
                ServerServiceDoc.sincronizacionDocumentos(obj, function (data) {
                    if (data.status === 200) {
                        $scope.root.estado=true;
                        $scope.root.asientosContables = data.obj.result;
                        $scope.encabezado= data.obj.result.encabezadofactura;
                        
                        if($scope.root.asientosContables.estado===true){
                            $scope.root.asientosContables=data.obj.parametro;
                            $scope.encabezado=data.obj.parametro.encabezadofactura;
                            $scope.root.asientosContables.descripcion=data.obj.result.descripcion;
                            $scope.color_boton="btn-danger";
                            $scope.iconos="glyphicon glyphicon-asterisk";
                        }else{  
                           if(parametros.sincronizar===1){
                            $scope.root.asientosContables.descripcion="";
                            $scope.color_boton="btn-success";
                            $scope.iconos="";
                           }
                        }
                        console.log("$scope.root.asientosContables:: ",$scope.root.asientosContables );
                    } else {
                        AlertService.mostrarVentanaAlerta("Error Mensaje del sistema: ", data.msj);
                    }
                });
            };
            
             $scope.lista_reportesGenerados = {
                data: 'root.asientosContables.asientoscontables',
                enableColumnResize: true,
                enableRowSelection: false,
                enableHighlighting: true,
                columnDefs: [
                    {field: 'codcentrocostoasiento', displayName: "C. Costos", cellClass: "txt-center dropdown-button", width: "5%"},
                    {field: 'C. Utilidad', displayName: "C. Utilidad", cellClass: "txt-center dropdown-button", width: "6%",
                        cellTemplate: ' <div class="row">\
                                               {{row.entity.codcentroutilidadasiento}} \
                                            </div>'
                    },
                     {field: 'L. Costos', displayName: "Linea Costos", cellClass: "txt-center dropdown-button", width: "7%",
                        cellTemplate: ' <div class="row">\
                                               {{row.entity.codlineacostoasiento}} \
                                            </div>'
                    },
                    {field: 'Cuenta', displayName: "Cuenta", cellClass: "txt-center dropdown-button", width: "8%",
                        cellTemplate: ' <div class="row">\
                                               {{row.entity.codcuentaasiento}} \
                                            </div>'
                    },
                    {field: 'Identificacion', displayName: "Identificacion", cellClass: "txt-center dropdown-button", width: "8%",
                        cellTemplate: ' <div class="row">\
                                               {{row.entity.identerceroasiento}} \
                                            </div>'
                    },                    
                    {field: 'Valor Base', displayName: "Valor Base", cellClass: "txt-center dropdown-button", width: "10%",
                        cellTemplate: ' <div class="row">\
                                               {{row.entity.valorbaseasiento}} \
                                            </div>'
                    },
                    {field: 'Valor Credito', displayName: "Valor Credito", cellClass: "txt-center dropdown-button", width: "10%",
                        cellTemplate: ' <div class="row">\
                                               {{row.entity.valorcreditoasiento}} \
                                            </div>'
                    },
                    {field: 'Valor Debito', displayName: "Valor Debito", cellClass: "txt-center dropdown-button", width: "10%",
                        cellTemplate: ' <div class="row">\
                                               {{row.entity.valordebitoasiento}} \
                                            </div>'
                    },
                    {field: 'V. Tasa', displayName: "Valor Tasa", cellClass: "txt-center dropdown-button", width: "6%",
                        cellTemplate: ' <div class="row">\
                                               {{row.entity.valortasaasiento}} \
                                            </div>'
                    },
                    {field: 'observacionasiento', displayName: "Observacion", cellClass: "txt-left dropdown-button", width: "30%"}
                ]

            };
            
            


            that.init = function (callback) {
                $scope.root = {};
                that.listarPrefijos();
                callback();
            };



            that.init(function () {

            });

        }]);
});