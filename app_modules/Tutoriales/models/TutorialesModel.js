var TutorialesModel = function() {};
  

TutorialesModel.prototype.listarVideos = function(obj, callback){
 
    G.knex.column('id','tag', 'titulo', 'descripcion', 'path', 'fecha_registro', G.knex.raw("CASE WHEN tipo = 0 THEN 'Video' ELSE 'Tutorial' END as tipo"))
    .select()
    .from('tutoriales')
    .orderBy('tag', 'asc').then(function(resultado){ 
              
        callback(false, resultado)

    }).catch(function(err){ 
        
        console.log("err [listarVideos]:", err);
        callback({msj:'Error al listar los videos, consulte con el Administrador', status:501});
        
    });
 
};

TutorialesModel.$inject = [];


module.exports = TutorialesModel;

