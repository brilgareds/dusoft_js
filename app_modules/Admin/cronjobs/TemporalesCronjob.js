var TemporalesCronjob = function() {
   var that = this;
   that.iniciar();

};

TemporalesCronjob.prototype.iniciar = function(req, res){
    var that = this;
    
    var job = new G.cronJob('*/59 */59 */23 * * *', function () {
        console.log("corriendo crontab para borrar temporales");
        that.limpiarDirectorio(G.dirname + "/public/reports/");
        that.limpiarDirectorio(G.dirname + "/files/tmp/");
        
    });
    job.start();
    
};

TemporalesCronjob.prototype.limpiarDirectorio = function(path) {
  var that = this;
  if( G.fs.existsSync(path) ) {
    G.fs.readdirSync(path).forEach(function(file,index){
        
      var curPath = path + "/" + file;
      if(G.fs.lstatSync(curPath).isDirectory()) { // recurse
        that.limpiarDirectorio(path);
      } else { // delete file
        G.fs.unlinkSync(curPath);
      }
    });
   //G.fs.rmdirSync(path);
  }
};



module.exports = TemporalesCronjob;