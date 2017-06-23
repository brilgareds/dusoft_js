define(["angular", "js/controllers"], function(angular, controllers) {

    controllers.controller('ConexionesController', ['$scope', 'Usuario', "Request", "localStorageService",
        "$modal","AlertService", "$modalInstance","conexiones",
        function($scope, Usuario, Request, localStorageService, 
                 $modal, AlertService, $modalInstance, conexiones) {
            
            $scope.root = {
                conexiones : conexiones
            };
            
            $scope.listaConexiones = {
                data: 'root.conexiones',
                enableColumnResize: true,
                enableRowSelection: false,
                enableHighlighting: true,
                columnDefs: [
                    {field: 'descripcion_estado_separacion', displayName: 'Estado Separación'},
                    {field: 'pedido.numero_pedido', displayName: 'Numero Pedido', cellTemplate: "<div class='ngCellText ng-scope col1 colt1'><span class='pull-left'>{{row.entity.pedido.numero_pedido}}</span>" +
                                "<span  ng-show='row.entity.esDocumentoNuevo' class='label label-danger pull-right'>Nuevo</span></div>"},
                    {field: 'pedido.nombre_vendedor', displayName: 'Farmacia'},
                    {field: 'pedido.farmacia.nombre_bodega', displayName: 'Bodega'},
                    {field: 'zona_pedido', displayName: 'Zona'},
//                    {field: 'descripcion_estado_actual_separado', displayName: "Estado"},
                    {field: 'separador.nombre_operario', displayName: 'Separador'},
                    {field: 'auditor.nombre_responsable', displayName: 'Auditor'},
                    {field: 'fecha_separacion_pedido', displayName: "Fecha Separación"},
                    {field: 'accion', displayName: "Accion", cellClass: "txt-center", width: "7%",
                        cellTemplate: '<div ng-switch="esAuditorCreador(row)">\
                                      <button ng-switch-when="true" ng-validate-events="{{opcionesModulo.btnAuditarFarmacias}}" class="btn btn-default btn-xs" ng-click="onRowClick(row)"><span class="glyphicon glyphicon-zoom-in"></span> Auditar</button>\
                                      <button ng-switch-when="false" disabled class="btn btn-default btn-xs"><span class="glyphicon glyphicon-zoom-in"></span> Auditar</button>\
                                   </div>'
                    }
                ]

            };
            
    }]);
    
});
