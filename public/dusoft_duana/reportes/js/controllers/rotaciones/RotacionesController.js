
define(["angular", "js/controllers", 'includes/slide/slideContent',
    "includes/classes/Empresa",
    'controllers/drArias/FiltroDrAriasController',
    "models/ReportesGenerados",
], function(angular, controllers) {

    controllers.controller('RotacionesController', [
        '$scope', '$rootScope', "Request",
        "$filter", '$state', '$modal',
        "API", "AlertService", 'localStorageService',
        "Usuario", "socket", "$timeout","ReportesGenerados",
        "Empresa", "ParametrosBusquedaService","Zona",
        function($scope, $rootScope, Request,
                $filter, $state, $modal,
                API, AlertService, localStorageService,
                Usuario, socket, $timeout,ReportesGenerados,
               Empresa, ParametrosBusquedaService,Zona) {

            var that = this;

            $scope.seleccion = Usuario.getUsuarioActual().getEmpresa();
            $scope.session = {
                usuario_id: Usuario.getUsuarioActual().getId(),
                auth_token: Usuario.getUsuarioActual().getToken()
            };           
             
             $scope.item=0;
            
            $scope.itemValida=function(item){
                console.log(item);
                item++;
                var valida=true;
                if(item%2===0){
                  valida=false;
                }
                console.log(valida);
                return valida;
            };
            
            

            that.init = function(callback) {
                $scope.root = {};         
                callback();
            };
            
            
            
            
            /*
             * @Author: Andres M.
             * +Descripcion: Evento que actualiza la vista 
             */
           socket.on("onNotificarEstadoDescargaReporte", function(datos) {
	      
               if(datos.estado ==='ok'){                
	
		var timer = setTimeout(function(){
             
		   that.buscarReportesBloqueados();

		    clearTimeout(timer);

		   }, 0);	
		
               }
            }); 
            
        
             
             
             $scope.onDescagarArchivo=function(nombre_reporte){
              $scope.visualizarReporte("/reports/" + nombre_reporte, nombre_reporte, "download");
             }
             
           

            
            /**
             * @author Andres M. Gonzalez
             * @fecha 22/07/2016
             * +Descripcion Metodo encargado de invocar el servicio que
             *              listar todos los reportes generados
             */
            that.buscarRotacionZonas = function() {
                var obj = {
                    session: $scope.session
                };
                ParametrosBusquedaService.rotacionZonas(obj, function(data) {
                    if (data.status === 200) {
                       that.renderRotacionZonas(data); 
                       console.log("Zonas",$scope.listaRotacionZonas);
                    } else {
                        AlertService.mostrarVentanaAlerta("Mensaje del sistema ReportesBloqueados: ", data.msj);
                    }
                });
            };
            
            /**
             * +Descripcion:renderizar la consulta al modelo
             * @author Andres M Gonzalez
             * @fecha: 11/05/2016
             * @returns {objeto}
             */
            that.renderRotacionZonas = function (data) {
                var listaRotacionZonas = [];
                var rotacionZonas = undefined;
                var zonaName = "";
                
                for (var i in data.obj.rotacionZonas) {
                    var objt = data.obj.rotacionZonas[i];
                    var bodegas = {
                        nombreBodega: objt.nombre_bodega,
                        empresa: objt.empresa_id,
                        centroUtilidad: objt.centro_utilidad,
                        bodega: objt.bodega
                    };

                    if (objt.zona !== zonaName) {
                        if (rotacionZonas !== undefined) {
                            rotacionZonas.setNombreBodegas(listaRotacionZonasDetalle);
                            listaRotacionZonas.push(rotacionZonas);
                        }
                        zonaName = objt.zona;
                        var listaRotacionZonasDetalle = [];
                        var rotacionZonas = Zona.get();
                        rotacionZonas.setNombreZona(objt.zona);
                    }
                    listaRotacionZonasDetalle.push(bodegas);
                }
                $scope.listaRotacionZonas = listaRotacionZonas;
            };
                       
           
            that.init(function() {
                that.buscarRotacionZonas();
            });
                       

        }]);
});