
/* global G */

var AuditoriaContratos = function (auditoria_contratos) {

    this.m_contratos = auditoria_contratos;
};

/**
 * @author German Galvis
 * +Descripcion lista los productos con deficit de los contratos
 * @fecha 2019-05-30
 */
AuditoriaContratos.prototype.listarProductosContrato = function (req, res) {

    var that = this;
    var args = req.body.data;

    var parametros = {
        termino_busqueda: args.productos_contratos.termino_busqueda,
        filtro: args.productos_contratos.filtro,
        pagina_actual: args.productos_contratos.paginaActual,
        tipo: 1
    };

    G.Q.nfcall(that.m_contratos.listarProductosContrato, parametros).
            then(function (resultado) {
                res.send(G.utils.r(req.url, 'Consultar listar traslados ok!!!!', 200, {productos_contratos: resultado}));
            }).
            fail(function (err) {
                res.send(G.utils.r(req.url, 'Error al Consultar listado de traslados', 500, {productos_contratos: {}}));
            }).
            done();

};

/**
 * @author German Galvis
 * +Descripcion creacion del Excel a descargar
 * @fecha 2019-05-30
 */
AuditoriaContratos.prototype.descargarProductosContrato = function (req, res) {

    var that = this;
    var args = req.body.data;
    var archivoName;
    var today = new Date();
    var formato = 'YYYY-MM-DD';
    var fechaToday = G.moment(today).format(formato);

    var parametros = {
        termino_busqueda: args.productos_contratos.termino_busqueda,
        tipo: 2
    };

    G.Q.ninvoke(that.m_contratos, 'listarProductosContrato', parametros).then(function (resultados) {

        archivoName = "auditoriaContratos_" + fechaToday + ".xlsx";  
        resultados.nameArchivo = archivoName;
        resultados.nameHoja = "productosDeficit";
        return G.Q.nfcall(__creaExcel, resultados);

    }).then(function (resultado) {
        res.send(G.utils.r(req.url, 'creacion de excel ok!!!!', 200, {excel: resultado}));
    }).fail(function (err) {
        res.send(G.utils.r(req.url, 'Error al crear excel', 500, {excel: {}}));
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

    var header = [];
    header.push({header: 'CLIENTE', key: 'a', width: 35, style: style});
    header.push({header: 'COD. PRODUCTO', key: 'b', width: 15, style: style});
    header.push({header: 'DESCRIPCION', key: 'e', width: 50, style: style});
    header.push({header: 'PRECIO PACTADO', key: 'f', width: 20, style: style});
    header.push({header: 'COSTO SIN IVA', key: 'g', width: 15, style: style});
    header.push({header: 'DEFICIT', key: 'h', width: 9, style: style});
    header.push({header: 'USUARIO', key: 'i', width: 15, style: style});

    worksheet.columns = header;

//    worksheet.views = [
//        {zoomScale: 160, state: 'frozen', xSplit: 1, ySplit: 1, activeCell: 'A1'}
//    ];
    var i = 1;
    data.forEach(function (element) {

        worksheet.addRow([element.nombre_tercero, element.codigo_producto, element.descripcion, parseFloat(element.precio_pactado).toFixed(2),
             parseFloat(element.costo_sin_iva).toFixed(2), parseFloat(element.deficit).toFixed(2), element.nombre]);

        i++;
    });

    var font = {
        name: 'SansSerif',
        size: 9,
        bold: true
    };

    var alignment = {vertical: 'center'};

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

// save workbook to disk
    workbook.xlsx.writeFile(G.dirname + "/public/reports/Auditorias/" + data.nameArchivo).then(function () {

        callback(false, data.nameArchivo);
    });
}
;

AuditoriaContratos.$inject = ["m_contratos"];

module.exports = AuditoriaContratos;