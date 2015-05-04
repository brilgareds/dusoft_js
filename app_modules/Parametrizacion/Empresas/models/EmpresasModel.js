var EmpresasModel = function(centros_utilidad, bodegas) {

    this.m_centros_utilidad = centros_utilidad;
    this.m_bodegas = bodegas;
};


EmpresasModel.prototype.listar_empresas = function(callback) {

    var sql = " SELECT  empresa_id, razon_social FROM empresas WHERE sw_tipo_empresa= '0' AND sw_activa='1' ";

    G.db.query(sql, function(err, empresas, result) {
        callback(err, empresas, result);
    });
};

EmpresasModel.prototype.obtenerEmpresaPorCodigo = function(empresa_id, callback) {

    var sql = "SELECT  empresa_id, razon_social  FROM empresas WHERE empresa_id ILIKE $1";

    G.db.query(sql, [empresa_id + "%"], function(err, empresas, result) {
        callback(err, empresas, result);
    });
};

//lista las empresas y el estado en modulos_empresas en caso de estar presente
EmpresasModel.prototype.listar_empresas_modulos = function(modulos_id, callback) {

    var sql = "SELECT  a.empresa_id, a.razon_social, COALESCE(b.estado, '0') as estado, b.id as modulos_empresas_id, b.modulo_id\
               FROM empresas a\
               LEFT JOIN  modulos_empresas b on b.empresa_id = a.empresa_id and b.modulo_id  in(" + modulos_id + ")\
               WHERE a.sw_tipo_empresa= '0' AND a.sw_activa='1'";

    G.db.query(sql, [], function(err, empresas, result) {
        callback(err, empresas, result);
    });
};


EmpresasModel.prototype.guardarEmpresa = function(empresa, callback) {
    var self = this;

    __validarCreacionEmpresa(self, empresa, function(validacion) {

        if (!validacion.valido) {
            var err = {msj: validacion.msj};
            callback(err, false);
            return;
        }


        self.modificarEmpresa(empresa, function(err, rows, result) {
            if (err) {
                callback(err);
                return;
            }

            if (result.rowCount === 0) {
                self.insertarEmpresa(empresa, function(err, rows) {
                    if (err) {
                        callback(err);
                        return;
                    }
                    
                    callback(err, rows);
                });
            } else {
                callback(err, rows);
            }
        });

    });

};

EmpresasModel.prototype.modificarEmpresa = function(empresa, callback) {

    var sql = "UPDATE empresas  SET  empresa_id = $1, razon_social = $2  WHERE empresa_id = $1 RETURNING empresa_id";

    var params = [
        empresa.empresa_id, empresa.nombre
    ];

    G.db.query(sql, params, function(err, rows, result) {
        var empresa_id = (rows) ? rows[0] : undefined;
        callback(err, empresa_id, result);
    });
};


EmpresasModel.prototype.insertarEmpresa = function(empresa, callback) {

    var sql = "INSERT INTO empresas (empresa_id, razon_social, tipo_pais_id, tipo_dpto_id, tipo_mpio_id, esp_tipo_aportante_id, esp_sector_aportante_id,\
               ciiu_r3_division, ciiu_r3_grupo, ciiu_r3_clase) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING empresa_id";


    var params = [
        empresa.empresa_id, empresa.nombre, empresa.tipo_pais_id, empresa.tipo_dpto_id, empresa.tipo_mpio_id, empresa.esp_tipo_aportante_id,
        empresa.esp_sector_aportante_id, empresa.ciiu_r3_division, empresa.ciiu_r3_grupo, empresa.ciiu_r3_clase
    ];



    G.db.query(sql, params, function(err, rows, result) {
        var empresa_id = (rows) ? rows[0] : undefined;
        callback(err, empresa_id);
    });
};


function __validarCreacionEmpresa(that, empresa, callback) {
    var validacion = {
        valido: true,
        msj: ""
    };


    if (empresa.empresa_id === undefined || empresa.empresa_id.length === 0) {
        validacion.valido = false;
        validacion.msj = "La empresa debe tener un codigo";
        callback(validacion);
        return;
    }



    //trae los usuarios que hagan match con las primeras letras del nombre 
    that.obtenerEmpresaPorCodigo(empresa.empresa_id.substring(0, 4), function(err, rows) {
        if (err) {
            validacion.valido = false;
            validacion.msj = "Ha ocurrido un error validando la empresa";
            callback(validacion);
            return;
        }


        var empresa_id = empresa.empresa_id.toLowerCase().replace(/ /g, "");

        //determina si el nombre de la empresa esta en uso, insensible a mayusculas o espacios
        for (var i in rows) {

            if (empresa.empresa_id !== rows[i].empresa_id) {

                var _empresa_id = rows[i].empresa_id.toLowerCase().replace(/ /g, "");

                if (empresa_id === _empresa_id) {
                    validacion.valido = false;
                    validacion.msj = "El codigo de la empresa no esta disponible";
                    callback(validacion);
                    return;
                }

            }

        }
        callback(validacion);
    });
}

EmpresasModel.$inject = ["m_centros_utilidad", "m_bodegas"];

module.exports = EmpresasModel;