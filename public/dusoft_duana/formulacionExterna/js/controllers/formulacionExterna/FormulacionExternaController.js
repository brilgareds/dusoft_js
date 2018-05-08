define(["angular", "js/controllers", 'includes/slide/slideContent',
    "includes/classes/Empresa",
],function(angular, controllers) {

    controllers.controller('RegistroLlamadasController', ['$scope', '$rootScope', "Request", "$filter", '$state', '$modal', "$modalInstance","API", "AlertService", 'localStorageService', "Usuario", "socket", "$timeout", "Empresa", "formulaExternaService", registroLlamadasControler]); 
    controllers.controller('FormulacionExternaController', ['$scope', '$rootScope', "Request", "$filter", '$state', '$modal', "API", "AlertService", 'localStorageService', "Usuario", "socket", "$timeout", "Empresa", "formulaExternaService", 
      function($scope, $rootScope, Request, $filter, $state, $modal, API, AlertService, localStorageService, Usuario, socket, $timeout, Empresa, formulaExternaService) {


        /**
  				@description: Verifica el estado de una formula
  				@param: estado
        */
        $scope.classCssSinDispensar = "success"; 
        $scope.classCssPendientes = "default";  
        $scope.checkearEstadoFormula = checkearEstadoFormula;
        $scope.tipoDocumentos = [];

        /**
  				@description: Cambia el tamano de la columna donde se encuentra el input de busqueda
  				@param: tipo
        */
        $scope.onColumnaSize = onColumnaSize;
        /**
          @description: Redirige a la pantalla de crear formula
        */
        $scope.crear_formula = crear_formula;
        $scope.$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams) {
          $scope.$$watchers = null;
          $scope.root = null;
	      });

        $scope.buscarFormulas = buscarFormulas;
        $scope.onSeleccionFiltro = onSeleccionFiltro;
        $scope.dispensacionPendientes = dispensacionPendientes;
        $scope.imprimirDispensados = imprimirDispensados;
        $scope.imprimirPendientes = imprimirPendientes;
        $scope.imprimirTodoDispensado = imprimirTodoDispensado;
        $scope.abrirModalRegistroLlamadas = abrirModalRegistroLlamadas;
        $scope.abrirFechaInicial = abrirFechaInicial;
        $scope.abrirFechaFinal = abrirFechaFinal;

        /***************************
		  		Definicion de funciones
        ***************************/
        function checkearEstadoFormula(estado){
          if(estado ===0){
            $scope.classCssSinDispensar = "success";
            $scope.classCssPendientes = "default";
          }else{
            $scope.classCssSinDispensar = "default";
            $scope.classCssPendientes = "success";
          }
        };
			
        function onColumnaSize(tipo){
          if(tipo === "AS" || tipo === "MS" || tipo === "CD"){
              $scope.columnaSizeBusqueda = "col-md-4"; 
          }else{
              $scope.columnaSizeBusqueda = "col-md-3";
          }
        };

        function crear_formula(){
          $state.go("Formula");
        };

        function buscarFormulas(fecha_inicial, fecha_final, nombre_paciente, formula_papel, tipo_id_paciente, paciente_id, pagina) {
          var fecha_ini = typeof fecha_inicial == 'string'? fecha_inicial : fecha_inicial.getFullYear().toString() + '-' + (fecha_inicial.getMonth() + 101).toString().slice(-2) + '-'+ (fecha_inicial.getDate() + 100).toString().slice(-2);
          var fecha_fin = typeof fecha_final == 'string'? fecha_final : fecha_final.getFullYear().toString() + '-' + (fecha_final.getMonth() + 101).toString().slice(-2) + '-'+ (fecha_final.getDate() + 100).toString().slice(-2);
          formulaExternaService.buscarFormulas(fecha_ini, fecha_fin, nombre_paciente, formula_papel, tipo_id_paciente, paciente_id, pagina, function(error, formulas){
            if(error){
              AlertService.mostrarMensaje("warning", 'Error mientras se recuperaban las formulas.');
              return;
            }
            $scope.root.formulas = formulas;
          });
        };

        function onSeleccionFiltro(filtro){
          $scope.root.buscador.filtro = filtro;
        };

        function dispensacionPendientes(formula_id, formula_papel, tipo_id_paciente, paciente_id, plan_id, plan_descripcion, nombre_paciente, fecha_formula){
          formulaExternaService.shared = {
            formula_id : formula_id,
            formula_papel: formula_papel,
            tipo_id_paciente: tipo_id_paciente,
            paciente_id: paciente_id,
            plan_id : plan_id,
            plan_descripcion : plan_descripcion,
            nombre_paciente: nombre_paciente,
            fecha_formula: fecha_formula
          };
          $state.go("FormulaExternaPendientes");
        };

        function imprimirDispensados(formula_id, imprimir_actual){
          formulaExternaService.imprimirMedicamentosDispensados(formula_id, imprimir_actual, function(error, resultado){
              $scope.visualizarReporte("/reports/" + resultado.listar_medicamentos_pendientes.nombre_pdf, resultado.listar_medicamentos_pendientes.nombre_pdf, "_blank");
          });
        };

        function imprimirTodoDispensado(formula_id, imprimir_actual){
          formulaExternaService.imprimirTodoDispensado(formula_id, imprimir_actual, function(error, resultado){
            $scope.visualizarReporte("/reports/" + resultado.listar_medicamentos_pendientes.nombre_pdf, resultado.listar_medicamentos_pendientes.nombre_pdf, "_blank");
          });
        };

        function imprimirPendientes(formula_id){
          formulaExternaService.imprimirMedicamentosPendientesPorDispensar(formula_id, function(error, resultado){
              $scope.visualizarReporte("/reports/" + resultado.listar_medicamentos_pendientes.nombre_pdf, resultado.listar_medicamentos_pendientes.nombre_pdf, "_blank");
          });
        };

        function abrirModalRegistroLlamadas(formula){
            $scope.opts = {
                backdropClick: true,
                dialogFade: false,
                keyboard: true,
                windowClass: 'app-modal-window-xlg',
                templateUrl: 'views/formulacionExterna/modal/registroLlamadas.html',
                scope: $scope,
                controller: "RegistroLlamadasController"
            };

            //datos para compartir con el controlador del modal
            formulaExternaService.shared = {
                formula : formula
            };

            var modalInstance = $modal.open($scope.opts);
            modalInstance.result.then(function(item){

            },function(){

            });
        
        }

        function abrirFechaInicial($event){
          $event.preventDefault();
          $event.stopPropagation();
          $scope.root.datepicker_fecha_inicial = true;
        }

        function abrirFechaFinal($event){
          $event.preventDefault();
          $event.stopPropagation();
          $scope.root.datepicker_fecha_final = true;
        }


        /***************************
        	Grillas
        ***************************/
        $scope.listaFormulas = {
          data: 'root.formulas',
          enableColumnResize: true,
	        enableRowSelection: false,
    	    enableCellSelection: true,
        	enableHighlighting: true,
          columnDefs: [
          	{
              field: '#Formula', 
              width: "10%", 
              displayName: '#Formula', 
              cellTemplate: '<div class="col-xs-16" style="padding-left:1em;"><p class="text-uppercase">{{row.entity.formula_papel}}</p></div>'
            },
            {
              displayName: 'Identificacion',
              width: "10%",   
              cellTemplate: '<div class="col-xs-16 txt-center"><p class="text-lowercase">{{ row.entity.tipo_id_paciente}} {{ row.entity.paciente_id }}</p> </div>'
            },   
            {
              displayName: 'Paciente',
              width: "25%",   
              cellTemplate: '<div class="col-xs-16 " style="padding-left:1em;"><p class="text-lowercase">{{row.entity.nombre_paciente}}</p> </div>'
            },   
            {
              displayName: 'F.Formulacion',  
              width: "10%",  
              cellTemplate: '<div class="col-xs-12 txt-center"><p class="text-uppercase ">{{row.entity.fecha_formula}}</p></div>'
            },
            {
              displayName: 'Plan', 
              width: "35%",   
              cellTemplate: '<div class="col-xs-12 " style="padding-left:1em;"><p class="text-lowercase">{{row.entity.plan_descripcion}}</p></div>'
            },
            {
              displayName: "Opc", 
              width:"10%", 
              cellClass: "txt-center dropdown-button",
            	cellTemplate:'<div class="btn-group">\
                              <button class="btn btn-default btn-xs dropdown-toggle" ng-class="row.entity.tiene_pendientes? \'btn-danger\' : \'btn-success\'" data-toggle="dropdown">Accion<span class="caret"></span></button>\
                              <ul class="dropdown-menu dropdown-options">\
                                <li ng-if="row.entity.tiene_pendientes">\n\
                                  <a href="javascript:void(0);" ng-click="dispensacionPendientes(row.entity.formula_id, row.entity.formula_papel, row.entity.tipo_id_paciente, row.entity.paciente_id, row.entity.plan_id, row.entity.plan_descripcion, row.entity.nombre_paciente, row.entity.fecha_formula)" class="glyphicon glyphicon-tasks">&nbsp;Pendientes</a>\
                                </li>\
                                <li ng-if="row.entity.tiene_pendientes">\n\
                                  <a href="javascript:void(0);" ng-click="abrirModalRegistroLlamadas(row.entity)" class="glyphicon glyphicon-phone-alt">&nbsp;Registro llamadas</a>\
                                </li>\
                                <li>\
                                  <a href="javascript:void(0);" ng-click="imprimirTodoDispensado(row.entity.formula_id, false)" class="glyphicon glyphicon-print">&nbsp;Dispensados</a>\
                                </li>\
                                <li ng-if="row.entity.tiene_pendientes">\
                                  <a href="javascript:void(0);" ng-click="imprimirPendientes(row.entity.formula_id)" class="glyphicon glyphicon-print" ng-validate-events="{{habilitar_modificacion_producto()}}">&nbsp;Pendientes</a>\
                                </li>\
                              </ul>\
                            </div>'
            }
          ]
        };


      	/***************************
      		Funcion de inicializacion
      	***************************/
        init();
        function init(){
          //Verifica que los campos empresa, centro de utilidad y bodega se encuentren seleccionados, si alguno no esta seleccionado redirige al Home.
          var is_set_empresa_id = Usuario.getUsuarioActual().getEmpresa() ? true : false;
          var is_set_centro_utilidad = is_set_empresa_id ? Usuario.getUsuarioActual().getEmpresa().getCentroUtilidadSeleccionado() : false;
          var is_set_bodega = is_set_centro_utilidad ? Usuario.getUsuarioActual().getEmpresa().getCentroUtilidadSeleccionado().getBodegaSeleccionada() : false;

          if(!is_set_empresa_id || !is_set_centro_utilidad || !is_set_bodega){
            $rootScope.$emit("onIrAlHome",{mensaje:"El usuario no tiene una bodega valida para dispensar formulas.", tipo:"warning"});
            AlertService.mostrarMensaje("warning", "Debe seleccionar la empresa, centro de utilidad y bodega.");
            return;
          }

          var date = new Date();
          var date2 = new Date();
          date2.setDate(date2.getDate()-30);
          fecha_hoy = date.getFullYear()  + '-' +("0" + (date.getMonth() + 1)).slice(-2) + '-' + ("0" + date.getDate()).slice(-2);
          fecha_inicial = date2.getFullYear()  + '-' +("0" + (date2.getMonth() + 1)).slice(-2) + '-' + ("0" + date2.getDate()).slice(-2);

          $scope.root = {
            datepicker_fecha_inicial : '',
            datepicker_fecha_final : '',
            visibleBuscador : true,
            formulas : [],
            buscador : {
              fecha_inicial: fecha_inicial,
              fecha_final: fecha_hoy,
              numero_formula : '',
              numero_documento : '',
              nombre_paciente : '',
              filtro : {
                id: false ,
                descripcion : 'Tipo Documento'
              },
              pagina : 1
            }
          };

          //Inicializa el service con los datos de session de usuario para poder realizar peticiones
          formulaExternaService.session = {
              usuario_id: Usuario.getUsuarioActual().getId(),
              auth_token: Usuario.getUsuarioActual().getToken()
          };

          $scope.columnaSizeBusqueda = "col-md-4"; 
          formulaExternaService.obtenerTiposDeDocumentos(function(error, tipoDocumentos){
              if(!error){
                  $scope.tipoDocumentos = tipoDocumentos;
              }
          });
        }
      }]);


