module.exports = function(app){

    app.get('/api/FormulacionExterna/index', function(req, res){
        res.send({ msj : 'Formulacion Externa Index'  });
    });

}