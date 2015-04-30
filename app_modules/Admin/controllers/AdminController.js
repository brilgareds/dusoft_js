var Admin = function(m_admin) {
    
    this.m_admin = m_admin;
    console.log("Modulo Admin Cargado ");

};


Admin.prototype.inicializarAplicacion = function(req, res){
    var archivo = G.fs.readFileSync(G.dirname+G.settings.carpeta_admin+"Setup.json", "utf8");
    var json = JSON.parse(archivo);
    var self = this;
    self.m_admin.Setup(json, function(err, rows){
        if(err){
            var msj = "Ha ocurrido un error";
            
            if(err){
                msj = err.msj;
            }
            
            res.send(G.utils.r(req.url, msj, 403, {admin: {}}));
            return;
        }
        
        res.send(G.utils.r(req.url, "Se ha inicializado la aplicacion correctamente", 200, {admin: {}}));
        
    });
    
    
      
};


Admin.$inject = ["m_admin"];

module.exports = Admin;