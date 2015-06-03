define(["angular", "js/models"], function(angular, models) {

    models.factory('RecepcionMercancia', ["$filter", function($filter) {

            function RecepcionMercancia(empresa_id, numero_recepcion, fecha_registro) {
                this.empresa_id = empresa_id || '';
                this.numero_recepcion = numero_recepcion || '';
                this.orden_compra = '';
                this.numero_guia = '';
                this.numero_factura = '';
                this.proveedor = '';
                this.transportadora = '';
                this.novedad = '';
                this.cantidad_cajas = 0;
                this.cantidad_neveras = 0;
                this.temperatura_neveras = '';
                this.contiene_medicamentos = true;
                this.contiene_dispositivos = false;
                this.hora_ingreso = new Date();
                this.fecha_ingreso = $filter('date')(new Date(), "dd-MM-yyyy");
                this.fecha_registro = fecha_registro || '';
            }

            this.get = function(empresa_id, numero_recepcion, fecha_registro) {
                return new RecepcionMercancia(empresa_id, numero_recepcion, fecha_registro);
            };

            RecepcionMercancia.prototype.set_numero_recepcion = function(numero_recepcion) {
                this.numero_recepcion = numero_recepcion;
            };

            RecepcionMercancia.prototype.set_empresa_id = function(empresa_id) {
                this.empresa_id = empresa_id;
            };

            RecepcionMercancia.prototype.set_proveedor = function(proveedor) {
                this.proveedor = proveedor;
            };

            RecepcionMercancia.prototype.set_orden_compra = function(orden_compra) {
                this.orden_compra = orden_compra;
            };

            RecepcionMercancia.prototype.set_transportadora = function(transportadora) {
                this.transportadora = transportadora;
            };

            RecepcionMercancia.prototype.set_novedad = function(novedad) {
                this.novedad = novedad;
            };

            RecepcionMercancia.prototype.set_numero_guia = function(numero_guia) {
                this.numero_guia = numero_guia;
            };

            RecepcionMercancia.prototype.set_numero_factura = function(numero_factura) {
                this.numero_factura = numero_factura;
            };

            RecepcionMercancia.prototype.set_cantidad_cajas = function(cantidad_cajas) {
                this.cantidad_cajas = cantidad_cajas;
            };

            RecepcionMercancia.prototype.set_cantidad_neveras = function(cantidad_neveras) {
                this.cantidad_neveras = cantidad_neveras;
            };

            RecepcionMercancia.prototype.set_temperatura_neveras = function(temperatura_neveras) {
                this.temperatura_neveras = temperatura_neveras;
            };

            RecepcionMercancia.prototype.set_contiene_medicamentos = function() {
                this.contiene_dispositivos = false;
                this.contiene_medicamentos = true;
            };

            RecepcionMercancia.prototype.set_contiene_dispositivos = function() {
                this.contiene_dispositivos = true;
                this.contiene_medicamentos = false;
            };

            RecepcionMercancia.prototype.set_hora_ingreso = function(hora_ingreso) {
                this.hora_ingreso = hora_ingreso;
            };

            RecepcionMercancia.prototype.set_fecha_ingreso = function(fecha_ingreso) {
                this.fecha_ingreso = fecha_ingreso;
            };
            
            RecepcionMercancia.prototype.set_fecha_registro = function(fecha_registro) {
                this.fecha_registro = fecha_registro;
            };



            RecepcionMercancia.prototype.get_numero_recepcion = function() {
                return this.numero_recepcion;
            };

            RecepcionMercancia.prototype.get_empresa_id = function() {
                return this.empresa_id;
            };

            RecepcionMercancia.prototype.get_proveedor = function() {
                return this.proveedor;
            };

            RecepcionMercancia.prototype.get_orden_compra = function() {
                return this.orden_compra;
            };

            RecepcionMercancia.prototype.get_transportadora = function() {
                return this.transportadora;
            };

            RecepcionMercancia.prototype.get_novedad = function() {
                return this.novedad;
            };

            RecepcionMercancia.prototype.get_numero_guia = function() {
                return this.numero_guia;
            };

            RecepcionMercancia.prototype.get_numero_factura = function() {
                return this.numero_factura;
            };

            RecepcionMercancia.prototype.get_cantidad_cajas = function() {
                return this.cantidad_cajas;
            };

            RecepcionMercancia.prototype.get_cantidad_neveras = function() {
                return this.cantidad_neveras;
            };

            RecepcionMercancia.prototype.get_temperatura_neveras = function() {
                return this.temperatura_neveras;
            };

            RecepcionMercancia.prototype.get_contiene_medicamentos = function() {
                return this.contiene_medicamentos;
            };

            RecepcionMercancia.prototype.get_contiene_dispositivos = function() {
                return this.contiene_dispositivos;
            };

            RecepcionMercancia.prototype.get_hora_ingreso = function() {
                return this.hora_ingreso;
            };

            RecepcionMercancia.prototype.get_fecha_ingreso = function() {
                return this.fecha_ingreso;
            };
            
            RecepcionMercancia.prototype.get_fecha_registro = function() {
                return this.fecha_registro;
            };

            RecepcionMercancia.prototype.validar_campos_ingreso = function() {

                var continuar = true;
                var msj = '';
                var msj = [];

                if (this.proveedor === '' || this.orden_compra === '' || this.transportadora === '') {
                    continuar = false;
                    msj.push('Seleccionar un proveedor');
                }
                if (this.orden_compra === '') {
                    continuar = false;
                    msj.push('Seleccionar una orden de compra');
                }
                if (this.transportadora === '') {
                    continuar = false;
                    msj.push('Seleccionar la transportadora');
                }

                if (this.numero_guia === '') {
                    continuar = false;
                    msj.push('Ingresar el numero de la guia');
                }

                if (this.numero_factura === '') {
                    continuar = false;
                    msj.push('Ingresar el numero de la factura');
                }

                if (this.fecha_ingreso === '') {
                    continuar = false;
                    msj.push('Ingresar la fecha de ingreso');
                }

                if (this.hora_ingreso === null) {
                    continuar = false;
                    msj.push('Ingresar hora de ingreso');
                }


                // Validar que las cantidad de cajas no sean 0 o vacias                                
                if (this.cantidad_cajas === '' || this.cantidad_cajas === 0) {
                    if (this.cantidad_neveras === '') {
                        continuar = false;
                        msj.push('Ingresar cantidad de cajas o neveras');
                    }
                }

                if (this.cantidad_neveras === '' || this.cantidad_neveras === 0) {
                    this.temperatura_neveras = '';
                }

                // Validar que si ingresar neveras, obligatoriamente ingresen la temperatura de la nevera
                if (this.cantidad_neveras !== '' && this.cantidad_neveras !== 0) {
                    if (this.temperatura_neveras === '') {
                        continuar = false;
                        msj.push('Ingresar la temperatura de las neveras');
                    }
                }


                return {continuar: continuar, msj: msj.join(', ')};
            };

            return this;
        }]);
});