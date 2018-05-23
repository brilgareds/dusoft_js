
var Reportes = function (drArias, j_reporteDrAriasJobs, eventos_dr_arias, emails, socket) {
    this.m_drArias = drArias;
    this.j_reporteDrAriasJobs = j_reporteDrAriasJobs;
    this.e_dr_arias = eventos_dr_arias;
    this.emails = emails;
    this.io = socket;
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
    G.Q.nfcall(__guardarEstadoReporte, that, datos).then(function (resultados) {

        //estado del reporte 0- En proceso 1- generado 2- error al generar 3- reporte con cero registros
        that.e_dr_arias.onNotificarEstadoDescargaReporte(datos.usuario);
        res.send(G.utils.r(req.url, 'Generando Informe...', 200, {listarDrArias: 'pendiente'}));

        return G.Q.ninvoke(that.m_drArias, 'listarDrArias', filtro);

    }).then(function (resultados) {

        resultado = resultados;
        if (resultado !== -1) {

            return G.Q.nfcall(__generarCsvDrArias, resultado, filtro);

        } else {
            return 0;
        }

    }).then(function (tamaño) {

        datos.fecha_fin = G.moment().format();
        if (tamaño > 0) {
            datos.estado = '1';
            return G.Q.nfcall(__generarDetalle, resultado, datos, that);
        } else {
            datos.estado = '3';
            return true;
        }

    }).then(function (result) {
        return G.Q.nfcall(__editarEstadoReporte, that, datos);

    }).then(function (result) {
        that.e_dr_arias.onNotificarEstadoDescargaReporte(datos.usuario);

    }).fail(function (err) {
        datos.fecha_fin = G.moment().format();
        datos.estado = '2';
        return G.Q.nfcall(__editarEstadoReporte, that, datos);
        that.e_dr_arias.onNotificarEstadoDescargaReporte(datos.usuario);
    }).done();
};

