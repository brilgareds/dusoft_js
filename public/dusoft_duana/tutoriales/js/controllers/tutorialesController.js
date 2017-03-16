define(["angular", "js/controllers"], function(angular, controllers) {

 var fo = controllers.controller('tutorialesController',
            ['$scope', 
                '$rootScope', 
                'Request', 
                'API', 
                'AlertService', 
                'Usuario',         
                "$timeout", 
                "$filter",
                "localStorageService",
                "$state",
                "$modal",
                "socket",
                function($scope, 
                $rootScope,
                Request, 
                API, 
                AlertService, 
                Usuario,
                $timeout, 
                $filter,
                localStorageService,
                $state,
                $modal,
                socket) {

                var that = this;
                $scope.paginaactual = 1;
                var empresa = angular.copy(Usuario.getUsuarioActual().getEmpresa());              
                var fecha_actual = new Date();
                
                $scope.root = {
                    termino_busqueda_proveedores: "",
                    fecha_inicial_aprobaciones: $filter('date')(new Date("01/01/" + fecha_actual.getFullYear()), "yyyy-MM-dd"),
                    fecha_final_aprobaciones: $filter('date')(fecha_actual, "yyyy-MM-dd"),                 
                    empresaSeleccionada: '',
                    termino_busqueda:'',
                    estadoSesion: true,
                    items:0,
                    afiliados:[],
                    estadoBotones : [
                        "btn btn-danger btn-xs",
                        "btn btn-primary btn-xs",
                        "btn btn-danger btn-xs",
                        "btn btn-info btn-xs",
                        "btn btn-warning btn-xs",
                        "btn btn-success btn-xs",
                        "btn btn-warning btn-xs"
                    ],
                    opciones: Usuario.getUsuarioActual().getModuloActual().opciones,
                }; 
                
               
                that.cargar_permisos = function() {
                // Permisos ajustes formula              
                    $scope.root.permisos_ajustes = {
                        btn_ajustar_entrega_formula: {
                            'click': $scope.root.opciones.sw_ajustar_entrega_formula
                        }
                    };                
                };
               
                /*
                 * Inicializacion de variables
                 * @param {type} empresa
                 * @param {type} callback
                 * @returns {void}
                 */
                that.init = function(empresa, callback) {
                    that.cargar_permisos();
                    $scope.session = {
                        usuario_id: Usuario.getUsuarioActual().getId(),
                        auth_token: Usuario.getUsuarioActual().getToken()
                    };
                  
                    callback();
                };
                  
               
                
                that.init(empresa, function() {

                    if(!Usuario.getUsuarioActual().getEmpresa()) {
                        $rootScope.$emit("onIrAlHome",{mensaje: "El usuario no tiene una empresa valida para dispensar formulas", tipo:"warning"});
                        AlertService.mostrarMensaje("warning", "Debe seleccionar la empresa");
                    }else{                               
                        if(!Usuario.getUsuarioActual().getEmpresa().getCentroUtilidadSeleccionado() ||
                            Usuario.getUsuarioActual().getEmpresa().getCentroUtilidadSeleccionado() === undefined) {
                            $rootScope.$emit("onIrAlHome",{mensaje: "El usuario no tiene un centro de utilidad valido para dispensar formulas.", tipo:"warning"});
                            AlertService.mostrarMensaje("warning", "Debe seleccionar el centro de utilidad");
                        }else{
                            if (!Usuario.getUsuarioActual().getEmpresa().getCentroUtilidadSeleccionado().getBodegaSeleccionada()) {
                                $rootScope.$emit("onIrAlHome",{mensaje:"El usuario no tiene una bodega valida para dispensar formulas.", tipo:"warning"});
                                AlertService.mostrarMensaje("warning", "Debe seleccionar la bodega");
                            }else{                                
                                //that.listarTipoDocumentos(function(){});    
                                
                            }
                        }
                    }                                           
                });



                $scope.$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams) {

                $scope.$$watchers = null;
               
                $scope.root=null;

           });

        }]);
});
