var Admin = function(m_admin, j_temporales) {
    
    this.m_admin = m_admin;
    //this.j_temporales = j_temporales;

};


Admin.prototype.inicializarAplicacion = function(req, res){
    var archivo = G.fs.readFileSync(G.dirname+G.settings.carpeta_admin+"Setup.json", "utf8");
    var json = JSON.parse(archivo);
    var self = this;
    
    self.m_admin.Setup(json, function(err, rows){
        if(err){
            var msj = "Ha ocurrido un error con el proceso de inicializacion, favor revisar el archivo de configuración";
            
            if(err.msj){
                msj = "Error en el archivo de inicialización: "+err.msj;
            }
            
            res.send(G.utils.r(req.url, msj, 403, {admin: {}}));
            return;
        }
        
        res.send(G.utils.r(req.url, "Se ha inicializado la aplicacion correctamente", 200, {admin: {}}));
        
    });
    
};


Admin.$inject = ["m_admin"/*, "j_temporales"*/];

module.exports = Admin;