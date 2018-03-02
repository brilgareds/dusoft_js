define(["angular", "js/services", "includes/classes/planes"], function(angular, services) {
  services.factory('formulaExternaService', ['$rootScope', 'Request', 'API',"$modal","localStorageService", "PacienteEsm", "Planes", formulaExternaService]);

  function formulaExternaService($rootScope, Request, API, $modal, localStorageService, PacienteEsm, Planes) {
    var self = this;
    /*Cuerpo de la peticion, debe contener los datos de la sesion para que el servidor acepte la peticion*/
    self.session = {};

    /**
    * @Descripcion Obtiene los tipos de documentos (cedula, TI, TE, etc)
    * @param callback
    */
    self.obtenerTiposDeDocumentos = obtenerTiposDeDocumentos;

    /**
    * @Descripcion Consulta el paciente
    * @param tipoIdentificacion el tipo de identificacion (CC, TI, TE, ... etc).
    * @param identificacion numero de identificacion.
    * @param callback
    * @return Paciente
    */
    self.obtenerPaciente = obtenerPaciente;
    self.obtenerTipoFormula = obtenerTipoFormula;
    self.obtenerMunicipios = obtenerMunicipios;

    return this;

    /****************** DEFINICION DE FUNCIONES *********************/
    function obtenerTiposDeDocumentos(callback){
      var body = {
        session : self.session,
        data : {}
      };

      Request.realizarRequest(API.FORMULACION_EXTERNA.OBTENER_TIPOS_DOCUMENTO,"POST", body, function(data){
          var error = data.status == 200? 0 : 1;
          callback(error, data.obj.listar_tipo_documento);
      });
    }

    function obtenerPaciente(tipoIdentificacion, identificacion, callback){
      var body = {
        session : self.session,
        data : {
          tipoIdentificacion : tipoIdentificacion,
          identificacion : identificacion
        }
      };

      Request.realizarRequest(API.FORMULACION_EXTERNA.OBTENER_PACIENTE,"POST", body, function(data){
          var error = data.status == 200 ? 0 : 1;
          if(!error){
            var objPLan = Planes.get(data.obj.plan_atencion, data.obj.plan_descripcion);
            var objPaciente = PacienteEsm.get(data.obj.tipo_id_paciente, data.obj.paciente_id, data.obj.apellidos, data.obj.nombres);
            objPaciente.setPlan(objPLan);
            callback(error, objPaciente);
          } else{
            callback(error, null);
          }
      });
    }    

    function obtenerTipoFormula(callback){
      var body = {
        session : self.session,
        data : {
          listar_tipo_formula : {}
        }
      };

      Request.realizarRequest(API.FORMULACION_EXTERNA.OBTENER_TIPO_FORMULA,"POST", body, function(data){
          var error = data.status == 200 ? 0 : 1;
          if(!error){
            callback(error, data.obj.listar_tipo_formula);
          } else{
            callback(error, null);
          }
      });
    }

    function obtenerMunicipios(term,callback){
      var body = {
        session : self.session,
        data : {
          term : term
        }
      };

      Request.realizarRequest(API.FORMULACION_EXTERNA.OBTENER_MUNICIPIOS,"POST", body, function(data){
          var error = data.status == 200 ? 0 : 1;
          if(!error){
            callback(error, data);
          } else{
            callback(error, null);
          }
      });
    }

  }
});
