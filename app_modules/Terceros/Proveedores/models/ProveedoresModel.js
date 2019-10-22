var ProveedoresModel = function() {

};

ProveedoresModel.prototype.listar_proveedores = function(termino_busqueda, callback) {

    var sql = " select \
                b.codigo_proveedor_id,\
                a.tipo_id_tercero,\
                a.tercero_id,\
                a.nombre_tercero as nombre_proveedor,\
                a.direccion,\
                a.telefono \
                from terceros a \
                inner join terceros_proveedores b on a.tipo_id_tercero = b.tipo_id_tercero and a.tercero_id = b.tercero_id\
                where a.tipo_id_tercero ilike :1 or \
                a.tercero_id ilike :1 or \
                a.nombre_tercero ilike :1 or \
                a.direccion ilike :1 or  \
                a.telefono ilike :1 ORDER BY 4 " ;

    
    G.knex.raw(sql, {1:"%"+termino_busqueda+"%"}).
    then(function(resultado){
       callback(false, resultado.rows, resultado);
    }).catch(function(err){
       callback(err);
    });
};


ProveedoresModel.prototype.verExistenciaTerceroAsistencial = (tercero_id, callback) => {
    Promise.resolve(true)
        .then(response => {
            return G.knex('terceros').count('*').where({ tercero_id, tipo_id_tercero: 'NIT' });
        }).then(response => {
            const contador = parseFloat(response[0].count);
            callback(false, contador);
        }).catch(err => {
            callback(err);
        });
};

ProveedoresModel.prototype.verExistenciaProveedorAsistencial = (tercero_id, callback) => {
    Promise.resolve(true)
        .then(response => {
            return G.knex('terceros_proveedores').count('*').where({ tercero_id });
        }).then(response => {
            const contador = parseFloat(response[0].count);
            callback(false, contador);
        }).catch(err => {
            callback(err);
        });
};

ProveedoresModel.prototype.crearTercero = (obj, callback) => {
    var logs = 'Creando tercero...\n';

    Promise.resolve(true)
        .then(response => {
            if (!obj || !obj.tipodocumento || !obj.documento || !obj.razonsocial || !obj.tipo_pais_id || !obj.tipo_dpto_id || !obj.tipo_mpio_id || !obj.direccion || !obj.telefono || !obj.naturaleza || !obj.userId) {
                logs += 'Obj con formato invalido para crear un tercero!\n';
                throw {};
            }

            const query = G.knex('terceros')
                .insert({
                    tipo_id_tercero: obj.tipodocumento,
                    tercero_id: obj.documento,
                    nombre_tercero: obj.razonsocial,
                    tipo_pais_id: obj.tipo_pais_id,
                    tipo_dpto_id: obj.tipo_dpto_id,
                    tipo_mpio_id: obj.tipo_mpio_id,
                    direccion: obj.direccion,
                    telefono: obj.telefono,
                    email: '',
                    sw_persona_juridica: obj.naturaleza,
                    usuario_id: obj.userId
                });
            return query;
        }).then(response => {
            logs += 'Tercero Creado\n';
            callback(false, logs);
        }).catch(err => {
            logs += 'Error al crear tercero!\n';

            if (!err.msg) {
                err = {
                    msg: logs + err.toString(),
                    status: 300
                };
            }
            callback(err);
        });
};

ProveedoresModel.prototype.crearTerceroProveedor = (tercero, callback) => {
    let logs = 'Creando Proveedor...\n';

    Promise.resolve(true)
        .then(response => {
            return G.knex.column(G.knex.raw('nextval(\'terceros_proveedores_codigo_proveedor_id_seq\')'));
        }).then(response => {
            const existeNuevaSecuencia = response && response.length && response[0].nextval;

            if (!existeNuevaSecuencia) throw { msg: 'Error al buscar nueva secuencia en "crearTerceroProveedor"\n' };

            const nuevaSecuencia = response[0].nextval;

            const query_crearTerceroProveedor = G.knex('terceros_proveedores').insert({
                codigo_proveedor_id: nuevaSecuencia,
                tipo_id_tercero: tercero.tipodocumento,
                tercero_id: tercero.documento,
                estado: 1,
                dias_gracia: 0,
                dias_credito: 0,
                tiempo_entrega: 0,
                descuento_por_contado: 0,
                cupo: 0,
                sw_regimen_comun: 0,
                sw_gran_contribuyente: 0,
                porcentaje_rtf: tercero.porcentaje_rtf,
                porcentaje_ica: tercero.porcentaje_ica,
                porcentaje_reteiva: tercero.porcentaje_reteiva,
                sw_rtf: tercero.sw_rtf,
                sw_reteiva: tercero.sw_reteiva,
                sw_ica: tercero.sw_ica
            });

            // return true; // Este hay que borrarlo y descomentar el siguiente
            return query_crearTerceroProveedor;
        }).then(response => {
            logs += 'Proveedor creado\n';
            callback(false, logs);
        }).catch(err => {
            if (!err.status) err.status = 300;
            logs += 'Error al crear proveedor!\n';
            err.msg = logs;

            callback(err);
        });
};




ProveedoresModel.prototype.obtenerProveedorPorCodigo = function(codigoProveedor, callback){
    var sql = " select \
            a.codigo_proveedor_id,\
            b.tipo_id_tercero,\
            b.tercero_id,\
            b.nombre_tercero as nombre_proveedor,\
            b.direccion,\
            b.telefono \
            from terceros_proveedores a \
            inner join terceros b on a.tipo_id_tercero = b.tipo_id_tercero and a.tercero_id = b.tercero_id\
            where a.codigo_proveedor_id = :1" ;
    
    G.knex.raw(sql, {1:codigoProveedor}).
    then(function(resultado){
       callback(false, resultado.rows);
    }).catch(function(err){
       callback(err);
    });
};



ProveedoresModel.prototype.listarTerceroProveedor = (obj, callback) => {

    Promise.resolve(true)
        .then(response => {
            const queryListarTerceroProveedor = G.knex
                .column(['ter.*', 'p.*', 'ter.nombre_tercero as nombre_proveedor'])
                .from('terceros as ter')
                .innerJoin('terceros_proveedores as p', function() {
                    this.on('ter.tipo_id_tercero', 'p.tipo_id_tercero')
                        .on('ter.tercero_id', 'p.tercero_id')})
                .where('ter.nombre_tercero', 'ILIKE', `%${obj.tercero_documento}%`)
                .andWhere('ter.tipo_id_tercero', 'ILIKE', `%${obj.tercero_tipo_documento}%`)
                .orWhere('ter.tercero_id', 'ILIKE', `%${obj.tercero_documento}%`);

            // ORDER BY 4 " ; // ter.nombre_tercero

            return queryListarTerceroProveedor;
        }).then(response => {
            callback(false, response);
        }).catch(err => {
            console.log('err: ', err);
            callback(err);
        });
};



module.exports = ProveedoresModel;