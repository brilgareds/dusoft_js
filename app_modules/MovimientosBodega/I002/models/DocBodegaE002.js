var DocuemntoBodegaE002 = function(movientos_bodegas, m_pedidos_clientes, m_pedidos_farmacias) {

    this.m_movimientos_bodegas = movientos_bodegas;
    this.m_pedidos_clientes = m_pedidos_clientes;
    this.m_pedidos_farmacias = m_pedidos_farmacias;

};

/*********************************************************************************************************************************
 * ============= DOCUMENTOS TEMPORALES =============
 /*********************************************************************************************************************************/

DocuemntoBodegaE002.$inject = ["m_movimientos_bodegas", "m_pedidos_clientes", "m_pedidos_farmacias"];

module.exports = DocuemntoBodegaE002;