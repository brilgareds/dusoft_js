module.exports = function(app){

    app.get('/api/FacturacionProveedores/index', function(req, res){
        res.send({ title: 'Facturacion Proveedores Index'  });
    });

}