
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
                  
            $scope.checkedDuarte=false;      
            $scope.checkedSistemas=false;      
            
            $scope.mes={id:2,mes: 2};
            $scope.item=0;
            $scope.listaRotacions={};
            $scope.emails_envio="";
            $scope.email_envio="";
            that.listRotacionBodegas=[];
            
            $scope.onSeleccionMes=function(data){
                $scope.mes=data;
            };
             
            
            $scope.itemValida=function(item){
                item++;
                var valida=true;
                if(item%2===0){
                  valida=false;
                }
                return valida;
            };
                        
            that.init = function(callback) {
                $scope.root = {};         
                callback();
            };
                        
            $scope.agregar = function (check,dato) {    
                
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
                if(dato===1){                    
                   $scope.checkedSistemas=false; 
                   $scope.checkedDuarte=true; 
                }
                if(dato===0){
                   
                   $scope.checkedDuarte=false; 
                   $scope.checkedSistemas=true;
                }
               $scope.email_envio=dato;
            };  
            
            var color="";
            $scope.validarColor=function(dato){ 
                color="list-group-item ";
                if (dato==='0 '){
                  color+="list-group-item-success";  
                }
                if (dato==='1 '){
                  color+="list-group-item-info";  
                }
                if (dato==='2 '){
                  color+="list-group-item-warning";  
                }
                if (dato==='4 '){
                  color+="list-group-item-danger";  
                }
                return color;
            }; 
            
            $scope.enviar = function () {//self.generarRotaciones
                
                if (that.listRotacionBodegas.length > 0 && ($scope.emails_envio !== "" || $scope.email_envio !== "")) {
                    var parametros ={
                        bodegas :that.listRotacionBodegas,
                        remitente : $scope.email_envio,
                        remitentes: $scope.emails_envio,
                        meses:$scope.mes.id
                    };
                    that.buscarRotaciones(parametros);
                    $scope.checkedDuarte=false;      
                    $scope.checkedSistemas=false;
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
            
            
            socket.on("onNotificarRotacion", function (datos) {
                that.listRotacionBodegas = [];
                var timer = setTimeout(function () {

                    that.buscarRotacionZonas();

                    clearTimeout(timer);

                }, 100);
            });
            
            
            /**
             * @author Andres M. Gonzalez
             * @fecha 22/07/2016
             * +Descripcion Metodo encargado de invocar el servicio que
             *              listar todos los reportes generados
             */
            that.buscarRotaciones= function(parametros) {
                
                var obj = {
                    session: $scope.session,
                    data : parametros
                };
                ParametrosBusquedaService.generarRotaciones(obj, function(data) {
                    if (data.status === 200) {
                      that.limpiar();  
                    } else {
                        AlertService.mostrarVentanaAlerta("Error Mensaje del sistema: ", data.msj);
                    }
                });
            };
            
            that.limpiar=function(){
               that.listRotacionBodegas=[];
               $scope.email_envio="";
               $scope.emails_envio="";
               $scope.mes={id:2,mes: 2};
            };
                  
             
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
//                        console.log(data.obj.rotacionZonas);
                       that.renderRotacionZonasMovil(data.obj.rotacionZonas); 
//                       console.log("Zonas",$scope.listaRotacionZonas);
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
            that.renderRotacionZonasMovil = function (data) {
//                console.log(data);
                 var listaRotacionZona = [];
                data.forEach(function(objt) {
                     
            if(objt.zona!==""){  
                    var listaRotacionZonasDetalle = [];
                    var rotacionZonas = Zona.get();
                    rotacionZonas.setNombreZona(objt.zona);
                    objt.bodegas.forEach(function(obj) {                         
                         
                       var bodegas = {
                        nombreBodega: obj.nombreBodega,
                        empresa: obj.empresa,
                        centroUtilidad: obj.centroUtilidad,
                        fechaRegistro: obj.fechaRegistro,
                        diferenciaDias: obj.diferenciaDias,
                        swRemitente: obj.swRemitente,
                        swEstadoCorreo: obj.swEstadoCorreo,
                        logError: obj.logError,
                        remitentes: obj.remitentes,
                        meses: obj.meses,
                        bodega: obj.bodega                        
                      };
                      listaRotacionZonasDetalle.push(bodegas);
                     
                    });
                    
                     rotacionZonas.setNombreBodegas(listaRotacionZonasDetalle); 
                      listaRotacionZona.push(rotacionZonas);
                    
                   }  
                    
                    
                  });
                  $scope.listaRotacionZonas = listaRotacionZona;                

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