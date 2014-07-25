module.exports = function(app, di_container) {

  // Obtener los documentos de la bodega en las que el usuario tiene permiso para trabajar
  app.post('api/movBodegas/usuarioDocumentos', function(req, res){
      
  });
  
  
  
  // ======== Ruteo para Documentos E008 =============
  
  var c_e008 = di_container.get("c_e008");
  
  // Documento temporal de despacho clientes
  app.post('api/movBodegas/E008/documentoTemporalClientes', function(req, res){
      c_e008.documentoTemporalClientes(req, res);
  });
  
  // Documento temporal de despacho farmacias
  app.post('api/movBodegas/E008/DocumentoTemporalFarmacias', function(req, res){
      c_e008.documentoTemporalFarmacias(req, res);
  });


};