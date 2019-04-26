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
                    $scope.ConceptoGeneral = [];
                    $scope.conceptoGeneralActual = [];
                    $scope.conceptoEspecificoActual = [];
                    $scope.tituloConceptoGeneralActual = [];
                    $scope.tituloConceptoEspecificoActual = [];
                    $scope.baja_costo = true;
                    $scope.ultimaFacturaAbierta = {};

                    var modalInstance = {};
                };

                var number_money = function(price){
                    console.log('\nPrecio es: '+ price);
                    var number = String(price.replace(/(\D)/g, ""));
                    console.log('Precio sin comas ni puntos fue de: ', number, '\n');
                    price = new Intl.NumberFormat("de-DE").format(price);
                    price ='$'+price.replace(/(,)/g, "coma").replace(/(\.)/g, "punto").replace(/(coma)/g, ".").replace(/(punto)/g, ",");

                    console.log('Nuevo precio: ', price + '\n');
                    return price;
                };

                $scope.listarTiposDoc = function(){
                    var obj = {
                        session: $scope.session,
                        data: {}
                    };

                    NotasProveedoresService.TiposDoc(obj, function(data) {
                        if(data.status === 200){
                            $scope.root.tiposDoc = data.obj.tiposDoc;
                            $scope.tipoDoc = 'Tipo Doc';
                        }else{
                            console.log('Error: ', data);
                        }
                    });
                };

                $scope.updateConceptoGeneral = function(nota, codigo, concepto) {
                    nota.conceptoGeneralTitulo = concepto;
                    nota.conceptoGeneralNombre = concepto;
                    nota.conceptoGeneralId = codigo;
                    nota.conceptoEspecificoActual = '';

                    console.log('Nuevo concepto, nota.conceptoGeneralActual: ', nota.conceptoGeneralActual);
                    console.log('Concepto.length: ', concepto.length);
                    var obj = {
                        session: $scope.session,
                        data: {
                            conceptoGeneral: codigo
                        }
                    };

                    NotasProveedoresService.conceptosEspecificos(obj, function(data){
                        if(data.status === 200){
                            nota.conceptosEspecificos = data.obj;
                            console.log('Conceptos especificos son: ', nota.conceptosEspecificos);
                        }else{ console.log('A ocurrido un error: ', data.obj.err); }
                    });
                };

                $scope.updateConceptoEspecifico = function(nota, codigo, concepto){
                    console.log('Nuevo concepto, nota.conceptoEspecificoActual: ', nota);

                    var cantidadMaximaLetras = 30;
                    nota.conceptoEspecificoTitulo = concepto;
                    nota.conceptoEspecificoId = codigo;

                    if(concepto.length > cantidadMaximaLetras){
                        nota.conceptoEspecificoNombre = concepto.substring(0, cantidadMaximaLetras-1) + '...';
                    }else{
                        nota.conceptoEspecificoNombre = concepto;
                    }
                };

                $scope.listarNotasProveedores = function(){
                    console.log('Init "listarNotas"');
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

                        NotasProveedoresService.listarNotas(obj, function(data) {

                            if(data.status === 200){
                                $scope.root.listarNotas = data.obj.notasProveedor;
                                if($scope.root.listarNotas.length === 0){
                                    alert('No se encontro ninguna factura!');
                                }else{
                                    for(var nota of $scope.root.listarNotas) {
                                        nota.facturaValorString = $scope.number_money(nota.facturaValor);
                                        nota.facturaSaldoString = $scope.number_money(nota.facturaSaldo);
                                        nota.facturaValor = parseFloat(nota.facturaValor);
                                        nota.facturaSaldo = parseFloat(nota.facturaSaldo);
                                    }
                                    console.log('Facturas listadas!');
                                }
                                // $scope.root.listarNotas.facturaValor = $scope.number_money(data.obj.notasProveedor.facturaValor);
                            }else{ console.log('Error: ', data.obj.err); }
                        });
                    }
                };

                $scope.ListarPrefijos = function(){
                    $scope.root.tiposNotas = ['Nota Debito', 'Nota Credito'];
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
                    console.log('Eliminando producto!');

                    let obj = {
                        session: $scope.session,
                        data: nota
                    };
                    NotasProveedoresService.eliminarProductoTemporal(obj, data => {
                        if(data.status === 200){
                            console.log('Fine!');
                            $scope.crearNotaTemporal($scope.ultimaFacturaAbierta, false);
                        }else{ console.log('Ocurrio un error: ', data.obj); }
                    });
                };

                $scope.crearNotaTemporal = function(Factura, modal=true){
                    console.log('This is the Note: ', Factura);
                    $scope.ultimaFacturaAbierta = Factura;
                    var obj = {
                        session: $scope.session,
                        data: Factura
                    };

                    NotasProveedoresService.crearNotaTemporal(obj, data => {
                        if(data.status === 200){
                            console.log('All fine!!');
                            $scope.NotaTemporal = data.obj;
                            console.log($scope.NotaTemporal);
                            if(modal){
                                $scope.modal($scope.NotaTemporal);
                            }
                        }else{
                            console.log('Error: ', data.obj.err);
                        }

                    });
                };

                $scope.crearNota = function() {
                    console.log('Funcion para crear Nota Proveedor!!');

                    let obj = {
                        session: $scope.session,
                        data: $scope.NotaTemporal
                    };

                    NotasProveedoresService.crearNota(obj, data => {
                        console.log('Service finish!');
                        if(data.status === 200){
                            console.log('fine, response is: ', data.obj);
                            $scope.crearNotaTemporal($scope.ultimaFacturaAbierta, false);
                        }else{ console.log('Hubo un error: ', data.obj); }
                    });
                };

                $scope.agregarDetalleTemporal = function(){
                    $scope.NotaTemporal.temporal.toUpdate = [];
                    let productos = $scope.NotaTemporal.factura.detalle;
                    let toUpdate = $scope.NotaTemporal.temporal.toUpdate;

                    productos.forEach(element => {
                        if(element.available) toUpdate.push(element);
                    });

                    if(toUpdate.length === 0) {
                        alert('Debe seleccionar al menos 1 producto!');
                    }else{
                        console.log('object finish: ', toUpdate);
                        let obj = {
                            session: $scope.session,
                            data: toUpdate
                        };

                        NotasProveedoresService.agregarDetalleTemporal(obj, data => {
                            if(data.status === 200){
                                console.log('All fine in Ajax, data: ', data.obj);
                                $scope.crearNotaTemporal($scope.ultimaFacturaAbierta, false);
                                // modalInstance.close();
                            }else { console.log('Hubo un error!!', data.obj.err); }
                        });
                    }
                };

                $scope.modal = function (obj) {

                    $scope.opts = {
                        backdrop: true,
                        backdropClick: true,
                        dialogFade: true,
                        keyboard: true,
                        templateUrl: 'views/modals/showNotes.html',
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

                $scope.verNotasFactura = function(factura){
                    console.log('Visualizar Notas...');
                    console.log('Object is: ', factura);

                    let obj = {
                        session: $scope.session,
                        data: factura
                    };

                    NotasProveedoresService.verNotasFactura(obj, data => {
                        console.log('After Ajax!!');

                        if (data.status === 200) {
                            console.log('Ajax fine!!');
                            console.log('data is: ', data.obj);
                            $scope.NotasGeneradas = data.obj;
                            $scope.modal($scope.NotasGeneradas);
                        } else { console.log('Hubo un error: ', data.obj); }
                    });
                };

                $scope.listarNotas = {
                    data: 'root.listarNotas',
                    multiSelect: false,
                    enableHighlighting: true,
                    showFilter: true,
                    enableRowSelection: false,
                    enableColumnResize: true,
                    columnDefs: [
                        {field: 'facturaNumero', displayName: "Factura", width: "12%"},
                        {field: 'documentoTipo', displayName: 'Tipo Doc.', width: "7%"},
                        {field: 'documentoId', displayName: 'Documento', width: "9%"},
                        {field: 'proveedorNombre', displayName: 'Nombre', width: "12%"},
                        {field: 'facturaObservacion', displayName: 'Observaciones', width: "17%"},
                        {field: 'fecha', displayName: 'Fecha', width: "12%"},
                        {field: 'facturaValorString', displayName: 'Valor Factura', width: "11%"},
                        {field: 'facturaSaldoString', displayName: 'Saldo', width: "11%"},
                        {displayName: 'Crear', width: "5%", cellTemplate: '<div style="text-align: center;"><i ng-click="crearNotaTemporal(row.entity)" class="fa fa-plus-circle fa-2x" aria-hidden="true" style="color: #0c99d0;"></i></div>'},
                        {displayName: 'Ver', width: "5%", cellTemplate: '<div style="text-align: center;"><i ng-click="verNotasFactura(row.entity)" class="fa fa-file fa-2x" aria-hidden="true" style="color: #da8f07;"></i></div>'}
                    ]
                };
                that.init();
            }
        ]);
    }
);
