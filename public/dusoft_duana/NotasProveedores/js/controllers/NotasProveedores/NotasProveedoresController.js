/* global entregado, si, $flow, that, $http, echo, subirArchivo, flow, data, modalInstancesy, form, backdrop, parametros, parametros, parametros, archivo */

define(
    ["angular", "js/controllers", 'includes/slide/slideContent', "includes/classes/Empresa"],
    function (angular, controllers) {
        controllers.controller('NotasProveedoresController', [
            '$scope', '$rootScope', "Request",
            "$filter", '$state', '$modal',
            "API", "AlertService", 'localStorageService',
            "Usuario", "socket", "$timeout",
            "Empresa", "CentroUtilidad", "Bodega", "$location", "NotasProveedoresService",
            function ($scope, $rootScope, Request, $filter, $state, $modal, API, AlertService, localStorageService, Usuario, socket, $timeout, Empresa, CentroUtilidad, Bodega, $location, NotasProveedoresService) {

                var that = this;

                that.init = function(){
                    $scope.session = {
                        usuario_id: Usuario.getUsuarioActual().getId(),
                        auth_token: Usuario.getUsuarioActual().getToken()
                    };
                    $scope.root = {
                        listarNotas : [],
                        tiposDoc: [],
                        prefijosNotas: []
                    };
                    $scope.NotaTemporal = {};
                    $scope.listarTiposDoc();
                    $scope.ListarPrefijos();
                    $scope.details = [];
                    $scope.enableDetails = [];
                    $scope.glosasConceptoEspecifico = [];
                    $scope.conceptoDefault = '-Seleccione un concepto-';
                    $scope.ConceptoGeneral = [];
                    $scope.conceptoGeneralActual = 'Facturacion';
                    $scope.conceptoEspecificoActual = 'Medicamentos';
                    $scope.tituloConceptoGeneralActual = [];
                    $scope.tituloConceptoEspecificoActual = [];
                    $scope.baja_costo = true;
                    $scope.ultimaFacturaAbierta = {};
                    $scope.NotasGeneradas = {};
                    $scope.nombre_tercero = '';

                    var modalInstance = {};
                };

                var number_money = function(price){
                    let number = String(price.replace(/(\D)/g, ""));
                    price = new Intl.NumberFormat("de-DE").format(price);
                    price ='$'+price.replace(/(,)/g, "coma").replace(/(\.)/g, "punto").replace(/(coma)/g, ".").replace(/(punto)/g, ",");
                    return price;
                };

                $scope.get = (url, obj, callback) => {
                    Request.realizarRequest(url, "GET", obj, data => callback(data) );
                };

                $scope.post = (url, obj, callback) => {
                    Request.realizarRequest(url, "POST", obj, data => callback(data) );
                };

                $scope.listarTiposDoc = function(){
                    let obj = {
                        session: $scope.session,
                        data: {}
                    };

                    $scope.post(API.NOTAS_PROVEEDORES.TIPOS_DOC, obj, data => {
                        if (data.status === 200) {
                            $scope.root.tiposDoc = data.obj.tiposDoc;
                            $scope.tipoDoc = 'Tipo Doc';
                        } else {
                            console.log('Error: ', data);
                        }
                    });
                };

                $scope.listarRetencionesAnuales = () => {
                    let obj = {
                        session: $scope.session,
                        data: {}
                    };

                    $scope.post(API.NOTAS_PROVEEDORES.LISTAR_RETENCIONES_ANUALES, obj, data => {
                        if(data.status === 200) {
                            $scope.root.listarNotas.retencionAnual = data.obj;
                        } else {
                            alert('Hubo un error!!');
                        }
                    });
                };

                $scope.updateConceptoGeneral = function(nota, codigo, concepto) {
                    nota.conceptoGeneralTitulo = concepto;
                    nota.conceptoGeneralNombre = concepto;
                    nota.conceptoGeneralId = codigo;
                    nota.conceptoEspecificoActual = '';
                    nota.conceptoEspecificoNombre = $scope.conceptoDefault;
                    nota.conceptoEspecificoTitulo = $scope.conceptoDefault;

                    let obj = {
                        session: $scope.session,
                        data: {
                            conceptoGeneral: codigo
                        }
                    };

                    $scope.post(API.NOTAS_PROVEEDORES.CONCEPTOS_ESPECIFICOS, obj, data => {
                        if(data.status === 200){
                            nota.conceptosEspecificos = data.obj;
                        }else{ console.log('A ocurrido un error: ', data.obj.err); }
                    });
                };

                $scope.updateConceptoEspecifico = function(nota, codigo, concepto){
                    let cantidadMaximaLetras = 30;
                    nota.conceptoEspecificoTitulo = concepto;
                    nota.conceptoEspecificoId = codigo;

                    if(concepto.length > cantidadMaximaLetras){
                        nota.conceptoEspecificoNombre = concepto.substring(0, cantidadMaximaLetras-1) + '...';
                    }else{
                        nota.conceptoEspecificoNombre = concepto;
                    }
                };

                $scope.listarNotasProveedores = function(){
                    if($scope.tipoDoc !== 'Tipo Doc'){ var tipoDoc = $scope.tipoDoc; }
                    if($scope.tipoNota !== 'Tipo Nota'){ var tipoNota = $scope.tipoNota; }

                    const busquedaPorDocumento = $scope.tipoDoc !== 'Tipo Doc' && $scope.numero_documento;
                    const busquedaPorNota = $scope.tipoNota !== 'Tipo Nota' && $scope.numero_nota;
                    const busquedaPorTercero = !!$scope.nombre_tercero;
                    const busquedaPorFactura = !!$scope.numero_factura;

                    if(!busquedaPorDocumento && !busquedaPorNota && !busquedaPorTercero && !busquedaPorFactura){
                        alert('Filtrado incorrecto!');
                    } else {
                        var obj = {
                            session: $scope.session,
                            data: {
                                tipo_documento: tipoDoc,
                                numero_documento: $scope.numero_documento,
                                nombre: $scope.nombre_tercero,
                                factura: $scope.numero_factura,
                                tipo_nota: tipoNota,
                                numero_nota: $scope.numero_nota
                            }
                        };

                        $scope.post(API.NOTAS_PROVEEDORES.LISTAR_NOTAS, obj, data => {

                            if(data.status === 200) {
                                $scope.root.listarNotas = data.obj.notasProveedor;
                                if($scope.root.listarNotas.length === 0) {
                                    alert('No se encontro ninguna factura!');
                                }else{
                                    for(var nota of $scope.root.listarNotas) {
                                        nota.facturaValorString = $scope.number_money(nota.facturaValor);
                                        nota.facturaSaldoString = $scope.number_money(nota.facturaSaldo);
                                        nota.facturaValor = parseFloat(nota.facturaValor);
                                        nota.facturaSaldo = parseFloat(nota.facturaSaldo);
                                    }
                                }
                                // $scope.root.listarNotas.facturaValor = $scope.number_money(data.obj.notasProveedor.facturaValor);
                            }else{ console.log('Error: ', data.obj.err); }
                        });
                    }
                };

                $scope.ListarPrefijos = function(){
                    $scope.root.tiposNotas = ['NDD', 'NCD'];
                    $scope.tipoNota = 'Tipo Nota';
                };

                $scope.FechaActual = function(){
                    var fecha_actual = new Date();
                };

                $scope.ActualizarTipoDoc = function(nuevoTipoDoc){
                    $scope.tipoDoc = nuevoTipoDoc;
                };

                $scope.ActualizarTipoNota = function(nuevoTipoNota){
                    $scope.tipoNota = nuevoTipoNota;
                };

                $scope.number_money = function(price){
                    // console.log('Precio es: '+ price + '\n');
                    var number = String(price.replace(/(\D)/g, "."));
                    // console.log('Precio sin comas ni puntos fue de: ', number, '\n');
                    var cant_numb = number.length;
                    var number_format = '';

                    if(cant_numb > 1){
                        number_format_1 = number.substring(0, (cant_numb-2));
                        number_format_2 = number.substring((cant_numb-2));
                        number_format = '$' + new Intl.NumberFormat().format(number_format_1) + ',' + number_format_2;
                    }else{
                        alert("Error: valor debe tener almenos 2 digitos!");
                    }
                    return number_format;
                };

                $scope.eliminarProductoTemporal = function(nota){
                    let obj = {
                        session: $scope.session,
                        data: nota
                    };
                    $scope.post(API.NOTAS_PROVEEDORES.ELIMINAR_PRODUCTO_TEMPORAL, obj, data => {
                        if(data.status === 200){
                            $scope.crearNotaTemporal($scope.ultimaFacturaAbierta, false, false);
                        }else{ console.log('Ocurrio un error: ', data.obj); }
                    });
                };

                $scope.crearNotaTemporal = (Factura, verNotasTemporal=false, modal=true) => {
                    $scope.ultimaFacturaAbierta = Factura;
                    let obj = {
                        session: $scope.session,
                        data: Factura
                    };

                    $scope.post(API.NOTAS_PROVEEDORES.CREAR_NOTA_TEMPORAL, obj, data => {
                        if(data.status === 200){
                            $scope.NotaTemporal = data.obj;
                            if(modal){
                                $scope.modal($scope.NotaTemporal);
                            } else if (verNotasTemporal) {
                                $scope.verNotasFactura(Factura);
                            }
                        } else { console.log('Error: ', data.obj.err); }
                    });
                };

                $scope.crearNota = function() {
                    let obj = {
                        session: $scope.session,
                        data: $scope.NotaTemporal
                    };

                    $scope.post(API.NOTAS_PROVEEDORES.CREAR_NOTA, obj, data => {
                        if(data.status === 200){
                            alert('Nota creada con exito!');
                            modalInstance.close();
                            $scope.crearNotaTemporal($scope.ultimaFacturaAbierta, true, false);
                        }else{ console.log('Hubo un error: ', data.obj); }
                    });
                };

                $scope.agregarDetalleTemporal = function(){
                    $scope.NotaTemporal.temporal.toUpdate = [];
                    let productos = $scope.NotaTemporal.factura.detalle;
                    let toUpdate = $scope.NotaTemporal.temporal.toUpdate;
                    let sinConceptoEspecifico = true;
                    let validacionError = 0;
                    let availableCount = 0;

                    productos.forEach(element => {
                        if(element.available) {
                            availableCount++;
                            sinConceptoEspecifico = element.conceptoEspecificoNombre === $scope.conceptoDefault;

                            if(sinConceptoEspecifico){
                                validacionError++;
                                alert('Concepto especifico vacio en producto: '+element.codigo_producto);
                            } else {
                                toUpdate.push(element);
                            }
                        }
                    });

                    if(validacionError > 0) {
                        alert('Debe llenar correctamente el formulario!');
                    } else if (toUpdate.length === 0) {
                        alert('Debe seleccionar al menos 1 producto!');
                    } else {
                        let obj = {
                            session: $scope.session,
                            data: toUpdate
                        };

                        $scope.post(API.NOTAS_PROVEEDORES.AGREGAR_DETALLE_TEMPORAL, obj, data => {
                            if(data.status === 200){
                                $scope.crearNotaTemporal($scope.ultimaFacturaAbierta, false, false);
                                // modalInstance.close();
                            }else { console.log('Hubo un error!!', data.obj.err); }
                        });
                    }
                };

                $scope.modal = function (obj, opt=1) {
                    let template = '';
                    if(opt === 1){
                        template = 'views/modals/createNote.html';
                    }else if(opt === 2){
                        template = 'views/modals/showNotes.html';
                    }

                    $scope.opts = {
                        backdrop: true,
                        backdropClick: true,
                        dialogFade: true,
                        keyboard: true,
                        templateUrl: template,
                        scope: $scope,
                        // controller: "VentanaMensajeSincronizacionController",
                        resolve: {
                            mensaje: function() {
                                return obj;
                            }
                        }
                    };
                    modalInstance = $modal.open($scope.opts);

                    modalInstance.result.then(function(){
                    },function(){});
                };

                $scope.cerrarVentana = function(){
                    modalInstance.close();
                };

                $scope.showDetails = function(key){
                    if($scope.details[key] === undefined){
                        $scope.details[key] = true;
                    }else{
                        $scope.details[key] = !$scope.details[key];
                    }
                    return $scope.details[key];
                };

                that.sincronizacionDocumentos = parametros => {
                    $scope.root.estado = false;
                    $scope.color_boton = "";
                    $scope.iconos = "";
                    $scope.encabezado = {};
                    $scope.root.asientosContables = {};
                    const obj = {
                        session: $scope.session,
                        data: {
                            prefijo: parametros.prefijo,
                            facturaFiscal: parametros.facturaFiscal,
                            sincronizar: parametros.sincronizar,
                            servicio: parametros.servicio,
                            codigoProveedor: $scope.cod_proveedor
                        }
                    };
                    console.log('Objeto antes de Ajax: ', obj);

                    $scope.post(API.NOTAS_PROVEEDORES.SINCRONIZACION_DOCUMENTOS, obj,data => {
                        if (data.status === 200) {
                            $scope.root.estado = true;
                            $scope.root.asientosContables = data.obj.asientosContables;
                            console.log('Respuesta es: ', data.obj);

                            if ($scope.root.asientosContables.estado === true) {
                                // $scope.encabezado = data.obj.parametro.encabezado;
                                $scope.color_boton = "btn-danger";
                                $scope.iconos = "glyphicon glyphicon-asterisk";
                            } else {
                                if (parametros.sincronizar === 1) {
                                    $scope.root.asientosContables.descripcion = "";
                                    $scope.color_boton = "btn-success";
                                    $scope.iconos = "";
                                }
                            }
                            console.log("$scope.root.asientosContables:: ", $scope.root.asientosContables);
                        } else {
                            console.log(" data.mensaje", data.msj);
                            console.log(" data.mensaje", data);
                            AlertService.mostrarVentanaAlerta("Mensaje del sistema: ", data.msj);
                        }
                    });
                };

                $scope.sincronizarNota = (Nota) => {
                    alert('Sincronizando Nota!!');

                    $scope.servicioProveedor = false;
                    $scope.servicioPrefijo = true;
                    $scope.servicio = 5;

                    let prefijo = $scope.root.prefijo2;
                    let servicio = $scope.root.servicio;

                    let numero = $scope.root.numero;
                    const obj = {
                        prefijo: prefijo.prefijo,
                        facturaFiscal: numero,
                        sincronizar: 1,
                        servicio: $scope.servicio
                    };

                    that.sincronizacionDocumentos(obj);
                };

                $scope.verNotasFactura = function(factura){
                    let obj = {
                        session: $scope.session,
                        data: factura
                    };

                    $scope.post(API.NOTAS_PROVEEDORES.VER_NOTAS_FACTURA, obj, data => {

                        if (data.status === 200) {
                            if(data.obj.tipos.all.length > 0){
                                $scope.NotasGeneradas = {
                                    encabezado: data.obj.encabezado,
                                    notas: [ data.obj.tipos.debito, data.obj.tipos.credito ]
                                };
                                $scope.modal($scope.NotasGeneradas, 2);
                            }else{ alert('La factura no tiene notas creadas!!'); }
                        } else { alert('No se encontraron notas!!'); }
                    });
                };

                $scope.imprimir_pdf = (nota, tipo) => {
                    nota.tipoNota = tipo;
                    let url = '';
                    nota.retencionAnual = $scope.NotaTemporal.retencionAnual;
                    if($scope.session.bodega === '06') {
                        url = nota.url2;
                    }else{
                        url = nota.url;
                    }

                    let host = $location.protocol() + '://' + $location.host() + ':' + $location.port();

                    let obj = {
                        session: $scope.session,
                        data: {
                            reimprimir: true,
                            host: host,
                            rows: nota
                        }
                    };
                    let request = new XMLHttpRequest();
                    request.onreadystatechange = function() {
                        if (this.readyState === this.DONE) {
                            if(this.status === 200) {
                                window.open(url, '_blank');
                            } else {
                                $scope.post(API.NOTAS_PROVEEDORES.IMPRIMIR_NOTA, obj, data => {
                                    if (data.status === 200) {
                                        modalInstance.close();
                                        $scope.crearNotaTemporal($scope.ultimaFacturaAbierta, true, false);
                                        window.open(data.obj, '_blank');
                                        // console.log('la url final es: ', data.obj);
                                    } else {
                                        console.log('Error en Ajax, status: ', data);
                                    }
                                });
                            }
                        }
                    };
                    request.open('HEAD', url);
                    request.send();
                };

                $scope.listarNotas = {
                    data: 'root.listarNotas',
                    multiSelect: false,
                    enableHighlighting: true,
                    showFilter: true,
                    enableRowSelection: false,
                    enableColumnResize: true,
                    columnDefs: [
                        {field: 'facturaNumero', displayName: "Factura", width: "10%"},
                        {field: 'proveedorNombre', displayName: 'Proveedor', width: "12%"},
                        {field: 'documento', displayName: 'Documento', width: "12%"},
                        {field: 'facturaObservacion', displayName: 'Observaciones', width: "21%"},
                        {field: 'fecha', displayName: 'Fecha', width: "13%"},
                        {field: 'facturaValorString', displayName: 'Valor Factura', width: "11%"},
                        {field: 'facturaSaldoString', displayName: 'Saldo', width: "11%"},
                        {displayName: 'Crear', width: "5%", cellTemplate: '<div style="text-align: center;"><i ng-click="crearNotaTemporal(row.entity)" class="fa fa-plus-circle fa-2x" aria-hidden="true" style="color: #0c99d0;"></i></div>'},
                        {displayName: 'Ver', width: "5%", cellTemplate: '<div style="text-align: center;"><i ng-click="crearNotaTemporal(row.entity, true, false)" class="fa fa-file fa-2x" aria-hidden="true" style="color: #1c99d1;"></i></div>'}
                    ]
                };
                that.init();
            }
        ]);
    }
);
