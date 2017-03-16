define(["angular", "js/controllers"], function(angular, controllers) {

    controllers.controller('tutorialesController',
                ['$scope', '$rootScope','AlertService', 'Usuario', "$timeout", 
                    "$filter", "localStorageService", "$state","$modal","socket", "tutorialesService","API",
                    function($scope, $rootScope, AlertService, Usuario, $timeout, 
                    $filter,localStorageService,$state,$modal,socket,tutorialesService,API) {

        var that = this;
        $scope.paginaactual = 1;
        var empresa = angular.copy(Usuario.getUsuarioActual().getEmpresa());              
        var fecha_actual = new Date();

        $scope.root = {
                
            empresaSeleccionada: '',
            termino_busqueda:'',
           
            opciones: Usuario.getUsuarioActual().getModuloActual().opciones,
            items:0
        }; 
        
        $scope.root.filtros = [                
                    {tipo: '-1',descripcion: "Seleccionar"},
                    {tipo: '0',descripcion: "#Categoria"},
                    {tipo: '1',descripcion: "Descripcion"} 
                  ];
                 
        $scope.root.filtro = $scope.root.filtros[0]; 
        
         $scope.onSeleccionFiltro = function(filtro){
                      
                    $scope.root.filtro = filtro;
                    $scope.root.termino_busqueda = '';
                };

        that.cargar_permisos = function() {
        // Permisos ajustes formula              
            $scope.root.permisos_ajustes = {
                btn_ajustar_entrega_formula: {
                    'click': $scope.root.opciones.sw_ajustar_entrega_formula
                }
            };                
        };

        
        $scope.buscarVideo = function(event){
            
             if (event.which === 13 || event.which === 1){     
                                    
                    that.listarVideoTutoriales();                         
                 
            }
            
        };
        /**
         * +Descripcion Metodo encargado de invocar el servicio
         *              que consultara los tutoriales
         * @fecha 2017/03/06
         */
        that.listarVideoTutoriales = function(){
            
            var obj = {                   
                session: $scope.session,
                data: {
                   lista_video_tutoriales: {
                        filtro:$scope.root.filtro,
                        termino_busqueda: $scope.root.termino_busqueda,
                        paginaActual:$scope.paginaactual
                   }
               }    
            };  
            
            tutorialesService.listarVideoTutoriales(obj,function(data){
                
                if(data.status === 200){
                   $scope.root.items = data.obj.lista_video_tutoriales.length;    
                   $scope.tutoriales = tutorialesService.renderlListarVideoTutoriales(data.obj.lista_video_tutoriales);
                    
                }else{
                    AlertService.mostrarMensaje("warning", data.msj);
                }
                

            });

        };
        
         $scope.listaTutoriales = {
            data: 'tutoriales',
            enableColumnResize: true,
            enableRowSelection: false,
            enableCellSelection: true,
            enableHighlighting: true,
            columnDefs: [
                {field: 'getTag()', displayName: '# Tag', width:"7%"}, 
                {field: 'getTipo()', displayName: 'Tipos', width:"7%"}, 
                {field: 'getTitulo()', displayName: 'Titulo', width:"20%"}, 
                {field: 'getDescripcion()', displayName: 'Descripcion'}, 
                {field: 'getFecha()', displayName: 'Fecha', width:"20%"}, 
                {displayName: "Opc", width:"7%", cellClass: "txt-center dropdown-button",
                    cellTemplate: '<button class="btn btn-default btn-xs dropdown-toggle" ng-click="ventanaVisualizarVideo(row.entity)"  ><div class = "glyphicon glyphicon-facetime-video"></div></button>'},
            ]               
        };
        
        $scope.ventanaVisualizarVideo = function(entity){
             
             $scope.tutorialEntity = entity;
           
             $scope.opts = {
                    backdropClick: true,
                    dialogFade: false,
                    keyboard: true,
                    template: ' <div class="modal-header">\
                                    <button type="button" class="close" ng-click="close()">&times;</button>\
                                    <h4 class="modal-title">Desea eliminar el producto?</h4>\
                                </div>\
                                <div align="center" class="embed-responsive embed-responsive-16by9">\
                                    <video autoplay loop class="embed-responsive-item" controls>\
                                        <source src='+API.PATH_URL_VIDEO+""+entity.getPath()+' type="video/mp4">\
                                    </video>\
                                </div>\
                                    <div class="modal-body">\
                                    <h4>Titulo</h4>\
                                    <h5> {{ tutorialEntity.getTitulo() }}</h5>\
                                    <h4>Descripcion.</h4>\
                                    <h5> {{ tutorialEntity.getDescripcion() }} </h5>\
                                </div>\
                                <div class="modal-footer">\
                                    <button class="btn btn-warning" ng-click="close()">Cerrar</button>\
                                    <button class="btn btn-primary" ng-click="confirmar()" ng-disabled="" >Si</button>\
                                </div>',
                    scope: $scope,
                    backdrop: 'static',
                    controller: ["$scope", "$modalInstance", function($scope, $modalInstance) {

                        $scope.confirmar = function() {
                            $scope.eliminar_producto();
                            $modalInstance.close();
                        };
                        $scope.close = function() {
                            $modalInstance.close();
                        };
                    }]
                };
                var modalInstance = $modal.open($scope.opts);
        };
        
       
       /*
        * funcion para paginar anterior
        * @returns {lista datos}
        */
        $scope.paginaAnterior = function() {
           if ($scope.paginaactual === 1)
               return;
           $scope.paginaactual--;
           that.listarVideoTutoriales();
        };


        /*
         * funcion para paginar siguiente
         * @returns {lista datos}
         */
        $scope.paginaSiguiente = function() {
            $scope.paginaactual++;
            that.listarVideoTutoriales();
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
                        that.listarVideoTutoriales();

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
