define(["angular", "js/controllers", 'includes/slide/slideContent', "includes/classes/Empresa"], function(angular, controllers) {
    
    controllers.controller('FormulaController', ['$scope', '$rootScope', "Request", "$filter", '$state', '$modal', "API", "AlertService", 'localStorageService', "Usuario", "socket", "$timeout", "Empresa", "formulaExternaService", "Usuario", formulaController]);
    controllers.controller('MunicipioController', ['$scope', '$rootScope', "Request", "$filter", '$state', '$modal', "API", "AlertService", 'localStorageService', "Usuario", "socket", "$timeout", "Empresa", "formulaExternaService", "Usuario", municipioController]);
    
    function formulaController($scope, $rootScope, Request, $filter, $state, $modal, API, AlertService, localStorageService, Usuario, socket, $timeout, Empresa, formulaExternaService, Usuario) {
        //Tipos de documento que se despliegan en el elemento select
        $scope.tipoDocumentos = [];
        $scope.tipoFormulas = [];
        $scope.root = {
            tipoDocumentoSeleccionado : {'descripcion' : 'Tipo Documento'},
            tipoFormulaSeleccionada : {'descripcion' : 'Tipo Formula'},
            documento : '',
            paciente : {},
            formula : {}
        };

        /**
        * @Descripcion Consulta el paciente
        */
        $scope.obtenerPaciente = obtenerPaciente;

        /**
        * @Descripcion Funcion que fija el tipo de documento seleccionado.
        */
        $scope.onSeleccionFiltro = onSeleccionFiltro;

        /**
        * @Descripcion Funcion encargada de abrir el calendario del campo fecha
        */
        $scope.abrirFecha = abrirFecha;

        $scope.abrilModal = abrirModal;




        /***********************************
            Definicion de funciones
        ***********************************/
        function obtenerPaciente(tipoIdentificacion, identificacion){
            formulaExternaService.obtenerPaciente(tipoIdentificacion, identificacion, function(error, paciente){
                if(!error){
                    $scope.root.paciente = paciente;
                }
            });
        }

        function onSeleccionFiltro(tipoDocumento){
            $scope.root.tipoDocumentoSeleccionado = tipoDocumento;
        }

        function abrirFecha($event) {
            $event.preventDefault();
            $event.stopPropagation();
            $scope.root.datepicker_fecha_inicial = true;
            $scope.root.datepicker_fecha_final = false;
        }

        function abrirModal(){
            $scope.opts = {
                backdropClick: true,
                dialogFade: false,
                keyboard: true,
                windowClass: 'app-modal-window-xlg',                            
                templateUrl: 'views/formulacionExterna/modal/municipio.html',
                scope: $scope,                  
                controller: "MunicipioController"
            };

            var modalInstance = $modal.open($scope.opts);   
            modalInstance.result.then(function(){},function(){});                          
        }




        /***********************************
            Funcion inicializadora del modulo
        ***********************************/
        function init(){
            //Inicializa el service con los datos de session de usuario para poder realizar peticiones
            formulaExternaService.session = {
                usuario_id: Usuario.getUsuarioActual().getId(),
                auth_token: Usuario.getUsuarioActual().getToken()
            };
            //Inicializa  select de tipos de documentos
            formulaExternaService.obtenerTiposDeDocumentos(function(error, tipoDocumentos){
                if(!error){
                    $scope.tipoDocumentos = tipoDocumentos;
                }
            });
            //Inicializa Select de tipos de formulas
            formulaExternaService.obtenerTipoFormula(function(error, tipoFormulas){
                if(!error){
                    $scope.tipoFormulas = tipoFormulas;
                }
            });
            //Obtiene los municipios
            formulaExternaService.obtenerMunicipios('C',function(error, municipios){
                if(!error){
                    console.log('municipios', municipios);
                }
            });
        }

        init();
    }


    function municipioController($scope, $rootScope, Request, $filter, $state, $modal, API, AlertService, localStorageService, Usuario, socket, $timeout, Empresa, formulaExternaService, Usuario) {

    }
});