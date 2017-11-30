define(["angular", "js/controllers"], function(angular, controllers) {

    var fo = controllers.controller('GestionarLiosController', [
        '$scope', '$rootScope', 'Request',
        '$modalInstance', 'API', "socket", "AlertService",
        "Usuario", "documentos", "tipo", "numeroGuia",
        function($scope, $rootScope, Request,
                $modalInstance, API, socket, AlertService,
                Usuario, documentos, tipo, numeroGuia) {


            var self = this;
            
            
            self.init = function(){
                $scope.root = {
                    cantidadCajas:0,
                    cantidadLios:0,
                    cantidadNeveras:0,
                    observacion:""
                };
                
                $scope.root.session = {
                    usuario_id: Usuario.getUsuarioActual().getId(),
                    auth_token: Usuario.getUsuarioActual().getToken()
                };
                
                $scope.root.documentos = documentos;
                
            };
            
            self.validarLios = function(){
                var cantidadCajas = parseInt($scope.root.cantidadCajas);
                var cantidadLios = parseInt($scope.root.cantidadLios);
                var cantidadNeveras = parseInt($scope.root.cantidadNeveras);
                
                console.log("cantidad cajas ", cantidadCajas, " cantidadLios ", cantidadLios, " neveras " , cantidadNeveras);
                
                if(isNaN(cantidadCajas) || isNaN(cantidadLios) || isNaN(cantidadNeveras) || cantidadLios === 0 || cantidadCajas < 0 || cantidadNeveras < 0
                   || (cantidadCajas === 0 && cantidadNeveras === 0)){
                   
                    return false;
                } else if(!isNaN(cantidadCajas) && !isNaN(cantidadLios) &&
                         ((cantidadCajas > 0 && cantidadLios  > cantidadCajas) || (cantidadNeveras > 0 && cantidadLios > cantidadNeveras))) {
                    return false;
                }
                

                return true;
                
            };

            $modalInstance.opened.then(function() {
               

            });

            $modalInstance.result.then(function() {
                $scope.root.documentos = [];
                $scope.root = null;
                $rootScope.$emit("onLiosRegistrados");
              
            }, function() {
            });
            
            
            $scope.listaDocumentos = {
                data: 'root.documentos',
                enableColumnResize: true,
                enableRowSelection: false,
                columnDefs: [
                    {field:'lios', displayName:"", width:"40", cellClass: "txt-center dropdown-button", cellTemplate:"<div><input-check   ng-model='row.entity.seleccionado' ng-change='onAgregarDocumentoALio(row.entity)' ng-disabled='!datos_view.despachoPorLios'   /></div>"},
                    {field: 'get_descripcion()', displayName: 'Documento Bodega'},
                    //{field: 'cantidad_cajas', displayName: 'Cajas', width: "15%", cellTemplate: '<div class="col-xs-12"> <input type="text" ng-model="row.entity.cantidad_cajas" validacion-numero-entero class="form-control grid-inline-input" name="" id="" /> </div>'},
                    //{field: 'cantidad_neveras', displayName: 'Nevera', width: "15%", cellTemplate: '<div class="col-xs-12"> <input type="text" ng-model="row.entity.cantidad_neveras" validacion-numero-entero class="form-control grid-inline-input" name="" id="" /> </div>'},
                    //{field: 'temperatura_neveras', displayName: '°C Nevera', width: "15%", cellTemplate: '<div class="col-xs-12"> <input type="text" ng-model="row.entity.temperatura_neveras" validacion-numero class="form-control grid-inline-input" name="" id="" /> </div>'},
                    /*{displayName: "Opciones", cellClass: "txt-center dropdown-button",
                        cellTemplate: '<div class="btn-group">\
                                            <button class="btn btn-default btn-xs" ng-click="seleccionar_documento_planilla(row.entity)" ng-disabled="validar_ingreso_documento(row.entity)" ><span class="glyphicon glyphicon-ok"></span></button>\
                                        </div>'
                    }*/
                ]
            };
            
            $scope.cerrar = function(){
                $modalInstance.close();
            };
            
            
            $scope.onIngresarLios = function(){
                
                if(!self.validarLios()){
                    AlertService.mostrarVentanaAlerta("Alerta del sistema", "La cantidad de cajas, neveras o lios no son correctos");
                    
                    return;
                }
                
                var obj = {
                    session: $scope.root.session,
                    data: {
                        planillas_despachos: {
                            documentos: documentos,
                            totalCaja: $scope.root.cantidadCajas,
                            cantidadLios: $scope.root.cantidadLios,
                            cantidadNeveras: $scope.root.cantidadNeveras,
                            tipo:tipo,
                            numeroGuia:numeroGuia,
                            observacion:$scope.root.observacion
                        }
                    }
                };


                Request.realizarRequest(API.PLANILLAS.GESTIONAR_LIOS, "POST", obj, function(data) {
                    
                    if(data.status === 200){
                        AlertService.mostrarVentanaAlerta("Alerta del sistema", "Se ha guardado el registro correctamente");
                        $scope.cerrar();
                    } else if(data.status === 403) {
                        
                        AlertService.mostrarVentanaAlerta("Alerta del sistema", data.msj);
                    } else {
                        AlertService.mostrarVentanaAlerta("Alerta del sistema", "Ha ocurrido un error...");
                    }
                   
                });
            };
           
            
            self.init();
          

        }]);

});


