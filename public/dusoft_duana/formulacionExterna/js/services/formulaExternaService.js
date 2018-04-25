define(["angular", "js/services", "includes/classes/planes", "includes/classes/Paciente", "includes/classes/Lote", "includes/classes/Producto"], function(angular, services) {
  services.factory('formulaExternaService', ['$rootScope', 'Request', 'API',"$modal","localStorageService", "Paciente", "Planes", "PlanesRangosEsm", "EpsAfiliadosEsm", "Lote", "Producto", formulaExternaService]);

  function formulaExternaService($rootScope, Request, API, $modal, localStorageService, Paciente, Planes, PlanesRangosEsm, EpsAfiliadosEsm, Lote, Producto) {
    var self = this;
    /*datos de la sesion para que el servidor acepte la peticion*/
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
    self.obtenerAfiliado = obtenerAfiliado;
    self.obtenerTipoFormula = obtenerTipoFormula;
    self.obtenerMunicipios = obtenerMunicipios;
    self.obtenerProfesionales = obtenerProfesionales;
    self.obtenerDiagnosticos = obtenerDiagnosticos;
    self.obtenerFormulaExternaTmp = obtenerFormulaExternaTmp;
    self.obtenerDiagnosticosTmp = obtenerDiagnosticosTmp;
    self.obtenerMedicamentosTmp = obtenerMedicamentosTmp;
    self.obtenerLotesDeProducto = obtenerLotesDeProducto;
    self.obtenerDispensacionMedicamentosTmp = obtenerDispensacionMedicamentosTmp;
    self.guardarFormulaExternaTmp = guardarFormulaExternaTmp;
    self.guardarDiagnosticoTmp = guardarDiagnosticoTmp;
    self.insertarMedicamentoTmp = insertarMedicamentoTmp;
    self.insertarDispensacionMedicamentoTmp = insertarDispensacionMedicamentoTmp;
    self.insertarLlamadaPacientes= insertarLlamadaPacientes;
    self.eliminarMedicamentoTmp = eliminarMedicamentoTmp;
    self.eliminarDiagnosticoTmp = eliminarDiagnosticoTmp;
    self.eliminarDispensacionMedicamentoTmp = eliminarDispensacionMedicamentoTmp;
    self.consultaExisteFormula = consultaExisteFormula;
    self.imprimirMedicamentosPendientesPorDispensar = imprimirMedicamentosPendientesPorDispensar;
    self.imprimirMedicamentosDispensados = imprimirMedicamentosDispensados;
    self.imprimirMedicamentosPendientesDispensados = imprimirMedicamentosPendientesDispensados;
    self.imprimirTodoDispensado = imprimirTodoDispensado;
    self.generarEntrega = generarEntrega;
    self.generarEntregaPendientes = generarEntregaPendientes;
    self.usuarioPrivilegios = usuarioPrivilegios;
    self.buscarProductos = buscarProductos;
    self.autorizarMedicamento = autorizarMedicamento;
    self.buscarFormulas = buscarFormulas;
    self.listarLlamadasPacientes= listarLlamadasPacientes;
    self.listarMedicamentosPendientes = listarMedicamentosPendientes;
    self.inactivarPendiente = inactivarPendiente;
    self.cambiarCodigoPendiente = cambiarCodigoPendiente;
    self.actualizarFormulaExternaTmp = actualizarFormulaExternaTmp;
    

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

    function obtenerAfiliado(tipoIdentificacion, identificacion, callback){
      var body = {
        session : self.session,
        data : {
          tipoIdentificacion : tipoIdentificacion,
          identificacion : identificacion
        }
      };

      Request.realizarRequest(API.FORMULACION_EXTERNA.OBTENER_AFILIADO,"POST", body, function(data){
          var error = data.status == 200 ? 0 : 1;
          if(!error){
            if(data.obj){
              var objAfiliados = EpsAfiliadosEsm.get(data.obj.tipo_id_paciente, data.obj.paciente_id, data.obj.plan_atencion);
              var objPlanRango = PlanesRangosEsm.get(data.obj.tipo_afiliado_id, data.obj.rango);
              var objPlan = Planes.get(data.obj.plan_atencion, data.obj.plan_descripcion);
              objPlanRango.agregarPlanes(objPlan);
              var objPaciente = Paciente.get(data.obj.tipo_id_paciente, data.obj.paciente_id, data.obj.apellidos, data.obj.nombres);
              objAfiliados.agregarPacientes(objPaciente);
              objAfiliados.agregarPlanAtencion(objPlanRango);
            } else {
              objAfiliados = false;
            }
            callback(error, objAfiliados);
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


    function inactivarPendiente(esm_pendiente_dispensacion_id, callback){
      var body = {
        session : self.session,
        data : {
          esm_pendiente_dispensacion_id : esm_pendiente_dispensacion_id
        }
      };

      Request.realizarRequest(API.FORMULACION_EXTERNA.INACTIVAR_PENDIENTE,"POST", body, function(data){
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
            callback(error, data.obj);
          } else{
            callback(error, null);
          }
      });
    }

    function obtenerDiagnosticosTmp(tmp_formula_id, callback){
      var body = {
        session : self.session,
        data : {
          tmp_formula_id: tmp_formula_id
        }
      };

      Request.realizarRequest(API.FORMULACION_EXTERNA.OBTENER_DIAGNOSTICOS_TMP,"POST", body, function(data){
          var error = data.status == 200 ? 0 : 1;
          if(!error){
            callback(error, data.obj);
          } else{
            callback(error, null);
          }
      });
    }

    function eliminarDiagnosticoTmp(tmp_formula_id, diagnostico_id, callback){
      var body = {
        session : self.session,
        data : {
          tmp_formula_id: tmp_formula_id,
          diagnostico_id : diagnostico_id
        }
      };

      Request.realizarRequest(API.FORMULACION_EXTERNA.ELIMINAR_DIAGNOSTICO_TMP,"POST", body, function(data){
          var error = data.status == 200 ? 0 : 1;
          if(!error){
            callback(error, 0);
          } else{
            callback(error, null);
          }
      });
    }

    function obtenerDiagnosticos(tipo_id_paciente, paciente_id, codigo, diagnostico, callback){
      var body = {
        session : self.session,
        data : {
          tipo_id_paciente: tipo_id_paciente,
          paciente_id: paciente_id,
          codigo: codigo,
          diagnostico: diagnostico
        }
      };

      Request.realizarRequest(API.FORMULACION_EXTERNA.OBTENER_DIAGNOSTICOS,"POST", body, function(data){
          var error = data.status == 200 ? 0 : 1;
          if(!error){
            callback(error, data.obj);
          } else{
            callback(error, null);
          }
      });
    }

    function obtenerProfesionales(term, callback){
      var body = {
        session : self.session,
        data : {
          term : term
        }
      };

      Request.realizarRequest(API.FORMULACION_EXTERNA.OBTENER_PROFESIONALES,"POST", body, function(data){
          var error = data.status == 200 ? 0 : 1;
          if(!error){
            callback(error, data.obj);
          } else{
            callback(error, null);
          }
      });
    }


    function cambiarCodigoPendiente(formula_id ,esm_pendiente_dispensacion_id, codigo_cambiar, codigo_medicamento, callback){
      var body = {
        session : self.session,
        data : {
          formula_id : formula_id,
          esm_pendiente_dispensacion_id : esm_pendiente_dispensacion_id,
          codigo_cambiar : codigo_cambiar,
          codigo_medicamento : codigo_medicamento
        }
      };

      Request.realizarRequest(API.FORMULACION_EXTERNA.CAMBIAR_CODIGO_PENDIENTE,"POST", body, function(data){
          var error = data.status == 200 ? 0 : 1;
          if(!error){
            callback(error, data.obj);
          } else{
            callback(error, null);
          }
      });
    }

    function guardarDiagnosticoTmp(tmp_formula_id, tipo_id_paciente, paciente_id, diagnostico_id, callback){
      var body = {
        session : self.session,
        data : {
          tmp_formula_id: tmp_formula_id,
          tipo_id_paciente : tipo_id_paciente,
          paciente_id : paciente_id,
          diagnostico_id : diagnostico_id
        }
      } 

      Request.realizarRequest(API.FORMULACION_EXTERNA.GUARDAR_DIAGNOSTICO_TMP, "POST", body, function(data){
        var error = data.status == 200? 0 : 1;
        if(!error){
          callback(error, data.obj);
        } else {
          callback(error, null);
        }
      });
    }

    function guardarFormulaExternaTmp(formula_papel, empresa_id, fecha_formula, tipo_formula, tipo_id_tercero, tercero_id, tipo_id_paciente, paciente_id, plan_id, rango, tipo_afiliado_id, centro_utilidad, bodega, tipo_pais_id, tipo_dpto_id, tipo_mpio_id, callback){
      var body = {
        session : self.session,
        data : {
          formula_papel: formula_papel,
           empresa_id: empresa_id,
           fecha_formula: fecha_formula,
           tipo_formula: tipo_formula,
           tipo_id_tercero: tipo_id_tercero,
           tercero_id: tercero_id,
           tipo_id_paciente: tipo_id_paciente,
           paciente_id: paciente_id,
           plan_id: plan_id,
           rango: rango,
           tipo_afiliado_id: tipo_afiliado_id,
           centro_utilidad: centro_utilidad,
           bodega: bodega,
           tipo_pais_id: tipo_pais_id,
           tipo_dpto_id: tipo_dpto_id,
           tipo_mpio_id: tipo_mpio_id
        }
      };

      Request.realizarRequest(API.FORMULACION_EXTERNA.GUARDAR_FORMULA_TMP,"POST", body, function(data){
          var error = data.status == 200 ? 0 : 1;
          if(!error){
            callback(error, data.obj.tmp_formula_id);
          } else{
            callback(error, null);
          }
      });
    }

    function actualizarFormulaExternaTmp(tmp_formula_id, formula_papel, empresa_id, fecha_formula, tipo_formula, tipo_id_tercero, tercero_id, tipo_id_paciente, paciente_id, plan_id, rango, tipo_afiliado_id, centro_utilidad, bodega, tipo_pais_id, tipo_dpto_id, tipo_mpio_id, callback){
      var body = {
        session : self.session,
        data : {
          tmp_formula_id : tmp_formula_id,
          formula_papel: formula_papel,
           empresa_id: empresa_id,
           fecha_formula: fecha_formula,
           tipo_formula: tipo_formula,
           tipo_id_tercero: tipo_id_tercero,
           tercero_id: tercero_id,
           tipo_id_paciente: tipo_id_paciente,
           paciente_id: paciente_id,
           plan_id: plan_id,
           rango: rango,
           tipo_afiliado_id: tipo_afiliado_id,
           centro_utilidad: centro_utilidad,
           bodega: bodega,
           tipo_pais_id: tipo_pais_id,
           tipo_dpto_id: tipo_dpto_id,
           tipo_mpio_id: tipo_mpio_id
        }
      };

      Request.realizarRequest(API.FORMULACION_EXTERNA.ACTUALIZAR_FORMULA_TMP,"POST", body, function(data){
          var error = data.status == 200 ? 0 : 1;
          if(!error){
            callback(error, data.obj.tmp_formula_id);
          } else{
            callback(error, null);
          }
      });
    }

    function obtenerFormulaExternaTmp(tipo_id_paciente, paciente_id, callback){
      var body = {
        session : self.session,
        data : {
          tipo_id_paciente: tipo_id_paciente,
          paciente_id : paciente_id
        }
      };

      Request.realizarRequest(API.FORMULACION_EXTERNA.OBTENER_FORMULA_EXTERNA_TMP,"POST", body, function(data){
          var formula = {};
          if (data.obj){
            var nombreMunicipio = data.obj.municipio? data.obj.municipio : 'Seleccionar Municipio';

            formula = {
              tmp_formula_id : data.obj.tmp_formula_id,
              formula_papel: data.obj.tmp_formula_papel,
              fecha : data.obj.fecha_formula,
              profesional : {
                nombre : data.obj.nombre_profesional,
                tipo_id_tercero : data.obj.tipo_id_tercero,
                tercero_id : data.obj.tercero_id
              },
              municipio : {
                nombre : nombreMunicipio,
                tipo_pais_id : data.obj.tipo_pais_id,
                tipo_dpto_id : data.obj.tipo_dpto_id,
                tipo_mpio_id : data.obj.tipo_mpio_id
              },
              tipoFormula : {
                id : data.obj.tipo_formula,
                descripcion : data.obj.descripcion_tipo_formula
              }
            };
          }          
          
          var error = data.status == 200 ? 0 : 1;
          if(!error){
            callback(error, formula);
          } else{
            callback(error, null);
          }
      });
    }

    function buscarProductos(empresa_id, centro_utilidad, bodega_id, codigo_producto, principio_activo, descripcion, codigo_barras, pagina, callback){
      var body = {
        session : self.session,
        data : {
          empresa_id: empresa_id,
          centro_utilidad : centro_utilidad,
          bodega_id : bodega_id,
          codigo_producto : codigo_producto,
          principio_activo : principio_activo,
          descripcion : descripcion,
          codigo_barras : codigo_barras,
          pagina : pagina
        }
      }; 

      Request.realizarRequest(API.FORMULACION_EXTERNA.BUSCAR_PRODUCTOS, "POST", body, function(data){
        var error = data.status == 200? 0 : 1;
        if(!error){
          callback(error, data.obj);
        } else {
          callback(error, null);
        }
      });
    }

    function insertarMedicamentoTmp(tmp_formula_id, codigo_producto, cantidad, tiempo_tratamiento, unidad_tiempo_tratamiento, tipo_id_paciente, paciente_id,  callback){
      var body = {
        session : self.session,
        data : {
          tmp_formula_id: tmp_formula_id,
          codigo_producto : codigo_producto,
          cantidad : cantidad,
          tiempo_tratamiento : tiempo_tratamiento,
          unidad_tiempo_tratamiento : unidad_tiempo_tratamiento,
          tipo_id_paciente : tipo_id_paciente,
          paciente_id : paciente_id
        }
      };

      Request.realizarRequest(API.FORMULACION_EXTERNA.INSERTAR_MEDICAMENTO_TMP, "POST", body, function(data){
        var error = data.status == 200? 0 : 1;
        if(!error){
          callback(error, data.obj);
        } else {
          callback(error, null);
        }
      });
    }

    function obtenerMedicamentosTmp(tmp_formula_id, callback){
      var body = {
        session : self.session,
        data : {
          tmp_formula_id: tmp_formula_id
        }
      };

      Request.realizarRequest(API.FORMULACION_EXTERNA.OBTENER_MEDICAMENTOS_TMP, "POST", body, function(data){
        var error = data.status == 200? 0 : 1;
        if(!error){
          callback(error, data.obj);
        } else {
          callback(error, null);
        }
      });
    }

    function eliminarMedicamentoTmp(fe_medicamento_id, callback){
      var body = {
        session : self.session,
        data : {
          fe_medicamento_id:fe_medicamento_id 
        }
      };

      Request.realizarRequest(API.FORMULACION_EXTERNA.ELIMINAR_MEDICAMENTO_TMP, "POST", body, function(data){
        var error = data.status == 200? 0 : 1;
        if(!error){
          callback(error, data.obj);
        } else {
          callback(error, null);
        }
      });
    }

    function consultaExisteFormula(tipo_id_paciente, paciente_id, formula_papel, callback){
      var body = {
        session : self.session,
        data : {
          tipo_id_paciente : tipo_id_paciente,
          paciente_id : paciente_id,
          formula_papel : formula_papel
        }
      };

      Request.realizarRequest(API.FORMULACION_EXTERNA.CONSULTA_EXISTE_FORMULA, "POST", body, function(data){
        var error = data.status == 200? 0 : 1;
        if(!error){
          callback(error, data.obj);
        } else {
          callback(error, null);
        }
      });
    }

    function obtenerLotesDeProducto(empresa_id, centro_utilidad, bodega, codigo_producto, formula_id_tmp, tipo_paciente_id, paciente_id, principio_activo, sw_autorizado, callback){
      var body = {
        session : self.session,
        data : {
          empresa_id : empresa_id,
          centro_utilidad : centro_utilidad,
          bodega : bodega,
          codigo_producto : codigo_producto,
          formula_id_tmp : formula_id_tmp,
          existenciasBodegas : {
            autorizado : sw_autorizado
          },
          //parametros para confontar el medicamento (determinar si ya se realizo una entrega del medicamento hace menos de 25 dias)
          tipo_paciente_id: tipo_paciente_id, 
          paciente_id : paciente_id,
          principio_activo : principio_activo
        }
      };

      Request.realizarRequest(API.FORMULACION_EXTERNA.OBTENER_LOTES_DE_PRODUCTO, "POST", body, function(data){
        var error = data.status == 200? 0 : data.status;
        if(!error){
            var productos = [];
            data.obj.forEach(function(item, index){
              var objLote = Lote.get(item.lote, item.fecha_vencimiento, item.existencia_actual);
              var objProducto = Producto.get(item.codigo_producto, item.producto, 0);
              objProducto.setConcentracion(item.concentracion);
              objProducto.setMolecula(item.molecula);
              objProducto.setCodigoFormaFarmacologico(item.forma_farmacologica);
              objProducto.setLaboratorio(item.laboratorio);
              objProducto.setPrincipioActivo(item.cod_principio_activo);
              objProducto.setEstadoProductoVencimiento(item.estado_producto);
              objProducto.cantidad_despachada = item.cantidad_despachada;
              objProducto.esm_dispen_tmp_id = item.esm_dispen_tmp_id
              objProducto.loteSeleccionado = item.loteseleccionado;
              objProducto.agregarLotes(objLote);
              productos.push(objProducto);
            });
          callback(error, productos);
        } else {
          callback(error, data);
        }
      });
    }

    function usuarioPrivilegios(empresa_id, centro_utilidad, bodega, callback){ 
      var body = {
        session : self.session,
        data : {
          existenciasBodegas : {
            empresa : empresa_id,
            centroUtilidad : centro_utilidad,
            bodega : bodega
          }
        }
      };

      Request.realizarRequest(API.DISPENSACIONHC.USUARIO_PRIVILEGIOS,"POST", body, function(data){
        var error = data.status == 200? 0 : data.status;
        if(!error){
          callback(error, data.obj.privilegios);
        } else {
          callback(error, data.obj);
        }
      });
    };

    function insertarDispensacionMedicamentoTmp(empresa_id, centro_utilidad, bodega, codigo_producto, cantidad_despachada, fecha_vencimiento, lote, formula_id_tmp, formula_id, cantidad_solicitada, callback){
      var body = {
        session : self.session,
        data : {
          empresa_id : empresa_id,
          centro_utilidad : centro_utilidad,
          bodega : bodega,
          codigo_producto : codigo_producto,
          cantidad_despachada : cantidad_despachada,
          fecha_vencimiento : fecha_vencimiento,
          lote : lote,
          formula_id_tmp : formula_id_tmp,
          formula_id : formula_id,
          cantidad_solicitada : cantidad_solicitada
        }
      };

      Request.realizarRequest(API.FORMULACION_EXTERNA.INSERTAR_DISPENSACION_MEDICAMENTO_TMP, "POST", body, function(data){
        var error = data.status == 200? 0 : 1;
        if(!error){
          callback(error, data.obj);
        } else {
          callback(error, data.obj);
        }
      });
    }

    function eliminarDispensacionMedicamentoTmp(esm_dispen_tmp_id, callback){
      var body = {
        session : self.session,
        data : {
          esm_dispen_tmp_id : esm_dispen_tmp_id
        }
      };

      Request.realizarRequest(API.FORMULACION_EXTERNA.ELIMINAR_DISPENSACION_MEDICAMENTO_TMP, "POST", body, function(data){
        var error = data.status == 200? 0 : 1;
        if(!error){
          callback(error, data);
        } else {
          callback(error, null);
        }
      });
    }

    function obtenerDispensacionMedicamentosTmp(formula_id_tmp, formula_id, callback){
      var body = {
        session : self.session,
        data : {
          formula_id_tmp : formula_id_tmp,
          formula_id : formula_id
        }
      };

      Request.realizarRequest(API.FORMULACION_EXTERNA.OBTENER_DISPENSACION_MEDICAMENTO_TMP, "POST", body, function(data){
        var error = data.status == 200? 0 : 1;
        if(!error){
          callback(error, data.obj);
        } else {
          callback(error, null);
        }
      });
    }

    function generarEntrega(formula_id_tmp, observacion, todo_pendiente, empresa_id, centro_utilidad, bodega, plan, callback){
      var body = {
        session : self.session,
        data : {
          formula_id_tmp : formula_id_tmp,
          observacion : observacion,
          todo_pendiente : todo_pendiente,
          empresa_id : empresa_id,
          centro_utilidad : centro_utilidad,
          bodega : bodega,
          plan: plan
        }
      };

      Request.realizarRequest(API.FORMULACION_EXTERNA.GENERAR_ENTREGA, "POST", body, function(data){
        var error = data.status == 200? 0 : 1;
        if(!error){
          callback(error, data.obj);
        } else {
          callback(error, data.obj);
        }
      });
    }

    function generarEntregaPendientes(formula_id, observacion, todo_pendiente, empresa_id, centro_utilidad, bodega, plan, callback){
      var body = {
        session : self.session,
        data : {
          formula_id : formula_id,
          observacion : observacion,
          todo_pendiente : todo_pendiente,
          empresa_id : empresa_id,
          centro_utilidad : centro_utilidad,
          bodega : bodega,
          plan: plan
        }
      };

      Request.realizarRequest(API.FORMULACION_EXTERNA.GENERAR_ENTREGA_PENDIENTES, "POST", body, function(data){
        var error = data.status == 200? 0 : 1;
        if(!error){
          callback(error, data.obj);
        } else {
          callback(error, data.obj);
        }
      });
    }

    //args.fe_medicamento_id, args.observacion_autorizacion,
    function autorizarMedicamento(fe_medicamento_id, observacion_autorizacion, callback){
      var body = {
        session : self.session,
        data : {
          fe_medicamento_id : fe_medicamento_id,
          observacion_autorizacion : observacion_autorizacion
        }
      };

      Request.realizarRequest(API.FORMULACION_EXTERNA.AUTORIZAR_MEDICAMENTO, "POST", body, function(data){
        var error = data.status == 200? 0 : 1;
        if(!error){
          callback(error, data.obj);
        } else {
          callback(error, data.obj);
        }
      });
    }

    function imprimirMedicamentosPendientesPorDispensar(formula_id, callback){
      var body = {
        session : self.session,
        data : {
          formula_id : formula_id
        }
      };

      Request.realizarRequest(API.FORMULACION_EXTERNA.IMPRIMIR_MEDICAMENTOS_PENDIENTES_POR_DISPENSAR, "POST", body, function(data){
        var error = data.status == 200? 0 : 1;
        if(!error){
          callback(error, data.obj);
        } else {
          callback(error, data.obj);
        }
      });
    }

    function imprimirMedicamentosPendientesDispensados(formula_id, imprimir_actual, callback){
      var body = {
        session : self.session,
        data : {
          formula_id : formula_id,
          imprimir_actual : imprimir_actual
        }
      };

      Request.realizarRequest(API.FORMULACION_EXTERNA.IMPRIMIR_MEDICAMENTOS_PENDIENTES_DISPENSADOS, "POST", body, function(data){
        var error = data.status == 200? 0 : 1;
        if(!error){
          callback(error, data.obj);
        } else {
          callback(error, data.obj);
        }
      });
    }


    function listarMedicamentosPendientes(formula_id, callback){
      var body = {
        session : self.session,
        data : {
          formula_id : formula_id
        }
      };

      Request.realizarRequest(API.FORMULACION_EXTERNA.LISTAR_MEDICAMENTOS_PENDIENTES, "POST", body, function(data){
        var error = data.status == 200? 0 : 1;
        if(!error){
          callback(error, data.obj);
        } else {
          callback(error, data.obj);
        }
      });
    }

    function insertarLlamadaPacientes(formula_id, contacto_nombre, contacto_parentezco, observacion, tel_contacto, callback){
      var body = {
        session : self.session,
        data : {
          formula_id : formula_id,
          contacto_nombre : contacto_nombre,
          contacto_parentezco : contacto_parentezco,
          observacion : observacion,
          tel_contacto : tel_contacto
        }
      };

      Request.realizarRequest(API.FORMULACION_EXTERNA.INSERTAR_LLAMADAS_PACIENTES, "POST", body, function(data){
        var error = data.status == 200? 0 : 1;
        if(!error){
          callback(error, data.obj);
        } else {
          callback(error, data.obj);
        }
      });
    }

    function listarLlamadasPacientes(formula_id, callback){
      var body = {
        session : self.session,
        data : {
          formula_id : formula_id
        }
      };

      Request.realizarRequest(API.FORMULACION_EXTERNA.LISTAR_LLAMADAS_PACIENTES, "POST", body, function(data){
        var error = data.status == 200? 0 : 1;
        if(!error){
          callback(error, data.obj);
        } else {
          callback(error, data.obj);
        }
      });
    }

    function imprimirMedicamentosDispensados(formula_id, imprimir_actual, callback){
      var body = {
        session : self.session,
        data : {
          formula_id : formula_id,
          imprimir_actual : imprimir_actual
        }
      };

      Request.realizarRequest(API.FORMULACION_EXTERNA.IMPRIMIR_MEDICAMENTOS_DISPENSADOS, "POST", body, function(data){
        var error = data.status == 200? 0 : 1;
        if(!error){
          callback(error, data.obj);
        } else {
          callback(error, data.obj);
        }
      });
    }    


    function imprimirTodoDispensado(formula_id, imprimir_actual, callback){
      var body = {
        session : self.session,
        data : {
          formula_id : formula_id,
          imprimir_actual : imprimir_actual
        }
      };

      Request.realizarRequest(API.FORMULACION_EXTERNA.IMPRIMIR_TODO_DISPENSADO, "POST", body, function(data){
        var error = data.status == 200? 0 : 1;
        if(!error){
          callback(error, data.obj);
        } else {
          callback(error, data.obj);
        }
      });
    }
    
    //G.Q.ninvoke(that.m_formulacionExterna,'buscarFormulas', args.nombre_paciente, args.formula_papel, args.tipo_id_paciente, args.paciente_id).then(function(resultado){
    function buscarFormulas(nombre_paciente, formula_papel, tipo_id_paciente, paciente_id, pagina, callback){
      var body = {
        session : self.session,
        data : {
          nombre_paciente : nombre_paciente,
          formula_papel : formula_papel,
          tipo_id_paciente : tipo_id_paciente,
          paciente_id : paciente_id,
          pagina : pagina
        }
      };

      Request.realizarRequest(API.FORMULACION_EXTERNA.BUSCAR_FORMULAS, "POST", body, function(data){
        var error = data.status == 200? 0 : 1;
        if(!error){
          callback(error, data.obj);
        } else {
          callback(error, data.obj);
        }
      });
    }

  }
});
