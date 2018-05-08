BEGIN TRANSACTION;
CREATE TABLE version (
	id_version SERIAL,
	version VARCHAR(8),
	modulo TEXT,
	comentario TEXT
);
COMMIT TRANSACTION;

-----------------------------------------------------------------------------
------------------------------  Version 2.00.00  ------------------------------
-----------------------------------------------------------------------------
BEGIN TRANSACTION;
INSERT INTO version (version, modulo, comentario) VALUES ('02.00.00', 'BASE', 'Inicia control de versión Dusoft');
COMMIT TRANSACTION;

-----------------------------------------------------------------------------
------------------------------  Version 2.00.01  ------------------------------
-----------------------------------------------------------------------------
BEGIN TRANSACTION;
INSERT INTO version (version, modulo, comentario) VALUES ('02.00.01', 'SISTEMA', 'Se elimina temporalmente el socket de estaditicas del sistema por problemas con tablets');
COMMIT TRANSACTION;

-----------------------------------------------------------------------------
------------------------------  Version 2.00.02  ------------------------------
-----------------------------------------------------------------------------
BEGIN TRANSACTION;
INSERT INTO version (version, modulo, comentario) VALUES ('02.00.02', 'SISTEMA', 'Pone en funcionamiento el socket de estadisticas del sistema');
COMMIT TRANSACTION;


-----------------------------------------------------------------------------
------------------------------  Version 2.00.03  ------------------------------
-----------------------------------------------------------------------------
BEGIN TRANSACTION;
INSERT INTO version (version, modulo, comentario) VALUES ('02.00.03', 'VALIDACION DESPACHOS', 'Se ajusta el boton adjuntar archivos para que ejecute la camara cuando se presione el boton, atributo capture.');
COMMIT TRANSACTION;


-----------------------------------------------------------------------------
------------------------------  Version 2.00.04  ------------------------------
-----------------------------------------------------------------------------
BEGIN TRANSACTION;
INSERT INTO version (version, modulo, comentario) VALUES ('02.00.04', 'KARDEX', 'Se ajusta en Kardex, Movimientos bodegas, Modificar lotes de productos. se crea nueva funcion en el modelo consultar_stock_producto_kardex reemplaza consultar_stock_producto');
COMMIT TRANSACTION;

