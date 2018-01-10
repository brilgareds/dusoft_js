var TemporalesCronjob = function() {
   var that = this;
   //Cronjob solo corren en modo produccion
    if(G.program.prod){
       
        that.iniciar();
        that.backuptExistencias();
    }
    


};

TemporalesCronjob.prototype.iniciar = function(){
    var that = this;
    //El cronjob correra todos los dias a media noche
    
   // var job = new G.cronJob('*/59 */59 */23 * * *', function () {
    var job = new G.cronJob('00 00 00 * * *', function () {
        
        G.utils.limpiarDirectorio(G.dirname + "/public/reports/");
        G.utils.limpiarDirectorio(G.dirname + "/files/tmp/");
        
    });
    job.start();
    
};

//Proceso temporal hasta cuadrar los lapsos de cierre
TemporalesCronjob.prototype.backuptExistencias = function(){
    var that = this;
    //El cronjob correra todos los dias a media noche
    var job = new G.cronJob('00 00 00 * * *', function () {
        
        var sql = "INSERT INTO existencias_bodega_backup\
                    SELECT * FROM existencias_bodegas where empresa_id in ('03', 'FD') AND existencia > 0;"
        
        G.knex.raw(sql).then(function(){
          
        }).catch(function(err){
            console.log("error generado en backup existencias bodega", err);
        });
        
    });
    job.start();
    
};

module.exports = TemporalesCronjob;