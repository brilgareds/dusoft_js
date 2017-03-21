define(["angular", 
    "js/controllers",
    'includes/slide/slideContent',
    'includes/classes/GestionTerceros/Terceros/Genero',
    'includes/classes/GestionTerceros/Terceros/TipoDocumento',
    'includes/classes/GestionTerceros/Terceros/EstadoCivil',
    'includes/classes/GestionTerceros/Terceros/TipoNacionalidad',
    'includes/classes/GestionTerceros/Terceros/TipoOrganizacion',
    'includes/classes/Tercero'], function(angular, controllers) {

    controllers.controller('GuardarTerceroController', [
        '$scope', '$rootScope', 'Request',
        'API', "socket", "AlertService",
        '$state', "Usuario", "localStorageService", "$modal","GestionTercerosService",
        'Genero', 'Tercero', 'TipoDocumento', 'EstadoCivil','TipoNacionalidad','TipoOrganizacion',
        function($scope, $rootScope, Request,
                 API, socket, AlertService, 
                 $state, Usuario, localStorageService, $modal, GestionTercerosService,
                 Genero, Tercero, TipoDocumento, EstadoCivil, TipoNacionalidad, TipoOrganizacion) {
                     
            var self = this;
            
            $scope.root = {
                tabActual : 0,
                tiposNaturaleza:[
                    {
                        codigo:"0",
                        descripcion:"Natural"
                    },
                    {
                        codigo:"1",
                        descripcion:"Juridica"
                    }
                ],
                tabs: [false, false, false],
                tercero : Tercero.get(),
                parametros : {
                    generos:[],
                    tiposDocumentos:[],
                    tiposEstadoCivil:[],
                    tiposNacionalidad:[],
                    tiposOrganizacion:[]
                },
                session : {
                    usuario_id: Usuario.getUsuarioActual().getId(),
                    auth_token: Usuario.getUsuarioActual().getToken()
                }
            };
            
            $scope.listaContactos = {
                data: 'usuarios',
                multiSelect: false,
                showFilter: true,
                enableRowSelection: true,
                columnDefs: [
                    {field: 'nombre_usuario', displayName: 'Nombre'},
                    {field: 'usuario', displayName: 'Correo'},
                    {field: 'usuario', displayName: 'Tipo'}
                ]

            };
            
            
            $scope.root.tipoNaturaleza =  $scope.root.tiposNaturaleza[0];
           
            /**
            * @author Eduar Garcia
            * +Descripcion Permite obtener los parametros de los dropdown
            * @fecha 2017-03-17
            */
            self.gestionarParametrosTerceros = function(){
                
                var parametros = {
                    session:$scope.root.session,
                    data:{}
                };
                
                GestionTercerosService.obtenerParametrizacionTerceros(parametros,function(respuesta){
                    if(respuesta.status === 200){
                        console.log("obtenerParametrizacion terceros ", respuesta);
                        var data = respuesta.obj.parametrizacion;
                        self.gestionarParametrosTercero(data);
                        
                    } else {
                        AlertService.mostrarVentanaAlerta("Mensaje del sistema", "Ha ocurrido un error");
                    }
                    
                });
                
                GestionTercerosService.obtenerPaises(parametros,function(respuesta){
                    if(respuesta.status === 200){
                        console.log("obtenerParametrizacion paises ", respuesta);
                    } else {
                        AlertService.mostrarVentanaAlerta("Mensaje del sistema", "Ha ocurrido un error");
                    }
                });
  
            };
            
            self.gestionarParametrosTercero = function(data){
                
                if(data["generos"]){
                    $scope.root.parametros.generos = [];
                    for(var i in data["generos"]){
                        var _genero = data["generos"][i];
                        var genero = Genero.get(_genero["id"], _genero["descripcion"]);
                        $scope.root.parametros.generos.push(genero);
                    }
                }
                
                if(data["tiposDocumentos"]){
                    $scope.root.parametros.tiposDocumento = [];
                    for(var i in data["tiposDocumentos"]){
                        var _tipoDocumento = data["tiposDocumentos"][i];
                        var tipoDocumento = TipoDocumento.get(_tipoDocumento["id"], _tipoDocumento["descripcion"]);
                        $scope.root.parametros.tiposDocumentos.push(tipoDocumento);
                    }
                }
                
                if(data["tiposEstadoCivil"]){
                    $scope.root.parametros.tiposEstadoCivil = [];
                    for(var i in data["tiposEstadoCivil"]){
                        var _tiposEstadoCivil = data["tiposEstadoCivil"][i];
                        var tiposEstadoCivil = EstadoCivil.get(_tiposEstadoCivil["id"], _tiposEstadoCivil["descripcion"]);
                        $scope.root.parametros.tiposEstadoCivil.push(tiposEstadoCivil);
                    }
                }
                
                if(data["tiposNacionalidad"]){
                    $scope.root.parametros.tiposNacionalidad = [];
                    for(var i in data["tiposNacionalidad"]){
                        var _tiposNacionalidad = data["tiposNacionalidad"][i];
                        var tiposNacionalidad = TipoNacionalidad.get(_tiposNacionalidad["id"], _tiposNacionalidad["descripcion"]);
                        $scope.root.parametros.tiposNacionalidad.push(tiposNacionalidad);
                    }
                }
                
                if(data["tiposOrganizacion"]){
                    $scope.root.parametros.tiposOrganizacion = [];
                    for(var i in data["tiposOrganizacion"]){
                        var _tiposOrganizacion = data["tiposOrganizacion"][i];
                        var tiposOrganizacion = TipoOrganizacion.get(_tiposOrganizacion["id"], _tiposOrganizacion["descripcion"]);
                        $scope.root.parametros.tiposOrganizacion.push(tiposOrganizacion);
                    }
                }
                
                
                
            };
            
            /**
            * @author Eduar Garcia
            * +Descripcion Handler de los tabs del formulario de clientes, es tambien llamado por el boton siguiente
            * @params obj: {tab}
            * @fecha 2017-03-15
            */
            $scope.onTabChange = function(tab){
                $scope.root.tabActual = tab;
                
                for(var _tab in $scope.root.tabs){   
                    if(parseInt(_tab) === parseInt(tab)){
                        $scope.root.tabs[_tab] = true;
                    } else {
                        $scope.root.tabs[_tab] = false;
                    }
                }                
            };
            
            /**
            * @author Eduar Garcia
            * +Descripcion Handler del boton de siguiente
            * @fecha 2017-03-15
            */
            $scope.onBtnSiguiente = function(){
                $scope.root.tabActual++;
                $scope.onTabChange($scope.root.tabActual);
            };  
            
            $scope.onCambiarNaturaleza = function(){
                console.log("tipo naturaleza ", $scope.root.tipoNaturaleza);
            };
            
            /**
            * @author Eduar Garcia
            * +Descripcion Handler del boton de cancelar
            * @fecha 2017-03-15
            */
            $scope.onBtnCancelar = function(){
                $state.go("Terceros");
            };
            
            self.gestionarParametrosTerceros();
            

        }]);
        
});
