
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
    var filtro = args;
    var datos={};
    filtro.dias=1;
    filtro.fecha_inicial=G.moment(filtro.fecha_inicial).format("YYYY-MM-DD");
    filtro.fecha_final=G.moment(filtro.fecha_final).format("YYYY-MM-DD");
    filtro.nombre='drArias_'+filtro.fecha_inicial+'_'+filtro.fecha_final+'_'+Math.floor((Math.random() * 100000) + 1)+'.csv';    
    datos.nombre_reporte='drArias';
    datos.nombre_archivo=filtro.nombre;
    datos.fecha_inicio=G.moment().format();
    datos.usuario=filtro.session.usuario_id;
    datos.estado='0';
    datos.busqueda=filtro;  
    
    __guardarEstadoReporte(that,datos);
    
    res.send(G.utils.r(req.url, 'Generando Informe...', 200, {listarDrArias: 'pendiente'})); 
    
    G.Q.ninvoke(that.m_drArias, 'listarDrArias', filtro).then(function (resultado) {
        if(resultado !== -1 ){
        __generarCsvDrArias(resultado,filtro, function(tamaño) {
                  datos.fecha_fin=G.moment().format();
                  if(tamaño>0){
                  datos.estado='1';
                  }else{
                  datos.estado='3';     
                  }
                  __editarEstadoReporte(that,datos);
                });
        }else{
            datos.fecha_fin=G.moment().format();
            datos.estado='2';
            __editarEstadoReporte(that,datos);
        }
    }).
    fail(function (err) {
        console.log("error controller ", err);
        res.send(G.utils.r(req.url, 'Error Listado Dr Arias', 500, {listarDrArias: err}));
    }).
    done();
};

/*
* @author Andres M Gonzalez
* funcion para consultar reportesGenerados
* @param {type} req
* @param {type} res
* @returns {datos de consulta}
*/
Reportes.prototype.reportesGenerados = function(req, res) {
    
    var that = this;
    var args = req.body.data;
    var datos = {};
    datos.usuario=args.session.usuario_id;
    that.m_drArias.reportesGenerados(datos,function(err, reportes ) {
        if (err) {
            res.send(G.utils.r(req.url, 'Error listando los reportes generados', 500, {reportes: err}));
        } else {
            res.send(G.utils.r(req.url, 'Lista de reportes generados OK', 200, {reportes: reportes}));
        }
    });
};

/**
 * @author Andres M Gonzalez
 * +Descripcion controlador que lista los planes
 * @params detalle: 
 * @fecha 2016-06-17
 */
Reportes.prototype.listarPlanes = function (req, res) {
    var that = this;
    var args = req.body.data;
    
    G.Q.ninvoke(that.m_drArias, 'listarPlanes').then(function (listarPlanes) {
       res.send(G.utils.r(req.url, 'Listado Planes', 200, {listarPlanes: listarPlanes}));  
    }).
    fail(function (err) {
        console.log("error controller ", err);
        res.send(G.utils.r(req.url, 'Error Listado Planes', 500, {listarPlanes: err}));
    }).
    done();
};

function __generarCsvDrArias(datos,filtro, callback) {  
    
    console.log("Generar CSV DR ARDIAS");
    
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
          callback(datos.length);
          console.log('file saved');
        });
      });
}


function __guardarEstadoReporte(that,datos){
   
    G.Q.ninvoke(that.m_drArias, 'guardarEstadoReporte',datos).then(function (resultado) {       
    }).
    fail(function (err) {
        console.log("error controller guardarEstadoReporte ", err);
    }).
    done();
}

function __editarEstadoReporte(that,datos){   
    G.Q.ninvoke(that.m_drArias, 'editarEstadoReporte',datos).then(function (resultado) {       
    }).
    fail(function (err) {
        console.log("error controller editarEstadoReporte ", err);
    }).
    done();
}

Reportes.$inject = [
    "m_drArias","j_reporteDrAriasJobs"
];

module.exports = Reportes;