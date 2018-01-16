var SistemaModel = function() {
};

SistemaModel.prototype.listar_log_version = function(pagina, callback) {
	var campos = ['id_version', 'version', 'modulo', 'comentario'];
	G.knex.column(campos).
    from('version').
    limit(G.settings.limit).offset((pagina - 1) * G.settings.limit).then(function(rows){
        callback(false, rows);
    }).catch(function(err){
    	callback(err);
    });
};

SistemaModel.prototype.ultima_version = function(callback) {
	G.knex.raw('SELECT version FROM version WHERE id_version = (SELECT MAX(id_version) FROM version)').
    then(function(rows){
        callback(false, rows.rows[0].version);
    }).catch(function(err){
    	callback(err);
    });
};

SistemaModel.$inject = [];

module.exports = SistemaModel;