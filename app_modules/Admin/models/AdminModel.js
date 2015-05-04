var AdminModel = function(m_usuarios, m_modulos, m_rol, m_empresas) {

    this.m_usuarios = m_usuarios;
    this.m_modulos = m_modulos;
    this.m_rol = m_rol;
    this.m_empresas = m_empresas;
};

AdminModel.prototype.Setup = function(json, callback) {

    var self = this;
    var usuario = json.usuario;
    var empresa = json.empresa;
    var rol = json.rol;
    var modulos = json.modulos;

    console.log("usuario >>>>>>>>", usuario);

    self.m_usuarios.guardarUsuario(usuario, function(err, rows) {

        if (err) {
            callback(err, false);
            return;
        }

        rol.usuario_id = rows.usuario_id;
        rol.empresa_id = empresa.empresa_id;

        self.m_empresas.guardarEmpresa(empresa, function(err, rows) {

            if (err) {
                callback(err, false);
                return;
            }

            self.m_rol.insertarRol(rol, function(err, rows) {
                if (err) {
                    callback(err, false);
                    return;
                }

                rol.id = rows[0].id;

                __guardarModulo(self, modulos, rol, function(err, modulos) {
                    if (err) {
                        callback(err, false);
                        return;
                    }
                    
                    //se asigna el rol al usuario creado
                    self.m_usuarios.asignarRolUsuario(rol.usuario_id, empresa.empresa_id, rol.id, rol.usuario_id, '1', function(){
                        callback(err);
                    });
                });

            });


        });
    });



};



function __guardarModulo(self, modulos, rol, index, callback) {
    var modulo = modulos[index];

    if (!modulo) {
        callback(false, modulos);
        return;
    }

    modulo.usuario_id = rol.usuario_id;

    //se guarda el modulo
    self.m_modulo.insertarModulo(modulo, function(err, rows) {
        if (err) {
            callback(err, false);
            return;
        }

        modulo.id = rows.id;
        index++;

        var empresaModulo = [
            {
                empresa: {
                    codigo: rol.empresa_id,
                    estado: true
                },
                modulo: {
                    modulo_id: modulo.id
                }
            }
        ];

        //se habilita el modulo en la empresa del usuario
        self.m_modulo.habilitarModuloEnEmpresas(modulo.usuario_id, empresaModulo, function(err, rows, ids) {

            if (err) {
                callback(err, false);
                return;
            }

            var rolModulo = [
                {
                    modulo: {
                        empresasModulos: [
                            {
                                id: ids[0].modulos_empresas_id
                            }
                        ],
                        modulo_id: modulo.id
                    },
                    rol: {
                        id: rol.id
                    },
                    estado: true
                }
            ];


            //se habilita el modulo para el rol del usuario
            self.m_rol.habilitarModulosEnRoles(modulo.usuario_id, rolModulo, function(err) {
                if (err) {
                    callback(err, false);
                    return;
                }

                __guardarModulo(self, modulos, rol.usuario_id, index, callback);
            });
        });



    });
}

AdminModel.$inject = ["m_usuarios", "m_modulo", "m_rol", "m_empresas"];


module.exports = AdminModel;