select formula_id,
    formula_papel,
    nom_bode,
    fecha,
    fecha_formula,
    plan_descripcion,
    descripcion_tipo_formula,
    eps_punto_atencion_nombre,
    codigo_alterno,
    codigo_producto,
    producto,
    cantidad,
    paciente_id,
    paciente,
    tercero_id,
    medico,
    especialidad,
    codigo_cum,
    lote,
    dispenso,
    precio,
    precio_regulado,
    pos,
    fecha_vencimiento,
    molecula, tipo_id_paciente,
    anatomofarmacologico,
    sum(total) as total,
    sum(costo) as total_costo


from (
    (select distinct fdm.formula_id, bdd.lote,
         efe.formula_papel,
         i.descripcion_tipo_formula,
         epad.primer_apellido || ' ' || epad.segundo_apellido || ' ' || epad.primer_nombre || ' ' || epad.segundo_nombre as paciente,
         efe.paciente_id, efe.tipo_id_paciente,
         ip.codigo_cum,
         fc_descripcion_producto(bdd.codigo_producto) as producto,
         te.nombre_tercero as medico,
         CAST(efe.tercero_id as text) as tercero_id,
         (select descripcion
          from especialidades esp
          inner join profesionales_especialidades pe ON (pe.especialidad = esp.especialidad)
          where te.tercero_id = pe.tercero_id and te.tipo_id_tercero = pe.tipo_id_tercero
          limit 1) as especialidad,
         bd.fecha_registro as fecha,
         efe.fecha_formula,
         bdd.codigo_producto,
         bdd.cantidad,
         bdd.total_costo,
         dn.bodega,
         (select descripcion
          from bodegas
          where bodega = dn.bodega and empresa_id = dn.empresa_id and centro_utilidad = dn.centro_utilidad) as nom_bode,
         dn.centro_utilidad,
         dn.empresa_id,
         bd.bodegas_doc_id,
         su.nombre as usuario_digita,
         efe.plan_id,
         efe.rango,
         pl.plan_descripcion,
         case when epaten.eps_punto_atencion_nombre != ''
                  then epaten.eps_punto_atencion_nombre
              else pl.plan_descripcion END as eps_punto_atencion_nombre,
         (case when ip.sw_generico = '1'
                   then (bdd.total_costo * 1.35)
               else (bdd.total_costo * 1.25) end) as precio,
         (bdd.cantidad * bdd.total_costo) as costo,
         (case when ip.sw_generico = '1'
                   then ((bdd.total_costo * bdd.cantidad) * 1.35)
               else ((bdd.total_costo * bdd.cantidad) * 1.25) end) as total,
             (SELECT nombre FROM system_usuarios where usuario_id = bd.usuario_id) as dispenso, ip.codigo_alterno,
         invt.precio_regulado,
         case when ip.sw_pos = 0 then 'NO POS' else 'POS' end as pos, bdd.fecha_vencimiento,
         molecula(bdd.codigo_producto) as molecula,
         ana.descripcion as anatomofarmacologico
     from bodegas_doc_numeraciones dn
          INNER JOIN bodegas_documentos bd on dn.bodegas_doc_id = bd.bodegas_doc_id
          INNER JOIN bodegas_documentos_d bdd
     on bd.bodegas_doc_id = bdd.bodegas_doc_id and bd.numeracion = bdd.numeracion
          INNER JOIN esm_formulacion_despachos_medicamentos fdm
     ON bd.bodegas_doc_id = fdm.bodegas_doc_id and bd.numeracion = fdm.numeracion
          INNER JOIN inventarios_productos ip on ip.codigo_producto = bdd.codigo_producto and $X{IN, ip.tipo_producto_id, Tipo_Producto}
         LEFT JOIN inv_med_cod_anatofarmacologico as ana
     on (ip.cod_anatofarmacologico = ana.cod_anatomofarmacologico)
         LEFT JOIN inventarios AS invt on (bdd.codigo_producto =invt.codigo_producto and dn.empresa_id=invt.empresa_id)
         INNER JOIN esm_formula_externa efe on efe.formula_id =fdm.formula_id
         INNER JOIN system_usuarios su on (efe.usuario_id=su.usuario_id)
         left JOIN eps_afiliados epa on epa.afiliado_id=efe.paciente_id and epa.afiliado_tipo_id=efe.tipo_id_paciente
         and eps_afiliacion_id=(select epa.eps_afiliacion_id from eps_afiliados epa where epa.afiliado_id=efe.paciente_id and epa.afiliado_tipo_id=efe.tipo_id_paciente and eps_punto_atencion_id!='' order by 1 desc limit 1)
         left join planes pl on (epa.plan_atencion = pl.plan_id)
         left join eps_afiliados_datos epad on efe.paciente_id=epad.afiliado_id and efe.tipo_id_paciente=epad.afiliado_tipo_id
         left JOIN eps_puntos_atencion epaten on epaten.eps_punto_atencion_id = epa.eps_punto_atencion_id
         inner join esm_tipos_formulas i on i.tipo_formula_id = efe.tipo_formula
         inner join terceros te on efe.tipo_id_tercero = te.tipo_id_tercero and efe.tercero_id = te.tercero_id
     where
         dn.empresa_id= $P{empresa} and efe.sw_estado not in ('2')
         and case when $P{c_u} is not null then dn.centro_utilidad =$P{c_u} else true end
         and case when $P{bodega} is not null then dn.bodega =$P{bodega} else true end
         and cast (bd.fecha_registro as date) between $P{fecha_ini} and $P{fecha_fin}
         and case when $P{codigo_pro} is not null then bdd.codigo_producto =$P{codigo_pro} else true end
         and case when $P{cedula} is not null then efe.paciente_id=$P{cedula} else true end
         and $X{IN, pl.plan_id, programa}
         and bdd.total_costo >0
    )
    union
    (
        select distinct dmp.formula_id, bdd.lote,
            efe.formula_papel,
            i.descripcion_tipo_formula,
            epad.primer_apellido || ' ' || epad.segundo_apellido || ' ' || epad.primer_nombre || ' '
                || epad.segundo_nombre as paciente,
            efe.paciente_id, efe.tipo_id_paciente,
            ip.codigo_cum,
            fc_descripcion_producto(bdd.codigo_producto) as producto,
            te.nombre_tercero as medico,
            CAST(efe.tercero_id as text) as tercero_id,
            (select descripcion
             from especialidades esp
                  inner join profesionales_especialidades pe ON (pe.especialidad = esp.especialidad)
             where te.tercero_id = pe.tercero_id and te.tipo_id_tercero = pe.tipo_id_tercero
             limit 1) as especialidad,
            bd.fecha_registro as fecha,
            efe.fecha_formula,
            bdd.codigo_producto,
            bdd.cantidad,
            bdd.total_costo,
            dn.bodega,
            (select descripcion
             from bodegas
             where bodega = dn.bodega and empresa_id = dn.empresa_id and
                 centro_utilidad = dn.centro_utilidad) as nom_bode,
            dn.centro_utilidad,
            dn.empresa_id,
            bd.bodegas_doc_id,
            su.nombre as usuario_digita,
            efe.plan_id,
            efe.rango,
            pl.plan_descripcion,
            case when epaten.eps_punto_atencion_nombre != ''
                     then epaten.eps_punto_atencion_nombre
                 else pl.plan_descripcion END as eps_punto_atencion_nombre,
            (case when ip.sw_generico = '1'
                      then (bdd.total_costo * 1.35)
                  else (bdd.total_costo * 1.25) end) as precio,
            (bdd.cantidad * bdd.total_costo) as costo,
            (case when ip.sw_generico = '1'
                      then ((bdd.total_costo * bdd.cantidad) * 1.35)
                  else ((bdd.total_costo * bdd.cantidad) * 1.25) end) as total,
                (SELECT nombre FROM system_usuarios where usuario_id = bd.usuario_id) as dispenso, ip.codigo_alterno,
            invt.precio_regulado,
            case when ip.sw_pos = 0 then 'NO POS' else 'POS' end as pos, bdd.fecha_vencimiento,
            molecula(bdd.codigo_producto) as molecula,
            ana.descripcion as anatomofarmacologico
        from bodegas_doc_numeraciones dn
             INNER JOIN bodegas_documentos bd on dn.bodegas_doc_id = bd.bodegas_doc_id
             INNER JOIN bodegas_documentos_d bdd
        on bd.bodegas_doc_id = bdd.bodegas_doc_id and bd.numeracion = bdd.numeracion
             INNER JOIN esm_formulacion_despachos_medicamentos_pendientes dmp
        ON bd.bodegas_doc_id = dmp.bodegas_doc_id and bd.numeracion = dmp.numeracion
             INNER JOIN inventarios_productos ip on ip.codigo_producto = bdd.codigo_producto and $X{IN, ip.tipo_producto_id, Tipo_Producto}
            LEFT JOIN inv_med_cod_anatofarmacologico as ana
        on (ip.cod_anatofarmacologico = ana.cod_anatomofarmacologico)
            LEFT JOIN inventarios AS invt on (bdd.codigo_producto =invt.codigo_producto and dn.empresa_id=invt.empresa_id)
            INNER JOIN esm_formula_externa efe on efe.formula_id =dmp.formula_id
            INNER JOIN system_usuarios su on (efe.usuario_id=su.usuario_id)
            left JOIN eps_afiliados epa on epa.afiliado_id=efe.paciente_id and epa.afiliado_tipo_id=efe.tipo_id_paciente
            and eps_afiliacion_id=(select epa.eps_afiliacion_id from eps_afiliados epa where epa.afiliado_id=efe.paciente_id and epa.afiliado_tipo_id=efe.tipo_id_paciente and eps_punto_atencion_id!='' order by 1 desc limit 1)
            left join planes pl on (epa.plan_atencion = pl.plan_id)
            left join eps_afiliados_datos epad on efe.paciente_id=epad.afiliado_id and efe.tipo_id_paciente=epad.afiliado_tipo_id
            left JOIN eps_puntos_atencion epaten on epaten.eps_punto_atencion_id = epa.eps_punto_atencion_id
            inner join esm_tipos_formulas i on i.tipo_formula_id = efe.tipo_formula
            inner join terceros te on efe.tipo_id_tercero = te.tipo_id_tercero and efe.tercero_id = te.tercero_id
            inner JOIN profesionales prf ON efe.tercero_id = prf.tercero_id and efe.tipo_id_tercero = prf.tipo_id_tercero
        where
            dn.empresa_id= $P{empresa} and efe.sw_estado not in ('2')
            and case when $P{c_u} is not null then dn.centro_utilidad =$P{c_u} else true end
            and case when $P{bodega} is not null then dn.bodega =$P{bodega} else true end
            and cast (bd.fecha_registro as date) between $P{fecha_ini} and $P{fecha_fin}
            and case when $P{codigo_pro} is not null then bdd.codigo_producto =$P{codigo_pro} else true end
            and case when $P{cedula} is not null then efe.paciente_id=$P{cedula} else true end
            and $X{IN, pl.plan_id, programa}
            and bdd.total_costo >0
    )
    union
    (
        select distinct d.evolucion_id as formula_id, c.lote,
            CAST(hfc.numero_formula as text) as formula_papel,
            i.descripcion_tipo_formula,
            epad.primer_apellido || ' ' || epad.segundo_apellido || ' ' || epad.primer_nombre || ' '
                || epad.segundo_nombre as paciente,
            hfc.paciente_id, hfc.tipo_id_paciente,
            w.codigo_cum,
            (
                SELECT (w.descripcion || ' ' || COALESCE(w.contenido_unidad_venta, '') || ' ' || COALESCE(
                    (select uni.descripcion from unidades uni where w.unidad_id = uni.unidad_id), '') || ' | ' ||
                    COALESCE((select ipre.descripcion
                              from inv_presentacioncomercial ipre
                              where w.presentacioncomercial_id = ipre.presentacioncomercial_id), '') || ' X ' ||
                    COALESCE(w.cantidad, '') || '. ' || (select clas.descripcion
                                                         from inv_clases_inventarios clas
                                                         where w.grupo_id = clas.grupo_id AND w.clase_id = clas.clase_id))) as producto,
            'medico' as medico,
            CAST(hfc.medico_id as text) as tercero_id,
            'especialidad' as especialidad,
            b.fecha_registro as fecha,
            hfc.fecha_registro as fecha_formula,
            c.codigo_producto,
            c.cantidad,
            c.total_costo,
            a.bodega,
            (select descripcion
             from bodegas
             where bodega = a.bodega and empresa_id = a.empresa_id and centro_utilidad = a.centro_utilidad) as nom_bode,
            a.centro_utilidad,
            a.empresa_id,
            a.bodegas_doc_id,
            su.nombre as usuario_digita,
            g.plan_id,
            '' as rango,
            g.plan_descripcion,
            case when h.eps_punto_atencion_nombre != ''
                     then h.eps_punto_atencion_nombre
                 else g.plan_descripcion END as eps_punto_atencion_nombre,
            (case when w.sw_generico = '1'
                      then (c.total_costo * 1.35)
                  else (c.total_costo * 1.25) end) as precio,
            (c.cantidad * c.total_costo) as costo,
            (case when w.sw_generico = '1'
                      then ((c.total_costo * c.cantidad) * 1.35)
                  else ((c.total_costo * c.cantidad) * 1.25) end) as total,
                (SELECT nombre FROM system_usuarios where usuario_id = b.usuario_id) as dispenso, w.codigo_alterno,
            invt.precio_regulado,
            case when w.sw_pos = 0 then 'NO POS' else 'POS' end as pos, c.fecha_vencimiento,
            molecula(c.codigo_producto) as molecula,
            ana.descripcion as anatomofarmacologico
        from bodegas_doc_numeraciones a
             inner JOIN bodegas_documentos b on a.bodegas_doc_id = b.bodegas_doc_id
             INNER JOIN system_usuarios su on (b.usuario_id = su.usuario_id)
             inner JOIN bodegas_documentos_d c on b.bodegas_doc_id = c.bodegas_doc_id and b.numeracion = c.numeracion
             inner JOIN hc_formulacion_despachos_medicamentos_pendientes d
        on b.bodegas_doc_id = d.bodegas_doc_id and b.numeracion = d.numeracion
             inner JOIN inventarios_productos w on w.codigo_producto = c.codigo_producto and $X{IN, w.tipo_producto_id, Tipo_Producto}
            LEFT JOIN inv_med_cod_anatofarmacologico as ana
        on (w.cod_anatofarmacologico = ana.cod_anatomofarmacologico)
            LEFT JOIN inventarios AS invt on (c.codigo_producto =invt.codigo_producto and a.empresa_id=invt.empresa_id)
            inner JOIN hc_formulacion_antecedentes_optima hfc on d.evolucion_id = hfc.evolucion_id
            left join eps_afiliados e on e.afiliado_id= hfc.paciente_id and e.afiliado_tipo_id= hfc.tipo_id_paciente
            and e.eps_afiliacion_id=(select epa.eps_afiliacion_id from eps_afiliados epa where epa.afiliado_id=hfc.paciente_id and epa.afiliado_tipo_id=hfc.tipo_id_paciente and eps_punto_atencion_id!='' order by 1 desc limit 1)
            left join eps_afiliados_datos epad on hfc.paciente_id=epad.afiliado_id and hfc.tipo_id_paciente=epad.afiliado_tipo_id
            left join planes_rangos f on e.plan_atencion = f.plan_id
            left join planes g on f.plan_id= g.plan_id
            left join eps_puntos_atencion h on h.eps_punto_atencion_id = e.eps_punto_atencion_id
            inner join hc_evoluciones he on d.evolucion_id=he.evolucion_id
            inner join esm_tipos_formulas i on i.tipo_formula_id = he.tipo_formula
        where
            a.empresa_id= $P{empresa}
            and case when $P{c_u} is not null then a.centro_utilidad =$P{c_u} else true end
            and case when $P{bodega} is not null then a.bodega =$P{bodega} else true end
            and case when $P{cedula} is not null then hfc.paciente_id=$P{cedula} else true end
            and case when $P{codigo_pro} is not null then w.codigo_producto =$P{codigo_pro} else true end
            and c.total_costo >0
            and cast (b.fecha_registro as date) between $P{fecha_ini} and $P{fecha_fin}
            and $X{IN, g.plan_id, programa}
    )
    union
    (
        select distinct d.evolucion_id as formula_id, c.lote,
            CAST(hfc.numero_formula as text) as formula_papel,
            i.descripcion_tipo_formula,
            epad.primer_apellido || ' ' || epad.segundo_apellido || ' ' || epad.primer_nombre || ' '
                || epad.segundo_nombre as paciente,
            hfc.paciente_id, hfc.tipo_id_paciente,
            w.codigo_cum,
            (
                SELECT (w.descripcion || ' ' || COALESCE(w.contenido_unidad_venta, '') || ' ' || COALESCE(
                    (select uni.descripcion from unidades uni where w.unidad_id = uni.unidad_id), '') || ' | ' ||
                    COALESCE((select ipre.descripcion
                              from inv_presentacioncomercial ipre
                              where w.presentacioncomercial_id = ipre.presentacioncomercial_id), '') || ' X ' ||
                    COALESCE(w.cantidad, '') || '. ' || (select clas.descripcion
                                                         from inv_clases_inventarios clas
                                                         where w.grupo_id = clas.grupo_id AND w.clase_id = clas.clase_id))) as producto,
            'medico' as medico,
            CAST(hfc.medico_id as text) as tercero_id,
            'especialidad' as especialidad,
            b.fecha_registro as fecha,
            hfc.fecha_registro as fecha_formula,
            c.codigo_producto,
            c.cantidad,
            c.total_costo,
            a.bodega,
            (select descripcion
             from bodegas
             where bodega = a.bodega and empresa_id = a.empresa_id and centro_utilidad = a.centro_utilidad) as nom_bode,
            a.centro_utilidad,
            a.empresa_id,
            a.bodegas_doc_id,
            su.nombre as usuario_digita,
            g.plan_id,
            '' as rango,
            g.plan_descripcion,
            case when h.eps_punto_atencion_nombre != ''
                     then h.eps_punto_atencion_nombre
                 else g.plan_descripcion END as eps_punto_atencion_nombre,
            (case when w.sw_generico = '1'
                      then (c.total_costo * 1.35)
                  else (c.total_costo * 1.25) end) as precio,
            (c.cantidad * c.total_costo) as costo,
            (case when w.sw_generico = '1'
                      then ((c.total_costo * c.cantidad) * 1.35)
                  else ((c.total_costo * c.cantidad) * 1.25) end) as total,
                (SELECT nombre FROM system_usuarios where usuario_id = b.usuario_id) as dispenso, w.codigo_alterno,
            invt.precio_regulado,
            case when w.sw_pos = 0 then 'NO POS' else 'POS' end as pos, c.fecha_vencimiento,
            molecula(c.codigo_producto) as molecula,
            ana.descripcion as anatomofarmacologico
        from bodegas_doc_numeraciones as a
             inner JOIN bodegas_documentos b on a.bodegas_doc_id = b.bodegas_doc_id
             INNER JOIN system_usuarios su on (b.usuario_id = su.usuario_id)
             inner JOIN bodegas_documentos_d c on b.bodegas_doc_id = c.bodegas_doc_id and b.numeracion = c.numeracion
             inner JOIN hc_formulacion_despachos_medicamentos d
        on b.bodegas_doc_id = d.bodegas_doc_id and b.numeracion = d.numeracion
             inner JOIN inventarios_productos w on w.codigo_producto = c.codigo_producto and $X{IN, w.tipo_producto_id, Tipo_Producto}
            LEFT JOIN inv_med_cod_anatofarmacologico as ana
        on (w.cod_anatofarmacologico = ana.cod_anatomofarmacologico)
            LEFT JOIN inventarios AS invt on (c.codigo_producto =invt.codigo_producto and a.empresa_id=invt.empresa_id)
            inner JOIN hc_formulacion_antecedentes_optima hfc on d.evolucion_id = hfc.evolucion_id
            left join eps_afiliados e on e.afiliado_id= hfc.paciente_id and e.afiliado_tipo_id= hfc.tipo_id_paciente
            and e.eps_afiliacion_id=(select epa.eps_afiliacion_id from eps_afiliados epa where epa.afiliado_id=hfc.paciente_id and epa.afiliado_tipo_id=hfc.tipo_id_paciente and eps_punto_atencion_id!='' order by 1 desc limit 1)
            left join eps_afiliados_datos epad on hfc.paciente_id=epad.afiliado_id and hfc.tipo_id_paciente=epad.afiliado_tipo_id
            left join planes_rangos f on e.plan_atencion = f.plan_id
            left join planes g on f.plan_id= g.plan_id
            left join eps_puntos_atencion h on h.eps_punto_atencion_id = e.eps_punto_atencion_id
            inner join hc_evoluciones he on d.evolucion_id=he.evolucion_id
            inner join esm_tipos_formulas i on i.tipo_formula_id = he.tipo_formula
        where
            a.empresa_id= $P{empresa}
            and case when $P{c_u} is not null then a.centro_utilidad =$P{c_u} else true end
            and case when $P{bodega} is not null then a.bodega =$P{bodega} else true end
            and case when $P{cedula} is not null then hfc.paciente_id=$P{cedula} else true end
            and case when $P{codigo_pro} is not null then w.codigo_producto =$P{codigo_pro} else true end
            and c.total_costo >0
            and cast (b.fecha_registro as date) between $P{fecha_ini} and $P{fecha_fin}
            and $X{IN, g.plan_id, programa}
    )
) as w
where case when $P{producto} is not null then w.producto ilike '%$P!{producto}%' else true end
group by 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27
order by 3


