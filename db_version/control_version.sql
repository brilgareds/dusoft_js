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

