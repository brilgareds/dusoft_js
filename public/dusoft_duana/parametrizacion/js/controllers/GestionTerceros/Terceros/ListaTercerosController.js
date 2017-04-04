define(["angular", 
    "js/controllers",
    'includes/slide/slideContent'], function(angular, controllers) {

    controllers.controller('ListaTercerosController', [
        '$scope', '$rootScope', 'Request',
        'API', "socket", "AlertService",
        '$state', "Usuario", "localStorageService", "$modal","GestionTercerosService","Tercero",
        'TipoDocumento',
        function($scope, $rootScope, Request,
                 API, socket, AlertService, 
                 $state, Usuario, localStorageService, $modal, GestionTercerosService, Tercero,
                 TipoDocumento) {
                     
            var self = this;
            
            $scope.root = {
                paginaActual : 1,
                terceros:[],
                tiposDocumentos:[],
                tipoDocumento: TipoDocumento.get(),
                terminoBusquedaDocumento : "",
                terminoBusqueda : "",
                session : {
                    usuario_id: Usuario.getUsuarioActual().getId(),
                    auth_token: Usuario.getUsuarioActual().getToken()
                }
            };
            
            
            $scope.listaTerceros = {
                data: 'root.terceros',
                multiSelect: false,
                showFilter: true,
                enableRowSelection: false,
                columnDefs: [
                    {field: 'getNombre()', displayName: 'Nombre'},
                    {field: 'getIdentificacion()', displayName: 'Identificación'},
                    {field: 'getDireccion()', displayName: 'Dirección'},
                    {field: 'accion', displayName: '', width: '70',
                        cellTemplate: '<div class="ngCellText txt-center">\
                                      <button class="btn btn-default btn-xs"  ng-click="onEditarTercero(row.entity)"><span class="glyphicon glyphicon-zoom-in"></span></button>\
                                   </div>'
                    }
                ]

            };
            
           /**
            * @author Eduar Garcia
            * +Descripcion Handler del boton crear tercero
            * @fecha 2017-04-04
            */  
            $scope.onCrearTercero = function(){
                localStorageService.set("accion", "0");
                $scope.onIrVistaGuardarTercero();
            };
            
            /**
            * @author Eduar Garcia
            * +Descripcion Hnadler del boton de editar tercero
            * @params tercero: {Tercero}
            * @fecha 2017-04-04
            */
            $scope.onEditarTercero = function(tercero){
                localStorageService.set("tercero_tipo_id", tercero.getTipoId());
                localStorageService.set("tercero_id", tercero.getId());
                localStorageService.set("accion", "1");
                $scope.onIrVistaGuardarTercero();
            };
            
            /**
            * @author Eduar Garcia
            * +Descripcion Permite ir al view para guardar el tercedro
            * @fecha 2017-04-04
            */    
            $scope.onIrVistaGuardarTercero = function(){
                $state.go("GuardarTercero");
            };
            
            /**
            * @author Eduar Garcia
            * +Descripcion Permite realiar peticion al API para traer los terceros
            * @params callback: {function}
            * @fecha 2017-04-03
            */            
            self.listarTerceros = function(){
               
                var parametros = {
                    session:$scope.root.session,
                    data:{
                        tercero:{
                            empresa_id: Usuario.getUsuarioActual().getEmpresa().getCodigo(),
                            paginaActual : $scope.root.paginaActual,
                            busquedaDocumento:$scope.root.tipoDocumento.getId(),
                            terminoBusqueda: ($scope.root.tipoDocumento.getId().length > 0) ? $scope.root.terminoBusquedaDocumento : $scope.root.terminoBusqueda
                        }
                    }
                };
                
                GestionTercerosService.listarTerceros(parametros,function(respuesta){
                    if(respuesta.status === 200){
                        $scope.root.terceros = [];
                        var terceros = respuesta.obj.terceros;
                        
                        for(var i in terceros){
                            var _tercero = terceros[i];
                            var tercero = Tercero.get(_tercero["nombre_tercero"], _tercero["tipo_id_tercero"], _tercero["tercero_id"], _tercero["direccion"]);
                            $scope.root.terceros.push(tercero);
                        }
                        
                    } else {
                        AlertService.mostrarVentanaAlerta("Mensaje del sistema",respuesta.msj);
                    }
                });
            };
            
            /**
            * @author Eduar Garcia
            * +Descripcion Permite realizar llamado al API para traer los documentos
            * @fecha 2017-04-04
            */ 
            self.listarTiposDocumentos = function(){
                
                var parametros = {
                    session:$scope.root.session,
                    data:{
                        tercero:{

                        }
                    }
                };
                
                GestionTercerosService.listarTiposDocumentos(parametros, function(respuesta){
                   var tiposDocumentos = respuesta.obj.tiposDocumento;
                   
                   for(var i in tiposDocumentos){
                       var _tipoDocumento = tiposDocumentos[i];
                       var tipoDocumento = TipoDocumento.get(_tipoDocumento["id"], _tipoDocumento["descripcion"]);
                       $scope.root.tiposDocumentos.push(tipoDocumento);
                   }
                   
                });
                
            };
            
            /**
            * @author Eduar Garcia
            * +Descripcion Handler del text input de tipo de documento
            * @params event: {Event}
            * @fecha 2017-04-04
            */ 
            $scope.onBuscarPorDocumento = function(event){
                if(event && event.which !== 13 || $scope.root.tipoDocumento.getId().length === 0 ){
                    return;
                }
                
                $scope.root.paginaActual = 1;
                
                self.listarTerceros();
                
            };
            
           /**
            * @author Eduar Garcia
            * +Descripcion Handler del text input de busqueda por nombre
            * @params callback: {function}
            * @fecha 2017-04-03
            */ 
            $scope.onBuscar = function(event){
                if(event && event.which !== 13 ){
                    return;
                }
                
                $scope.root.paginaActual = 1;
                
                $scope.root.tipoDocumento = TipoDocumento.get();
                $scope.root.terminoBusquedaDocumento = "";
                self.listarTerceros();
            }
            
            /**
            * @author Eduar Garcia
            * +Descripcion Handler del dropdown de tipos de documentos
            * @params tipoDocumento: {TipoDocumento}
            * @fecha 2017-04-04
            */ 
            $scope.onSelecionarTipoDocumento = function(tipoDocumento){
                $scope.root.tipoDocumento = tipoDocumento;
            };
            
            /**
            * @author Eduar Garcia
            * +Descripcion Handler del boton anterior de la paginacion
            * @fecha 2017-04-04
            */ 
            $scope.paginaAnterior = function() {
                $scope.root.paginaActual--;
                self.listarTerceros();
            };
            
            /**
            * @author Eduar Garcia
            * +Descripcion Handler del boton siguiente de la paginacion
            * @fecha 2017-04-04
            */ 
            $scope.paginaSiguiente = function() {
                $scope.root.paginaActual++;
                self.listarTerceros();
            };
            
            self.listarTerceros();
            self.listarTiposDocumentos();

            

        }]);
        
});
