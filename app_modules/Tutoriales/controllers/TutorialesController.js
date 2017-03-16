
var Tutoriales = function(m_tutoriales, e_tutoriales, m_usuarios, e_tutoriales) {
    
    this.m_tutoriales = m_tutoriales;
    this.e_tutoriales = e_tutoriales;
    this.m_usuarios = m_usuarios;
    this.e_tutoriales = e_tutoriales;
    
   
};

/**
 * @author Cristian Ardila
 * +Descripcion Metodo encargado de listar los video tutoriales
 * @fecha 2017/16/03
 */
Tutoriales.prototype.listarVideos = function(req, res){
    console.log("*********Tutoriales.prototype.listarVideos***********");
    var that = this;
    
    var args = req.body.data;
     
    var parametros = {};
     G.Q.ninvoke(that.m_tutoriales, "listarVideos",parametros).then(function(resultado){
        
        console.log("resultado ", resultado);
        if(resultado.length>0){
            
            res.send(G.utils.r(req.url,"Lista de video tutoriales", 200,{lista_video_tutoriales:resultado}));
        }else{
            
            throw {msj:'Error en la consulta de videos', status:401}
            
        }
        
        
    }).fail(function(err){
        res.send(G.utils.r(req.url,err.msj,err.status,{}));
    }).done();
    
           
}


Tutoriales.$inject = ["m_tutoriales", "e_tutoriales", "m_usuarios", "e_tutoriales"];

module.exports = Tutoriales;
