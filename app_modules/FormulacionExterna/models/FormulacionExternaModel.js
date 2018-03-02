var FormulacionExternaModel = function() {
};

FormulacionExternaModel.prototype.obtenerPaciente = function(tipoIdentificacion, identificacion, callback) {
    var columnas =  [
                        "p.paciente_id",
                        "p.tipo_id_paciente",
                        G.knex.raw("p.primer_nombre || ' ' || p.segundo_nombre  as nombres"), 
                        G.knex.raw("p.primer_apellido || ' ' || p.segundo_apellido as apellidos"),
                        "ea.estado_afiliado_id",
                        "ea.plan_atencion",
                        "ea.rango_afiliado_atencion",
                        "pa.plan_descripcion"
                    ];

    var query = G.knex.select(columnas)
                        .from('pacientes as p')
                        .innerJoin('eps_afiliados as ea',
                            function() {
                                this.on("p.tipo_id_paciente", "ea.afiliado_tipo_id")
                                    .on("p.paciente_id", "ea.afiliado_id")
                            }
                        )
                        .innerJoin('planes as pa',
                            function() {
                                this.on("ea.plan_atencion", "pa.plan_id")
                            }
                        )
                        .where('p.tipo_id_paciente', tipoIdentificacion).andWhere("p.paciente_id","=", identificacion);

    query.then(function(resultado){
        callback(false, resultado);
    }).catch(function(err){
        G.logError("err FormulacionExternaModel [obtenerPaciente]: " + err);
        callback(err);
    });
};

FormulacionExternaModel.prototype.obtenerMunicipios = function(term, callback) {
    var columnas = 	[
	    				"a.tipo_pais_id",
	    				"a.tipo_dpto_id",
	    				"a.tipo_mpio_id",
	    				"a.municipio",
	    				"b.departamento"
                    ];

	var query = G.knex.select(columnas)
                        .from('tipo_mpios as a')
                        .innerJoin('tipo_dptos as b',
                            function() {
                                this.on("a.tipo_pais_id", "b.tipo_pais_id")
                                    .on("a.tipo_dpto_id", "b.tipo_dpto_id")
                        	}
                        )
                        .where('a.municipio',G.constants.db().LIKE,"%" + term + "%");

    query.then(function(resultado){
      	callback(false, resultado);
    }).catch(function(err){
        G.logError("err FormulacionExternaModel [obtenerMunicipios]: " + err);
	    callback(err);
    });
};

FormulacionExternaModel.$inject = [];

module.exports = FormulacionExternaModel;