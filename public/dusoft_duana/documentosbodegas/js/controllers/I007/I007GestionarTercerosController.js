
define(["angular", "js/controllers"], function (angular, controllers) {

    controllers.controller('I007GestionarTercerosController', [
        '$scope', '$rootScope', 'Request',
        '$modal', '$modalInstance', 'API', "socket", "$timeout", "$filter", "Usuario",
        "AlertService", "$state", 'I007Service',
        'Usuario',
        "TercerosI007",
        'tipoTerceros',
        function ($scope, $rootScope, Request, $modal, $modalInstance, API, socket, $timeout, $filter, Sesion,
                AlertService, $state, I007Service, Usuario, Terceros, tipTer) {

            var that = this;
            $scope.parametros = '';
            $scope.paginaactual = 1;
            $scope.tipoProducto;
            $scope.tipoTercero = tipTer;
            $scope.root = {
                termino_busqueda: '',
                cantidad_consulta: 0
            };

            $scope.datos_form = {
                listado_terceros: []
            };

            $scope.onCerrar = function () {
                $modalInstance.close(null);
            };

            $scope.root.filtros = [
                {id: 'Nombre', descripcion: "Nombre"}
            ];

            $scope.root.filtro = $scope.root.filtros[0];


            /**
             * +Descripcion Metodo encargado de visualizar en el boton del dropdwn
             *              el tipo de documento seleccionado
             * @param {type} filtro
             * @returns {undefined}
             */
            $scope.onSeleccionFiltro = function (filtro) {

                $scope.root.filtro = filtro;
                $scope.root.termino_busqueda = '';
            };


            /**
             * @author German Galvis
             * @fecha 01/06/2018
             * +Descripcion Metodo encargado de invocar el servicio que
             *              listara los clientes para facturar
             *  @parametros ($event = eventos del teclado)
             */
            $scope.buscarTercero = function (event) {
                if (event.which === 13 || event.which === 1) {
                    that.listarTerceros();
                }

            };

            /*
             * Descripcion: lista todos los clientes existentes
             * @author German Andres Galvis
             * @fecha  01/06/2018
             */
            that.listarTerceros = function () {
                var usuario = Usuario.getUsuarioActual();
                var obj = {
                    session: $scope.session,
                    data: {
                        filtro: $scope.root.filtro,
                        terminoBusqueda: $scope.root.termino_busqueda,
                        empresaId: usuario.getEmpresa().getCodigo(),
                        paginaActual: $scope.paginaactual
                    }
                };

                I007Service.listarTerceros(obj, function (data) {
                    if (data.status === 200) {
                        $scope.root.cantidad_consulta = data.obj.listarTerceros.length;

                        if ($scope.root.cantidad_consulta === 0) {
                            AlertService.mostrarMensaje("warning", "no se encontraron registros");
                        }

                        that.renderTerceros(data.obj.listarTerceros);
                    } else {
                        AlertService.mostrarVentanaAlerta("Mensaje del sistema", data.msj);
                    }
                });
            };

            that.renderTerceros = function (clientes) {
                $scope.datos_form.listado_terceros = [];
                clientes.forEach(function (data) {
                    var tercero = Terceros.get(data.nombre_tercero, data.tipo_id_tercero, data.tercero_id,
                            data.direccion, data.telefono, data.pais, data.dv);
                    $scope.datos_form.listado_terceros.push(tercero);
                });
            };

            $scope.lista_terceros = {
                data: 'datos_form.listado_terceros',
                enableColumnResize: true,
                enableRowSelection: false,
                enableCellSelection: true,
                enableHighlighting: true,
                columnDefs: [
                    {field: 'id', displayName: 'Identificación', width: "25%", enableCellEdit: false,
                        cellTemplate: '<div class="col-xs-16 "><p class="text-uppercase">{{row.entity.getTipoId()}}- {{row.entity.getId()}}</p></div>'},
                    {field: 'nombre_tercero', displayName: 'Nombre', width: "65%", enableCellEdit: false},
                    {width: "10%", displayName: "Opción", cellClass: "txt-center",
                        cellTemplate: '<div class="btn-group">\
                                            <button class="btn btn-default btn-xs" ng-click="seleccionarTercero(row.entity)"><span class="glyphicon glyphicon-ok"></span></button>\
                                        </div>'}
                ]
            };

            /*
             * funcion para paginar anterior
             * @returns {lista datos}
             */
            $scope.paginaAnterior = function () {
                if ($scope.paginaactual === 1)
                    return;
                $scope.paginaactual--;
                that.listarTerceros();
            };


            /*
             * funcion para paginar siguiente
             * @returns {lista datos}
             */
            $scope.paginaSiguiente = function () {
                $scope.paginaactual++;
                that.listarTerceros();
            };

            /*
             * Descripcion: guarda la informacion del cliente seleccionado
             * @author German Andres Galvis
             * @fecha  18/05/2018
             */
            $scope.seleccionarTercero = function (tercero) {
                $modalInstance.close(tercero);
            };


        }]);
});