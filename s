[33mcommit bc195a77b9c371d458ebe4f77c4a77bb36d74083[m
Author: egarcia <desarrollo@duanaltda.com>
Date:   Wed Oct 21 18:07:36 2015 -0500

    cambios modulo separacion en el backend pedidosClienteModel metodo consultar_detalle_peddio

[1mdiff --git a/app_modules/PedidosClientes/models/PedidosClienteModel.js b/app_modules/PedidosClientes/models/PedidosClienteModel.js[m
[1mindex 1a05277..65d5bdb 100644[m
[1m--- a/app_modules/PedidosClientes/models/PedidosClienteModel.js[m
[1m+++ b/app_modules/PedidosClientes/models/PedidosClienteModel.js[m
[36m@@ -366,7 +366,8 @@[m [mPedidosClienteModel.prototype.consultar_detalle_pedido = function(numero_pedido,[m
                     b.item_id,\[m
                     b.tipo_estado_auditoria,\[m
                     b.cantidad_ingresada,\[m
[31m-                    COALESCE(b.auditado, '0') as auditado\[m
[32m+[m[32m                    COALESCE(b.auditado, '0') as auditado,\[m
[32m+[m[32m                    c.codigo_barras \[m
                     from ventas_ordenes_pedidos_d a \[m
                     inner join inventarios_productos c on a.codigo_producto = c.codigo_producto \[m
                     inner join inv_subclases_inventarios d on c.grupo_id = d.grupo_id and c.clase_id = d.clase_id and c.subclase_id = d.subclase_id \[m
