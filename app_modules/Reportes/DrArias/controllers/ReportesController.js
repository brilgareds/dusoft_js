
var Reportes = function (drArias,j_reporteDrAriasJobs,eventos_dr_arias) {
    this.m_drArias = drArias;
    this.j_reporteDrAriasJobs = j_reporteDrAriasJobs;
    this.e_dr_arias = eventos_dr_arias;
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
    datos.nombre_reporte='Reporte Dr Arias';
    datos.nombre_archivo=filtro.nombre;
    datos.fecha_inicio=G.moment().format();
    datos.usuario=filtro.session.usuario_id;
    datos.estado='0';
    datos.busqueda=filtro; 
    __guardarEstadoReporte(that,datos);   
    
    that.e_dr_arias.onNotificarEstadoDescargaReporte(datos.usuario);
    res.send(G.utils.r(req.url, 'Generando Informe...', 200, {listarDrArias: 'pendiente'})); 
    
    G.Q.ninvoke(that.m_drArias, 'listarDrArias', filtro).then(function (resultado) {
        if(resultado !== -1 ){
            
       
             
        __generarCsvDrArias(resultado,filtro, function(tamaño) {
                  datos.fecha_fin=G.moment().format();
                  if(tamaño>0){
                  datos.estado='1';
                   __generarDetalle(resultado,datos,that,function(){});
                  }else{
                  datos.estado='3';     
                  }
                  __editarEstadoReporte(that,datos);
                  that.e_dr_arias.onNotificarEstadoDescargaReporte(datos.usuario);
                });
        }else{
            datos.fecha_fin=G.moment().format();
            datos.estado='2';
            __editarEstadoReporte(that,datos);
            that.e_dr_arias.onNotificarEstadoDescargaReporte(datos.usuario);
        }
    }).
    fail(function (err) {
        console.log("error controller ", err);
        datos.fecha_fin=G.moment().format();
        datos.estado='2';
        __editarEstadoReporte(that,datos);
        that.e_dr_arias.onNotificarEstadoDescargaReporte(datos.usuario);
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


/**
 * @author Andres M Gonzalez
 * +Descripcion controlador que genera detalle
 * @params detalle: 
 * @fecha 2016-08-02
 */
function __generarDetalle(resultado,datos,that,callback) {  
    var formula='';
    var countFormula=0;
    var countPaciente=0;
    var paciente='';
    var total=0;
    var cantidades=0;
    var precio=0;
    var bodegas=[];  
    var detalle={};
    var consolidado={};
    var control=true;
    var bodega="";
    var bga=[];
    var i=0;
    var totalDetalle=0;
    var countPaciente_2=0;
    var countFormula_2=0;
  for (var key in resultado){
      i++;
    var value = resultado[key];
    if(control){
       bodega=value.nom_bode; 
       control=false;
       countPaciente_2=0;
       countFormula_2=0;
    }
    if(value.formula_id !== formula){
        countFormula++;
        countFormula_2++;
        formula=value.formula_id;        
        consolidado.countformula=countFormula_2;        
    }
    if(value.paciente_id !== paciente){
        countPaciente++;
        countPaciente_2++;
        consolidado.countpaciente=countPaciente_2;
        paciente=value.paciente_id;
    }
    
    var tt=value.total.replace(",",".");
    var prc=value.precio.replace(",",".");
    total=total+parseFloat(tt);
    precio=precio+parseFloat(prc);
    cantidades += parseInt(value.cantidad);
        totalDetalle=totalDetalle+parseFloat(tt);
        consolidado.total=totalDetalle;
        
     if(value.nom_bode !== bodega || resultado.length==i){
        consolidado.bodega=bodega;
        bodegas[bodega]=consolidado; 
        bga.push(consolidado);
        bodega=value.nom_bode;
        countPaciente_2=0;
        countFormula_2=0;        
        totalDetalle=0;
        consolidado={};
    }
        
        
  }
  detalle.cantidadFomulas=countFormula;
  detalle.cantidadPacientes=countPaciente;
  detalle.cantidadDespachoUnidades=cantidades;
  detalle.total=total;
  detalle.precio=precio;
  datos.detalle=detalle;  
  datos.bodegasdetalle=JSON.stringify(bga);
  __editarConsolidadoReporte(that,datos);
return;
}

/**
 * @author Andres M Gonzalez
 * +Descripcion controlador que genera csv
 * @params detalle: 
 * @fecha 2016-06-17
 */
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
                    del: ';',
                    hasCSVColumnTitle:'Dr Arias'
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

function __editarConsolidadoReporte(that,datos){   
    G.Q.ninvoke(that.m_drArias, 'editarConsolidadoReporte',datos).then(function (resultado) {       
    }).
    fail(function (err) {
        console.log("error controller editarConsolidadoReporte ", err);
    }).
    done();
}

Reportes.$inject = [
    "m_drArias","j_reporteDrAriasJobs","e_dr_arias"
];

module.exports = Reportes;