-----------------------------------------------------------------------------
------------------------------  Version 2.00.05  ------------------------------
-----------------------------------------------------------------------------
BEGIN TRANSACTION;
INSERT INTO version (version, modulo, comentario) VALUES ('02.00.05', 'SEPARACION PEDIDOS', 'Se crea validacion en el servidor para verificar que la cantidad ingresada no sea mayor a la cantidad solicitada');
COMMIT TRANSACTION;
-----------------------------------------------------------------------------
------------------------------  Version 2.00.06  ------------------------------
-----------------------------------------------------------------------------
BEGIN TRANSACTION;
INSERT INTO version (version, modulo, comentario) VALUES ('02.00.06', 'DOCUMENTOS BODEGA', 'Se amplia la cabecera enviada a Dumian por el ws agreando la observacion y le numero de pedido');
COMMIT TRANSACTION;
-----------------------------------------------------------------------------
------------------------------  Version 2.00.07  ------------------------------
-----------------------------------------------------------------------------
BEGIN TRANSACTION;
INSERT INTO version (version, modulo, comentario) VALUES ('02.00.07', 'DOCUMENTOS BODEGA', 'Se agregan varios clientes para las remisiones de Dumian');
COMMIT TRANSACTION;
-----------------------------------------------------------------------------
------------------------------  Version 2.00.08  ------------------------------
-----------------------------------------------------------------------------
BEGIN TRANSACTION;
INSERT INTO version (version, modulo, comentario) VALUES ('02.00.08', 'DOCUMENTOS BODEGA', 'Se crea cliente uci mario correa Los chorros');
COMMIT TRANSACTION;
-----------------------------------------------------------------------------
------------------------------  Version 2.00.09  ------------------------------
-----------------------------------------------------------------------------
BEGIN TRANSACTION;
INSERT INTO version (version, modulo, comentario) VALUES ('02.00.09', 'DOCUMENTOS BODEGA', 'Se crea cliente uci mario correa Los chorros');
COMMIT TRANSACTION;
-----------------------------------------------------------------------------
------------------------------  Version 2.00.10  ------------------------------
-----------------------------------------------------------------------------
BEGIN TRANSACTION;
INSERT INTO version (version, modulo, comentario) VALUES ('02.00.10', 'DOCUMENTOS BODEGA', 'Se crea modulo actas tecnicas');
COMMIT TRANSACTION;
-----------------------------------------------------------------------------
------------------------------  Version 2.00.11  ------------------------------
-----------------------------------------------------------------------------
BEGIN TRANSACTION;
INSERT INTO version (version, modulo, comentario) VALUES ('02.00.11', 'DISPENSACION HC', 'se modifica el servidor de dispensacion para que no se modifque la fecha de pendiente');
COMMIT TRANSACTION;
-----------------------------------------------------------------------------
------------------------------  Version 2.00.12  ------------------------------
-----------------------------------------------------------------------------
BEGIN TRANSACTION;
INSERT INTO version (version, modulo, comentario) VALUES ('02.00.12', 'DOCUMENTOS BODEGA', 'se agrega cliente para dumian 800088098');
COMMIT TRANSACTION;
-----------------------------------------------------------------------------
------------------------------  Version 2.00.13  ------------------------------
-----------------------------------------------------------------------------
BEGIN TRANSACTION;
INSERT INTO version (version, modulo, comentario) VALUES ('02.00.13', 'DOCUMENTOS BODEGA', 'se crean los documentos: I011  E009');
COMMIT TRANSACTION;
-----------------------------------------------------------------------------
------------------------------  Version 2.00.14  ------------------------------
-----------------------------------------------------------------------------
BEGIN TRANSACTION;
INSERT INTO version (version, modulo, comentario) VALUES ('02.00.14', 'PEDIDOS', 'se comenta siguiente linea, porque cuando hay mas de un despacho se esta restando la reserva del pedido X a la disponibilidad del mismo pedido y por el contrario se debe obviar');
COMMIT TRANSACTION;
-----------------------------------------------------------------------------
------------------------------  Version 2.00.15  ------------------------------
-----------------------------------------------------------------------------
BEGIN TRANSACTION;
INSERT INTO version (version, modulo, comentario) VALUES ('02.00.15', 'PEDIDOS', 'se agrega el tercero 800088098 a remision dumian');
COMMIT TRANSACTION;
-----------------------------------------------------------------------------
------------------------------  Version 2.00.16  ------------------------------
-----------------------------------------------------------------------------
BEGIN TRANSACTION;
INSERT INTO version (version, modulo, comentario) VALUES ('02.00.16', 'DOCUMENTOS BODEGA', 'se agrega tipo de producto (Gerencia)');
COMMIT TRANSACTION;
-----------------------------------------------------------------------------
------------------------------  Version 2.00.17  ------------------------------
-----------------------------------------------------------------------------
BEGIN TRANSACTION;
INSERT INTO version (version, modulo, comentario) VALUES ('02.00.17', 'DOCUMENTOS BODEGA', 'se agrega tipo de producto (Gerencia)');
COMMIT TRANSACTION;
-----------------------------------------------------------------------------
------------------------------  Version 2.00.18  ------------------------------
-----------------------------------------------------------------------------
BEGIN TRANSACTION;
INSERT INTO version (version, modulo, comentario) VALUES ('02.00.18', 'DOCUMENTOS BODEGA', 'se modifica el reporte (tamanio letra)');
COMMIT TRANSACTION;
-----------------------------------------------------------------------------
------------------------------  Version 2.00.19  ------------------------------
-----------------------------------------------------------------------------
BEGIN TRANSACTION;
INSERT INTO version (version, modulo, comentario) VALUES ('02.00.19', 'FACTURACION PROVEEDORES', 'se modifica eliminando el update a actas tecnica ya que donde se ubico el update no deberia ir porque en la funcion ingresarFactura no se cre
a el prefijo y el numero se modifica eliminando el update a actas tecnica ya que donde se ubico el update no deberia ir porque en la funcion ingresarFactura no se crea el prefijo ni el numero');
COMMIT TRANSACTION;
-----------------------------------------------------------------------------
------------------------------  Version 2.00.20  ------------------------------
-----------------------------------------------------------------------------
BEGIN TRANSACTION;
INSERT INTO version (version, modulo, comentario) VALUES ('02.00.20', 'DOCUMENTOS BODEGA', 'se corrige la modificacion de existencias en bodega y en lotes_fv al realizar devoluciones (EDB)');
COMMIT TRANSACTION;
-----------------------------------------------------------------------------
------------------------------  Version 2.00.21  ------------------------------
-----------------------------------------------------------------------------
BEGIN TRANSACTION;
INSERT INTO version (version, modulo, comentario) VALUES ('02.00.21', 'RADICACIÓN', 'se crea modulo de radicacion de facturas de sistemas');
COMMIT TRANSACTION;
-----------------------------------------------------------------------------
------------------------------  Version 2.00.22  ------------------------------
-----------------------------------------------------------------------------
BEGIN TRANSACTION;
INSERT INTO version (version, modulo, comentario) VALUES ('02.00.22', 'RADICACIÓN', 'se compila gestionFactura');
COMMIT TRANSACTION;
-----------------------------------------------------------------------------
------------------------------  Version 2.00.23  ------------------------------
-----------------------------------------------------------------------------
BEGIN TRANSACTION;
INSERT INTO version (version, modulo, comentario) VALUES ('02.00.23', 'RADICACIÓN', 'se compila gestionFactura');
COMMIT TRANSACTION;
-----------------------------------------------------------------------------
------------------------------  Version 2.00.24  ------------------------------
-----------------------------------------------------------------------------
BEGIN TRANSACTION;
INSERT INTO version (version, modulo, comentario) VALUES ('02.00.24', 'RADICACIÓN', 'se compila gestionFactura');
COMMIT TRANSACTION;
-----------------------------------------------------------------------------
------------------------------  Version 2.00.25  ------------------------------
-----------------------------------------------------------------------------
BEGIN TRANSACTION;
INSERT INTO version (version, modulo, comentario) VALUES ('02.00.25', 'DOCUMENTOS BODEGA', 'se modifica el documento a imprimir para I012');
COMMIT TRANSACTION;
-----------------------------------------------------------------------------
------------------------------  Version 2.00.26  ------------------------------
-----------------------------------------------------------------------------
BEGIN TRANSACTION;
INSERT INTO version (version, modulo, comentario) VALUES ('02.00.26', 'RADICACIÓN', 'se agrega imagen de descarga para factura');
COMMIT TRANSACTION;
-----------------------------------------------------------------------------
------------------------------  Version 2.00.27  ------------------------------
-----------------------------------------------------------------------------
BEGIN TRANSACTION;
INSERT INTO version (version, modulo, comentario) VALUES ('02.00.27', 'DOCUMENTOS BODEGA', 'se modifica la validacion de existencias');
COMMIT TRANSACTION;
-----------------------------------------------------------------------------
------------------------------  Version 2.00.28  ------------------------------
-----------------------------------------------------------------------------
BEGIN TRANSACTION;
INSERT INTO version (version, modulo, comentario) VALUES ('02.00.28', 'AUDITORIA', 'Se modifica la seleccion del prefijo en auditoria - se correge error en facturacion clientes');
COMMIT TRANSACTION;
-----------------------------------------------------------------------------
------------------------------  Version 2.00.29  ------------------------------
-----------------------------------------------------------------------------
BEGIN TRANSACTION;
INSERT INTO version (version, modulo, comentario) VALUES ('02.00.29', 'DISPENSACION', 'Se modifica la consulta de dispensacion listarFormulas para que consulte los afiliados AC');
COMMIT TRANSACTION;
-----------------------------------------------------------------------------
------------------------------  Version 2.00.30  ------------------------------
-----------------------------------------------------------------------------
BEGIN TRANSACTION;
INSERT INTO version (version, modulo, comentario) VALUES ('02.00.30', 'DOCUMENTOS BODEGA', 'se agrega la impresion por torre para el tipo de documento I011');
COMMIT TRANSACTION;
-----------------------------------------------------------------------------
------------------------------  Version 2.00.31  ------------------------------
-----------------------------------------------------------------------------
BEGIN TRANSACTION;
INSERT INTO version (version, modulo, comentario) VALUES ('02.00.31', 'DOCUMENTOS BODEGA', 'se realiza modificacion por solicitud de usuario final para el tipo de documento I011');
COMMIT TRANSACTION;
-----------------------------------------------------------------------------
------------------------------  Version 2.00.32  ------------------------------
-----------------------------------------------------------------------------
BEGIN TRANSACTION;
INSERT INTO version (version, modulo, comentario) VALUES ('02.00.32', 'DOCUMENTOS BODEGA', 'correcion al reporte para el tipo de documento I011');
COMMIT TRANSACTION;
-----------------------------------------------------------------------------
------------------------------  Version 2.00.33  ------------------------------
-----------------------------------------------------------------------------
BEGIN TRANSACTION;
INSERT INTO version (version, modulo, comentario) VALUES ('02.00.33', 'PEDIDOS', 'se corrige consulta consultar_detalle_pedido ya que traía la fecha_verificacion asc y deberia ser desc');
COMMIT TRANSACTION;
-----------------------------------------------------------------------------
------------------------------  Version 2.00.34  ------------------------------
-----------------------------------------------------------------------------
BEGIN TRANSACTION;
INSERT INTO version (version, modulo, comentario) VALUES ('02.00.34', 'PEDIDOS', 'se corrige consulta consultar_detalle_pedido ya que traía la fecha_verificacion asc y deberia ser desc');
COMMIT TRANSACTION;
-----------------------------------------------------------------------------
------------------------------  Version 2.00.35  ------------------------------
-----------------------------------------------------------------------------
BEGIN TRANSACTION;
INSERT INTO version (version, modulo, comentario) VALUES ('02.00.35', 'DOCUMENTOS BODEGA', 'se agrega nuevo documento de bodega (I012)');
COMMIT TRANSACTION;
-----------------------------------------------------------------------------
------------------------------  Version 2.00.36  ------------------------------
-----------------------------------------------------------------------------
BEGIN TRANSACTION;
INSERT INTO version (version, modulo, comentario) VALUES ('02.00.36', 'FACTURA CLIENTES', 'se modifica controlador porque no dejaba crear inv_facturas_xconsumo_tmp_d ya que no se creaba primero inv_facturas_xconsumo_tmp ');
COMMIT TRANSACTION;
-----------------------------------------------------------------------------
------------------------------  Version 2.00.37  ------------------------------
-----------------------------------------------------------------------------
BEGIN TRANSACTION;
INSERT INTO version (version, modulo, comentario) VALUES ('02.00.37', 'FACTURA CLIENTES', 'se modifica controlador porque no dejaba crear inv_facturas_xconsumo_tmp_d ya que no se creaba primero inv_facturas_xconsumo_tmp ');
COMMIT TRANSACTION;