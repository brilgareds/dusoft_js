var TemporalesCronjob = function(m_cronjob) {
   var that = this;
   this.m_cronjob = m_cronjob;
          
  // that.iniciar();

};

TemporalesCronjob.prototype.nombre = "temporales";


TemporalesCronjob.prototype.iniciar = function(req, res){
  // console.log("iniciando cronjob");
    var that = this;
    
     G.Q.ninvoke(that.m_cronjob,'obtenerEstadoCronjob', {nombre : that.nombre}).then(function(resultado){
         var def = G.Q.defer();
        if(resultado){
            console.log("processo listo para ejecutar cronjob ===================================");
        } else {
            console.log("el proceso no puede ejecutar cronjob =================================");
            def.resolve();
        }
         
     }).fail(function(err){
         console.log("error generado ", err);
     });
};


TemporalesCronjob.$inject = ["m_cronjob"];

module.exports = TemporalesCronjob;