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
                
                __guardarModulo(self, modulos, rol.usuario_id, function(err, modulos){
                    
                });
                
                console.log("rol id >>>>>>>>>>>>>>>>>>>>>>>>>", rol);
            });


        });
    });



};



function __guardarModulo(self, modulos, usuario_id, index, callback){
    var modulo = modulos[index];
    
    if(!modulo){
        callback(false, modulos);
        return;
    }
    
    modulo.usuario_id = usuario_id;
    
    self.m_modulo.insertarModulo(modulo, function(err, rows){
        if(err){
            callback(err, false);
            return;
        }
        
        modulo.id = rows.id;
        index++;
        
        __guardarModulo(self, modulos, usuario_id, index, callback);
        
        
    });
}

AdminModel.$inject = ["m_usuarios", "m_modulo", "m_rol", "m_empresas"];


module.exports = AdminModel;