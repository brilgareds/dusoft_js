module.exports = function(app, di_container) {

    /*var usuarios_controller = require('./controllers/UsuariosController');
    var usuarios_model = require('./models/UsuariosModel');
   
    di_container.register("c_usuarios", usuarios_controller);
    di_container.register("m_usuarios", usuarios_model);*/
    
    var c_usuarios = di_container.get("c_usuarios");
    
    app.post('/api/Usuarios/listar', function(req, res) {
         c_usuarios.listarUsuarios(req, res);
    });    
    
    app.post('/api/Usuarios/guardarUsuario', function(req, res) {
         c_usuarios.guardarUsuario(req, res);
    });  
    
    app.post('/api/Usuarios/obtenerUsuarioPorId', function(req, res) {
         c_usuarios.obtenerUsuarioPorId(req, res);
    });  
    
    app.post('/api/Usuarios/subirAvatarUsuario', function(req, res) {
         c_usuarios.subirAvatarUsuario(req, res);
    }); 
    
    app.post('/api/Usuarios/obtenerAvatarUsuario', function(req, res) {
         c_usuarios.obtenerAvatarUsuario(req, res);
    }); 
  
    app.post('/api/Usuarios/asignarRolUsuario', function(req, res) {
         c_usuarios.asignarRolUsuario(req, res);
    }); 
    
    
};