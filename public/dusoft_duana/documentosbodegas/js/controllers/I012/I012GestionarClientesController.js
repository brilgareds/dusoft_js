
define(["angular", "js/controllers"], function (angular, controllers) {

    controllers.controller('I012GestionarClientesController', [
        '$scope', '$rootScope', 'Request',
        '$modal', '$modalInstance', 'API', "socket", "$timeout", "$filter", "Usuario",
        "AlertService", "$state", 'I012Service',
        'Usuario',
        "Clientes",
        'tipoTerceros',
        function ($scope, $rootScope, Request, $modal, $modalInstance, API, socket, $timeout, $filter, Sesion,
                AlertService, $state, I012Service, Usuario, Clientes, tipTer) {

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
                listado_clientes: []
            };

            $scope.onCerrar = function () {
                $modalInstance.close(null);
            };

            $scope.root.filtros = [
                {tipo: '', descripcion: "Todos"},
                {tipo: 'Nombre', descripcion: "Nombre"}
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
             * @fecha 24/03/2018
             * +Descripcion Metodo encargado de invocar el servicio que
             *              listara los clientes para facturar
             *  @parametros ($event = eventos del teclado)
             */
            $scope.buscarClientesFactura = function (event) {
                if (event.which === 13 || event.which === 1) {
                    that.listarClientes();
                }

            };

            /*
             * Descripcion: lista todos los clientes existentes
             * @author German Andres Galvis
             * @fecha  24/03/2018
             */
            that.listarClientes = function () {
                var usuario = Usuario.getUsuarioActual();
                var obj = {
                    session: $scope.session,
                    listar_clientes: {
                        filtro: $scope.root.filtro,
                        terminoBusqueda: $scope.root.termino_busqueda,
                        empresaId: usuario.getEmpresa().getCodigo(),
                        paginaActual: $scope.paginaactual
                    }
                };

                I012Service.listarClientes(obj, function (data) {
                    if (data.status === 200) {
                        $scope.root.cantidad_consulta = data.obj.listarClientes.length;

                        if ($scope.root.cantidad_consulta === 0) {
                            AlertService.mostrarMensaje("warning", "no se encontraron registros");
                        }

                        that.renderClientes(data.obj.listarClientes);
                    } else {
                        AlertService.mostrarVentanaAlerta("Mensaje del sistema", data.msj);
                    }
                });
            };

            that.renderClientes = function (clientes) {
                $scope.datos_form.listado_clientes = [];
                clientes.forEach(function (data) {
                    var cliente = Clientes.get(data.nombre_tercero, data.tipo_id_tercero, data.tercero_id,
                            data.direccion, data.telefono, data.pais, data.dv);
                    $scope.datos_form.listado_clientes.push(cliente);
                });
            };

            $scope.lista_clientes = {
                data: 'datos_form.listado_clientes',
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
                                            <button class="btn btn-default btn-xs" ng-click="seleccionarCliente(row.entity)"><span class="glyphicon glyphicon-ok"></span></button>\
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
                that.listarClientes();
            };


            /*
             * funcion para paginar siguiente
             * @returns {lista datos}
             */
            $scope.paginaSiguiente = function () {
                $scope.paginaactual++;
                that.listarClientes();
            };

            /*
             * Descripcion: guarda la informacion del cliente seleccionado
             * @author German Andres Galvis
             * @fecha  26/03/2018
             */
            $scope.seleccionarCliente = function (cliente) {
                $modalInstance.close(cliente);
            };


        }]);
});