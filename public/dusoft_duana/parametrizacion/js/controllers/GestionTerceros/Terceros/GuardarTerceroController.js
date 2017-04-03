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
    'includes/classes/GestionTerceros/Terceros/Pais',
    'includes/classes/GestionTerceros/Terceros/Departamento',
    'includes/classes/GestionTerceros/Terceros/Ciudad',
    'includes/classes/GestionTerceros/Terceros/TipoNaturaleza',
    'includes/classes/GestionTerceros/Terceros/Telefono',
    'includes/classes/Tercero',
    'controllers/GestionTerceros/Terceros/ListaTelefonosController'], function(angular, controllers) {

    controllers.controller('GuardarTerceroController', [
        '$scope', '$rootScope', 'Request',
        'API', "socket", "AlertService",
        '$state', "Usuario", "localStorageService", "$modal", "$filter", "GestionTercerosService",
        'Genero', 'Tercero', 'TipoDocumento', 'EstadoCivil','TipoNacionalidad','TipoOrganizacion',
        'TipoDireccion','NomenclaturaDireccion','TipoTelefono','TipoLineaTelefonica','TipoCorreo',
        'TipoRedSocial','TipoContacto','Contacto','Pais','Departamento','Ciudad','TipoNaturaleza',
        'Telefono',
        function($scope, $rootScope, Request,
                 API, socket, AlertService, 
                 $state, Usuario, localStorageService, $modal, $filter, GestionTercerosService,
                 Genero, Tercero, TipoDocumento, EstadoCivil, TipoNacionalidad, TipoOrganizacion,
                 TipoDireccion, NomenclaturaDireccion, TipoTelefono, TipoLineaTelefonica, TipoCorreo,
                 TipoRedSocial, TipoContacto, Contacto, Pais, Departamento, Ciudad, TipoNaturaleza,
                 Telefono) {
                     
            var self = this;
            
            $scope.root = {
                tabActual : 0,
                tiposNaturaleza:[
                    TipoNaturaleza.get("0", "Natural"),
                    TipoNaturaleza.get("1", "Juridica")
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
                    tiposContacto:[],
                    paises:[],
                    contactos:[]
                },
                session : {
                    usuario_id: Usuario.getUsuarioActual().getId(),
                    auth_token: Usuario.getUsuarioActual().getToken()
                }
            };
            
            var contacto = Contacto.get();
            var telefono = Telefono.get();
            $scope.root.tercero.setContacto(contacto);
            $scope.root.tercero.setTelefonoSeleccionado(telefono);
            
            
            $scope.listaContactos = {
                data: 'root.tercero.contactos',
                multiSelect: false,
                showFilter: true,
                enableRowSelection: true,
                columnDefs: [
                    {field: 'nombre', displayName: 'Nombre'},
                    {field: 'telefono', displayName: 'Teléfono'},
                    {field: 'email', displayName: 'Correo'},
                    {field: 'getTipoContacto().getDescripcion()', displayName: 'Tipo'},
                    {field: 'opciones', displayName: "", cellClass: "txt-center dropdown-button", width: "70", 
                        cellTemplate: '\
                                        <div class="btn-group">\
                                        <button class="btn btn-default btn-xs dropdown-toggle" data-toggle="dropdown" >Acción<span class="caret"></span></button>\
                                        <ul class="dropdown-menu dropdown-options">\
                                            <li>\
                                                <a href="javascript:void(0);" ng-click="onEditarContacto(row.entity)">Editar</a>\
                                            </li>\
                                            <li>\
                                                <a href="javascript:void(0);" ng-click="onRemoverContacto(row.entity)">Remover</a>\
                                            </li>\
                                        </ul>\
                                    </div>'
                    }
                ]

            };
            
            $scope.formularios = {
                formularioTerceros:null,
                formularioUbicacion:null,
                formularioContacto:null
            };
            
            $scope.root.tercero.tipoNaturaleza =  $scope.root.tiposNaturaleza[0];
            $scope.pickerFechaExpedicion = {};
            $scope.pickerFechaExpiracion = {};
            $scope.pickerFechaNacimiento = {};
            
            //$filter('date')($scope.fechafinal, "yyyy-MM-dd") + " 23:59:00"
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
                       // console.log("obtenerParametrizacion terceros ", respuesta);
                        var data = respuesta.obj.parametrizacion;
                        self.gestionarParametrosTercero(data);
                        
                    } else {
                        AlertService.mostrarVentanaAlerta("Mensaje del sistema", "Ha ocurrido un error");
                    }
                    
                });
                
                GestionTercerosService.obtenerPaises(parametros,function(respuesta){
                    if(respuesta.status === 200){
                        //console.log("obtenerParametrizacion paises ", respuesta);
                        var data = respuesta.obj.ciudades;
                        self.gestionarPaises(data);
                    } else {
                        AlertService.mostrarVentanaAlerta("Mensaje del sistema", "Ha ocurrido un error");
                    }
                });
  
            };
            
           /**
            * @author Eduar Garcia
            * +Descripcion Permite hacer serializacion de los paises obtenidos del API
            * @param {Array<Object>} paises
            * @fecha 2017-03-21
            */
            self.gestionarPaises = function(paises){
                $scope.root.parametros.paises = [];
                for(var i in paises){
                    var _pais = paises[i];
                    var pais = Pais.get(_pais["pais_id"], _pais["nombre_pais"]);
                    $scope.root.parametros.paises.push(pais);
                }
            };
            
           /**
            * @author Eduar Garcia
            * +Descripcion Permite hacer serializacion de los departamentos obtenidos del API
            * @param {Array<Object>} departamentos
            * @fecha 2017-03-21
            */
            self.gestionarDepartamentos = function(departamentos){
                $scope.root.tercero.getPais().setDepartamentos([]);
                for(var i in departamentos){
                    var _departamento = departamentos[i];
                    var departamento = Departamento.get(_departamento["departamento_id"], _departamento["nombre_departamento"]);
                    $scope.root.tercero.getPais().agregarDepartamento(departamento);
                }
                
            };
            
           /**
            * @author Eduar Garcia
            * +Descripcion Permite hacer serializacion de las ciudades obtenidas del API
            * @param {Array<Object>} ciudades
            * @fecha 2017-03-21
            */
            self.gestionarCiudades = function(ciudades){
                var departamento = $scope.root.tercero.getPais().getDepartamentoSeleccionado();
                for(var i in ciudades){
                    var _ciudad = ciudades[i];
                    var ciudad = Ciudad.get(_ciudad["id"], _ciudad["nombre_ciudad"]);
                    departamento.agregarCiudad(ciudad);
                }
                
            };
            
           /**
            * @author Eduar Garcia
            * +Descripcion Permite mapear la informacion del tercero en los dropdown
            * @params Obj {}
            * @fecha 2017-03-21
            */
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
            
            self.obtenerNombreFormularioActual = function(tab){
                var obj = $scope.formularios;
                var forms =  Object.keys(obj);
                
                for(var i in forms){
                    if(parseInt(i) === parseInt(tab)){
                        return forms[i];
                    }
                }
                
            };
            
            /**
            * @author Eduar Garcia
            * +Descripcion Handler de los tabs del formulario de clientes, es tambien llamado por el boton siguiente
            * @params obj: {tab}
            * @fecha 2017-03-15
            */
            $scope.onTabChange = function(tab, finalizar){

                var formulario = self.obtenerNombreFormularioActual($scope.root.tabActual);
                
                if(!formulario || !$scope.formularios[formulario]){
                    return false;
                }
                
                var formActual =  $scope.formularios[formulario];
                
                if(formulario === "formularioUbicacion"){                    
                    self.setValidacionTelefono($scope.root.tercero.getTelefonos().length > 0);
                }
                
               
                if(!formActual.$valid && formulario !== "formularioContacto"){
                    console.log("formulario to show validation ", formActual);
                    formActual.mostrarErrorEnCampos();
                    return false;
                }
                
                if(!finalizar){       
                    $scope.root.tabActual = tab;
                    for(var _tab in $scope.root.tabs){   
                        if(parseInt(_tab) === parseInt(tab)){
                            $scope.root.tabs[_tab] = true;
                        } else {
                            $scope.root.tabs[_tab] = false;
                        }
                    }    
                } else {
                    
                   self.submitformularioTerceros(function(){
                       
                   });
                    
                }
                
                
                return true;
            };
            
            
            /**
            * @author Eduar Garcia
            * +Descripcion Permite realiar peticion al API para guardar el tercero
            * @params callback: {function}
            * @fecha 2017-03-30
            */            
            self.submitformularioTerceros = function(callback){
               console.log("tercero a enviar datos ", $scope.root.tercero)
               
                var parametros = {
                    session:$scope.root.session,
                    data:{
                        tercero:$scope.root.tercero,
                        empresa_id: Usuario.getUsuarioActual().getEmpresa().getCodigo(),
                        accion : localStorageService.get("accion") || "0"
                    }
                };
                
                GestionTercerosService.submitformularioTerceros(parametros,function(respuesta){
                    if(respuesta.status === 200){
                        var data = respuesta.obj.departamentos;
                        self.gestionarDepartamentos(data);
                    } else {
                        AlertService.mostrarVentanaAlerta("Mensaje del sistema",respuesta.msj);
                    }
                });
            };
            
           /**
            * @author Eduar Garcia
            * +Descripcion Permite validar los input del telefono
            * @params callback: {function}
            * @fecha 2017-03-30
            */
            self.setValidacionTelefono = function(expresion){
                var formulario = $scope.formularios.formularioUbicacion;
                formulario.tipoTelefono.$setValidity("required", expresion);
                formulario.tipoLineaTelefonica.$setValidity("required", expresion);
                formulario.numeroTelefono.$setValidity("required",expresion);
            };
            
            $scope.obtenerDireccion = function(){
                var tercero = $scope.root.tercero;
                
                var nomenclatura1 = tercero.getNomenclaturaDireccion1() || NomenclaturaDireccion.get();
                var nomenclatura2 = tercero.getNomenclaturaDireccion2() || NomenclaturaDireccion.get();
                
                tercero.setDireccion(nomenclatura1.getDescripcion() + " " + tercero.getNomenclaturaDescripcion1() + " " +
                       nomenclatura2.getDescripcion() + " " + tercero.getNomenclaturaDescripcion2()  + " " +
                       tercero.getNumeroPredio() + " " + tercero.getBarrio());

            };
            
            
           /**
            * @author Eduar Garcia
            * +Descripcion Handler del boton para agregar contacto
            * @fecha 2017-03-30
            */
            $scope.onBtnAgregarContacto = function(){
                var formulario = self.obtenerNombreFormularioActual($scope.root.tabActual);
                var formActual =  $scope.formularios[formulario];
               
                if(!formActual.$valid){
                    formActual.mostrarErrorEnCampos();
                    return false;
                }
                
                var contacto = angular.copy($scope.root.tercero.getContacto());
                var tercero = $scope.root.tercero;
                
                if(contacto.getId() === 0){
                    contacto.setId((tercero.getContactos().length + 1));
                }
                
                tercero.agregarContacto(contacto);
                $scope.root.tercero.getContacto().inicializar();
                
            };
            
            $scope.onRemoverContacto = function(contacto){
                var tercero = $scope.root.tercero;
                var contactos = tercero.getContactos();
                contactos.splice(contactos.indexOf(contacto));
            };
            
           /**
            * @author Eduar Garcia
            * +Descripcion  Handler del boton editar del grid de contacto
            * @params contacto: {Contacto}
            * @fecha 2017-03-30
            */
            $scope.onEditarContacto = function(contacto){
                $scope.root.tercero.getContacto().inicializar(contacto);
            };
            
           /**
            * @author Eduar Garcia
            * +Descripcion Handler de los tabs
            * @params tab: {int}
            * @fecha 2017-03-30
            */
            $scope.onCambiarValorTab = function(tab){
                $scope.root.tabActual = tab;
            };
            
           /**
            * @author Eduar Garcia
            * +Descripcion Permite agregar un telefono al tercero
            * @fecha 2017-03-30
            */
            $scope.onAgregarTelefono = function(){
                var telefono = angular.copy($scope.root.tercero.getTelefonoSeleccionado());
                var formulario = $scope.formularios.formularioUbicacion;
                
                if($scope.root.tercero.agregarTelefono(telefono)){
                    
                    $scope.root.tercero.setTelefonoSeleccionado(Telefono.get());
                    self.setValidacionTelefono(true);
                    formulario.mostrarErrorEnCampos();
                } else {
                    self.setValidacionTelefono(false);
                    formulario.mostrarErrorEnCampos();
                }
            };
            
            /**
            * @author Eduar Garcia
            * +Descripcion Permite mostrar el listado de telefonos en una ventana
            * @params callback: {function}
            * @fecha 2017-03-30
            */
            $scope.onMostrarListaTelefonos = function(){
                
                if($scope.root.tercero.getTelefonos().length === 0){
                    return;
                }
                
                $scope.root.tercero.setTelefonoSeleccionado(Telefono.get());
                
                $scope.opts = {
                    size: 'lg',
                    backdrop: 'static',
                    dialogClass: "editarproductomodal",
                    templateUrl: 'views/GestionTerceros/Terceros/ListaTelefonos.html',
                    controller: "ListaTelefonosController",
                    resolve: {
                        tercero: function() {
                            return $scope.root.tercero;
                        }
                    }
                };

                var modalInstance = $modal.open($scope.opts);
            };
            
            
           /**
            * @author Eduar Garcia
            * +Descripcion Handler del dropdown de paises
            * @fecha 2017-03-21
            */
            $scope.onSeleccionarPais = function(){
                var pais = $scope.root.tercero.getPais();
                var parametros = {
                    session:$scope.root.session,
                    data:{
                        departamentos:{
                            pais_id:pais.getId()
                        }
                    }
                };
                
                GestionTercerosService.obtenerDepartamentosPorPais(parametros,function(respuesta){
                    if(respuesta.status === 200){
                        var data = respuesta.obj.departamentos;
                        self.gestionarDepartamentos(data);
                    } else {
                        AlertService.mostrarVentanaAlerta("Mensaje del sistema", "Ha ocurrido un error");
                    }
                });
            };
            
           /**
            * @author Eduar Garcia
            * +Descripcion Handler del dropdown de departamentos
            * @fecha 2017-03-21
            */
            $scope.onSeleccionarDepartamento = function(){
                var departamento = $scope.root.tercero.getPais().getDepartamentoSeleccionado();
                var parametros = {
                    session:$scope.root.session,
                    data:{
                        ciudades:{
                            departamento_id:departamento.getId()
                        }
                    }
                };
                
                GestionTercerosService.obtenerCiudadesPorDepartamento(parametros,function(respuesta){
                    if(respuesta.status === 200){
                        var data = respuesta.obj.ciudades;
                        self.gestionarCiudades(data);
                    } else {
                        AlertService.mostrarVentanaAlerta("Mensaje del sistema", "Ha ocurrido un error");
                    }
                });
            };
            
            /**
            * @author Eduar Garcia
            * +Descripcion Handler del boton de siguiente
            * @fecha 2017-03-15
            */
            $scope.onBtnSiguiente = function(finalizar){
                var tab = $scope.root.tabActual;
                tab++;
                $scope.onTabChange(tab, finalizar);
                
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
            
           /**
            * @author Eduar Garcia
            * +Descripcion Handler textfield de fecha de expedicion
            * @param {Object} event
            * @fecha 2017-03-22
            */
            $scope.onAbrirFechaExpedicion = function($event) {

                $event.preventDefault();
                $event.stopPropagation();
                $scope.pickerFechaExpedicion.open = !$scope.pickerFechaExpedicion.open;
            };
            
           /**
            * @author Eduar Garcia
            * +Descripcion Handler textfield de fecha de expiracion
            * @param {Object} event
            * @fecha 2017-03-22
            */
            $scope.onAbrirFechaExpiracion = function($event) {

                $event.preventDefault();
                $event.stopPropagation();
                $scope.pickerFechaExpiracion.open = !$scope.pickerFechaExpiracion.open;
            };
            
           /**
            * @author Eduar Garcia
            * +Descripcion Handler textfield de numero de identificacion y el dropdown de tipo de documento
            * @fecha 2017-03-22
            */
            $scope.onIdentificacionBlur = function(){
                
                var tercero = $scope.root.tercero;
                
                if(tercero.getTipoDocumento() && tercero.getTipoDocumento().getId().length > 0 && tercero.getId().length > 0){
                    var parametros = {
                        session:$scope.root.session,
                        data:{
                            tercero:{
                                id: tercero.getId(),
                                tipoDocumento: {
                                    id:tercero.getTipoDocumento().getId()
                                }
                            }
                        }
                    };

                    GestionTercerosService.verificarTercero(parametros,function(respuesta){
                        if(respuesta.status === 200){
                            
                            if(respuesta.obj.tercero.length > 0){
                                AlertService.mostrarVentanaAlerta("Mensaje del sistema", "El tercero ya esta registrado");
                                tercero.setId("");
                            } else {
                                //En caso de perder el blur el input al dar click en el boton de siguiente
                                var formulario = self.obtenerNombreFormularioActual($scope.root.tabActual);
                                var formActual =  $scope.formularios[formulario];

                                if(formActual.$valid){
                                   var tab = $scope.root.tabActual + 1;
                                   $scope.onTabChange(tab); 
                                }
                                
                            }
                            
                        } else {
                            AlertService.mostrarVentanaAlerta("Mensaje del sistema", "Ha ocurrido un error verificando el tercero");
                        }
                    });
                }
                
            };
            
           /**
            * @author Eduar Garcia
            * +Descripcion Handler textfield de fecha de nacimiento
            * @param {Object} event
            * @fecha 2017-03-22
            */
            $scope.onAbrirFechaNacimiento = function($event) {

                $event.preventDefault();
                $event.stopPropagation();
                $scope.pickerFechaNacimiento.open = !$scope.pickerFechaNacimiento.open;
            };
            
            $scope.onFechaNacimientoChange = function(){
                $scope.root.tercero.fechaNacimiento = $filter('date')($scope.root.tercero.fechaNacimiento, "yyyy-MM-dd");
            };
            
            self.gestionarParametrosTerceros();
            

        }]);
        
});
