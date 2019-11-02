SELECT
    procpid AS id,
    datname AS database,
    usename AS user,
    client_addr AS ip,
    substring(query_start, 0, 20) AS fecha,
    current_query AS consulta
FROM pg_stat_activity
WHERE NOT current_query ILIKE '%<IDLE>%' AND NOT current_query ILIKE '%from system_usuarios_sesiones%' AND
    NOT current_query ILIKE '%update system_usuarios_sesiones%' AND procpid != pg_backend_pid()
ORDER BY query_start ASC;