var TutorialesModel = function() {};
  

TutorialesModel.prototype.listarVideos = function(obj, callback){
 
    G.knex.column('id','tag', 'titulo', 'descripcion', 'path', G.knex.raw("TO_CHAR(fecha_registro,'YYYY-MM-DD') as fecha_registro") , G.knex.raw("CASE WHEN tipo = 0 THEN 'Video' ELSE 'Tutorial' END as tipo"))
    .select()
    .from('tutoriales')
    .where(function() {       
        if (obj.filtro.tipo === '0') {
            this.where(G.knex.raw("tag"), G.constants.db().LIKE, "%" + obj.termino_busqueda + "%");
        }

        if (obj.filtro.tipo === '1') {
            this.where(G.knex.raw("descripcion"), G.constants.db().LIKE, "%" + obj.termino_busqueda + "%")
        }      
    }).orderBy("id", "desc").limit(G.settings.limit).
    offset((obj.pagina_actual - 1) * G.settings.limit).then(function(resultado){ 
              
        callback(false, resultado)

    }).catch(function(err){ 
        
        console.log("err [listarVideos]:", err);
        callback({msj:'Error al listar los videos, consulte con el Administrador', status:501});
        
    });
 
};


TutorialesModel.prototype.guardarTutorial = function(parametros, callback){
    var tutorial = parametros.tutorial;
    
    if(!tutorial.tipo || !tutorial.descripcion || !tutorial.tag || !tutorial.titulo ){
        callback({msj: 'Algunos Datos Obligatorios No Estan Definidos', status: 404});    
        return;
    }
    
    if (tutorial.descripcion.length === 0 || !tutorial.tag.length === 0 || !tutorial.titulo.length === 0) {
        callback({msj: 'Algunos Datos Obligatorios No Estan Definidos', status: 404});
        return;
    }
    
    tutorial.tipo = tutorial.tipo.id;
    delete tutorial["fecha"];
    tutorial.usuario_id = tutorial.usuarioId;
    delete tutorial["usuarioId"];
    
    var query = G.knex('tutoriales');
    
    if(!tutorial.id){
        delete tutorial["id"];
        query.insert(tutorial);        
    } else {
        query.update(tutorial).
        where("id", tutorial.id);
    }
    
    query.returning("id").
    then(function(resultado) {       
        callback(false, resultado);
    }).catch(function(err){ 
        console.log(err)
        callback({msj:'Error al guardar el tutorial', status:501});
        
    });
};

TutorialesModel.$inject = [];


module.exports = TutorialesModel;

