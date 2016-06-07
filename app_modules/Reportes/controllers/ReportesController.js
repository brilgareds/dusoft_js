
var Reportes = function(drArias) {
    this.m_drArias = drArias;
};

/**
* @author Andres M Gonzalez
* +Descripcion controlador que lista todos los datos del Dr Arias
* @params detalle: 
* @fecha 2016-06-03
*/
Reportes.prototype.listarDrArias = function(req, res) {
    var that = this;
    var args = req.body.data;
    var termino_busqueda = {};
  //  var pagina_actual = args.autorizaciones.pagina_actual;

        G.Q.ninvoke(this.m_drArias,'listarDrArias',termino_busqueda).
          then(function(resultado) {
      console.log("resultado controller ",resultado);
          res.send(G.utils.r(req.url, 'Listado de Dr Arias!!!!', 200, {listarDrArias: resultado}));
        }).
          fail(function(err) {
          console.log("error controller ",err);
          res.send(G.utils.r(req.url, 'Error Listado Dr Arias', 500, {listarDrArias: err}));
        }).
          done();
};

Reportes.$inject = [
                          "m_drArias"
                         ];

module.exports = Reportes;