define(["angular", 
    "js/controllers",
    'includes/slide/slideContent',
    'includes/classes/GestionTerceros/Terceros/Genero',
    'includes/classes/GestionTerceros/Terceros/TipoDocumento',
    'includes/classes/GestionTerceros/Terceros/EstadoCivil',
    'includes/classes/GestionTerceros/Terceros/TipoNacionalidad',
    'includes/classes/GestionTerceros/Terceros/TipoOrganizacion',
    'includes/classes/GestionTerceros/Terceros/TipoDireccion',
    'includes/classes/GestionTerceros/Terceros/NomenclaturaDireccion',
    'includes/classes/GestionTerceros/Terceros/TipoTelefono',
    'includes/classes/GestionTerceros/Terceros/TipoLineaTelefonica',
    'includes/classes/GestionTerceros/Terceros/TipoCorreo',
    'includes/classes/GestionTerceros/Terceros/TipoRedSocial',
    'includes/classes/GestionTerceros/Terceros/Contacto',
    'includes/classes/GestionTerceros/Terceros/TipoContacto',
    'includes/classes/Tercero'], function(angular, controllers) {

    controllers.controller('GuardarTerceroController', [
        '$scope', '$rootScope', 'Request',
        'API', "socket", "AlertService",
        '$state', "Usuario", "localStorageService", "$modal","GestionTercerosService",
        'Genero', 'Tercero', 'TipoDocumento', 'EstadoCivil','TipoNacionalidad','TipoOrganizacion',
        'TipoDireccion','NomenclaturaDireccion','TipoTelefono','TipoLineaTelefonica','TipoCorreo',
        'TipoRedSocial','TipoContacto','Contacto',
        function($scope, $rootScope, Request,
                 API, socket, AlertService, 
                 $state, Usuario, localStorageService, $modal, GestionTercerosService,
                 Genero, Tercero, TipoDocumento, EstadoCivil, TipoNacionalidad, TipoOrganizacion,
                 TipoDireccion, NomenclaturaDireccion, TipoTelefono, TipoLineaTelefonica, TipoCorreo,
                 TipoRedSocial, TipoContacto, Contacto) {
                     
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
                    tiposOrganizacion:[],
                    tiposDireccion:[],
                    nomenclaturasDireccion:[],
                    tiposTelefono:[],
                    tiposLineaTefelonica:[],
                    tiposCorreo:[],
                    tiposRedSocial:[],
                    tiposContacto:[]
                },
                session : {
                    usuario_id: Usuario.getUsuarioActual().getId(),
                    auth_token: Usuario.getUsuarioActual().getToken()
                }
            };
            
            var contacto = Contacto.get();
            $scope.root.tercero.setContacto(contacto);
            
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
                
                if(data["tiposDireccion"]){
                    $scope.root.parametros.tiposDireccion = [];
                    for(var i in data["tiposDireccion"]){
                        var _tiposDireccion = data["tiposDireccion"][i];
                        var tiposDireccion = TipoDireccion.get(_tiposDireccion["id"], _tiposDireccion["descripcion"]);
                        $scope.root.parametros.tiposDireccion.push(tiposDireccion);
                    }
                }
                
                if(data["nomenclaturasDireccion"]){
                    $scope.root.parametros.nomenclaturasDireccion = [];
                    for(var i in data["nomenclaturasDireccion"]){
                        var _nomenclaturaDireccion = data["nomenclaturasDireccion"][i];
                        var nomenclaturaDireccion = NomenclaturaDireccion.get(_nomenclaturaDireccion["id"], _nomenclaturaDireccion["descripcion"]);
                        nomenclaturaDireccion.setCodigo(_nomenclaturaDireccion["codigo"]);
                        $scope.root.parametros.nomenclaturasDireccion.push(nomenclaturaDireccion);
                    }
                }
                
                if(data["tiposTelefeno"]){
                    $scope.root.parametros.tiposTelefono = [];
                    for(var i in data["tiposTelefeno"]){
                        var _tipoTelefono = data["tiposTelefeno"][i];
                        var tipoTelefono = TipoTelefono.get(_tipoTelefono["id"], _tipoTelefono["descripcion"]);
                        $scope.root.parametros.tiposTelefono.push(tipoTelefono);
                    }
                }
                
                if(data["tiposLineaTefelonica"]){
                    $scope.root.parametros.tiposLineaTefelonica = [];
                    for(var i in data["tiposLineaTefelonica"]){
                        var _tipoLineaTelefono = data["tiposLineaTefelonica"][i];
                        var tipoLineaTelefono = TipoLineaTelefonica.get(_tipoLineaTelefono["id"], _tipoLineaTelefono["descripcion"]);
                        $scope.root.parametros.tiposLineaTefelonica.push(tipoLineaTelefono);
                    }
                }
                
                if(data["tiposCorreo"]){
                    $scope.root.parametros.tiposCorreo = [];
                    for(var i in data["tiposCorreo"]){
                        var _tipoCorreo = data["tiposCorreo"][i];
                        var tipoCorreo = TipoCorreo.get(_tipoCorreo["id"], _tipoCorreo["descripcion"]);
                        $scope.root.parametros.tiposCorreo.push(tipoCorreo);
                    }
                }
                
                if(data["tiposRedSocial"]){
                    $scope.root.parametros.tiposRedSocial = [];
                    for(var i in data["tiposRedSocial"]){
                        var _tipoRedSocial = data["tiposRedSocial"][i];
                        var tipoRedSocial = TipoRedSocial.get(_tipoRedSocial["id"], _tipoRedSocial["descripcion"]);
                        $scope.root.parametros.tiposRedSocial.push(tipoRedSocial);
                    }
                }
                
                if(data["tiposContacto"]){
                    $scope.root.tercero.getContacto().setTiposContacto([]);
                    for(var i in data["tiposContacto"]){
                        var _tipoContacto = data["tiposContacto"][i];
                        var tipoContacto = TipoContacto.get(_tipoContacto["id"], _tipoContacto["descripcion"]);
                        $scope.root.tercero.getContacto().agregarTipoContacto(tipoContacto);
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
