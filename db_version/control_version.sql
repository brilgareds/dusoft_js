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