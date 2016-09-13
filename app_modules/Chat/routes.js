module.exports = function(app, di_container) {


    var c_Chat = di_container.get("c_chat");

    app.post('/api/Chat/listarGrupos', function(req, res) {
        c_Chat.listarGrupos(req, res);
    });
    
    app.post('/api/Chat/listarUsuariosPorGrupo', function(req, res) {
        c_Chat.listarUsuariosPorGrupo(req, res);
    });
    
    app.post('/api/Chat/insertarUsuariosEnGrupo', function(req, res) {
        c_Chat.insertarUsuariosEnGrupo(req, res);
    });
    
    app.post('/api/Chat/guardarGrupo', function(req, res) {
        c_Chat.guardarGrupo(req, res);
    });
    
    app.post('/api/Chat/obtenerGrupoPorId', function(req, res) {
        c_Chat.obtenerGrupoPorId(req, res);
    });
    
    app.post('/api/Chat/cambiarEstadoUsuarioGrupo', function(req, res) {
        c_Chat.cambiarEstadoUsuarioGrupo(req, res);
    });
    
    app.post('/api/Chat/guardarConversacion', function(req, res) {
        c_Chat.guardarConversacion(req, res);
    });
    
    app.post('/api/Chat/obtenerConversaciones', function(req, res) {
        c_Chat.obtenerConversaciones(req, res);
    });
    
    app.post('/api/Chat/obtenerDetalleConversacion', function(req, res) {
        c_Chat.obtenerDetalleConversacion(req, res);
    });
    
    app.post('/api/Chat/guardarMensajeConversacion', function(req, res) {
        c_Chat.guardarMensajeConversacion(req, res);
    });
    
    app.post('/api/Chat/subirArchivoMensaje', function(req, res) {
        c_Chat.subirArchivoMensaje(req, res);
    });
    
    
    
};