define(["angular", "js/models"], function(angular, models) {

    models.factory('AutorizacionOrdenCompra', [function() {

            function AutorizacionOrdenCompra(orden, empresa, centroUtilidad, bodega) {
                this.orden = [];
                this.orden.push(orden);
                this.ordenSeleccionada = orden;
                this.centroUtilidad = centroUtilidad;
                this.bodega = bodega;
                this.empresa = empresa;
                this.nombreAutorizador = '';
                this.nombreAutorizador2 = '';
                this.usuarioIdAutorizador = '';
                this.usuarioIdAutorizador2 = '';
                this.swAutorizado = '';
                this.swNoAutorizado = '';
                this.swAutorizado2 = '';
                this.swAutorizado = '';
                this.justificacion = '';
                this.justificacion2 = '';
            }



            this.get = function(orden, empresa, centroUtilidad, bodega) {
                return new AutorizacionOrdenCompra(orden, empresa, centroUtilidad, bodega);
            };

            // ordenAutorizacionCompra array
            AutorizacionOrdenCompra.prototype.getOrden = function() {
                return this.orden;
            };

            AutorizacionOrdenCompra.prototype.setOrden = function(orden) {
                this.orden.push(orden);
            };

            // ordenAutorizacionCompra
            AutorizacionOrdenCompra.prototype.getOrdenSeleccionada = function() {
                return this.ordenSeleccionada;
            };

            AutorizacionOrdenCompra.prototype.setOrdenSeleccionada = function(ordenSeleccionada) {
                this.ordenSeleccionada = ordenSeleccionada;
            };

            // centroUtilidad
            AutorizacionOrdenCompra.prototype.getCentroUtilidad = function() {
                return this.centroUtilidad;
            };

            AutorizacionOrdenCompra.prototype.setcentroUtilidad = function(centroUtilidad) {
                this.centroUtilidad = centroUtilidad;
            };
            // bodega
            AutorizacionOrdenCompra.prototype.getBodega = function() {
                return this.bodega;
            };

            AutorizacionOrdenCompra.prototype.setBodega = function(bodega) {
                this.bodega = bodega;
            };
            // Empresa
            AutorizacionOrdenCompra.prototype.getEmpresa = function() {
                return this.empresa;
            };

            AutorizacionOrdenCompra.prototype.setEmpresa = function(empresa) {
                this.empresa = empresa;
            };
            // usuarioIdAutorizador
            AutorizacionOrdenCompra.prototype.getUsuarioIdAutorizador = function() {
                return this.usuarioIdAutorizador;
            };

            AutorizacionOrdenCompra.prototype.setUsuarioIdAutorizador = function(usuarioIdAutorizador) {
                this.usuarioIdAutorizador = usuarioIdAutorizador;
            };
            // nombre usuarioIdAutorizador
            AutorizacionOrdenCompra.prototype.getNombreAutorizador = function() {
                return this.nombreAutorizador;
            };

            AutorizacionOrdenCompra.prototype.setNombreAutorizador = function(nombreAutorizador) {
                this.nombreAutorizador = nombreAutorizador;
            };
            // nombre justificacion
            AutorizacionOrdenCompra.prototype.getJustificacion = function() {
                return this.justificacion;
            };

            AutorizacionOrdenCompra.prototype.setJustificacion = function(justificacion) {
                this.justificacion = justificacion;
            };

            // usuarioIdAutorizador
            AutorizacionOrdenCompra.prototype.getUsuarioIdAutorizador2 = function() {
                return this.usuarioIdAutorizador2;
            };

            AutorizacionOrdenCompra.prototype.setUsuarioIdAutorizador2 = function(usuarioIdAutorizador2) {
                this.usuarioIdAutorizador2 = usuarioIdAutorizador2;
            };

            // nombre usuarioIdAutorizador_2
            AutorizacionOrdenCompra.prototype.getNombreAutorizador2 = function() {
                return this.nombreAutorizador2;
            };

            AutorizacionOrdenCompra.prototype.setNombreAutorizador2 = function(nombreAutorizador2) {
                this.nombreAutorizador2 = nombreAutorizador2;
            };
            // nombre justificacion
            AutorizacionOrdenCompra.prototype.getJustificacion2 = function() {
                return this.justificacion2;
            };

            AutorizacionOrdenCompra.prototype.setJustificacion2 = function(justificacion2) {
                this.justificacion = justificacion2;
            };
            // swAutorizado
            AutorizacionOrdenCompra.prototype.getSwAutorizado = function() {
                return this.swAutorizado;
            };

            AutorizacionOrdenCompra.prototype.setSwAutorizado = function(swAutorizado) {
                this.swAutorizado = swAutorizado;
            };
            // swAutorizado
            AutorizacionOrdenCompra.prototype.getSwNoAutorizado = function() {
                return this.swNoAutorizado;
            };

            AutorizacionOrdenCompra.prototype.setSwNoAutorizado = function(swNoAutorizado) {
                this.swNoAutorizado = swNoAutorizado;
            };
            // swAutorizado2
            AutorizacionOrdenCompra.prototype.getSwAutorizado2 = function() {
                return this.swAutorizado2;
            };

            AutorizacionOrdenCompra.prototype.setSwAutorizado2 = function(swAutorizado2) {
                this.swAutorizado2 = swAutorizado2;
            };

            //borra el contenido del objeto
            AutorizacionOrdenCompra.prototype.vaciarCentroUtilidad = function() {
                this.centrosUtilidad = [];
            }

            return this;
        }]);
});