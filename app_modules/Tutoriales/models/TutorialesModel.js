var TutorialesModel = function() {};
  

TutorialesModel.prototype.listarVideos = function(obj, callback){
 
    G.knex.column('id','tag', 'titulo', 'descripcion', 'path', G.knex.raw("TO_CHAR(fecha_registro,'YYYY-MM-DD') as fecha_registro") , G.knex.raw("CASE WHEN tipo = 0 THEN 'Video' ELSE 'Tutorial' END as tipo"))
    .select()
    .from('tutoriales')
    .where(function() {       
        if (obj.filtro.tipo === '0') {
            this.where(G.knex.raw("tag"), G.constants.db().LIKE, "%#" + obj.termino_busqueda + "%");
        }

        if (obj.filtro.tipo === '1') {
            this.where(G.knex.raw("descripcion"), G.constants.db().LIKE, "%" + obj.termino_busqueda + "%")
        }      
    }).limit(G.settings.limit).
    offset((obj.pagina_actual - 1) * G.settings.limit).then(function(resultado){ 
              
        callback(false, resultado)

    }).catch(function(err){ 
        
        console.log("err [listarVideos]:", err);
        callback({msj:'Error al listar los videos, consulte con el Administrador', status:501});
        
    });
 
};

TutorialesModel.$inject = [];


module.exports = TutorialesModel;

