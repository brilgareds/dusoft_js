
var Tutoriales = function(m_tutoriales, e_tutoriales, m_usuarios, e_tutoriales) {
    
    this.m_tutoriales = m_tutoriales;
    this.e_tutoriales = e_tutoriales;
    this.m_usuarios = m_usuarios;
    this.e_tutoriales = e_tutoriales;
    
   
};

Tutoriales.prototype.listarVideos = function(req, res){
    
    var that = this;
    
    var args = req.body.data;
    
    
    console.log("args ", args)
        
}


Tutoriales.$inject = ["m_tutoriales", "e_tutoriales", "m_usuarios", "e_tutoriales"];

module.exports = Tutoriales;
