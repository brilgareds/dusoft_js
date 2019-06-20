let SistemaModel = function() {
};

SistemaModel.prototype.listar_log_version = (pagina, callback) => {
	let query = G.knex.column(['id_version', 'version', 'modulo', 'comentario'])
        .from('version')
        .limit(G.settings.limit)
        .offset((pagina - 1) * G.settings.limit);

	query
        .then(rows => {
            callback(false, rows);
        }).catch(err => {
            callback(err);
        });
};

SistemaModel.prototype.querysActiveInDb = (obj, callback) => {
    let response = { header: [], rows: [] };
    let date = {};
    let time = '';
    let row = '';
    let rows = [];
    let newRows = [];
    let query = G.knex('pg_stat_activity')
        .column([
            'procpid as id',
            'datname as database',
            'usename as user',
            'client_addr as ip',
            G.knex.raw('query_start as fecha'),
            'current_query as consulta'
        ])
        .whereNot('current_query', 'ILIKE', '%<IDLE>%')
        .andWhere(G.knex.raw(`not current_query ILIKE '%system_usuarios_sesiones%'`))
        .andWhere(G.knex.raw('procpid != pg_backend_pid()'))
        .orderBy('query_start');

    query
        .then(data => {
            for (let key in data) {
                rows = data[key];
                for (let head in rows) {
                    row = rows[head];
                    if (head === 'fecha') {
                        date = new Date(row);
                        row = String(('0' + date.getDate()).slice(-2)
                            + '-'
                            + ('0' + (date.getMonth() + 1)).slice(-2)
                            + '-' + date.getFullYear());
                        time = String(('0' + date.getHours()).slice(-2)
                            + ':' + ('0' + date.getMinutes()).slice(-2)
                            + ':' + ('0' + date.getSeconds()).slice(-2));
                        newRows.push(row);
                        newRows.push(time);
                    } else {
                        newRows.push(row);
                    }

                    if (key === '0') {
                        response.header.push(head);
                        if (head === 'fecha') {
                            response.header.push('hora');
                        }
                    }
                }
                response.rows.push(newRows);
                newRows = [];
            }
            callback(false, response);
        }).catch(err => {
            err.msg = 'Hubo un error al consultar procesos de la base de datos';
            callback(err);
        });
};

SistemaModel.prototype.killProcess = (obj, callback) => {
    let pid = obj.process.id;
    let db = obj.process.database;

    let query = G.knex.column(G.knex.raw('pg_cancel_backend(' + pid + ') AS dead'))
        .from('pg_stat_activity')
        .where('datname', db);

    query
        .then(response => {
            if (response.dead) {
                console.log('Proceso eliminado con Exito!');
                callback(false, response);
            } else {
                throw 'No se detuvo la consulta en la base de datos!';
            }
        }).catch(err => {
            callback(false, false);
        });
};

SistemaModel.prototype.ultima_version = callback => {
	G.knex.raw('SELECT version FROM version WHERE id_version = (SELECT MAX(id_version) FROM version)').
    then(rows => {
        callback(false, rows.rows[0].version);
    }).catch(err => {
    	callback(err);
    });
};

SistemaModel.$inject = [];

module.exports = SistemaModel;
