define(["angular", "js/controllers"], function(angular, controllers) {

    controllers.controller('GestionarNovedadProductoController', [
        '$scope', '$rootScope', 'API',
        '$modalInstance', 'AlertService', 'Request', 'ObservacionOrdenCompra', 'NovedadOrdenCompra',
        'ArchivoNovedadOrdenCompra','$filter','producto','nuevaNovedad',
        function($scope, $rootScope, API, $modalInstance, AlertService, Request, Observacion, Novedad,
                 Archivo, $filter, producto, nuevaNovedad) {

            var that = this;

            // Inicializacion Upload
            $scope.flow = new Flow();
            $scope.flow.target = API.ORDENES_COMPRA.SUBIR_ARCHIVO_NOVEDAD;
            $scope.flow.testChunks = false;
            $scope.flow.singleFile = true;
            $scope.producto = producto;
            
            //Si la novedad es nueva se setea un objeto novedad vacio
            if(nuevaNovedad){
                var novedad = Novedad.get();
                producto.set_novedad(novedad);
            } 
            
            $scope.flow.query = {
                session: JSON.stringify($scope.session)
            };
            
            // Variables
            var fecha_actual = new Date();
            $scope.fechaMinima = new Date();
            $scope.fecha_inicial = $filter('date')(new Date("01/01/" + fecha_actual.getFullYear()), "yyyy-MM-dd");
            $scope.datepickerFechaInicial = false;
            
            console.log("fecha minima ", $scope.fechaMinima);
          
            that.buscar_observaciones = function() {

                var obj = {session: $scope.session, data: {observaciones: {termino_busqueda: ""}}};

                Request.realizarRequest(API.OBSERVACIONES_ORDENES_COMPRA.LISTAR_OBSERVACIONES, "POST", obj, function(data) {

                    if (data.status === 200) {
                        that.render_observaciones(data.obj.observaciones);
                    }
                });
            };

            that.buscar_archivos_novedad = function() {

                var obj = {session: $scope.session,
                    data: {
                        ordenes_compras: {
                            novedad_id: $scope.producto.get_novedad().get_id()
                        }
                    }
                };

                Request.realizarRequest(API.ORDENES_COMPRA.CONSULTAR_ARCHIVOS_NOVEDAD, "POST", obj, function(data) {                    

                    if (data.status === 200) {
                        that.render_archivos_novedad(data.obj.lista_archivos);
                    }
                });

            };

            that.gestionar_novedades = function() {   
                
                var entrada = "";
                if($scope.producto.novedad.observacion.getTipoEntrada() === '0'){
                    entrada =  $filter('date')($scope.producto.get_novedad().getDescripcionEntrada(), "yyyy-MM-dd");
                }
                               
                var obj = {session: $scope.session,
                    data: {
                        ordenes_compras: {                            
                            novedad_id: $scope.producto.get_novedad().get_id() || 0,
                            item_id: $scope.producto.get_id(),
                            observacion_id: $scope.producto.get_novedad().get_observacion().get_id(),
                            descripcion: $scope.producto.get_novedad().get_descripcion(),
                            descripcionEntrada:entrada
                        }
                    }
                };
                
                Request.realizarRequest(API.ORDENES_COMPRA.GESTIONAR_NOVEDADES, "POST", obj, function(data) {


                    AlertService.mostrarMensaje("warning", data.msj);

                    if (data.status === 200) {

                        var novedad_id = (data.obj.ordenes_compras.length === 0) ? $scope.producto.get_novedad().get_id() : data.obj.ordenes_compras[0].novedad_id;
                        $scope.producto.get_novedad().set_id(novedad_id);
                        $scope.producto.set_novedad($scope.producto.get_novedad());

                        //Subir Archivo
                        if ($scope.flow.files.length > 0) {
                            that.subir_archivo_novedad();
                        } else {

                            $modalInstance.close();
                        }
                    }
                });
            };

            that.subir_archivo_novedad = function() {
                
                $scope.flow.opts.query.data = JSON.stringify({
                    ordenes_compras: {
                        novedad_id: $scope.producto.get_novedad().get_id()
                    }
                });

                $scope.flow.upload();
            };

            $scope.respuesta_subida_archivo = function(file, message) {

                var data = (message !== undefined) ? JSON.parse(message) : {};
                $scope.flow.cancel();

                if (data.status === 200) {
                    $scope.buscar_detalle_orden_compra();

                    $modalInstance.close();
                } else {
                    AlertService.mostrarMensaje("warning", data.msj);
                }


            };

            that.render_observaciones = function(observaciones) {
                console.log("observaciones novedad ", observaciones);
                $scope.Empresa.limpiar_observaciones();

                observaciones.forEach(function(data) {

                    var observacion = Observacion.get(data.id, data.codigo, data.descripcion, data.tipo_entrada);
                    $scope.Empresa.set_observaciones(observacion);
                });                
            };

            that.render_archivos_novedad = function(archivos) {

                $scope.producto.get_novedad().limpiar_archivos();

                archivos.forEach(function(data) {

                    var archivo = Archivo.get(data.id, data.descripcion_archivo);
                    $scope.producto.get_novedad().set_archivos(archivo);
                });
            };


            $scope.cargar_archivo = function($flow) {

                $scope.flow = $flow;
                
            };
            
            $scope.abrir_fecha_inicial = function($event) {

                $event.preventDefault();
                $event.stopPropagation();

                $scope.datepickerFechaInicial = true;
                
                console.log("datepicker_fecha_inicial ", $scope.datepickerFechaInicial);

            };
            

            $scope.aceptar = function() {
                that.gestionar_novedades();
            };

            $scope.close = function() {
                $modalInstance.close();
            };
            
            $scope.onDescargarArchivo = function(archivo){
                console.log("onDescargarArchivo ", archivo);
                $scope.visualizarReporte("/OrdenesCompras/Novedades/" + archivo.descripcion, archivo.descripicion, "blank");
            };
            
            $scope.onSeleccionarNovedad = function(){
                console.log("on seleccionar novedad ", $scope.producto.novedad);
                
                if($scope.producto.novedad.observacion.getTipoEntrada() === '0'){
                      $scope.producto.get_novedad().setDescripcionEntrada($filter('date')(new Date(), "yyyy-MM-dd"));
                }
                
            };

            that.buscar_observaciones();
            that.buscar_archivos_novedad();

        }]);
});