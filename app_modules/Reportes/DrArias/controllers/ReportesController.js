
var Reportes = function(drArias, j_reporteDrAriasJobs, eventos_dr_arias,emails) {
    this.m_drArias = drArias;
    this.j_reporteDrAriasJobs = j_reporteDrAriasJobs;
    this.e_dr_arias = eventos_dr_arias;
    this.emails = emails;
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

Reportes.prototype.rotacionZonas= function(req, res) {
    var that = this;
    var args = req.body.data;

    G.Q.ninvoke(that.m_drArias, 'rotacionZonas').then(function(rotacionZonas) {
	res.send(G.utils.r(req.url, 'Listado rotacion Zonas', 200, {rotacionZonas: rotacionZonas}));
    }).fail(function(err) {
	console.log("error controller listarPlanes ", err);
	res.send(G.utils.r(req.url, 'Error Listado rotacion Zonas', 500, {rotacionZonas: err}));
    }).done();
};



Reportes.prototype.listarPlanes0 = function(req, res) {
    var that = this;
    var args = req.body.data;
    var name="Man Palo Grande";
    var archivoName=name+".xlsx";
    
    G.Q.ninvoke(that.m_drArias, 'rotacion').then(function(listarPlanes) {
     
        return G.Q.nfcall(__organizaRotacion,0,listarPlanes,[]);
        
     }).then(function(resultados) {
         resultados.nameHoja="Rotacion";
         resultados.nameArchivo=archivoName;
         resultados.name=name;
         return G.Q.nfcall(__creaExcel,resultados);
         
     }).then(function(resultados) {      
         
         var subject = "desarrollo1@duanaltda.com";
         var to = "pedro.meneses@duanaltda.com";
         var ruta_archivo = "./"+archivoName;
         var nombre_archivo = archivoName;
         var message = "Rotacion DUARTE";
         
        return G.Q.nfcall(__enviar_correo_electronico,that, to, ruta_archivo, nombre_archivo, subject, message);
        
    }).then(function(resultados) {
        
	res.send(G.utils.r(req.url, 'Listado Planes', 200, {listarPlanes: resultados}));
        
    }).fail(function(err) {
        
	console.log("error controller listarPlanes ", err);
	res.send(G.utils.r(req.url, 'Error Listado Planes', 500, {listarPlanes: err}));
        
    }).done();

};

function __creaExcel(data, callback) {
    var workbook = new G.Excel.Workbook();
    var worksheet = workbook.addWorksheet(data.nameHoja, {properties: {tabColor: {argb: 'FFC0000'}}});

    var alignment = {vertical: 'middle', horizontal: 'center'};
    var border = {
        top: {style: 'thin'},
        left: {style: 'thin'},
        bottom: {style: 'thin'},
        right: {style: 'thin'}};

    var font = {name: 'Calibri', size: 9};

    var style = {font: font, border: border};
// add column headers
    worksheet.columns = [
        {header: 'CODIGO', key: 'a', style: style},
        {header: 'PRODUCTO - '+data.name, key: 'b', width: 50, style: style},
        {header: 'MOLECULA', key: 'c', width: 25, style: style},
        {header: 'LABORATORIO', key: 'd', style: style},
        {header: 'TIPO PRODUCTO', key: 'e', style: style},
        {header: 'NIVEL', key: 'f', style: style},
        {header: 'SALIDA 1', key: 'g', style: style},
        {header: 'SALIDA 2', key: 'h', style: style},
        {header: 'Promedio Mes', key: 'i', width: 9, style: style},
        {header: 'Stock Farmacia', key: 'j', width: 8.5, style: style},
        {header: 'Pedido 60 Dias', key: 'k', width: 7.5, style: style},
        {header: '', key: 'l', width: 10, style: style},
        {header: 'Stock Bodega', key: 'm', width: 7.5, style: style}
    ];

    worksheet.views = [
        {zoomScale: 160, state: 'frozen', xSplit: 1, ySplit: 1, activeCell: 'A1'}
    ];
    var i = 1;
    data.forEach(function (element) {

        if (element.color === 'ROJO') {
            worksheet.addRow([element.codigo_poducto, element.poducto, element.molecula, element.laboratorio, element.tipo_producto, element.nivel,
                element.sum1, element.sum2, element.promedioMes, element.totalStock, element.pedido60Dias, '', element.stockBodega]).font = {
                color: {argb: 'C42807'}, name: 'Calibri', size: 9
            };
        } else {
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

    var alignment = {vertical: 'center', horizontal: 'distributed'};

    var border = {
        top: {style: 'double'},
        left: {style: 'double'},
        bottom: {style: 'double'},
        right: {style: 'double'}
    };

    var style = {font: font, border: border, alignment: alignment};

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

// save workbook to disk
    workbook.xlsx.writeFile('./' + data.nameArchivo).then(function () {
        console.log("saved");
        callback(false, data.nameArchivo);
    });
};

function __organizaRotacion(index, data, resultado, callback) {

    var _resultado = data[index];
    index++;

    if (_resultado) {
        callback(false, sortJSON(resultado, 'molecula', 'asc'));
    }

    var resultColumna = {
        codigo_poducto: _resultado.codigo_producto,
        poducto: _resultado.producto,
        molecula: _resultado.molecula,
        laboratorio: _resultado.laboratorio,
        tipo_producto: _resultado.tipo_producto,
    };
    if (data[index] !== undefined) {
        if (_resultado.codigo_producto === data[index].codigo_producto) {
            resultColumna.sum1 = _resultado.mes === 'salida 1' ? _resultado.sum : (data[index].mes === 'salida 1' ? data[index].sum : 0);
            resultColumna.sum2 = _resultado.mes === 'salida 2' ? _resultado.sum : (data[index].mes === 'salida 2' ? data[index].sum : 0);
            index++;
        } else {
            resultColumna.sum1 = _resultado.mes === 'salida 1' ? _resultado.sum : 0;
            resultColumna.sum2 = _resultado.mes === 'salida 2' ? _resultado.sum : 0;
        }
    } else {
        resultColumna.sum1 = _resultado.mes === 'salida 1' ? _resultado.sum : 0;
        resultColumna.sum2 = _resultado.mes === 'salida 2' ? _resultado.sum : 0;
    }
    resultColumna.promedioMes = Math.ceil((resultColumna.sum2 + resultColumna.sum1) / 2);
    resultColumna.totalStock = _resultado.existencia;
    resultColumna.pedido60Dias = ((resultColumna.sum2 + resultColumna.sum1)) - (_resultado.existencia) > 0 ? (resultColumna.sum2 + resultColumna.sum1) - (_resultado.existencia) : '';
    resultColumna.stockBodega = _resultado.existencia_bd;
    resultColumna.nivel = _resultado.nivel;
    resultColumna.tipo_producto = _resultado.tipo_producto;
    resultColumna.color = _resultado.existencia / ((Math.ceil((resultColumna.sum2 + resultColumna.sum1)) / 2) > 0 ? Math.ceil(((resultColumna.sum2 + resultColumna.sum1)) / 2) : 1) >= 5 ? "ROJO" : "N/A";

    resultado.push(resultColumna);

    return __organizaRotacion(index, data, resultado, callback);
}

function sortJSON(data, key, orden) {
    return data.sort(function (a, b) {
        var x = a[key],
                y = b[key];

        if (orden === 'asc') {
            return ((x < y) ? -1 : ((x > y) ? 1 : 0));
        }

        if (orden === 'desc') {
            return ((x > y) ? -1 : ((x < y) ? 1 : 0));
        }
    });
}

// Funcion para enviar correos electronicos usando nodemailer
function __enviar_correo_electronico(that, to, ruta_archivo, nombre_archivo, subject, message, callback) {

   
    var smtpTransport = that.emails.createTransport("SMTP", {
        host: G.settings.email_host, // hostname
        secureConnection: true, // use SSL
        port: G.settings.email_port, // port for secure SMTP
        auth: {
            user: G.settings.email_user,
            pass: G.settings.email_password
        }
    });

    var settings = {
//        from: G.settings.email_compras,
        from: "desarrollo1@duanaltda.com",
        to: to,
        subject: subject,
        html: message,
        attachments: [{'filename': nombre_archivo, 'contents': G.fs.readFileSync(ruta_archivo)}]
    };

    smtpTransport.sendMail(settings, function(error, response) {

        if (error) {
            console.log("Error ",error);
            callback(true);
            return;
        } else {
            smtpTransport.close();            
            callback(false,"ok");
            return;
        }
    });
}
;


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
    "m_drArias", "j_reporteDrAriasJobs", "e_dr_arias","emails"
];

module.exports = Reportes;