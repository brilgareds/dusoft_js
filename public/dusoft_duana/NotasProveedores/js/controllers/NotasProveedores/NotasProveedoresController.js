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
                    $scope.listarTiposDoc();
                    $scope.ListarPrefijos();
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
                            console.log('Error: ', data.obj.err);
                        }
                    });
                };

                $scope.listarNotasProveedores = function(){
                    if($scope.tipoDoc !== 'Tipo Doc'){
                        var tipoDoc = $scope.tipoDoc;
                    }
                    if($scope.tipoNota !== 'Tipo Nota'){
                        var tipoNota = $scope.tipoNota;
                    }

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

                    NotasProveedoresService.listarNotasProveedores(obj, function(data) {
                        if(data.status === 200){
                            console.log('Data is: \n', data);
                            $scope.root.listarNotas = data.obj.notasProveedor;

                            for(var nota of $scope.root.listarNotas){
                                nota.facturaValor = $scope.number_money(nota.facturaValor);
                                console.log('\nValor: ', nota.facturaValor);

                            }

                            // $scope.root.listarNotas.facturaValor = $scope.number_money(data.obj.notasProveedor.facturaValor);

                        }else{
                            console.log('Error: ', data.obj.err);
                        }
                    });
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
                    console.log('Precio es: '+ price + '\n');
                    var number = String(price).replace(/(\D)/g, "");
                    console.log('Precio despues fue de: ', number, '\n');
                    var cant_numb = number.length;

                    if(cant_numb > 1){
                        number_format_1 = number.substring(0, (cant_numb-2));
                        number_format_2 = number.substring((cant_numb-2));
                        number_format = new Intl.NumberFormat().format(number_format_1) + '.' + number_format_2;
                    }else{
                        //alert("Error: valor debe tener almenos 2 digitos!");
                        number_format = "";
                    }
                    return price;
                };

                $scope.listarNotas = {
                    data: 'root.listarNotas',
                    multiSelect: false,
                    enableHighlighting: true,
                    showFilter: true,
                    enableRowSelection: false,
                    columnDefs: [
                        {field: 'facturaNumero', displayName: "Factura", width: "12%"},
                        {field: 'documentoTipo', displayName: 'Tipo Doc.', width: "7%"},
                        {field: 'documentoId', displayName: 'Documento', width: "9%"},
                        {field: 'proveedorNombre', displayName: 'Nombre', width: "12%"},
                        {field: 'facturaObservacion', displayName: 'Observaciones', width: "17%"},
                        {field: 'fecha', displayName: 'Fecha', width: "12%"},
                        {field: 'facturaValor', displayName: 'Valor Factura', width: "11%"},
                        {field: 'facturaSaldo', displayName: 'Saldo', width: "11%"},
                        {displayName: 'Crear', width: "5%", cellTemplate: '<div style="text-align: center;"><i class="fa fa-plus-circle fa-2x" aria-hidden="true" style="color: #0c99d0;;"></i></div>'},
                        {displayName: 'Ver', width: "5%", cellTemplate: '<div style="text-align: center;"><i class="fa fa-file fa-2x" aria-hidden="true" style="color: #da8f07;"></i></div>'}
                    ]
                };
                that.init();
            }
        ]);
    }
);