Reportes.prototype.listarDrArias0 = function (req, res) {
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

    G.Q.ninvoke(that.m_drArias, 'listarDrArias', filtro).then(function (resultado) {
        if (resultado !== -1) {

            __generarCsvDrArias(resultado, filtro, function (tamaño) {
                datos.fecha_fin = G.moment().format();
                if (tamaño > 0) {
                    datos.estado = '1';
                    __generarDetalle(resultado, datos, that, function () {
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
            fail(function (err) {
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
Reportes.prototype.reportesGenerados = function (req, res) {

    var that = this;
    var args = req.body.data;
    var datos = {};
    datos.usuario = args.session.usuario_id;
    that.m_drArias.reportesGenerados(datos, function (err, reportes) {
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
                console.log("error controller listarPlanes ", err);
                res.send(G.utils.r(req.url, 'Error Listado Planes', 500, {listarPlanes: err}));
            }).
            done();
};

Reportes.prototype.rotacionZonas0 = function (req, res) {
    var that = this;
    var args = req.body.data;

    G.Q.ninvoke(that.m_drArias, 'rotacionZonas').then(function (rotacionZonas) {
        res.send(G.utils.r(req.url, 'Listado rotacion Zonas', 200, {rotacionZonas: rotacionZonas}));
    }).fail(function (err) {
        console.log("error controller listarPlanes ", err);
        res.send(G.utils.r(req.url, 'Error Listado rotacion Zonas', 500, {rotacionZonas: err}));
    }).done();
};

Reportes.prototype.rotacionZonas = function (req, res) {
    var that = this;
    var args = req.body.data;

    G.Q.ninvoke(that.m_drArias, 'rotacionZonas').then(function (rotacionZonas) {

        res.send(G.utils.r(req.url, 'Listado rotacion Zonas', 200, {rotacionZonas: rotacionZonas}));

    }).fail(function (err) {
        console.log("error controller listarPlanes ", err);
        res.send(G.utils.r(req.url, 'Error Listado rotacion Zonas', 500, {rotacionZonas: err}));
    }).done();
};

Reportes.prototype.rotacionZonasMovil = function (req, res) {
    var that = this;
    var args = req.body.data;

    G.Q.ninvoke(that.m_drArias, 'rotacionZonas').then(function (rotacionZonas) {
        return G.Q.nfcall(__ordenarZonas, rotacionZonas, 0, [], '', []);

    }).then(function (respuesta) {

        res.send(G.utils.r(req.url, 'Listado rotacion Zonas', 200, {rotacionZonas: respuesta}));
    }).fail(function (err) {
        console.log("error controller listarPlanes ", err);
        res.send(G.utils.r(req.url, 'Error Listado rotacion Zonas', 500, {rotacionZonas: err}));
    }).done();
};

function __ordenarZonas(data, index, resultado, controlZona, bodegas, callback) {
    var _data = data[index];
    index++;

    if (!_data) {
        var json = {zona: controlZona, bodegas: bodegas};
        resultado.push(json);
        callback(false, resultado);
        return;
    }

    var cabecera = {
        nombreBodega: _data.nombre_bodega,
        empresa: _data.empresa_id,
        centroUtilidad: _data.centro_utilidad,
        fechaRegistro: _data.fecha_registro,
        diferenciaDias: _data.diferencia,
        swRemitente: _data.sw_remitente,
        swEstadoCorreo: _data.sw_estado_correo,
        logError: _data.log_error,
        remitentes: _data.remitentes,
        meses: _data.meses,
        bodega: _data.bodega
    };
    if (controlZona !== _data.zona) {
        var json = {zona: controlZona, bodegas: bodegas};
        bodegas = [];
        resultado.push(json);
        controlZona = _data.zona;
    }
    bodegas.push(cabecera);

    return  __ordenarZonas(data, index, resultado, controlZona, bodegas, callback)
}

Reportes.prototype.generarRotaciones = function (req, res) {
    var that = this;
    var args = req.body.data;
    var usuarioId = req.body.session.usuario_id;
    var today = new Date();
    var formato = 'DD-MM-YYYY hh:mm:ss a';
    var fechaToday = G.moment(today).format(formato);

    args.data.bodegas.forEach(function (item) {
        item.remitente = args.data.remitente;  //guardarControlRotacion   0     
        item.remitentes = args.data.remitentes;
        item.meses = args.data.meses;
        item.usuarioId = usuarioId;
        item.swEstadoCorreo = '0';
        item.logError = '';

        __rotacionesBodegas(that, item, function (data) {

            if (data.estado !== 200) {
                if (item.remitente === '1') {
                    console.log("Error", data);
                    var subject = "Error al Generar Rotación (ver detalles) " + fechaToday;
                    var to = G.settings.email_desarrollo1;
                    var ruta_archivo = "";
                    var nombre_archivo = "";
                    var enviado = "";
                    enviado = "Enviado al Dr Duarte. " + fechaToday;
                    var message = "Rotacion Dr. DUARTE <br><br>" + enviado + "<br> Error:  " + JSON.stringify(data) + " <br><br> Parametros: " + JSON.stringify(item);
                    __enviar_correo_electronico(that, to, ruta_archivo, nombre_archivo, subject, message, function () {});
                }
            }
        });

    });
    res.send(G.utils.r(req.url, 'Listado Planes', 200, {listarPlanes: 'ok'}));
};

function __rotacionesBodegas(that, bodega, callback) {

    var name;
    var archivoName;
    var today = new Date();
    var formato = 'YYYY-MM-DD';
    var fechaToday = G.moment(today).format(formato);
    var controlRotacionId;
    var listarPlanes;

    G.Q.ninvoke(that.m_drArias, 'guardarControlRotacion', bodega).then(function (respuesta) {

        bodega.controlRotacionId = respuesta[0]; 
        bodega.swEstadoCorreo = 0;
        notificacion = bodega;
       
        //that.io.sockets.emit('onNotificarRotacion', notificacion);  
        that.e_dr_arias.onNotificarRotacion(bodega.usuarioId,notificacion);

        return G.Q.ninvoke(that.m_drArias, 'rotacion', bodega);

    }).then(function (respuesta) {

        if (respuesta.length > 0) {

            listarPlanes = respuesta;
            listarPlanes.meses = bodega.meses;
            bodega.swEstadoCorreo = 1;
            that.e_dr_arias.onNotificarRotacion(bodega.usuarioId, bodega);
            return G.Q.ninvoke(that.m_drArias, 'editarControlRotacion', bodega);

        } else {
            throw {estado: 403, mensaje: "No hay productos"};
        }

    }).then(function (respuesta) {

        name = "Bodega: " + listarPlanes[0].nom_bode;
        archivoName = listarPlanes[0].nom_bode + "_" + fechaToday + "_" + bodega.meses + ".xlsx";
        return G.Q.nfcall(__organizaRotacion, 0, listarPlanes, []);

    }).then(function (resultados) {

        resultados.nameHoja = "Rotacion";
        resultados.nameArchivo = archivoName;
        resultados.name = name;
        return G.Q.nfcall(__creaExcel, resultados);

    }).then(function (resultados) {

        bodega.swEstadoCorreo = 2;
        that.e_dr_arias.onNotificarRotacion(bodega.usuarioId, bodega);
        return G.Q.ninvoke(that.m_drArias, 'editarControlRotacion', bodega);

    }).then(function (resultados) {

        var sistemas = G.settings.email_mauricio_barrios + "," + G.settings.email_pedro_meneses;
        var remitente = "";

        if (bodega.remitente === 0) {
            remitente = sistemas;
        }

        if (bodega.remitente === 1) {
            remitente = G.settings.email_miguel_duarte;//+","+sistemas;
        }

        if (bodega.remitentes.trim() !== "") {
            remitente += "," + bodega.remitentes;
        }

        var subject = "Rotación " + name;
        var to = remitente;
        var ruta_archivo = G.dirname + "/files/Rotaciones/" + archivoName;

        var nombre_archivo = archivoName;
        var message = "Rotacion Dr. DUARTE";

        return G.Q.nfcall(__enviar_correo_electronico, that, to, ruta_archivo, nombre_archivo, subject, message);

    }).then(function (resultados) {
        bodega.swEstadoCorreo = 3;
        that.e_dr_arias.onNotificarRotacion(bodega.usuarioId, bodega);
        return G.Q.ninvoke(that.m_drArias, 'editarControlRotacion', bodega);

    }).then(function (resultados) {
        callback(false, resultados);

    }).fail(function (err) {
        bodega.swEstadoCorreo = 4;
        bodega.logError = err;
        that.e_dr_arias.onNotificarRotacion(bodega.usuarioId, bodega);
        G.Q.ninvoke(that.m_drArias, 'editarControlRotacion', bodega, function () {
            callback(err);
        });

        console.log("error controller listarPlanes ", err);
    }).done();
}

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

    worksheet.columns = [
        {header: 'CODIGO', key: 'a', style: style},
        {header: 'PRODUCTO - ' + data.name, key: 'b', width: 50, style: style},
        {header: 'MOLECULA', key: 'c', width: 25, style: style},
        {header: 'LABORATORIO', key: 'd', style: style},
        {header: 'TIPO PRODUCTO', key: 'e', style: style},
        {header: 'NIVEL', key: 'f', style: style},
        {header: 'Promedio Mes', key: 'g', width: 9, style: style},
        {header: 'Stock Farmacia', key: 'h', width: 8.5, style: style},
        {header: 'Pedido 60 Dias', key: 'i', width: 7.5, style: style},
        {header: '', key: 'j', width: 10, style: style},
        {header: 'Stock Bodega', key: 'k', width: 7.5, style: style}
    ];

    worksheet.views = [
        {zoomScale: 160, state: 'frozen', xSplit: 1, ySplit: 1, activeCell: 'A1'}
    ];
    var i = 1;
    data.forEach(function (element) {

        if (element.color === 'ROJO') {
            worksheet.addRow([element.codigo_poducto, element.poducto, element.molecula, element.laboratorio, element.tipo_producto, element.nivel,
                element.promedioMes, element.totalStock, element.pedido60Dias, '', element.stockBodega]).font = {
                color: {argb: 'C42807'}, name: 'Calibri', size: 9
            };
        } else {
            worksheet.addRow([element.codigo_poducto, element.poducto, element.molecula, element.laboratorio, element.tipo_producto, element.nivel,
                element.promedioMes, element.totalStock, element.pedido60Dias, '', element.stockBodega]);
        }

        worksheet.getColumn('A').hidden = true;
        worksheet.getColumn('D').hidden = true;
        worksheet.getColumn('E').hidden = true;
        worksheet.getColumn('F').hidden = true;

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

// save workbook to disk
    workbook.xlsx.writeFile(G.dirname + "/files/Rotaciones/" + data.nameArchivo).then(function () {
        console.log("saved");
        callback(false, data.nameArchivo);
    });
}
;

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

    resultColumna.promedioMes = Math.ceil((_resultado.sum) / data.meses);
    resultColumna.totalStock = _resultado.existencia;
    resultColumna.pedido60Dias = ((_resultado.sum)) - (_resultado.existencia) > 0 ? (_resultado.sum) - (_resultado.existencia) : '';
    resultColumna.stockBodega = _resultado.existencia_bd;
    resultColumna.nivel = _resultado.nivel;
    resultColumna.tipo_producto = _resultado.tipo_producto;
   // resultColumna.color = (_resultado.existencia / ((Math.ceil((_resultado.sum)) / resultado.meses) > 0 ? Math.ceil(((_resultado.sum)) / data.meses) : 1) >= 5)  ? "ROJO" : "N/A"; //&& resultColumna.pedido60Dias === 0 || 

var promedio_dia= (((resultColumna.promedioMes/30)*60)-resultColumna.totalStock);
console.log("promedio_dia ",promedio_dia);
var mxm = resultColumna.totalStock/resultColumna.promedioMes;
console.log("mxm ",mxm);
var mayor5 = resultColumna.totalStock>5;
console.log("mayor5 ",mayor5);

resultColumna.color = (promedio_dia < 0 &&  mayor5 === true && (mxm >= 5 || mxm === Infinity))?"ROJO" : "N/A";

    resultado.push(resultColumna);

    return __organizaRotacion(index, data, resultado, callback);
}

function __organizaRotacion0(index, data, resultado, callback) {

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
   // resultColumna.color = _resultado.existencia / ((Math.ceil((resultColumna.sum2 + resultColumna.sum1)) / 2) > 0 ? Math.ceil(((resultColumna.sum2 + resultColumna.sum1)) / 2) : 1) >= 5 ? "ROJO" : "N/A";
    var promedio = resultColumna.promedioMes===0?1:resultColumna.promedioMes;    
    resultColumna.color = _resultado.existencia / promedio >=5 ? "ROJO" : "N/A"; 
    
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
        from: G.settings.email_desarrollo1,
        to: to,
        cc: "amgonzalez80@hotmail.com",
        subject: subject,
        html: message
    };

    if (ruta_archivo !== "") {
        settings.attachments = [{'filename': nombre_archivo, 'contents': G.fs.readFileSync(ruta_archivo)}];
    }
    smtpTransport.sendMail(settings, function (error, response) {
        if (error !== null) {
            callback({estado: 505, mensaje: error});
            return;
        } else {
            smtpTransport.close();
            callback(false, {estado: 200, mensaje: "Correo Enviado"});
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

    G.json2csv(opts, function (err, csv) {
        if (err)
            console.log("Eror de Archivo: ", err);
        var nombreReporte = filtro.nombre;
        G.fs.writeFile(G.dirname + "/public/reports/" + nombreReporte, csv, function (err) {
            if (err) {
                console.log('Error __generarCsvDrArias', err);
                throw err;
            }
            callback(false, datos.length);

        });
    });
}


function __guardarEstadoReporte(that, datos, callback) {
    G.Q.ninvoke(that.m_drArias, 'guardarEstadoReporte', datos).then(function (resultado) {

        callback(false, resultado.rowCount);
        return;
    }).fail(function (err) {
        console.log("error controller __guardarEstadoReporte ", err);
        callback(err);
    }).done();
}

function __editarEstadoReporte(that, datos, callback) {
    G.Q.ninvoke(that.m_drArias, 'editarEstadoReporte', datos).then(function (resultado) {
        callback(false, resultado);
        return;
    }).fail(function (err) {
        console.log("error controller __editarEstadoReporte ", err);
        callback(err);
    }).done();
}

function __editarConsolidadoReporte(that, datos) {
    G.Q.ninvoke(that.m_drArias, 'editarConsolidadoReporte', datos).then(function (resultado) {
    }).
            fail(function (err) {
                console.log("error controller __editarConsolidadoReporte ", err);
            }).
            done();
}

Reportes.$inject = [
    "m_drArias", "j_reporteDrAriasJobs", "e_dr_arias", "emails", "socket"
];

module.exports = Reportes;