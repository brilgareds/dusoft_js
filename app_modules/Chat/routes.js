module.exports = function(app, di_container) {


    var c_Chat = di_container.get("c_chat");

    app.post('/api/Chat/listarGrupos', function(req, res) {
        c_Chat.listarGrupos(req, res);
    });

};