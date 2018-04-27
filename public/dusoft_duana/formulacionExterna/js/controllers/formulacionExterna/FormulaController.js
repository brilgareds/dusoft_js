define(["angular", "js/controllers", 'includes/slide/slideContent', "includes/classes/Empresa"], function(angular, controllers) {
    
    controllers.controller('FormulaController', ['$scope', '$rootScope', "Request", "$filter", '$state', '$modal', "API", "AlertService", 'localStorageService', "Usuario", "socket", "$timeout", "Empresa", "formulaExternaService", "Usuario", formulaController]);
    controllers.controller('ModalSeleccionarController', ['$scope', '$rootScope', "Request", "$filter", '$state', '$modal', '$modalInstance', "API", "AlertService", 'localStorageService', "Usuario", "socket", "$timeout", "Empresa", "formulaExternaService", "Usuario", seleccionarController]);
    controllers.controller('ModalLotesMedicamentosFormuladosController', ['$scope', '$rootScope', "Request", "$filter", '$state', '$modal', '$modalInstance', "API", "AlertService", 'localStorageService', "Usuario", "socket", "$timeout", "Empresa", "formulaExternaService", "Usuario", lotesMedicamentosFormuladosController]);
    controllers.controller('ModalBusquedaProductosController', ['$scope', '$rootScope', "Request", "$filter", '$state', '$modal', '$modalInstance', "API", "AlertService", 'localStorageService', "Usuario", "socket", "$timeout", "Empresa", "formulaExternaService", "Usuario", busquedaProductosController]);
    controllers.controller('ModalGenerarEntregaController', ['$scope', '$rootScope', "Request", "$filter", '$state', '$modal', '$modalInstance', "API", "AlertService", 'localStorageService', "Usuario", "socket", "$timeout", "Empresa", "formulaExternaService", "Usuario", generarEntregaController]);
    controllers.controller('ModalDispensacionFormulaExternaAutorizacionController', ['$scope', '$rootScope', "Request", "$filter", '$state', '$modal', '$modalInstance', "API", "AlertService", 'localStorageService', "Usuario", "socket", "$timeout", "Empresa", "formulaExternaService", "Usuario","detalleRegistroDispensacion","detalleFormula", dispensacionFormulaExternaAutorizacionController]);

    function formulaController($scope, $rootScope, Request, $filter, $state, $modal, API, AlertService, localStorageService, Usuario, socket, $timeout, Empresa, formulaExternaService, Usuario) {

        //Tipos de documento que se despliegan en el elemento select
        $scope.tipoDocumentos = [];
        $scope.tipoFormulas = [];
        $scope.diagnosticos = [];
        $scope.productos = [];
        $scope.root = {
            tipoDocumentoSeleccionado : {'descripcion' : 'Tipo Documento'},
            documento : '',
            paciente : {},
            formula : {
                fecha: '',
                tipoFormula : {'descripcion' : 'Tipo Formula'},
                municipio :  {'nombre' : 'Seleccionar Municipio'}
            },
            busquedaProductos :{codigoBarras:'', descripcion:'', codigoProducto: '',principioActivo:'', pagina:1},
            productosFormulados : []
        };

        /**
        * @Descripcion Consulta el paciente
        * @Param tipoIdentificacion : El tipo de identificacion
        * @Param identificacion : La identificacion
        */
        $scope.obtenerAfiliado = obtenerAfiliado;

        /**
        * @Descripcion Funcion que fija el tipo de documento seleccionado.
        * @Param: tipoDocumento: El objeto tipo de documento
        */
        $scope.onSeleccionFiltro = onSeleccionFiltro;

        /**
        * @Descripcion Funcion encargada de abrir el calendario del campo fecha
        */
        $scope.abrirFecha = abrirFecha;

        /**
        * @Descripcion Funcion para abrir el modal de municipios
        */
        $scope.abrirModal = abrirModal;

        /**
        * @Descripcion Funcion para guardar la cabecera de la formula
        */
        $scope.guardarFormulaExternaTmp = guardarFormulaExternaTmp;

        /**
        * @Descripcion Filtra items de los elementos select
        */
        $scope.buscar = buscar;
        $scope.eliminarDiagnosticoTmp = eliminarDiagnosticoTmp;
        $scope.abrirModalLotesMedicamentosFormulados = abrirModalLotesMedicamentosFormulados;
        $scope.abrirModalBusquedaMedicamentos = abrirModalBusquedaMedicamentos;
        $scope.eliminarProductoLoteSeleccionado = eliminarProductoLoteSeleccionado;
        $scope.eliminarProducto = eliminarProducto;
        $scope.abrirModalGenerarEntrega = abrirModalGenerarEntrega;
        $scope.imprimirMedicamentosPendientesPorDispensar = imprimirMedicamentosPendientesPorDispensar;
        $scope.imprimirMedicamentosDispensados = imprimirMedicamentosDispensados;
        $scope.volver = volver;
        $scope.marcar = marcar;


        /***********************************
            Definicion de funciones
        ***********************************/
        function obtenerAfiliado(tipoIdentificacion, identificacion){
            //validacion si el tipo de identificacion no esta seleccionado
            if(!tipoIdentificacion){
                AlertService.mostrarMensaje("success", 'Seleccione el tipo de identificación');
                return;
            }
            //validacion si la identificacion no ha sido digitada
            if(!identificacion){
                AlertService.mostrarMensaje("success", 'Digite una identificación.');
                return;
            }

            formulaExternaService.obtenerAfiliado(tipoIdentificacion, identificacion, function(error, afiliado){
                if(!afiliado){
                    AlertService.mostrarMensaje("warning", 'No se encontró un afiliado con identificación: ' + tipoIdentificacion + identificacion);
                    return; 
                }

                if(!error){
                    if(afiliado.mostrarPacientes()[0].getPacienteId()){
                        $scope.root.afiliado = afiliado;
                        //Si existe una formula en el temporal, se recuperan los datos;
                        obtenerTemporales(tipoIdentificacion, identificacion);
                    } else {
                        //limpiar los campos para una segunda busqueda
                        $scope.root = {
                            tipoDocumentoSeleccionado : {'descripcion' : 'Tipo Documento'},
                            documento : '',
                            paciente : {},
                            formula : {
                                tipoFormula : {'descripcion' : 'Tipo Formula'},
                                municipio : ''
                            }
                        };
                        AlertService.mostrarMensaje("success", 'No se encontró el afiliado');
                    }
                }
            });
        }

        function onSeleccionFiltro(tipoDocumento){
            $scope.root.tipoDocumentoSeleccionado = tipoDocumento;
        }

        function abrirFecha($event){
            $event.preventDefault();
            $event.stopPropagation();
            $scope.root.datepicker_fecha_inicial = true;
        }

        function abrirModal(elemento){
            $scope.opts = {
                backdropClick: true,
                dialogFade: false,
                keyboard: true,
                windowClass: 'app-modal-window-sm',
                templateUrl: 'views/formulacionExterna/modal/modalSeleccionar.html',
                scope: $scope,
                controller: "ModalSeleccionarController"
            };

            //datos para compartir con el controlador del modal
            formulaExternaService.shared = {
                elemento : elemento,
                tipo_id_paciente: $scope.root.afiliado.mostrarPacientes()[0].getTipoIdPaciente(),
                id_paciente: $scope.root.afiliado.mostrarPacientes()[0].getPacienteId()
            };

            var modalInstance = $modal.open($scope.opts);
            modalInstance.result.then(function(item){
                //item seleccionado en el modal
                if(item){
                    if(formulaExternaService.shared.elemento == 'diagnostico'){
                        //Se guarda el diagnostico seleccionado
                        var tmp_formula_id = $scope.root.formula.tmp_formula_id;
                        var tipo_id_paciente = $scope.root.afiliado.mostrarPacientes()[0].getTipoIdPaciente();
                        var paciente_id = $scope.root.afiliado.mostrarPacientes()[0].getPacienteId();
                        var diagnostico_id = item.id;

                        if(tmp_formula_id && tipo_id_paciente && paciente_id && diagnostico_id){
                            formulaExternaService.guardarDiagnosticoTmp(tmp_formula_id, tipo_id_paciente, paciente_id, diagnostico_id, function(error, data){
                                if(!error){
                                    $scope.diagnosticos.push(item);
                                } else {
                                    AlertService.mostrarMensaje("warning", 'No se guardó el diagnostico');
                                }
                            });
                        }
                    }
                }
            },function(){

            });
        }

        function abrirModalBusquedaMedicamentos(){
            $scope.opts = {
                backdropClick: true,
                dialogFade: false,
                keyboard: true,
                windowClass: 'app-modal-window-xlg',
                templateUrl: 'views/formulacionExterna/modal/busquedaProductos.html',
                scope: $scope,
                controller: "ModalBusquedaProductosController"
            };

            //datos para compartir con el controlador del modal
            formulaExternaService.shared = {
                tipo_id_paciente: $scope.root.afiliado.mostrarPacientes()[0].getTipoIdPaciente(),
                id_paciente: $scope.root.afiliado.mostrarPacientes()[0].getPacienteId()
            };

            var modalInstance = $modal.open($scope.opts);
            modalInstance.result.then(function(item){
                //obtiene los medicamentos formulados guardados en temporal
                formulaExternaService.obtenerMedicamentosTmp($scope.root.formula.tmp_formula_id, function(error, medicamentosFormuladosTmp){
                    if(!error){
                        $scope.root.productosFormulados = medicamentosFormuladosTmp;
                    }
                });

            },function(){
                //obtiene los medicamentos formulados guardados en temporal
                formulaExternaService.obtenerMedicamentosTmp($scope.root.formula.tmp_formula_id, function(error, medicamentosFormuladosTmp){
                    if(!error){
                        $scope.root.productosFormulados = medicamentosFormuladosTmp;
                    }
                });

            });
        }

        function guardarFormulaExternaTmp(){
            var tipo_id_paciente = $scope.root.afiliado.mostrarPacientes()[0].getTipoIdPaciente();
            var paciente_id = $scope.root.afiliado.mostrarPacientes()[0].getPacienteId();
            var formula_papel = $scope.root.formula.formula_papel; 
            //consulta si ya existe una formula 

            if(!$scope.root.formula.tmp_formula_id){
                formulaExternaService.consultaExisteFormula(tipo_id_paciente, paciente_id, formula_papel, function(error, existe){
                    if(error){
                        AlertService.mostrarMensaje("warning", 'Ocurrio un error consultando si la formula ya existe.');
                        return;
                    }

                    if(existe){
                        AlertService.mostrarMensaje("warning", 'La formula ' + formula_papel + ' ya existe para el paciente.');
                        return;
                    }

                    var empresa_id = Usuario.getUsuarioActual().getEmpresa().getCodigo();
                    var fecha_formula = $scope.root.formula.fecha? $scope.root.formula.fecha.getFullYear().toString() + '-' + ($scope.root.formula.fecha.getMonth() + 101).toString().slice(-2) + '-'+ ($scope.root.formula.fecha.getDate() + 100).toString().slice(-2) : false;
                    var tipo_formula = $scope.root.formula.tipoFormula.id;
                    var tipo_id_tercero = $scope.root.formula.profesional? $scope.root.formula.profesional.tipo_id_tercero: false;
                    var tercero_id = $scope.root.formula.profesional? $scope.root.formula.profesional.tercero_id : false;
                    var plan_id = $scope.root.afiliado.mostrarPlanAtencion()[0].mostrarPlanes()[0].getPlanId();
                    var rango = $scope.root.afiliado.mostrarPlanAtencion()[0].getRango();
                    var tipo_afiliado_id = $scope.root.afiliado.mostrarPlanAtencion()[0].getTipoAfiliadoId();
                    var centro_utilidad = Usuario.getUsuarioActual().getEmpresa().getCentroUtilidadSeleccionado().getCodigo();
                    var bodega = Usuario.getUsuarioActual().getEmpresa().getCentroUtilidadSeleccionado().getBodegaSeleccionada().getCodigo();
                    var tipo_pais_id = $scope.root.formula.municipio ? $scope.root.formula.municipio.tipo_pais_id : null;
                    var tipo_dpto_id = $scope.root.formula.municipio ? $scope.root.formula.municipio.tipo_dpto_id : null;
                    var tipo_mpio_id = $scope.root.formula.municipio ? $scope.root.formula.municipio.tipo_mpio_id : null;

                    if(!formula_papel || !empresa_id || !fecha_formula || !tipo_formula || !tipo_id_tercero || !tercero_id || !tipo_id_paciente || !paciente_id || !plan_id || !rango || !tipo_afiliado_id || !centro_utilidad || !bodega){
                        AlertService.mostrarMensaje("warning", 'Diligencie los campos obligatorios (*).');
                        return;
                    }

                    formulaExternaService.guardarFormulaExternaTmp(formula_papel, empresa_id, fecha_formula, tipo_formula, tipo_id_tercero, tercero_id, tipo_id_paciente, paciente_id, plan_id, rango, tipo_afiliado_id, centro_utilidad, bodega, tipo_pais_id, tipo_dpto_id, tipo_mpio_id,  function(error, tmp_formula_id){
                        if(error){
                            AlertService.mostrarMensaje("warning", 'No se guardó la formula.');
                            return;
                        }
                        //Se asigna a la formula el id de la formula insertada en base de datos 
                        $scope.root.formula.tmp_formula_id = tmp_formula_id;
                    });
                });
            }else{
                formulaExternaService.consultaExisteFormula(tipo_id_paciente, paciente_id, formula_papel, function(error, existe){
                    if(error){
                        AlertService.mostrarMensaje("warning", 'Ocurrio un error consultando si la formula ya existe.');
                        return;
                    }

                    if(existe){
                        AlertService.mostrarMensaje("warning", 'La formula ' + formula_papel + ' ya existe para el paciente.');
                        return;
                    }

                    var empresa_id = Usuario.getUsuarioActual().getEmpresa().getCodigo();
                    var fecha_formula = typeof $scope.root.formula.fecha == 'string'? $scope.root.formula.fecha : $scope.root.formula.fecha.getFullYear().toString() + '-' + ($scope.root.formula.fecha.getMonth() + 101).toString().slice(-2) + '-'+ ($scope.root.formula.fecha.getDate() + 100).toString().slice(-2);
                    var tipo_formula = $scope.root.formula.tipoFormula.id;
                    var tipo_id_tercero = $scope.root.formula.profesional? $scope.root.formula.profesional.tipo_id_tercero: false;
                    var tercero_id = $scope.root.formula.profesional? $scope.root.formula.profesional.tercero_id : false;
                    var plan_id = $scope.root.afiliado.mostrarPlanAtencion()[0].mostrarPlanes()[0].getPlanId();
                    var rango = $scope.root.afiliado.mostrarPlanAtencion()[0].getRango();
                    var tipo_afiliado_id = $scope.root.afiliado.mostrarPlanAtencion()[0].getTipoAfiliadoId();
                    var centro_utilidad = Usuario.getUsuarioActual().getEmpresa().getCentroUtilidadSeleccionado().getCodigo();
                    var bodega = Usuario.getUsuarioActual().getEmpresa().getCentroUtilidadSeleccionado().getBodegaSeleccionada().getCodigo();
                    var tipo_pais_id = $scope.root.formula.municipio ? $scope.root.formula.municipio.tipo_pais_id : null;
                    var tipo_dpto_id = $scope.root.formula.municipio ? $scope.root.formula.municipio.tipo_dpto_id : null;
                    var tipo_mpio_id = $scope.root.formula.municipio ? $scope.root.formula.municipio.tipo_mpio_id : null;

                    if(!formula_papel || !empresa_id || !fecha_formula || !tipo_formula || !tipo_id_tercero || !tercero_id || !tipo_id_paciente || !paciente_id || !plan_id || !rango || !tipo_afiliado_id || !centro_utilidad || !bodega){
                        AlertService.mostrarMensaje("warning", 'Diligencie los campos obligatorios (*).');
                        return;
                    }

                    formulaExternaService.actualizarFormulaExternaTmp($scope.root.formula.tmp_formula_id, formula_papel, empresa_id, fecha_formula, tipo_formula, tipo_id_tercero, tercero_id, tipo_id_paciente, paciente_id, plan_id, rango, tipo_afiliado_id, centro_utilidad, bodega, tipo_pais_id, tipo_dpto_id, tipo_mpio_id,  function(error, tmp_formula_id){
                        if(error){
                            AlertService.mostrarMensaje("warning", 'No se guardó la formula.');
                            return;
                        }
                        AlertService.mostrarMensaje("success", 'Formula actualizada.');
                        //Se asigna a la formula el id de la formula insertada en base de datos 
                        //$scope.root.formula.tmp_formula_id = tmp_formula_id;
                    });
                });
            }
        }

        function buscar(elemento, term){
            if(term.length >= 3){
                if(elemento == 'municipio'){
                    formulaExternaService.obtenerMunicipios(term, function(error, municipios){
                        if(!error){
                            $scope.municipios = municipios;
                        }
                    });
                }

                if(elemento == 'profesional'){
                    formulaExternaService.obtenerProfesionales(term, function(error, profesionales){
                        if(!error){
                            $scope.profesionales = profesionales;
                        }
                    });
                }
            }
        }

        function obtenerTemporales(tipoIdPaciente, idPaciente){
            //obtiene temporal de formula externa (esm_formula_externa_tmp)
            formulaExternaService.obtenerFormulaExternaTmp(tipoIdPaciente, idPaciente, function(error, formulaExternaTmp){
                if(error || !formulaExternaTmp){
                    return;
                }

                $scope.root.formula = formulaExternaTmp;
                //Se obtienen los diagnosticos de la formula
                if($scope.root.formula.tmp_formula_id){
                    //obtiene los diagnosticos guardados en temporal
                    formulaExternaService.obtenerDiagnosticosTmp($scope.root.formula.tmp_formula_id, function(error, diagnosticos){
                        if(!error){
                            $scope.diagnosticos = diagnosticos;
                        }
                    });
                    //obtiene los medicamentos formulados guardados en temporal
                    formulaExternaService.obtenerMedicamentosTmp($scope.root.formula.tmp_formula_id, function(error, medicamentosFormuladosTmp){
                        if(!error){
                            $scope.root.productosFormulados = medicamentosFormuladosTmp;
                        }
                    });

                    formulaExternaService.obtenerDispensacionMedicamentosTmp($scope.root.formula.tmp_formula_id, null, function(error, medicamentosLotesDispensacion){
                        if(!error){
                            $scope.root.productosLotesSeleccionados = medicamentosLotesDispensacion;
                        }
                    });
                    //productosLotesSeleccionados
                }else{
                    $scope.diagnosticos = [];
                    $scope.root.productosFormulados = [];
                    $scope.root.productosLotesSeleccionados = [];
                }
            });
        }

        function eliminarDiagnosticoTmp(tmp_formula_id, diagnostico_id){
            formulaExternaService.eliminarDiagnosticoTmp(tmp_formula_id, diagnostico_id, function(error, data){
                if(!error){
                    //elimina el diagnostico del array diagnosticos
                    $scope.diagnosticos.forEach(function(obj, index){
                        if(obj.id == diagnostico_id){
                            $scope.diagnosticos.splice(index, 1);
                        }
                    });
                }
            });
        }

        function abrirModalLotesMedicamentosFormulados(producto){
            var existencia = parseInt(producto.existencia);
            if(existencia == 0){
                AlertService.mostrarMensaje("warning", 'Producto sin existencias');
                return;
            }

            $scope.opts = {
                backdropClick: true,
                dialogFade: false,
                keyboard: true,
                windowClass: 'app-modal-window-xlg',
                templateUrl: 'views/formulacionExterna/modal/lotesMedicamentosFormulados.html',
                scope: $scope,
                controller: "ModalLotesMedicamentosFormuladosController"
            };

            //datos para compartir con el controlador del modal
            formulaExternaService.shared = {
                producto: producto,
                tipo_id_paciente: $scope.root.afiliado.mostrarPacientes()[0].getTipoIdPaciente(),
                paciente_id: $scope.root.afiliado.mostrarPacientes()[0].getPacienteId(),
                tmp_formula_id : $scope.root.formula.tmp_formula_id
            };

            var modalInstance = $modal.open($scope.opts);
            modalInstance.result.then(function(item){
                //cuando se cierra el modal se recarga la grilla de medicamentos formulados
                formulaExternaService.obtenerMedicamentosTmp($scope.root.formula.tmp_formula_id, function(error, medicamentosFormuladosTmp){
                    if(!error){
                        $scope.root.productosFormulados = medicamentosFormuladosTmp;
                    }
                });
                //cuando se cierra el modal se recarga la grilla de medicamentos dispensados
                formulaExternaService.obtenerDispensacionMedicamentosTmp($scope.root.formula.tmp_formula_id, null,function(error, medicamentosLotesDispensacion){
                    if(!error){
                        $scope.root.productosLotesSeleccionados = medicamentosLotesDispensacion;
                    }
                });
            },function(){
                //cuando se cierra el modal se recarga la grilla de medicamentos formulados
                formulaExternaService.obtenerMedicamentosTmp($scope.root.formula.tmp_formula_id, function(error, medicamentosFormuladosTmp){
                    if(!error){
                        $scope.root.productosFormulados = medicamentosFormuladosTmp;
                    }
                });
                //cuando se cierra el modal se recarga la grilla de medicamentos dispensados
                formulaExternaService.obtenerDispensacionMedicamentosTmp($scope.root.formula.tmp_formula_id, null,function(error, medicamentosLotesDispensacion){
                    if(!error){
                        $scope.root.productosLotesSeleccionados = medicamentosLotesDispensacion;
                    }
                });
            });
        }

        function eliminarProductoLoteSeleccionado(esm_dispen_tmp_id){
            if(!esm_dispen_tmp_id){
                return;
            }
            formulaExternaService.eliminarDispensacionMedicamentoTmp(esm_dispen_tmp_id, function(error, data){
                if(error){
                    AlertService.mostrarMensaje("warning", 'Error eliminando el temporal.');
                    return;
                }
                //Elimina del arreglo el "producto lote seleccionado"
                $scope.root.productosLotesSeleccionados.forEach(function(obj, index){
                    if(esm_dispen_tmp_id == obj.esm_dispen_tmp_id){
                        $scope.root.productosLotesSeleccionados.splice(index, 1);
                    }
                });

                //recarga la grilla de medicamentos formulados
                formulaExternaService.obtenerMedicamentosTmp($scope.root.formula.tmp_formula_id, function(error, medicamentosFormuladosTmp){
                    if(!error){
                        $scope.root.productosFormulados = medicamentosFormuladosTmp;
                    }
                });
            });
        }

        function eliminarProducto(fe_medicamento_id){
            formulaExternaService.eliminarMedicamentoTmp(fe_medicamento_id, function(error, data){
                if(!error){
                    $scope.root.productosFormulados.forEach(function(obj, index){
                        if(obj.fe_medicamento_id == fe_medicamento_id){
                            $scope.root.productosFormulados.splice(index, 1);
                        }
                    });
                    //recarga grilla medicamentos temporales
                    formulaExternaService.obtenerDispensacionMedicamentosTmp($scope.root.formula.tmp_formula_id, null, function(error, medicamentosLotesDispensacion){
                        if(!error){
                            $scope.root.productosLotesSeleccionados = medicamentosLotesDispensacion;
                        }
                    });
                }
            });
        }


        function abrirModalGenerarEntrega(){
            $scope.opts = {
                backdropClick: true,
                dialogFade: false,
                keyboard: true,
                windowClass: 'app-modal-window-sm',
                templateUrl: 'views/formulacionExterna/modal/dispensacionRealizarEntrega.html',
                scope: $scope,
                controller: "ModalGenerarEntregaController"
            };
            //datos para compartir con el controlador del modal
            /*formulaExternaService.shared = {
                tipoEntrega: tipoEntrega
            };*/

            var modalInstance = $modal.open($scope.opts);
            modalInstance.result.then(function(item){
                //cierra el modal 
            },function(){
            });
        }

        function imprimirMedicamentosPendientesPorDispensar(formula_id){
            formulaExternaService.imprimirMedicamentosPendientesPorDispensar(formula_id, function(error, resultado){
                $scope.visualizarReporte("/reports/" + resultado.listar_medicamentos_pendientes.nombre_pdf, resultado.listar_medicamentos_pendientes.nombre_pdf, "_blank");
            });
        }

        function imprimirMedicamentosDispensados(formula_id, imprimir_actual_o_todo){
            formulaExternaService.imprimirMedicamentosDispensados(formula_id, imprimir_actual_o_todo, function(error, resultado){
                $scope.visualizarReporte("/reports/" + resultado.listar_medicamentos_pendientes.nombre_pdf, resultado.listar_medicamentos_pendientes.nombre_pdf, "_blank");
            });
        }

        function volver(){
            $state.go('FormulacionExterna');
        }

        function marcar(fe_medicamento_id, sw_marcado){
            formulaExternaService.marcar(fe_medicamento_id, sw_marcado , function(error, resultado){
                if(error){
                    AlertService.mostrarMensaje("warning", 'Error al marcar el medicamento');
                }

                formulaExternaService.obtenerMedicamentosTmp($scope.root.formula.tmp_formula_id, function(error, medicamentosFormuladosTmp){
                    if(!error){
                        $scope.root.productosFormulados = medicamentosFormuladosTmp;
                    }
                });
            });
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
            //inicializa variables de $scope necesarias para la busqueda de productos
            $scope.empresa_id = Usuario.getUsuarioActual().getEmpresa().getCodigo();
            $scope.centro_utilidad = Usuario.getUsuarioActual().getEmpresa().getCentroUtilidadSeleccionado().getCodigo();
            $scope.bodega = Usuario.getUsuarioActual().getEmpresa().getCentroUtilidadSeleccionado().getBodegaSeleccionada().getCodigo();

            //inicia grilla de productos formulados
            $scope.lista_productos_seleccionados = {
                data: 'root.productosFormulados',
                enableColumnResize: true,
                enableRowSelection: false,
                columnDefs: [
                    {field: 'codigo_producto', displayName: 'Codigo', width: "10%"},
                    {field: 'molecula', displayName: 'Medicamento', width: "50%"},
                    {field: 'cantidad', displayName: 'Cantidad', width: "10%", cellClass: "txt-center"},
                    {field: 'cantidad_despachada', displayName: 'Despachado', width: "10%", cellClass: "txt-center"},
                    {field: 'cantidad_pendiente', displayName: 'Pendiente', width: "10%", cellClass: "txt-center"},
                    {field: 'opciones', displayName : 'Opciones', width : '10%' , cellClass: "txt-center", cellTemplate : '<div class="col-xs-12">\
                          <button type="submit" class="btn btn-danger btn-xs" ng-click="eliminarProducto(row.entity.fe_medicamento_id)" style="padding: 3px 7px;"><i class="glyphicon glyphicon-remove"></i></button>\
                          <button type="submit" class="btn btn-success btn-xs" ng-if="row.entity.sw_marcado == \'0\'" ng-disabled="row.entity.cantidad_pendiente == 0" ng-click="abrirModalLotesMedicamentosFormulados(row.entity)" style="padding: 3px 7px;"><i class="glyphicon glyphicon-th-list"></i></button>\
                          <button type="submit" class="btn btn-success btn-xs" ng-if="row.entity.sw_marcado == \'0\' && row.entity.cantidad_pendiente != \'0\'" ng-click="marcar(row.entity.fe_medicamento_id, \'1\')" style="padding: 3px 7px;">Marcar</button>\
                          <button type="submit" class="btn btn-warning btn-xs" ng-if="row.entity.sw_marcado == \'1\' && row.entity.cantidad_pendiente != \'0\'" ng-click="marcar(row.entity.fe_medicamento_id, \'0\')" style="padding: 3px 7px;">Desmarcar</button>\
                    </div>'}
                ]
            };
            /*<i class="glyphicon glyphicon-ok-circle"></i> <i class="glyphicon glyphicon-remove-circle"></i>
           btn btn-default btn-xs */
            //lista_productos_lotes_seleccionados 
            $scope.lista_productos_lotes_seleccionados = {
                data: 'root.productosLotesSeleccionados',
                enableColumnResize: true,
                enableRowSelection: false,
                columnDefs: [
                    {field: 'codigo_producto', displayName: 'Codigo', width: "10%"},
                    {field: 'molecula', displayName: 'Medicamento', width: "50%"},
                    {field: 'cantidad_despachada', displayName: 'Cantidad', width: "10%", cellClass: "txt-center"},
                    {field: 'fecha_vencimiento', displayName: 'Fecha vencimiento', width: "10%", cellClass: "txt-center"},
                    {field: 'lote', displayName: 'Lote', width: "10%", cellClass: "txt-center"},
                    {field: 'opciones', displayName : 'Opciones', width : '10%' , cellClass: "txt-center", cellTemplate : '<div class="col-xs-12">\
                          <button type="submit" class="btn btn-danger btn-xs" ng-click="eliminarProductoLoteSeleccionado(row.entity.esm_dispen_tmp_id)" style="padding: 3px 7px;"><i class="glyphicon glyphicon-remove"></i></button>\
                    </div>'}
                ]
            };
        }

        init();
    }

/****************************************** CONTROLLER SELECCIONAR ********************************************/
    function seleccionarController($scope, $rootScope, Request, $filter, $state, $modal, $modalInstance, API, AlertService, localStorageService, Usuario, socket, $timeout, Empresa, formulaExternaService, Usuario) {
        //Modelo que contiene el termino de busqueda
        $scope.term = '';
        $scope.codigo = '';
        $scope.esDiagnostico = false;
        /**
        * @Descripcion Busca municipios cuyo nombre sea como el parametro pasado a la funcion
        * @Param term:  El termino de busqueda.
        */
        $scope.buscar= buscar;
        /**
        * @Descripcion Busca municipios cuyo nombre sea como el parametro pasado a la funcion
        */
        $scope.seleccionar= seleccionar;

        $scope.elemento = formulaExternaService.shared.elemento;
        if($scope.elemento == 'diagnostico'){
            $scope.esDiagnostico = true;
        }

        function buscar(elemento, term){
            term = term? term : '';

            if(term.length >= 3 || $scope.codigo.length >=3){
                if(elemento == 'diagnostico'){
                    var tipo_id_paciente = formulaExternaService.shared.tipo_id_paciente;
                    var paciente_id = formulaExternaService.shared.id_paciente;
                    var codigo = $scope.codigo;

                    formulaExternaService.obtenerDiagnosticos(tipo_id_paciente, paciente_id, codigo, term ,function(error, diagnosticos){
                        if(!error){
                            $scope.items = diagnosticos;
                        }
                    });
                }
            }
        }

        function seleccionar(item){
            $modalInstance.close(item);
        }
    }

/****************************************** CONTROLLER MEDICAMENTOS FORMULADOS DISPENSACION ********************************************/
    function lotesMedicamentosFormuladosController($scope, $rootScope, Request, $filter, $state, $modal, $modalInstance, API, AlertService, localStorageService, Usuario, socket, $timeout, Empresa, formulaExternaService, Usuario) {
        $scope.data = {
            //inicializan cuando se carga el modal en la funcion init()
            empresa_id : '',
            centro_utilidad : '',
            bodega : '',
            producto : '',
            tmp_formula_id : '',
            productos : '',
        };

        $scope.estadosLotesProxVencer = [
            "btn btn-warning btn-xs",
            "btn btn-danger btn-xs",
            "btn btn-success btn-xs",
            "btn btn-info btn-xs", 
            "btn btn-danger btn-xs",
            "btn btn-warning btn-xs",
            "btn btn-primary btn-xs",
            "btn btn-primary btn-xs",
            "btn btn-info btn-xs",
            "btn btn-warning btn-xs",
            "btn btn-warning btn-xs"
        ];

        $scope.agregarClaseLoteProxVencer = agregarClaseLoteProxVencer;
        $scope.cerrarVentanaDispensacionFormula = cerrarVentanaDispensacionFormula;
        $scope.adicionarEliminarDispensacionMedicamento = adicionarEliminarDispensacionMedicamento;
        $scope.ventanaAutorizaDispensacion = ventanaAutorizaDispensacion;

        function agregarClaseLoteProxVencer (estado) {
            return $scope.estadosLotesProxVencer[estado];
        }

        function cerrarVentanaDispensacionFormula () {
            //that.consultarMedicamentosTemporales();
            /**
            * +Descripcion Se valida si los productos formulados son pendientes
            */
            /*if(resultadoStorage.pendientes === 1){
               that.listarMedicamentosFormuladosPendientes(resultadoStorage);
            }
            if(resultadoStorage.pendientes === 0){
               that.listarMedicamentosFormulados(resultadoStorage);
            }*/
            
            $modalInstance.close();
        }

        function adicionarEliminarDispensacionMedicamento (medicamentoLote){
            if(!medicamentoLote.loteSeleccionado){
                if(parseInt(medicamentoLote.cantidad_despachada) <= 0 || !medicamentoLote.cantidad_despachada){
                    AlertService.mostrarMensaje("warning", 'Digite la cantidad.');
                    medicamentoLote.loteSeleccionado = true;
                    return;
                }

                formulaExternaService.insertarDispensacionMedicamentoTmp($scope.data.empresa_id, $scope.data.centro_utilidad, $scope.data.bodega, medicamentoLote.codigo_producto, medicamentoLote.cantidad_despachada, medicamentoLote.lotes[0].fecha_vencimiento, medicamentoLote.lotes[0].codigo_lote, $scope.data.tmp_formula_id, $scope.data.formula_id, $scope.data.producto.cantidad, function(error, esm_dispen_tmp_id){
                    if(error){
                        AlertService.mostrarMensaje("warning", esm_dispen_tmp_id);
                        medicamentoLote.loteSeleccionado = false;
                        return;
                    }
                    //se fija el id de la dispensacion guardada
                    medicamentoLote.esm_dispen_tmp_id = esm_dispen_tmp_id;
                    //fija la nueva cantidad pendiente
                    $scope.data.producto.cantidad_pendiente = parseFloat($scope.data.producto.cantidad_pendiente) - parseFloat(medicamentoLote.cantidad_despachada);
                });
            }else{
                formulaExternaService.eliminarDispensacionMedicamentoTmp(medicamentoLote.esm_dispen_tmp_id, function(error, resultado){
                    if(error){
                        AlertService.mostrarMensaje("warning", "Error eliminando la dispensación");
                        return;
                    }
                    medicamentoLote.loteSeleccionado = false;
                    //fija la nueva cantidad pendiente
                    $scope.data.producto.cantidad_pendiente = parseFloat($scope.data.producto.cantidad_pendiente) + parseFloat(medicamentoLote.cantidad_despachada);
                    medicamentoLote.cantidad_despachada = 0;
                });
            }
        }

        function ventanaAutorizaDispensacion(ultimoRegistroDispensacion, entity){ 
            $scope.opts = {
                backdrop: true,
                backdropClick: true,
                dialogFade: true,
                keyboard: true,
                templateUrl: '../DispensacionHc/views/dispensacionHc/dispensarAutorizaDispensacion.html',
                scope: $scope,                  
                controller: "ModalDispensacionFormulaExternaAutorizacionController",
                resolve: {
                        detalleRegistroDispensacion: function() {
                            return ultimoRegistroDispensacion;
                        },                     
                        detalleFormula: function(){
                            return entity;
                        }
                    }           
            };
            var modalInstance = $modal.open($scope.opts);   
           
            modalInstance.result.then(function(resultado){
                if(!resultado){
                    $scope.cerrarVentanaDispensacionFormula();
                    return;
                }
                //Si el medicamento fue autorizado, se refresca la propiedad dle objeto producto y se reinicia "init()" el modal para que recupere los lotes.
                if(resultado.sw_autorizado){
                    formulaExternaService.shared.producto.sw_autorizado = '1';
                }
                init();
            },function(){});                          
                
        };

        //inicializacion del modal
        function init(){
            $scope.data.empresa_id = Usuario.getUsuarioActual().getEmpresa().getCodigo();
            $scope.data.centro_utilidad = Usuario.getUsuarioActual().getEmpresa().getCentroUtilidadSeleccionado().getCodigo();
            $scope.data.bodega = Usuario.getUsuarioActual().getEmpresa().getCentroUtilidadSeleccionado().getBodegaSeleccionada().getCodigo();
            $scope.data.producto = formulaExternaService.shared.producto;
            $scope.data.tmp_formula_id = formulaExternaService.shared.tmp_formula_id? formulaExternaService.shared.tmp_formula_id : null;
            $scope.data.formula_id = formulaExternaService.shared.formula_id? formulaExternaService.shared.formula_id : null;
            $scope.data.tipo_id_paciente = formulaExternaService.shared.tipo_id_paciente;
            $scope.data.paciente_id =  formulaExternaService.shared.paciente_id;
            //si la existencia es cero no hacer la consulta de lotes
            //obtiene el producto con los lotes del producto 
            //grilla de lotes 
            $scope.listaLotes = {
                data: 'data.productos',
                enableColumnResize: true,
                enableRowSelection: false,
                enableCellSelection: true,
                enableHighlighting: true,
                showTreeExpandNoChildren: true,
                columnDefs: [
                    {field: 'getCodigoProducto()', displayName: 'Codigo', width:"10%"},
                    {field: 'getDescripcion()', displayName: 'Descripcion'},
                    {field: 'getConcentracion()', displayName: 'Concentracion', width:"10%"},
                    {field: 'getCodigoFormaFarmacologico()', displayName: 'F.Farmacologica', width:"10%"},
                    {field: 'getLaboratorio()', displayName: 'Laboratorio', width:"10%"},
                    {field: 'mostrarLotes()[0].getCodigo()', displayName: 'Lote', width:"10%"},
                    {field: 'fecha_vencimiento', width: "10%", displayName: 'Fecha vencimiento',
                        cellTemplate: '<div class="col-xs-12 "> \
                                            <input type="label" ng-model="row.entity.lotes[0].fecha_vencimiento" validacion-numero-entero class="form-control grid-inline-input" name="" id="" ng-class="agregarClaseLoteProxVencer(row.entity.estadoProductoVencimiento)"/>"\
                                        </div>'},
                    {field: 'mostrarLotes()[0].getCantidad()', displayName: 'Existencia', width:"10%"},
                    {field: 'cantidad_solicitada', width: "7%", displayName: 'Cantidad',
                        cellTemplate: '<div class="col-xs-12 "> \
                                            <input type="text" ng-model="row.entity.cantidad_despachada"  validacion-numero-entero ng-disabled="row.entity.loteSeleccionado" class="form-control grid-inline-input" name="" id="" ng-disabled="row.entity.estadoProductoVencimiento == 1" ng-class=""/>\
                                        </div>'},

                    {field: 'Sel', width: "10%",
                        displayName: "Dispensar",
                        cellClass: "txt-center",
                        cellTemplate: '<div class="row">\
                                          <input-check ng-model="row.entity.loteSeleccionado" ng-click="adicionarEliminarDispensacionMedicamento(row.entity)" ng-disabled="row.entity.estadoProductoVencimiento == 1"></input-check>\
                                          <button class="btn btn-default btn-xs" ng-click="cerrarVentanaDispensacionFormula()" ng-disabled ="showBtnDispensar ">Cerrar  </button>\
                                        </div>'
                    },
                ]
            };

            formulaExternaService.obtenerLotesDeProducto($scope.data.empresa_id, $scope.data.centro_utilidad, $scope.data.bodega, $scope.data.producto.codigo_producto, $scope.data.tmp_formula_id, $scope.data.tipo_id_paciente, $scope.data.paciente_id, $scope.data.producto.principio_activo, $scope.data.producto.sw_autorizado, function(error, data){
                //medicamento ya fue entregado en menos de 25 dias
                if(error == 204){
                    formulaExternaService.usuarioPrivilegios($scope.data.empresa_id, $scope.data.centro_utilidad, $scope.data.bodega, function(error, privilegios){
                        if(privilegios.sw_privilegio_autorizar_confrontado){
                            //mostrar modal para autorizacion la dispensacion
                            $scope.ventanaAutorizaDispensacion(data, $scope.data.producto);
                            return;
                        }else{
                            AlertService.mostrarVentanaAlerta("Mensaje del sistema", "El usuario no posee privilegios para autorizar la dispensacion");   
                            $scope.cerrarVentanaDispensacionFormula();
                            return;
                        }
                    });
                }
                $scope.data.productos = data;
            });
        }

        init();
    }


/****************************************** CONTROLLER BUSQUEDA PRODUCTOS ********************************************/
    function busquedaProductosController($scope, $rootScope, Request, $filter, $state, $modal, $modalInstance, API, AlertService, localStorageService, Usuario, socket, $timeout, Empresa, formulaExternaService, Usuario) {
        $scope.buscarProductos = buscarProductos;
        $scope.adicionarProducto = adicionarProducto;

        $scope.reiniciarPagina = reiniciarPagina;
        $scope.limpiarCampos = limpiarCampos;
        $scope.cerrar = cerrar;

        function buscarProductos(empresa_id, centro_utilidad, bodega_id, principio_activo, descripcion, codigo_barras, pagina){
            if(empresa_id && centro_utilidad && bodega_id && pagina && ( principio_activo || descripcion || codigo_barras)){
                if(pagina > 0){
                    formulaExternaService.buscarProductos(empresa_id, centro_utilidad, bodega_id, principio_activo, descripcion, codigo_barras, pagina, function(error, productos){
                        if(!error){
                            $scope.productos = productos;
                        }
                    });
                } else {
                    $scope.root.busquedaProductos.pagina = 1;
                }
            }else{
                AlertService.mostrarMensaje("warning", 'Diligencie alguno de los campos de busqueda.');
            }
        }

        function adicionarProducto(tmp_formula_id, tipo_id_paciente, paciente_id, producto){
            if(!producto.cantidad){
                AlertService.mostrarMensaje("warning", 'Digite la cantidad solicitada.');
                return;
            }
            formulaExternaService.insertarMedicamentoTmp(tmp_formula_id, producto.codigo_producto, producto.cantidad, 25, 4, tipo_id_paciente, paciente_id, function(error, fe_medicamento_id){
                //se fija el id que retorna le medicamento
                producto.fe_medicamento_id = fe_medicamento_id;
                producto.cantidad_despachada = 0;
                producto.cantidad_pendiente = producto.cantidad;

                AlertService.mostrarMensaje("success", 'Producto agregado');
                //Abre el modal de lotes, para seleccionar los lotes del producto
                $scope.abrirModalLotesMedicamentosFormulados(producto);
                return;
                //recarga los productos formulados
                /*formulaExternaService.obtenerMedicamentosTmp($scope.root.formula.tmp_formula_id, function(error, medicamentosFormuladosTmp){
                    if(!error){
                        $scope.root.productosFormulados = medicamentosFormuladosTmp;
                    }
                });*/
            });
            $scope.root.productosFormulados.push(producto);
        }

        function reiniciarPagina(){
            $scope.root.busquedaProductos.pagina=1;
        }

        function limpiarCampos(){
            $scope.productos = [];
            $scope.root.busquedaProductos.codigoProducto = '';
            $scope.root.busquedaProductos.codigoBarras = '';
            $scope.root.busquedaProductos.descripcion = '';
            $scope.root.busquedaProductos.principioActivo = '';
        }

        function cerrar(){
            $modalInstance.close();
        }
                                     /*  {field: 'Ajuste', width: "7%", displayName: 'Ajuste',
                    cellTemplate: '<div class="col-xs-12 " > \
                                  <input type="text" \
                                   ng-model="row.entity.mostrarPacientes()[0].mostrarFormulas()[0].numeroEntregaActual" \
                                   validacion-numero-entero \
                                   class="form-control grid-inline-input" \
                                   name="" \
                                   id="" \
                                   ng-disabled="!root.opciones.sw_ajustar_entrega_formula" ng-class=""\n\
                                    /> </div>'},*/

        //funcion inicializadora del modulo
        function init(){
            //inicializa grilla de busqueda de productos
            $scope.lista_productos = {
                data: 'productos',
                enableColumnResize: true,
                enableRowSelection: false,
                columnDefs: [
                    {field: 'codigo_producto', displayName: 'Codigo producto', width: "10%"},
                    {field: 'descripcion', displayName: 'Descripcion', width : '39%'},
                    {field: 'existencia', displayName: 'Existencia', width: "6%", cellClass: "txt-center",},
                    {field: 'molecula', displayName: 'Molecula', width: "27%"},
                    {field: 'cantidad', displayName: 'Cantidad', width: "10%", cellClass: "txt-center", cellTemplate: '<div class="col-xs-12 "><input type="text" ng-model="row.entity.cantidad" validacion-numero-entero class="form-control grid-inline-input" name="" id="" ng-class=""/></div>'},
                    {field: 'opciones', displayName : 'Opciones', width : '8%' , cellClass: "txt-center", cellTemplate : '<div class="col-xs-12"><button type="submit" class="btn btn-success btn-xs" ng-click="adicionarProducto(root.formula.tmp_formula_id, root.afiliado.mostrarPacientes()[0].getTipoIdPaciente(), root.afiliado.mostrarPacientes()[0].getPacienteId(),row.entity)" style="padding: 3px 7px;"><i class="glyphicon glyphicon-plus"></i></button></div>'}
                ]
            };
        }

        init();
    }

/****************************************** CONTROLLER GENERAR ENTREGA ********************************************/
    function generarEntregaController($scope, $rootScope, Request, $filter, $state, $modal, $modalInstance, API, AlertService, localStorageService, Usuario, socket, $timeout, Empresa, formulaExternaService, Usuario){
        $scope.cerrarVentana  = cerrarVentana;
        $scope.generarEntrega = generarEntrega;
        $scope.root.observacion = '';

        function cerrarVentana() {
            $modalInstance.close();
        }

        function generarEntrega(tmp_formula_id, formula_id, observacion, empresa_id, centro_utilidad, bodega, plan) {
            //Valida todo_pendiente {si ningun medicamento fue dispensado todo_pendiente = 1 | si algun medicamento fue dispensado todo_pendiente = 0}
            var todo_pendiente = $scope.root.productosLotesSeleccionados.length == 0? 1 : 0;
            if(tmp_formula_id){
                var observacion = observacion + " No. Formula: " + $scope.root.formula.formula_papel + " Paciente " + $scope.root.afiliado.mostrarPacientes()[0].getTipoIdPaciente() + $scope.root.afiliado.mostrarPacientes()[0].getPacienteId() + " " + $scope.root.afiliado.mostrarPacientes()[0].getNombres() + " " + $scope.root.afiliado.mostrarPacientes()[0].getApellidos();
                formulaExternaService.generarEntrega(tmp_formula_id, observacion, todo_pendiente, empresa_id, centro_utilidad, bodega, plan,function(error, data){
                    if(error){
                        AlertService.mostrarMensaje("warning", data);
                        return;
                    }
                    //Genera la impresion de medicamentos dispensados
                    if(!todo_pendiente){
                        $scope.imprimirMedicamentosDispensados(data.formula_id, true);
                    }
                    //Genera la impresion de medicamentos pendientes por dispensar
                    if(data.generoPendientes){
                        $scope.imprimirMedicamentosPendientesPorDispensar(data.formula_id);
                    }
                    //vuelve a formulacion externa pantalla principal
                    formulaExternaService.shared = {
                        formula_id : data.formula_id
                    };

                    $scope.volver();
                    $modalInstance.close();
                });
            }else{
                //entrega de pendientes
                formulaExternaService.generarEntregaPendientes(formula_id, observacion, todo_pendiente, empresa_id, centro_utilidad, bodega, plan, function(error, data){
                    if(error){
                        AlertService.mostrarMensaje("warning", "Error al momento de generar la entrega de pendientes");
                        return;
                    }

                    $scope.imprimirMedicamentosPendientesDispensados(formula_id, true);

                    $scope.volver();
                    $modalInstance.close();
                });
            }
        }
        //inicializa el modal
        function init(){
            if($scope.root.afiliado){
                $scope.plan_id = $scope.root.afiliado.mostrarPlanAtencion()[0].mostrarPlanes()[0].getPlanId();
            }

            $scope.medicamentosTemporales = {
                data: 'root.productosLotesSeleccionados',
                enableColumnResize: true,
                enableRowSelection: false,
                enableCellSelection: true,
                enableHighlighting: true,
                columnDefs: [
                    {field: 'molecula', displayName: 'Medicamento'},
                    {field: 'cantidad_despachada', displayName: 'Cantidad', width:"20%"}
                ]
            };
        }

        init();
    }

/****************************************** CONTROLLER AUTORIZACION ENTREGA MEDICAMENTO ********************************************/
    function dispensacionFormulaExternaAutorizacionController($scope, $rootScope, Request, $filter, $state, $modal, $modalInstance, API, AlertService, localStorageService, Usuario, socket, $timeout, Empresa, formulaExternaService, Usuario, detalleRegistroDispensacion, detalleFormula){
        var that = this;
        var empresa = angular.copy(Usuario.getUsuarioActual().getEmpresa());              
        var seleccionTipoObservacion;
        $scope.root = { observacion:''}; 
       
        $scope.detalleRegistroDispensacion = detalleRegistroDispensacion.msj[0];
        /*
         * Inicializacion de variables
         * @param {type} empresa
         * @param {type} callback
         * @returns {void}
         */
        that.init = function(empresa, callback) {
            $scope.session = {
                usuario_id: Usuario.getUsuarioActual().getId(),
                auth_token: Usuario.getUsuarioActual().getToken()
            };
            callback();
        };
        
        that.tipoObservacionConfrontado = function(){
              var tipoObservacion = [];                
              var data = [ {descripcion: "Entrega tarde"},
                           {descripcion: "Aumento de dosis"},
                           {descripcion: "No cumple el tiempo de tratamiento"}];
            for(var i in data){                
                tipoObservacion.push(data[i]);
            }                  
            return tipoObservacion;
        };
        /**
        * @author Cristian Ardila
        * @fecha 09/06/2016 (MM/DD/YYYY)
        * +Descripcion Metodo el cual invocara el servicio que consulta
        *              todos los tipos de formulas
        * */
        that.listarTipoObservacion = function(){
           $scope.tipoObservacion =  that.tipoObservacionConfrontado();
        };
        
        /**
         * @author Cristian Ardila
         * +Descripcion Se visualiza la tabla con los tipos de formulas
         * @fecha 25/05/2016
         */
        $scope.listaTipoObservacion = {
            data: 'tipoObservacion',
            afterSelectionChange: function(rowItem) {
                    if (rowItem.selected) {
                        that.onSeleccionTipoObservacion(rowItem.entity);
                    }else{
                        that.onSeleccionTipoObservacion(undefined);
                    }
                },
            enableColumnResize: true,
            enableRowSelection: true,
            keepLastSelected: false,
            multiSelect: false,
            columnDefs: [
                {field: 'descripcion', displayName: 'Descripcion'},              
            ],
        };
         
        that.onSeleccionTipoObservacion = function(entity){
            seleccionTipoObservacion = entity;
        };
        
        /*
         * +Descripcion Metodo encargado de realizar la autorizacion del producto
         *              confrontado y emitir un evento para que se desplegue la ventana
         *              con los lotes
         * @fecha 2016-10-13 YYYY-MM-DD
         */
        that.realizarEntregaFormula = function(){
            var resultadoStorage = localStorageService.get("dispensarFormulaDetalle");
           
            formulaExternaService.autorizarMedicamento(detalleFormula.fe_medicamento_id, seleccionTipoObservacion.descripcion, function(error, respuesta){
                if(!error){
                    that.cerrarVentana({sw_autorizado : true});
                } else {
                    that.cerrarVentana({sw_autorizado : false});
                    AlertService.mostrarVentanaAlerta("Mensaje del sistema", "Error en la autorizacion");
                }
            });
        };
        
        $scope.realizarAutorizacionDispensacion = function(){
            if(!seleccionTipoObservacion){
                AlertService.mostrarVentanaAlerta("Mensaje del sistema", "Debe seleccionar el tipo de observacion");
                return;
            }
            
            AlertService.mostrarVentanaAlerta("Mensaje del sistema",  "Desea autorizar la dispensacion del medicamento?",
                function(estado){
                    if(estado){
                       that.realizarEntregaFormula();
                    }
                }
            );
        };
        
        /**
         * @author Cristian Ardila
         * +Descripcion Metodo encargado de cerrar la ventana actual
         * @fecha 09/06/2016 (DD/MM/YYYY)
         */
        $scope.cerrarVentana = function(){
            $modalInstance.close();
        };
        
        that.cerrarVentana = function(data){
            $modalInstance.close(data);
        }

        that.init(empresa, function() {
            if(!Usuario.getUsuarioActual().getEmpresa()) {
                $rootScope.$emit("onIrAlHome",{mensaje: "El usuario no tiene una empresa valida para dispensar formulas", tipo:"warning"});
                AlertService.mostrarMensaje("warning", "Debe seleccionar la empresa");
            }else{
                if(!Usuario.getUsuarioActual().getEmpresa().getCentroUtilidadSeleccionado() || Usuario.getUsuarioActual().getEmpresa().getCentroUtilidadSeleccionado() === undefined) {
                    $rootScope.$emit("onIrAlHome",{mensaje: "El usuario no tiene un centro de utilidad valido para dispensar formulas.", tipo:"warning"});
                    AlertService.mostrarMensaje("warning", "Debe seleccionar el centro de utilidad");
                }else{
                    if (!Usuario.getUsuarioActual().getEmpresa().getCentroUtilidadSeleccionado().getBodegaSeleccionada()) {
                        $rootScope.$emit("onIrAlHome",{mensaje:"El usuario no tiene una bodega valida para dispensar formulas.", tipo:"warning"});
                        AlertService.mostrarMensaje("warning", "Debe seleccionar la bodega");
                    }
                }
            }
        });
        
        that.listarTipoObservacion();
        $scope.$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams) {
            $scope.$$watchers = null;
            // set localstorage
            $scope.root=null;
        });
    }
    

});