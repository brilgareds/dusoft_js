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
