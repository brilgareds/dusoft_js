
var Reportes = function (drArias) {
    this.m_drArias = drArias;
};

/**
 * @author Andres M Gonzalez
 * +Descripcion controlador que lista todos los datos del Dr Arias
 * @params detalle: 
 * @fecha 2016-06-03
 */
Reportes.prototype.listarDrArias = function (req, res) {
    var that = this;
    var args = req.body.data;
    var termino_busqueda = {};
    //  var pagina_actual = args.autorizaciones.pagina_actual;

    G.Q.ninvoke(this.m_drArias, 'listarDrArias', termino_busqueda).
    then(function (resultado) {
        console.log(resultado);
        
        __generarCsvDrArias(resultado, function(nombre_pdf) {
                    
                    res.send(G.utils.r(req.url, 'Documento Generado Correctamete', 200,{
                      //  movimientos_bodegas: {nombre_pdf: nombre_pdf}
                        listarDrArias: {nombre_pdf: nombre_pdf, datos_documento: datos_documento}
                    }));
                });
//        res.send(G.utils.r(req.url, 'Listado de Dr Arias!!!!', 200, {listarDrArias: resultado}));
    }).
    fail(function (err) {
        console.log("error controller ", err);
        res.send(G.utils.r(req.url, 'Error Listado Dr Arias', 500, {listarDrArias: err}));
    }).
    done();

};

function __generarCsvDrArias(datos, callback) {  

    G.jsreport.render({
        template: {
            content: G.fs.readFileSync('app_modules/Reportes/DrArias/reports/drArias.html', 'utf8'),
            recipe: "html",
            engine: 'jsrender',
            phantom: {
                margin: "10px",
                width: '700px'
            }
        },
        data: datos
    }, function(err, response) {
        
        response.body(function(body) {
           var fecha = new Date();
           var nombreTmp = "andres.html";
           G.fs.writeFile(G.dirname + "/public/reports/" + nombreTmp, body,  "binary",function(err) {
                if(err) {
                    console.log(err);
                } else {
                    callback(nombreTmp);
                }
            });
                
            
        });
    });
}


Reportes.$inject = [
    "m_drArias"
];

module.exports = Reportes;