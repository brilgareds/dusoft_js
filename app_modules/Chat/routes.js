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
};