/******************************** REGISTRO LLAMADAS CONTROLLER *************************************/
      function registroLlamadasControler($scope, $rootScope, Request, $filter, $state, $modal, $modalInstance, API, AlertService, localStorageService, Usuario, socket, $timeout, Empresa, formulaExternaService) {
        $scope.root = {
          pendientes : [],
          registroLlamadas : [],
          llamada : {
            contacto_nombre :''
          }
        };

        $scope.insertarLlamadaPacientes = insertarLlamadaPacientes;
        $scope.listarLlamadasPacientes = listarLlamadasPacientes;
        $scope.cerrar = cerrar;
        //insertarLlamadaPacientes(root.formula.formula_id, root.llamada.contacto_nombre, root.llamada.contacto_parentezco, root.llamada.observacion, root.llamada.tel_contacto)
        function insertarLlamadaPacientes(formula_id, contacto_nombre, contacto_parentezco, observacion, tel_contacto){
          formulaExternaService.insertarLlamadaPacientes(formula_id, contacto_nombre, contacto_parentezco, observacion, tel_contacto, function(error, llamada_id){
            if(error){
              AlertService.mostrarMensaje("warning", 'Error mientras se insertaba el registro');
              return;
            }
            //limpia los campos
            $scope.root.llamada = {
              contacto_nombre:''
            };
            //recarga la grilla de llamadas
            listarLlamadasPacientes(formula_id);
          });
        }

        function listarLlamadasPacientes(formula_id){
          formulaExternaService.listarLlamadasPacientes(formula_id, function(error, llamadas){
            if(error){
              AlertService.mostrarMensaje("warning", 'Error mientras se insertaba el registro');
              return;
            }
            $scope.root.registroLlamadas = llamadas;
          });
        }

        function cerrar(){
          $modalInstance.close();
        }

        function init(){
          $scope.root.formula= formulaExternaService.shared.formula;
          formulaExternaService.listarMedicamentosPendientes($scope.root.formula.formula_id, function(error, medicamentosPendientes){
            if(error){
              AlertService.mostrarMensaje("warning", 'Error mientras se recuperaban los medicamentos pendientes');
              return;
            }
            $scope.root.pendientes = medicamentosPendientes;
          });
          //carga las llamadas realizadas
          listarLlamadasPacientes($scope.root.formula.formula_id);

          $scope.listaPendientes = {
            data: 'root.pendientes',
            enableColumnResize: true,
            enableRowSelection: false,
            columnDefs: [
                {field: 'codigo_producto', displayName: 'Codigo', width: "20%"},
                {field: 'molecula', displayName: 'Medicamento', width: "50%"},
                {field: 'cantidad', displayName: 'Cantidad', width: "15%", cellClass: "txt-center"},
                {field: 'cantidad_pendiente', displayName: 'Pendiente', width: "15%", cellClass: "txt-center"}
            ]
          };

          $scope.listaRegistroLlamadas = {
            data: 'root.registroLlamadas',
            enableColumnResize: true,
            enableRowSelection: false,
            columnDefs: [
                {field: 'contacto_nombre', displayName: 'Nombre contacto', width: "10%"},
                {field: 'contacto_parentezco', displayName: 'Parentezco contacto', width: "10%"},
                {field: 'tel_contacto', displayName: 'Telefono', width: "10%"},
                {field: 'observacion', displayName: 'Observacion', width: "50%"},
                {field: 'fecha', displayName: 'Fecha', width: "10%", cellClass: "txt-center"},
                {field: 'usuario', displayName: 'Usuario', width: "10%", cellClass: "txt-center"}
            ]
          };
        }
        init();
      }

});