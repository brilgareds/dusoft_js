
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
            
            $scope.meses = [                
                    {id: 2,mes: 2},
                    {id: 3,mes: 3},
                    {id: 4,mes: 4},
                    {id: 5,mes: 5},
                    {id: 6,mes: 6}
                  ];
            
            $scope.mes={id:2,mes: 2};
            
            $scope.onSeleccionMes=function(data){
                $scope.mes=data;
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
            
            $scope.listaRotacions={};
            $scope.emails_envio="";
            $scope.email_envio="";
            that.init = function(callback) {
                $scope.root = {};         
                callback();
            };
            
            that.listRotacionBodegas=[];
            $scope.agregar = function (check,dato) {    
                console.log(dato);
                if (check) {
                    that.listRotacionBodegas.push(dato);
                } else {
                    that.quitar(dato);
                }                
            };
            
            that.quitar=function(dato){
                var i=0;
                 that.listRotacionBodegas.forEach(function(item){
                     if(item.nombreBodega === dato.nombreBodega){
                         that.listRotacionBodegas.splice(i, 1);
                     }
                     i++;
                 });
            };
            
            $scope.email=function(dato){
               $scope.email_envio=dato;
            };  
            
            $scope.enviar = function () {//self.generarRotaciones
                
                if (that.listRotacionBodegas.length > 0 && ($scope.emails_envio !== "" || $scope.email_envio !== "")) {
                    var parametros ={
                        bodegas :that.listRotacionBodegas,
                        remitente : $scope.email_envio,
                        remitentes: $scope.emails_envio
                    };
                    that.buscarRotaciones(parametros);
                    
                } else {
                    if (that.listRotacionBodegas.length <= 0) {
                        AlertService.mostrarVentanaAlerta("Mensaje del sistema", "Debe seleccionar una Farmacia");
                        return;
                    }
                    if ($scope.emails_envio === "" || $scope.email_envio === "") {
                        AlertService.mostrarVentanaAlerta("Mensaje del sistema", "Debe seleccionar un Remitente");
                        return;
                    }
                }
            };  
            
            var i=0;
            socket.on("onNotificarRotacion", function(datos){
                if(that.listRotacionBodegas.length*3 === i){
                   that.listRotacionBodegas=[];
                   that.buscarRotacionZonas();
                }
                if(i === 2){
                   that.buscarRotacionZonas();
                }
                i++;
            });
            
            
            /**
             * @author Andres M. Gonzalez
             * @fecha 22/07/2016
             * +Descripcion Metodo encargado de invocar el servicio que
             *              listar todos los reportes generados
             */
            that.buscarRotaciones= function(parametros) {
                parametros.meses=$scope.mes.id;
                var obj = {
                    session: $scope.session,
                    data : parametros
                };
                ParametrosBusquedaService.generarRotaciones(obj, function(data) {
                    if (data.status === 200) {
                      // that.renderRotacionZonas(data); 
                       console.log("Zonas",$scope.listaRotacionZonas);
                    } else {
                        AlertService.mostrarVentanaAlerta("Mensaje del sistema ReportesBloqueados: ", data.msj);
                    }
                });
            };
            
            
            /*
             * @Author: Andres M.
             * +Descripcion: Evento que actualiza la vista 
             */
//           socket.on("onNotificarEstadoDescargaReporte", function(datos) {
//	      
//               if(datos.estado ==='ok'){                
//	
//		var timer = setTimeout(function(){
//             
//		   that.buscarReportesBloqueados();
//
//		    clearTimeout(timer);
//
//		   }, 0);	
//		
//               }
//            }); 
            
        
             
             
             $scope.onDescagarArchivo=function(nombre_reporte){
              $scope.visualizarReporte("/reports/" + nombre_reporte, nombre_reporte, "download");
             };
            
            /**
             * @author Andres M. Gonzalez
             * @fecha 22/07/2016
             * +Descripcion Metodo encargado de invocar el servicio que
             *              listar todos los reportes generados
             */
            that.buscarRotacionZonas = function() {
                $scope.listaRotacionZonas={};
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
                        fechaRegistro: objt.fecha_registro,
                        diferenciaDias: objt.diferencia,
                        swRemitente: objt.sw_remitente,
                        swEstadoCorreo: objt.sw_estado_correo,
                        logError: objt.log_error,
                        remitentes: objt.remitentes,
                        meses: objt.meses,
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