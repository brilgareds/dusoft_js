define(["angular", "js/controllers", 'includes/slide/slideContent',
    "includes/classes/Empresa",
], function(angular, controllers) {
    controllers.controller('FormulacionExternaController', [
        '$scope', '$rootScope', "Request",
        "$filter", '$state', '$modal',
        "API", "AlertService", 'localStorageService',
        "Usuario", "socket", "$timeout",
        "Empresa",
        function($scope, $rootScope, Request, $filter, $state, $modal, API, AlertService, localStorageService, Usuario, socket, $timeout, Empresa) {
            $scope.root = {
            	visibleBuscador : true,
            	afiliados : []
            };

            /**
				@description: Verifica el estado de una formula
				@param: estado
            */
            $scope.classCssSinDispensar = "success"; 
            $scope.classCssPendientes = "default";  
            $scope.checkearEstadoFormula = checkearEstadoFormula;

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
                $scope.root=null;
	        });

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

            /***************************
            	Grillas
            ***************************/
			$scope.listaFormulas = {
                data: 'root.afiliados',
                enableColumnResize: true,
	            enableRowSelection: false,
    	        enableCellSelection: true,
        	    enableHighlighting: true,
            	columnDefs: [
                	{field: '#Evo', width: "5%", displayName: '#Evo', cellTemplate: '<div class="col-xs-16 "><p class="text-uppercase">{{row.entity.mostrarPacientes()[0].mostrarFormulas()[0].evolucionId}}</p></div>'},
                	{field: '#Formula', width: "5%", displayName: '#Formula', cellTemplate: '<div class="col-xs-16 "><p class="text-uppercase">{{row.entity.mostrarPacientes()[0].mostrarFormulas()[0].numeroFormula}}</p></div>'},
                	{field: '#Identificacion', width: "8%", displayName: '#Identificacion', cellTemplate: '<div class="col-xs-16 "><p class="text-uppercase">{{ row.entity.mostrarPacientes()[0].getTipoIdPaciente()}} {{ row.entity.mostrarPacientes()[0].getPacienteId()}}</p></div>'},
                    {displayName: 'Paciente',   cellTemplate: '<div class="col-xs-16 "><p class="text-lowercase">{{ row.entity.mostrarPacientes()[0].getNombres() }} {{ row.entity.mostrarPacientes()[0].getApellidos() }}</p> </div>'},   
                    {displayName: 'F.Formulacion',  width: "8%",  cellTemplate: '<div class="col-xs-12 "><p class="text-uppercase">{{row.entity.mostrarPacientes()[0].mostrarFormulas()[0].getFechaFormulacion()}}</p></div>'},
                    {displayName: 'F.Finalizacion',  width: "8%", cellTemplate: '<div class="col-xs-12 "><p class="text-uppercase">{{row.entity.mostrarPacientes()[0].mostrarFormulas()[0].getFechaFinalizacion()}}</p></div>'},
                    {displayName: '#Entregas', width: "6%", cellTemplate: '<div class="col-xs-12 "><p class="text-uppercase">{{row.entity.mostrarPacientes()[0].mostrarFormulas()[0].getNumeroEntregaActual()}} - {{row.entity.mostrarPacientes()[0].mostrarFormulas()[0].getNumeroTotalEntregas()}}</p></div>'},
	                {field: 'Ajuste', width: "7%", displayName: 'Ajuste',
    	                cellTemplate: '<div class="col-xs-12 " > \
                                <input type="text" \
                                ng-model="row.entity.mostrarPacientes()[0].mostrarFormulas()[0].numeroEntregaActual" \
                                validacion-numero-entero \
                                class="form-control grid-inline-input" \
                                name="" \
                                id="" \
                                ng-disabled="!root.opciones.sw_ajustar_entrega_formula" ng-class=""\n\
                                /> </div>'},
                    {displayName: 'Plan', width: "10%",   cellTemplate: '<div class="col-xs-12 "><p class="text-lowercase">{{row.entity.mostrarPlanAtencion()[0].mostrarPlanes()[0].getDescripcion()}}</p></div>'},
                    {displayName: 'Tipo', width: "9%", cellTemplate: '<div class="col-xs-12 "><p class="text-lowercase">{{row.entity.mostrarPacientes()[0].mostrarFormulas()[0].getDescripcionTipoFormula()}}</p></div>'},
                    {displayName: "Opc", width:"6%", cellClass: "txt-center dropdown-button",
                       	cellTemplate: '<div class="btn-group">\
                                       <button class="btn btn-default btn-xs dropdown-toggle" data-toggle="dropdown">Accion<span class="caret"></span></button>\
                                       <ul class="dropdown-menu dropdown-options">\
                                            <li ng-if="row.entity.mostrarPacientes()[0].mostrarFormulas()[0].estadoEntrega == 0 \
                                                    && root.estadoFormula == 0 \
                                                    && row.entity.mostrarPacientes()[0].mostrarFormulas()[0].getFormulaEnProceso() == 0">\n\
                                               <a href="javascript:void(0);" ng-click="dispensacionFormula(row.entity,0)" class= "glyphicon glyphicon-tasks"> Dispensaci&oacute;n </a>\
                                            </li>\
                                            <li ng-if="row.entity.mostrarPacientes()[0].mostrarFormulas()[0].getEstado() == 1 \
                                                    && root.estadoFormula == 1 \n\
                                                    && row.entity.mostrarPacientes()[0].mostrarFormulas()[0].getFormulaEnProceso() == 0 \
                                                    || row.entity.mostrarPacientes()[0].mostrarFormulas()[0].getEstado() == 2 \
                                                    && root.estadoFormula == 1 \
                                                    && row.entity.mostrarPacientes()[0].mostrarFormulas()[0].getFormulaEnProceso() == 0">\
                                               <a href="javascript:void(0);" ng-click="dispensacionFormula(row.entity,1)" class= "glyphicon glyphicon-eye-open" > Pendientes </a>\
                                            </li>\
                                            <li ng-if="row.entity.mostrarPacientes()[0].mostrarFormulas()[0].getNumeroEntregaActual() > 0 ">\
                                               <a href="javascript:void(0);" ng-click="listarTodoMedicamentosDispensados(row.entity)" class = "glyphicon glyphicon-print"> Todo </a>\
                                            </li>\
                                            <li ng-if="row.entity.mostrarPacientes()[0].mostrarFormulas()[0].getNumeroEntregaActual() > 0\
                                                    && row.entity.mostrarPacientes()[0].mostrarFormulas()[0].getEstado() == 1 || row.entity.mostrarPacientes()[0].mostrarFormulas()[0].getEstado() == 2 ">\n\
                                               <a href="javascript:void(0);" ng-click="imprimirMedicamentosPendientes({evolucion: row.entity.mostrarPacientes()[0].mostrarFormulas()[0].getEvolucionId(), \n\
                                                                                       tipoIdPaciente: row.entity.mostrarPacientes()[0].getTipoIdPaciente(), \n\
                                                                                       pacienteId: row.entity.mostrarPacientes()[0].getPacienteId()})" class = "glyphicon glyphicon-print" > Pendientes</a>\
                                            </li>\
                                            <li ng-if="row.entity.mostrarPacientes()[0].mostrarFormulas()[0].getNumeroEntregaActual() > 0 ">\
                                               <a href="javascript:void(0);" ng-click="imprimirMedicamentosDispensados({evolucion: row.entity.mostrarPacientes()[0].mostrarFormulas()[0].getEvolucionId(), \n\
                                                                                       tipoIdPaciente: row.entity.mostrarPacientes()[0].getTipoIdPaciente(), \n\
                                                                                       pacienteId: row.entity.mostrarPacientes()[0].getPacienteId()},0)" class = "glyphicon glyphicon-print" > Ultima entrega</a>\
                                            </li>\
                                             <li>\
                                               <a href="javascript:void(0);" ng-click="ventanaMovimientoFormulasPaciente({tipoIdPaciente: row.entity.mostrarPacientes()[0].getTipoIdPaciente(), \n\
                                                                                       pacienteId: row.entity.mostrarPacientes()[0].getPacienteId()})" class = "glyphicon glyphicon-folder-open" > Movimiento</a>\
                                             </li>\
                                             <li >\
                                               <a href="javascript:void(0);" ng-validate-events="{{ habilitar_modificacion_producto() }}"  ng-click="ventanaAjustarEntregaFormula({evolucion: row.entity.mostrarPacientes()[0].mostrarFormulas()[0].getEvolucionId(), numero_entrega: row.entity.mostrarPacientes()[0].mostrarFormulas()[0].getNumeroEntregaActual()})" class = "glyphicon glyphicon-wrench" > Ajustar formula</a>\
                                             </li>\
                                       </ul>\
                                  </div>'
                       },
                       {field: 'mostrarPacientes()[0].mostrarFormulas()[0].getEstadoEntrega()', width: "13%", displayName: "Estado", cellClass: "txt-center",
                        cellTemplate: " <span class='text-lowercase' ng-class='agregar_clase_formula(row.entity.mostrarPacientes()[0].mostrarFormulas()[0].estadoEntrega) '> \n\
                                     {{row.entity.mostrarPacientes()[0].mostrarFormulas()[0].descripcionEstadoEntrega}}  </span>"}, 
                ]
            };

        	/***************************
        		Funcion de inicializacion
        	***************************/
            init();
            function init(){
                $scope.columnaSizeBusqueda = "col-md-3"; 
            }
        }]);
});