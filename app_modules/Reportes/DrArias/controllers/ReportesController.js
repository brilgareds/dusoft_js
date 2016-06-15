
var Reportes = function (drArias,j_reporteDrAriasJobs) {
    this.m_drArias = drArias;
    this.j_reporteDrAriasJobs = j_reporteDrAriasJobs;
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
    var filtro = {fecha_inicial:'2016-06-14', fecha_final:'2016-06-15', dias:1};
    filtro.nombre='drArias_'+filtro.fecha_inicial+'_'+filtro.fecha_final+'.csv';
    //  var pagina_actual = args.autorizaciones.pagina_actual;
    res.send(G.utils.r(req.url, 'Listado Dr Arias', 200, {listarDrArias: 'pendiente'}));   
  
    G.Q.ninvoke(that.m_drArias, 'listarDrArias', termino_busqueda).then(function (resultado) {
        
        __generarCsvDrArias(resultado,filtro, function(nombre_pdf) {
                });
//        res.send(G.utils.r(req.url, 'Listado de Dr Arias!!!!', 200, {listarDrArias: resultado}));
    }).
    fail(function (err) {
        console.log("error controller ", err);
        res.send(G.utils.r(req.url, 'Error Listado Dr Arias', 500, {listarDrArias: err}));
    }).
    done();

};

function __generarCsvDrArias(datos,filtro, callback) {  
    
    console.log("Generar CSV DR ARDIAS");
        //fields=Object.keys(datos[0]);
        var fields =  ["fecha","fecha_formula","formula_id","formula_papel","nom_bode","plan_descripcion","usuario_digita",
                        "descripcion_tipo_formula","paciente_id","paciente","tercero_id","medico","especialidad",
                        "codigo_producto","codigo_cum","producto","cantidad","precio","total","eps_punto_atencion_nombre"];
                    
       var fieldNames=["FECHA","FECHA FORMULA","FORMULA_ID","FORMULA","FARMACIA","PROGRAMA","USUARIO FARMACIA",
                        "TIPO FORMULA","CC. PACIENTE","NOMBRES PACIENTE","CC. MEDICO","MEDICO","ESPECIALIDAD",
                        "CODIGO","CODIGO CUM","PRODUCTO","CANTIDAD","PRECIO UNITARIO","PRECIO TOTAL","PUNTO DE ATENCION"];
        var opts = {
                    data: datos,
                    fields: fields,
                    fieldNames: fieldNames,
                    del: ';'
                  };
                  
       G.json2csv(opts, function(err, csv) {
        if (err) console.log("Eror de Archivo: ",err);
        var nombreReporte=filtro.nombre;
        G.fs.writeFile(G.dirname + "/public/reports/" +nombreReporte, csv, function(err) {
          if (err){ 
           console.log('Error ',err);
           throw err;
          }
          console.log('file saved');
        });
      });
}


Reportes.$inject = [
    "m_drArias","j_reporteDrAriasJobs"
];

module.exports = Reportes;