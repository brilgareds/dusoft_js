SELECT a.*, c.parent, b.modulo_id, b.estado as estado_modulo_usuario, c.nombre, c.state, c.url, c.icon, c.carpeta_raiz,
    c.alias, b.id as login_modulos_empresas_id,
    CASE WHEN COALESCE((SELECT bb.id
                        FROM modulos aa
                             INNER join modulos bb on aa.id = bb.parent
                        WHERE aa.id = b.modulo_id
                        limit 1), 0) > 0
             THEN '1'
         ELSE '0' END as es_padre
FROM login_empresas a
     INNER JOIN login_modulos_empresas b ON b.login_empresas_id = a.id
     INNER JOIN modulos c ON b.modulo_id = c.id and c.estado = '1'
where c.app_token = 'dusoft-web') as asdsa
ORDER BY id
