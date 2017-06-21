
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
    
    if (args.lista_video_tutoriales.paginaActual === '') {
        res.send(G.utils.r(req.url, 'Se requiere el numero de la Pagina actual', 404, {lista_video_tutoriales: []}));
        return;
    }
    
    if(!args.lista_video_tutoriales.filtro || args.lista_video_tutoriales.filtro  === ''){
        
        res.send(G.utils.r(req.url, 'Debe diligenciar  la busqueda', 404, {lista_video_tutoriales: []}));
        return;
    }
     
    var parametros = {filtro: args.lista_video_tutoriales.filtro,
                    termino_busqueda: args.lista_video_tutoriales.termino_busqueda,
                    pagina_actual: args.lista_video_tutoriales.paginaActual};
         console.log("parametros ", parametros)        
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
    
           
};

/**
 * @author Eduar Garcia
 * +Descripcion Metodo que permite guardar un tutorial
 * @fecha 2017/31/05
 */
Tutoriales.prototype.guardarTutorial = function(req, res){

    var that = this;
    var args = req.body.data;
     
    if(!args.tutoriales && !args.tutoriales.empresa_id){
        res.send(G.utils.r(req.url, 'Algunos Datos Obligatorios No Estan Definidos', 404, {tutorial: []}));
        return;
    }
    
    var parametrosPermisos = { 
        usuario_id:req.session.user.usuario_id, 
        empresa_id:args.tutoriales.empresa_id,
        modulos:['videotutoriales'], 
        convertirJSON:true,
        limpiarCache:true,
        guardarResultadoEnCache:false
    };
    
    G.Q.ninvoke(that.m_usuarios, "obtenerParametrizacionUsuario", parametrosPermisos).then(function(parametrizacion){
        
        var opciones = (parametrizacion.modulosJson && parametrizacion.modulosJson.videotutoriales) ? parametrizacion.modulosJson.videotutoriales.opciones : undefined;
       
        if(opciones && opciones.sw_crear_tutorial){
            
            return G.Q.ninvoke(that.m_tutoriales, "guardarTutorial", {tutorial : args.tutoriales.tutorial});
            
        } else {
            
            throw {status:403, msj:"El usuario no puede crear tutoriales"};
        }
      
   }).then(function(resultado){
        console.log("resultado de guardar ", resultado)
        res.send(G.utils.r(req.url,"Lista de video tutoriales", 200,{tutorial:resultado}));
 
    }).fail(function(err){
        console.log("err [guardarTutorial]:", err);
        res.send(G.utils.r(req.url,err.msj || "Ha ocurrido un error...",err.status || 500,{tutorial:{}}));
    }).done();
    
};

/**
 * @author Eduar Garcia
 * +Descripcion Metodo que permite guardar un tutorial
 * @fecha 2017/31/05
 */
Tutoriales.prototype.subirArchivoTutorial = function(req, res){
    
    console.log("subirArchivoTutorial code 1");
    var that = this;
    var args = req.body.data;
    
    if(!args.tutoriales || !req.files.file || !args.tutoriales.tutorial.tipo || !args.tutoriales.tutorial.id  ){
        
        res.send(G.utils.r(req.url, 'Algunos Datos Obligatorios No Estan Definidos', 404, {tutorial: []}));
        return;
    }
    
    if (args.tutoriales.tutorial.id.length === 0 || !args.tutoriales.tutorial.tipo.id.length === 0) {
        res.send(G.utils.r(req.url, 'Algunos Datos Obligatorios No Estan Definidos', 404, {tutorial: []}));
        return;
    }
    
    req.files.file.customPath = G.settings.carpetaTutoriales  + ((args.tutoriales.tutorial.tipo.id === "0") ? "Videos/" : "Archivos/") + args.tutoriales.tutorial.id + "/" ;
    
    G.Q.ninvoke(G.utils, "subirArchivo", req.files, true).then(function(rutaArchivo){
        args.tutoriales.tutorial.path = args.tutoriales.tutorial.id + "/" + req.files.file.name;
        return G.Q.ninvoke(that.m_tutoriales, "guardarTutorial", {tutorial : args.tutoriales.tutorial});
        
    }).then(function(resultado){
        console.log("subirArchivoTutorial code 2");
        res.send(G.utils.r(req.url,"Lista de video tutoriales", 200,{tutorial:resultado}));
 
    }).fail(function(err){
        console.log("err [subirArchivoTutorial]:", err);
        res.send(G.utils.r(req.url,err.msj || "Ha ocurrido un error" ,err.status || 500,{tutorial:{}}));
    }).done();
};


Tutoriales.$inject = ["m_tutoriales", "e_tutoriales", "m_usuarios", "e_tutoriales"];

module.exports = Tutoriales;
