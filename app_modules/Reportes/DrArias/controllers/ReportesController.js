
var Reportes = function(drArias, j_reporteDrAriasJobs, eventos_dr_arias) {
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
Reportes.prototype.listarDrArias = function(req, res) {
    var that = this;
    var args = req.body.data;
    var filtro = args;
    var datos = {};
    filtro.dias = 1;
    var resultado = [];
    filtro.fecha_inicial = G.moment(filtro.fecha_inicial).format("YYYY-MM-DD");
    filtro.fecha_final = G.moment(filtro.fecha_final).format("YYYY-MM-DD");
    filtro.nombre = 'drArias_' + filtro.fecha_inicial + '_' + filtro.fecha_final + '_' + Math.floor((Math.random() * 100000) + 1) + '.csv';
    datos.nombre_reporte = 'Reporte Dr Arias';
    datos.nombre_archivo = filtro.nombre;
    datos.fecha_inicio = G.moment().format();
    datos.usuario = filtro.session.usuario_id;
    datos.estado = '0';
    datos.busqueda = filtro;
    G.Q.nfcall(__guardarEstadoReporte, that, datos).then(function(resultados) {

	//estado del reporte 0- En proceso 1- generado 2- error al generar 3- reporte con cero registros
	that.e_dr_arias.onNotificarEstadoDescargaReporte(datos.usuario);
	res.send(G.utils.r(req.url, 'Generando Informe...', 200, {listarDrArias: 'pendiente'}));

	return G.Q.ninvoke(that.m_drArias, 'listarDrArias', filtro);

    }).then(function(resultados) {

	resultado = resultados;
	if (resultado !== -1) {

	    return G.Q.nfcall(__generarCsvDrArias, resultado, filtro);

	} else {
	    return 0;
	}

    }).then(function(tamaño) {

	datos.fecha_fin = G.moment().format();
	if (tamaño > 0) {
	    datos.estado = '1';
	    return G.Q.nfcall(__generarDetalle, resultado, datos, that);
	} else {
	    datos.estado = '3';
	    return true;
	}

    }).then(function(result) {
	return G.Q.nfcall(__editarEstadoReporte, that, datos);

    }).then(function(result) {
	that.e_dr_arias.onNotificarEstadoDescargaReporte(datos.usuario);

    }).fail(function(err) {
	datos.fecha_fin = G.moment().format();
	datos.estado = '2';
	return G.Q.nfcall(__editarEstadoReporte, that, datos);
	that.e_dr_arias.onNotificarEstadoDescargaReporte(datos.usuario);
    }).done();
};
Reportes.prototype.listarDrArias0 = function(req, res) {
    var that = this;
    var args = req.body.data;
    var filtro = args;
    var datos = {};
    filtro.dias = 1;
    filtro.fecha_inicial = G.moment(filtro.fecha_inicial).format("YYYY-MM-DD");
    filtro.fecha_final = G.moment(filtro.fecha_final).format("YYYY-MM-DD");
    filtro.nombre = 'drArias_' + filtro.fecha_inicial + '_' + filtro.fecha_final + '_' + Math.floor((Math.random() * 100000) + 1) + '.csv';
    datos.nombre_reporte = 'Reporte Dr Arias';
    datos.nombre_archivo = filtro.nombre;
    datos.fecha_inicio = G.moment().format();
    datos.usuario = filtro.session.usuario_id;
    datos.estado = '0';
    datos.busqueda = filtro;
    __guardarEstadoReporte(that, datos);

    that.e_dr_arias.onNotificarEstadoDescargaReporte(datos.usuario);
    res.send(G.utils.r(req.url, 'Generando Informe...', 200, {listarDrArias: 'pendiente'}));

    G.Q.ninvoke(that.m_drArias, 'listarDrArias', filtro).then(function(resultado) {
	if (resultado !== -1) {

	    __generarCsvDrArias(resultado, filtro, function(tamaño) {
		datos.fecha_fin = G.moment().format();
		if (tamaño > 0) {
		    datos.estado = '1';
		    __generarDetalle(resultado, datos, that, function() {
		    });
		} else {
		    datos.estado = '3';
		}
		__editarEstadoReporte(that, datos);
		that.e_dr_arias.onNotificarEstadoDescargaReporte(datos.usuario);
	    });
	} else {
	    datos.fecha_fin = G.moment().format();
	    datos.estado = '2';
	    __editarEstadoReporte(that, datos);
	    that.e_dr_arias.onNotificarEstadoDescargaReporte(datos.usuario);
	}
    }).
	    fail(function(err) {
	console.log("error controller ", err);
	datos.fecha_fin = G.moment().format();
	datos.estado = '2';
	__editarEstadoReporte(that, datos);
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
    datos.usuario = args.session.usuario_id;
    that.m_drArias.reportesGenerados(datos, function(err, reportes) {
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
Reportes.prototype.listarPlanes = function(req, res) {
    var that = this;
    var args = req.body.data;

    G.Q.ninvoke(that.m_drArias, 'listarPlanes').then(function(listarPlanes) {
	res.send(G.utils.r(req.url, 'Listado Planes', 200, {listarPlanes: listarPlanes}));
    }).
	    fail(function(err) {
	console.log("error controller listarPlanes ", err);
	res.send(G.utils.r(req.url, 'Error Listado Planes', 500, {listarPlanes: err}));
    }).
	    done();
};



Reportes.prototype.listarPlanes0 = function(req, res) {
    var that = this;
    var args = req.body.data;
    
    G.Q.ninvoke(that.m_drArias, 'rotacion').then(function(listarPlanes) {
     
        return G.Q.nfcall(__organizaRotacion,0,listarPlanes,[]);
        
     }).then(function(resultados) {
        // console.log(">>>>>>",resultados)
         return G.Q.nfcall(__creaExcel,resultados);
         
     }).then(function(resultados) {
         
	res.send(G.utils.r(req.url, 'Listado Planes', 200, {listarPlanes: resultados}));
        
    }).fail(function(err) {
        
	console.log("error controller listarPlanes ", err);
	res.send(G.utils.r(req.url, 'Error Listado Planes', 500, {listarPlanes: err}));
        
    }).done();

};

function __creaExcel(data,callback){
var workbook = new G.Excel.Workbook();
var worksheet = workbook.addWorksheet('Discography', {properties:{tabColor:{argb:'FFC0000'}}});


worksheet.addRow(["MAN PALO GRANDE"]) ;


var alignment = { vertical: 'middle', horizontal: 'center' };
var border={
    top: {style:'thin'},
    left: {style:'thin'},
    bottom: {style:'thin'},
    right: {style:'thin'} };

var font = { name: 'Calibri',size: 9 };

var style= { font: font,border : border };
// add column headers
worksheet.columns = [
    { header: 'CODIGO', key: 'a', style: style },
    { header: 'PRODUCTO', key: 'b',width: 50, style: style },
    { header: 'MOLECULA', key: 'c',width: 25, style: style },
    { header: 'LABORATORIO', key: 'd', style: style },
    { header: 'TIPO PRODUCTO', key: 'e', style: style },
    { header: 'NIVEL', key: 'f', style: style },
    { header: 'SALIDA 1', key: 'g', style: style },
    { header: 'SALIDA 2', key: 'h', style: style },
    { header: 'Promedio Mes', key: 'i',width: 10, style: style },
    { header: 'Stock Farmacia', key: 'j',width: 10, style: style },
    { header: 'Pedidos 60 Dias', key: 'k',width: 10, style: style },
    { header: '', key: 'l',width: 10, style: style },
    { header: 'Stock Bodega', key: 'm',width: 10, style: style}
];

worksheet.views = [
    {zoomScale: 160,state: 'frozen', xSplit: 1, ySplit: 1, activeCell: 'A1'}
];
     var i=1;
    data.forEach(function(element) {
         console.log(element);
        if (element.color === 'ROJO') {
            worksheet.addRow([element.codigo_poducto, element.poducto, element.molecula, element.laboratorio, element.tipo_producto, element.nivel,
                element.sum1, element.sum2, element.promedioMes, element.totalStock, element.pedido60Dias, '', element.stockBodega]).font = {
                color: {argb: 'C42807'}, name: 'Calibri',size: 9
            };
        }else{
            worksheet.addRow([element.codigo_poducto, element.poducto, element.molecula, element.laboratorio, element.tipo_producto, element.nivel,
                element.sum1, element.sum2, element.promedioMes, element.totalStock, element.pedido60Dias, '', element.stockBodega]); 
        }
        
        worksheet.getColumn('A').hidden = true;
        worksheet.getColumn('D').hidden = true;
        worksheet.getColumn('E').hidden = true;
        worksheet.getColumn('F').hidden = true;
        worksheet.getColumn('G').hidden = true;
        worksheet.getColumn('H').hidden = true;
        worksheet.getColumn('N').hidden = true;
        worksheet.getColumn('O').hidden = true;
        
         i++;
      });
      


var font = {
    name: 'SansSerif',
    size: 9,
    bold: true
};

var alignment = { vertical: 'distributed', horizontal: 'center'  };

var border = {
    top: {style:'thin'},
    left: {style:'thin'},
    bottom: {style:'thin'},
    right: {style:'thin'}
};

var style = { font: font , border : border ,alignment : alignment } ;

worksheet.getCell('A1').style = style;
worksheet.getCell('B1').style = style;
worksheet.getCell('C1').style = style;
worksheet.getCell('D1').style = style;
worksheet.getCell('E1').style = style;
worksheet.getCell('F1').style = style;
worksheet.getCell('G1').style = style;
worksheet.getCell('H1').style = style;
worksheet.getCell('I1').style = style;
worksheet.getCell('J1').style = style;
worksheet.getCell('K1').style = style;
worksheet.getCell('L1').style = style;
worksheet.getCell('M1').style = style;
//
//worksheet.getCell('A1').font = font;
//worksheet.getCell('B1').font = font;
//worksheet.getCell('C1').font = font;
//worksheet.getCell('D1').font = font;
//worksheet.getCell('E1').font = font;
//worksheet.getCell('F1').font = font;
//worksheet.getCell('G1').font = font;
//worksheet.getCell('H1').font = font;
//worksheet.getCell('I1').font = font;
//worksheet.getCell('J1').font = font;
//worksheet.getCell('K1').font = font;
//worksheet.getCell('L1').font = font;
//worksheet.getCell('M1').font = font;
//
//worksheet.getCell('A1').alignment = alignment;
//worksheet.getCell('B1').alignment = alignment;
//worksheet.getCell('C1').alignment = alignment;
//worksheet.getCell('D1').alignment = alignment;
//worksheet.getCell('E1').alignment = alignment;
//worksheet.getCell('F1').alignment = alignment;
//worksheet.getCell('G1').alignment = alignment;
//worksheet.getCell('H1').alignment = alignment;
//worksheet.getCell('I1').alignment = alignment;
//worksheet.getCell('J1').alignment = alignment;
//worksheet.getCell('K1').alignment = alignment;
//worksheet.getCell('L1').alignment = alignment;
//worksheet.getCell('M1').alignment = alignment;

// add rows the dumb way
//worksheet.addRow(["Fearless", 2008]);
//worksheet.addRow(["Fearless", 2008]);
//worksheet.addRow(["Fearless", 2008]);
//worksheet.addRow(["Fearless", 2008]);
//worksheet.addRow(["Fearless", 2008]);
//worksheet.addRow(["Fearless", 2008]);
//worksheet.addRow(["Fearless", 2008]);
//
//// add an array of rows
//var rows = [
//  ["Speak Now", 2010],
//  {album: "Red", year: 2012}
//  
//];
//worksheet.addRows(rows);
//
// worksheet.getRow(5).font = {
//    name: 'Arial Black',
//    color: { argb: 'C42807' },
//    family: 2,    
//    size: 9,
//    italic: true
//};
//
//worksheet.getCell('A2').fill = {
//    type: 'pattern',
//    pattern:'darkTrellis',
//    fgColor:{argb:'FFFFFF00'},
//    bgColor:{argb:'FF0000FF'}
//};
//
//worksheet.getCell('A1').font = {
//    name: 'Arial Black',
//    color: { argb: 'C42807' },
//    family: 2,    
//    size: 9,
//    italic: true
//};
//
////var dobCol = worksheet.getColumn('a');
////ocultar
////dobCol.hidden = true;
//
//worksheet.getCell('F1').value = "Tulua";

// save workbook to disk
workbook.xlsx.writeFile('./taylor_swift.xlsx').then(function() {
  console.log("saved");
   callback(false, 'taylor_swift.xlsx');
}); 
}

function __organizaRotacion(index, data, resultado, callback) {

    var _resultado = data[index];
    index++;
    if (_resultado) {
        callback(false, resultado);
    }

    var resultColumna = {
        codigo_poducto: _resultado.codigo_producto,
        poducto: _resultado.producto,
        molecula: _resultado.molecula,
        laboratorio: _resultado.laboratorio,
        tipo_producto: _resultado.tipo_producto,
        sum1: _resultado.sum
    };
    
    if (_resultado.codigo_producto === data[index].codigo_producto) {
        resultColumna.sum2 = data[index].sum;
        index++;
    } else {
        resultColumna.sum2 = 0;
    }
    
    resultColumna.promedioMes = Math.ceil((resultColumna.sum2+resultColumna.sum1)/2);
    resultColumna.totalStock = _resultado.existencia;
    resultColumna.pedido60Dias = ((resultColumna.sum2+resultColumna.sum1)) - ( _resultado.existencia) > 0 ? (resultColumna.sum2+resultColumna.sum1) - (_resultado.existencia):0;
    resultColumna.stockBodega = _resultado.existencia_bd;
    resultColumna.nivel = _resultado.nivel;
    resultColumna.tipo_producto = _resultado.tipo_producto;    
    resultColumna.color= _resultado.existencia/((Math.ceil((resultColumna.sum2+resultColumna.sum1)) / 2)>0?Math.ceil(((resultColumna.sum2+resultColumna.sum1)) / 2):1)>=5?"ROJO":"N/A";
    
     resultado.push(resultColumna);
    
     return __organizaRotacion(index, data, resultado, callback);
}


/**
 * @author Andres M Gonzalez
 * +Descripcion controlador que genera detalle
 * @params detalle: 
 * @fecha 2016-08-02
 */
function __generarDetalle(resultado, datos, that, callback) {
    var formula = '';
    var countFormula = 0;
    var countPaciente = 0;
    var paciente = '';
    var total = 0;
    var cantidades = 0;
    var precio = 0;
    var bodegas = [];
    var detalle = {};
    var consolidado = {};
    var control = true;
    var bodega = "";
    var bga = [];
    var i = 0;
    var totalDetalle = 0;
    var countPaciente_2 = 0;
    var countFormula_2 = 0;
    for (var key in resultado) {
	i++;
	var value = resultado[key];
	if (control) {
	    bodega = value.nom_bode;
	    control = false;
	    countPaciente_2 = 0;
	    countFormula_2 = 0;
	}
	if (value.formula_id !== formula) {
	    countFormula++;
	    countFormula_2++;
	    formula = value.formula_id;
	    consolidado.countformula = countFormula_2;
	}
	if (value.paciente_id !== paciente) {
	    countPaciente++;
	    countPaciente_2++;
	    consolidado.countpaciente = countPaciente_2;
	    paciente = value.paciente_id;
	}

	var tt = value.total.replace(",", ".");
	var prc = value.precio.replace(",", ".");
	total = total + parseFloat(tt);
	precio = precio + parseFloat(prc);
	cantidades += parseInt(value.cantidad);
	totalDetalle = totalDetalle + parseFloat(tt);
	consolidado.total = totalDetalle;

	if (value.nom_bode !== bodega || resultado.length == i) {
	    consolidado.bodega = bodega;
	    bodegas[bodega] = consolidado;
	    bga.push(consolidado);
	    bodega = value.nom_bode;
	    countPaciente_2 = 0;
	    countFormula_2 = 0;
	    totalDetalle = 0;
	    consolidado = {};
	}


    }
    detalle.cantidadFomulas = countFormula;
    detalle.cantidadPacientes = countPaciente;
    detalle.cantidadDespachoUnidades = cantidades;
    detalle.total = total;
    detalle.precio = precio;
    datos.detalle = detalle;
    datos.bodegasdetalle = JSON.stringify(bga);
    __editarConsolidadoReporte(that, datos);
    callback(false, true);
    return;
}

/**
 * @author Andres M Gonzalez
 * +Descripcion controlador que genera csv
 * @params detalle: 
 * @fecha 2016-06-17
 */
function __generarCsvDrArias(datos, filtro, callback) {



    var fields = ["fecha", "fecha_formula", "formula_id", "formula_papel", "nom_bode", "plan_descripcion", "usuario_digita",
	"descripcion_tipo_formula", "paciente_id", "paciente", "tercero_id", "medico", "especialidad",
	"codigo_producto", "codigo_cum", "producto", "cantidad", "precio", "total", "eps_punto_atencion_nombre"];

    var fieldNames = ["FECHA", "FECHA FORMULA", "FORMULA_ID", "FORMULA", "FARMACIA", "PROGRAMA", "USUARIO FARMACIA",
	"TIPO FORMULA", "CC. PACIENTE", "NOMBRES PACIENTE", "CC. MEDICO", "MEDICO", "ESPECIALIDAD",
	"CODIGO", "CODIGO CUM", "PRODUCTO", "CANTIDAD", "PRECIO UNITARIO", "PRECIO TOTAL", "PUNTO DE ATENCION"];
    var opts = {
	data: datos,
	fields: fields,
	fieldNames: fieldNames,
	del: ';',
	hasCSVColumnTitle: 'Dr Arias'
    };

    G.json2csv(opts, function(err, csv) {
	if (err)
	    console.log("Eror de Archivo: ", err);
	var nombreReporte = filtro.nombre;
	G.fs.writeFile(G.dirname + "/public/reports/" + nombreReporte, csv, function(err) {
	    if (err) {
		console.log('Error __generarCsvDrArias', err);
		throw err;
	    }
	    callback(false, datos.length);

	});
    });
}


function __guardarEstadoReporte(that, datos, callback) {
    G.Q.ninvoke(that.m_drArias, 'guardarEstadoReporte', datos).then(function(resultado) {

	callback(false, resultado.rowCount);
	return;
    }).fail(function(err) {
	console.log("error controller __guardarEstadoReporte ", err);
	callback(err);
    }).done();
}

function __editarEstadoReporte(that, datos, callback) {
    G.Q.ninvoke(that.m_drArias, 'editarEstadoReporte', datos).then(function(resultado) {
	callback(false, resultado);
	return;
    }).fail(function(err) {
	console.log("error controller __editarEstadoReporte ", err);
	callback(err);
    }).done();
}

function __editarConsolidadoReporte(that, datos) {
    G.Q.ninvoke(that.m_drArias, 'editarConsolidadoReporte', datos).then(function(resultado) {
    }).
	    fail(function(err) {
	console.log("error controller __editarConsolidadoReporte ", err);
    }).
	    done();
}

Reportes.$inject = [
    "m_drArias", "j_reporteDrAriasJobs", "e_dr_arias"
];

module.exports = Reportes;