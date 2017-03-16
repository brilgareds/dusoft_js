
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

    var that = this;
    
    var args = req.body.data;
     
    
    if(!args.lista_video_tutoriales){
        
        res.send(G.utils.r(req.url, 'Algunos Datos Obligatorios No Estan Definidos', 404, {lista_video_tutoriales: []}));
        return;
    }
    
    if(!args.lista_video_tutoriales.filtro || args.lista_video_tutoriales.filtro  === ''){
        
        res.send(G.utils.r(req.url, 'Debe diligenciar  la busqueda', 404, {lista_video_tutoriales: []}));
        return;
    }
     
    var parametros = {filtro: args.lista_video_tutoriales.filtro,
                    termino_busqueda: args.lista_video_tutoriales.termino_busqueda};
                 
    G.Q.ninvoke(that.m_tutoriales, "listarVideos",parametros).then(function(resultado){

        if(resultado.length > 0){
            
            res.send(G.utils.r(req.url,"Lista de video tutoriales", 200,{lista_video_tutoriales:resultado}));
        }else{
            
            throw {msj:'Consulta sin resultados', status:403}
            
        } 
        
        
    }).fail(function(err){
        console.log("err [listarVideos]:", err);
        res.send(G.utils.r(req.url,err.msj,err.status,{lista_video_tutoriales:{}}));
    }).done();
    
           
}


Tutoriales.$inject = ["m_tutoriales", "e_tutoriales", "m_usuarios", "e_tutoriales"];

module.exports = Tutoriales;
