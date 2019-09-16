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
    //El cronjob correra todos los dias a media noche
    var job = new G.cronJob('00 00 00 * * *', function () {
        var d = new Date();
        var fecha = d.getDate()+'/'+(d.getMonth()+1)+'/'+d.getFullYear()+' '+d.getHours()+':'+d.getMinutes()+':'+d.getSeconds();
        var sql = "INSERT INTO\
                    existencia_productos_x_dia\
                    select\
                    a.empresa_id,\
                    a.centro_utilidad,\
                    a.bodega,\
                    a.codigo_producto,\
                    a.fecha_vencimiento,\
                    a.lote,\
                    a.existencia_actual,\
                    b.costo,\
                    '"+fecha+"' as fecha\
                    from\
                    existencias_bodegas_lote_fv as a\
                    inner join inventarios as b on (b.codigo_producto = a.codigo_producto and b.empresa_id = '03')\
                    where\
                    a.existencia_actual > 0\
                    and a.empresa_id in ('03', 'FD');";
        
        G.knex.raw(sql).then(function(){
           console.log("**************backuptExistencias****************");
        }).catch(function(err){
           console.log("error generado en backup existencias bodega", err);
        });
        
    });
    job.start();
    
};

module.exports = TemporalesCronjob;