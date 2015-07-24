module.exports = function(app, di_container) {
    
    var c_clientes = di_container.get("c_clientes");
    
    /*
     * Author:  Camilo Orozco
     * Descripcion: Consulta el listado de clientes de una ciudad
     */
    app.post('/api/Terceros/Clientes/listarClientes', function(req, res) {
         c_clientes.listarClientes(req, res);
    });    
    
    /*
     * Author:  Camilo Orozco
     * Descripcion: Consulta el listado de clientes de una ciudad
     */
    app.post('/api/Terceros/Clientes/listarClientesCiudad', function(req, res) {
         c_clientes.listarClientesCiudad(req, res);
    });
    
    //Consulta Contrato Clientes
    app.post('/api/Terceros/Clientes/consultarContratoCliente', function(req, res) {
         c_clientes.consultarContratoCliente(req, res);
    });
    
    //Trae el Nombre del País
    app.post('/api/Terceros/Clientes/nombrePais', function(req, res) {
         c_clientes.nombrePais(req, res);
    });
    
    //Trae el Nombre del Departamento
    app.post('/api/Terceros/Clientes/nombreDepartamento', function(req, res) {
         c_clientes.nombreDepartamento(req, res);
    });
    
    //Trae el Nombre del Municipio
    app.post('/api/Terceros/Clientes/nombreMunicipio', function(req, res) {
         c_clientes.nombreMunicipio(req, res);
    });
    
};