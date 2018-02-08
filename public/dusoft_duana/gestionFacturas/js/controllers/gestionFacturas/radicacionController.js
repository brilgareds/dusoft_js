
define(["angular", "js/controllers", 'includes/slide/slideContent',
    "includes/classes/Empresa",
], function(angular, controllers) {

    controllers.controller('radicacionController', [
        '$scope', '$rootScope', "Request",
        "$filter", '$state', '$modal',
        "API", "AlertService", 'localStorageService',
        "Usuario", "socket", "$timeout",
        "Empresa", 
        function($scope, $rootScope, Request, $filter, $state, $modal, API, AlertService, localStorageService, Usuario, socket, $timeout, Empresa) {
          var that = this;   
            $scope.session = {
                usuario_id: Usuario.getUsuarioActual().getId(),
                auth_token: Usuario.getUsuarioActual().getToken()
            };
            $scope.root={
                farmaciaSeleccionada : "",
                conceptoSeleccionado: ""
            };
           
        that.consultarFarmacia = function() {
                var obj = {
                            session: $scope.session,
                            data: {
                                  }
                          };

                Request.realizarRequest(
                        API.BODEGAS.LISTAR_BODEGA_DUANA_FARMACIA,
                        "POST",
                        obj,
                        function(data) {
                        //    console.log(">>>>>>>>>>>>>>>> ",data.obj.bodegas[0]);
                            if (data.status === 200) {
                                $scope.root.farmacias=data.obj.bodegas[0];                             
                            }
                        }
                );        
        
            };
  
        that.consultarConcepto = function() {
                var obj = {
                            session: $scope.session,
                            data: {
                                  }
                          };

                Request.realizarRequest(
                        API.RADICACION.LISTAR_CONCEPTO,
                        "POST",
                        obj,
                        function(data) {
                        
                            if (data.status === 200) {
                                that.render(data.obj.listarConcepto,function(datas){
                                    $scope.root.concepto=datas;
                                    $scope.root.conceptoSeleccionado=datas;
                                });
                            }
                        }
                );        
        
            };
            
            that.render=function(lista,callback){
                var conceptos=[];
                lista.forEach(function(data){
                    console.log(data);
                  var concepto={concepto_radicacion_id:data.concepto_radicacion_id,observacion:data.observacion};
                      conceptos.push(concepto);
                });
                console.log("Refresca",conceptos);
                callback(conceptos);
            };
            
            that.guardarConcepto=function(nombreConcepto,callback){
                console.log("guardarConcepto ",nombreConcepto);
                  var obj = {
                            session: $scope.session,
                            data: {
                                    nombre:nombreConcepto.toUpperCase()
                                  }
                          };

                Request.realizarRequest(
                        API.RADICACION.GUARDAR_CONCEPTO,
                        "POST",
                        obj,
                        function(data) {
                           
                            if (data.status === 200) { 
                              $scope.root.concepto="";
                              $scope.root.conceptoSeleccionado="";
                              AlertService.mostrarVentanaAlerta("Mensaje del sistema", "Concepto guardado correctamente");                                
                              callback(true);
                              return;
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
                    templateUrl: 'views/gestionFacturas/vistaConceptos.html',
                    scope: $scope,
                    controller: ['$scope', '$modalInstance', function ($scope, $modalInstance) {
                           
                            $scope.guardarConcepto=function(){
                              that.guardarConcepto($scope.root.nombreConcepto,function(){
                                  that.consultarConcepto();
                                  $scope.cerrar();
                              });                              
                            };
                            
                            $scope.cerrar = function () {
                                $modalInstance.close();
                            };
                        }]
                };
                var modalInstance = $modal.open($scope.opts);
            };
            
            
            
            $scope.modalConcepto=function(){
                console.log("modalConcepto");
                that.verConcepto();
            };
            
            
            
            
            
            $scope.onSeleccionFarmacia=function(){
             // console.log(" AAAAAAAAAAA", $scope.root.farmaciaSeleccionada);  
            };
            
            
            $scope.onSeleccionConcepto=function(){
              //  console.log("aaaaaaa", $scope.root.conceptoSeleccionada);
                
            };
            
           that.init=function(){
            that.consultarFarmacia();
            that.consultarConcepto();
           };
           
           that.init();

    }]);
});

     