define({ api: [
  {
    "type": "post",
    "url": "/login",
    "title": "Login",
    "name": "Autenticación_de_Usuarios",
    "group": "Autenticacion",
    "description": "Autentica un usuario en el sistema, permitiendole hacer uso de las funcionalidades del Sistema de Informacion Empresarial",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "field": "usuario_id",
            "optional": true,
            "description": "Identificador del Usuario."
          },
          {
            "group": "Parameter",
            "type": "String",
            "field": "auth_token",
            "optional": true,
            "description": "Token de Autenticación, este define si el usuario esta autenticado o no."
          },
          {
            "group": "Parameter",
            "type": "String",
            "field": "usuario",
            "optional": false,
            "description": "Nombre de Usuario, debe ser un usuario registrado en el Sistema de Información."
          },
          {
            "group": "Parameter",
            "type": "String",
            "field": "contrasenia",
            "optional": false,
            "description": "Contraseña valida para el usuario ingresado."
          }
        ]
      }
    },
    "success": {
      "examples": [
        {
          "title": "Ejemplo Válido del Request.",
          "content": "   HTTP/1.1 200 OK\n   {  \n        session: {              \n            usuario_id: '',\n            auth_token: ''\n        },\n        data : {\n            login :  { \n                        usuario : 'jhon.doe',\n                        contrasenia: '123jhon456'\n                     }\n        }\n   }\n"
        },
        {
          "title": "Respuesta-Exitosa:",
          "content": "   HTTP/1.1 200 OK\n   {\n     service : '/login',   \n     msj : 'Usuario Autenticado Correctamente',\n     status: '200',\n     obj : {\n                sesion : {\n                    usuario_id : 123456,\n                    auth_token : 'WUVgrfTd-lowg8Lsv-Qun6OzAQ-m0QaUhsl-LlzO1zF4'\n                }\n           }\n   }\n"
        }
      ]
    },
    "error": {
      "examples": [
        {
          "title": "Respuesta-Error:",
          "content": "   HTTP/1.1 404 Not Found\n   {\n     service : '/login',   \n     msj : 'Usuario o Contraseña Invalidos',\n     status: 404,\n     obj : {},\n   }\n"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "dusoft/app_modules/Autenticacion/controllers/AutenticacionController.js"
  },
  {
    "type": "post",
    "url": "/api/PedidosClientes/asignarResponsable",
    "title": "Asignar Responsables",
    "name": "Asignar_Responsables.",
    "group": "PedidosClientes",
    "description": "Asignar o delegar los pedidos a un operario de bodega para su correspondiente separacion.",
    "permission": {
      "name": "autenticado",
      "title": "Requiere Autenticacion",
      "description": "Requiere que el usuario esté autenticado.\n"
    },
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "field": "usuario_id",
            "optional": false,
            "description": "Identificador del Usuario."
          },
          {
            "group": "Parameter",
            "type": "String",
            "field": "auth_token",
            "optional": false,
            "description": "Token de Autenticación, este define si el usuario esta autenticado o no."
          },
          {
            "group": "Parameter",
            "type": "String[]",
            "field": "pedidos",
            "optional": false,
            "description": "Lista de pedidos"
          },
          {
            "group": "Parameter",
            "type": "Number",
            "field": "estado_pedido",
            "optional": false,
            "description": "ID del estado a asignar"
          },
          {
            "group": "Parameter",
            "type": "Number",
            "field": "responsable",
            "optional": false,
            "description": "Operario de Bodega al que se le asigna el pedido."
          }
        ]
      }
    },
    "success": {
      "examples": [
        {
          "title": "Ejemplo Válido del Request.",
          "content": "   HTTP/1.1 200 OK\n   {  \n        session: {              \n            usuario_id: 'jhon.doe',\n            auth_token: 'asdf2hgt56hjjhgrt-mnjhbgfd-asdfgyh-ghjmnbgfd'\n        },\n        data : {\n            asignacion_pedidos :  { \n                                    pedidos : [],\n                                    estado_pedido: '',\n                                    responsable : ''\n                                }\n        }\n   }\n"
        },
        {
          "title": "Respuesta-Exitosa:",
          "content": "   HTTP/1.1 200 OK\n   {\n     service : '/api/PedidosClientes/asignarResponsable',   \n     msj : 'Asignacion de Resposables',\n     status: '200',\n     obj : {\n           }\n   }\n"
        }
      ]
    },
    "error": {
      "examples": [
        {
          "title": "Respuesta-Error:",
          "content": "   HTTP/1.1 404 Not Found\n   {\n     service : '/api/PedidosClientes/asignarResponsable',   \n     msj : 'Mensaje Error',\n     status: 404,\n     obj : {},\n   }\n"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "dusoft/app_modules/PedidosClientes/controllers/PedidosClienteController.js"
  },
  {
    "type": "post",
    "url": "/api/PedidosClientes/listarPedidos",
    "title": "Listar Pedidos",
    "name": "Listar_Pedidos_Clientes",
    "group": "PedidosClientes",
    "description": "Proporciona un listado de Pedidos de Clientes, permite filtrar lo pedidos por los siguientes campos,\nnumero del pedido, identificacion o nombre del tercero, direccion, telefono, identificacion o nombre del vendedor.",
    "permission": {
      "name": "autenticado",
      "title": "Requiere Autenticacion",
      "description": "Requiere que el usuario esté autenticado.\n"
    },
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "field": "usuario_id",
            "optional": false,
            "description": "Identificador del Usuario."
          },
          {
            "group": "Parameter",
            "type": "String",
            "field": "auth_token",
            "optional": false,
            "description": "Token de Autenticación, este define si el usuario esta autenticado o no."
          },
          {
            "group": "Parameter",
            "type": "Number",
            "field": "empresa_id",
            "optional": false,
            "description": "Identificacion de la empresa de la cual se requieren los pedidos."
          },
          {
            "group": "Parameter",
            "type": "String",
            "field": "termino_busqueda",
            "optional": false,
            "description": "Termino por el cual desea filtrar los pedidos."
          },
          {
            "group": "Parameter",
            "type": "Number",
            "field": "pagina_actual",
            "optional": false,
            "description": "Numero de la pagina, requerido para la paginacion."
          }
        ]
      }
    },
    "success": {
      "examples": [
        {
          "title": "Ejemplo Válido del Request.",
          "content": "   HTTP/1.1 200 OK\n   {  \n        session: {              \n            usuario_id: 'jhon.doe',\n            auth_token: 'asdf2hgt56hjjhgrt-mnjhbgfd-asdfgyh-ghjmnbgfd'\n        },\n        data : {\n            pedidos_clientes :  { \n                                    termino_busqueda : '',\n                                    pagina_actual: ''\n                                }\n        }\n   }\n"
        },
        {
          "title": "Respuesta-Exitosa:",
          "content": "   HTTP/1.1 200 OK\n   {\n     service : '/api/PedidosClientes/listarPedidos',   \n     msj : 'Lista Pedidos Clientes',\n     status: '200',\n     obj : {\n                pedidos_clientes : [ \n                                      {   \n                                           numero_pedido: 33872,\n                                           tipo_id_cliente: 'CE',\n                                           identificacion_cliente: '10365',\n                                           nombre_cliente: 'CLINICA SANTA GRACIA DUMIAN MEDICAL\n                                           direccion_cliente: 'CALLE 14 15-49',\n                                           telefono_cliente: '8236444',\n                                           tipo_id_vendedor: 'CC ',\n                                           idetificacion_vendedor: '94518917',\n                                           nombre_vendedor: 'GUSTAVO ADOLFO MEJIA',\n                                           estado: '1',\n                                           descripcion_estado: 'Activo',\n                                           estado_actual_pedido: '1',\n                                           descripcion_estado_actual_pedido: 'Separado',\n                                           fecha_registro: '2014-01-21T17:28:50.700Z' \n                                       }\n                                    ]\n           }\n   }\n"
        }
      ]
    },
    "error": {
      "examples": [
        {
          "title": "Respuesta-Error:",
          "content": "   HTTP/1.1 404 Not Found\n   {\n     service : '/api/PedidosClientes/listarPedidos',   \n     msj : 'Mensaje Error',\n     status: 404,\n     obj : {},\n   }\n"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "dusoft/app_modules/PedidosClientes/controllers/PedidosClienteController.js"
  },
  {
    "type": "event",
    "url": "onNotificarPedidosActualizados",
    "title": "Notificación Pedidos Actualizados",
    "name": "Notificación_Pedidos_Actualizados",
    "group": "PedidosClientes_(evt)",
    "description": "Notifica a todos los usuarios en tiempo real que pedidos han sido actualizados.",
    "permission": {
      "name": "autenticado",
      "title": "Requiere Autenticacion",
      "description": "Requiere que el usuario esté autenticado.\n"
    },
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "Object",
            "field": "numero_pedidos",
            "optional": false,
            "description": "Lista de pedidos que le fueron asignados al operario de bodega."
          },
          {
            "group": "Parameter",
            "type": "Number",
            "field": "responsable",
            "optional": false,
            "description": "Operario de Bodega al que se le asigna el pedido."
          }
        ]
      }
    },
    "success": {
      "examples": [
        {
          "title": "Este Evento se usa en:",
          "content": "   Modulo : PedidosClientes\n   Accion : Controller - asignarResponsablesPedido();\n"
        },
        {
          "title": "Ejemplo Válido del Request.",
          "content": "   HTTP/1.1 200 OK\n   {  \n        numero_pedido: 15\n        \n   }\n"
        },
        {
          "title": "Emite o Notifica al evento onListarPedidosClientes",
          "content": "   HTTP/1.1 200 OK\n   {\n      pedidos_clientes : [ \n                            {   \n                                 numero_pedido: 33872,\n                                 tipo_id_cliente: 'CE',\n                                 identificacion_cliente: '10365',\n                                 nombre_cliente: 'CLINICA SANTA GRACIA DUMIAN MEDICAL\n                                 direccion_cliente: 'CALLE 14 15-49',\n                                 telefono_cliente: '8236444',\n                                 tipo_id_vendedor: 'CC ',\n                                 idetificacion_vendedor: '94518917',\n                                 nombre_vendedor: 'GUSTAVO ADOLFO MEJIA',\n                                 estado: '1',\n                                 descripcion_estado: 'Activo',\n                                 estado_actual_pedido: '1',\n                                 descripcion_estado_actual_pedido: 'Separado',\n                                 fecha_registro: '2014-01-21T17:28:50.700Z',\n                                 responsable_id: 19,\n                                 responsable_pedido: 'Ixon Eduardo Niño',\n                                 fecha_asignacion_pedido: '2014-03-04T17:44:30.911Z'                                   \n                               }\n                          ] \n   }\n"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "dusoft/app_modules/PedidosClientes/events/PedidosClientesEvents.js"
  },
  {
    "type": "event",
    "url": "onNotificacionOperarioPedidosAsignados",
    "title": "Notificación Pedidos Asignados",
    "name": "Notificación_Pedidos_Asignados",
    "group": "PedidosClientes_(evt)",
    "description": "Emite un evento o notificacion en tiempo real, a las plataformas conectados al API Dusoft Server, de los pedidos de clientes que le fueron asignado a un operario de bodega que se encuentre autenticado en el sistema.",
    "permission": {
      "name": "autenticado",
      "title": "Requiere Autenticacion",
      "description": "Requiere que el usuario esté autenticado.\n"
    },
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "Object",
            "field": "numero_pedidos",
            "optional": false,
            "description": "Lista de pedidos que le fueron asignados al operario de bodega."
          },
          {
            "group": "Parameter",
            "type": "Number",
            "field": "responsable",
            "optional": false,
            "description": "Operario de Bodega al que se le asigna el pedido."
          }
        ]
      }
    },
    "success": {
      "examples": [
        {
          "title": "Este Evento se usa en:",
          "content": "   Modulo : PedidosClientes\n   Accion : Controller - asignarResponsablesPedido();\n"
        },
        {
          "title": "Ejemplo Válido del Request.",
          "content": "   HTTP/1.1 200 OK\n   {  \n        numero_pedidos : [ 3865, 10265, 69, 12],\n        responsable : 19\n        \n   }\n"
        },
        {
          "title": "Emite o Notifica al evento onPedidosClientesAsignados",
          "content": "   HTTP/1.1 200 OK\n   {\n      pedidos_clientes : [ \n                            {   \n                                 numero_pedido: 33872,\n                                 tipo_id_cliente: 'CE',\n                                 identificacion_cliente: '10365',\n                                 nombre_cliente: 'CLINICA SANTA GRACIA DUMIAN MEDICAL\n                                 direccion_cliente: 'CALLE 14 15-49',\n                                 telefono_cliente: '8236444',\n                                 tipo_id_vendedor: 'CC ',\n                                 idetificacion_vendedor: '94518917',\n                                 nombre_vendedor: 'GUSTAVO ADOLFO MEJIA',\n                                 estado: '1',\n                                 descripcion_estado: 'Activo',\n                                 estado_actual_pedido: '1',\n                                 descripcion_estado_actual_pedido: 'Separado',\n                                 fecha_registro: '2014-01-21T17:28:50.700Z',\n                                 responsable_id: 19,\n                                 responsable_pedido: 'Ixon Eduardo Niño',\n                                 fecha_asignacion_pedido: '2014-03-04T17:44:30.911Z'     \n                                 lista_productos:[\n                                                             {\n                                                                numero_pedido : 33872,\n                                                                codigo_producto : '1145C1131279',\n                                                                descripcion_producto : 'OFTAFLOX . UNGUENTO OFTALMICO | TUBO X 5GR. SCANDINAVIA',\n                                                                cantidad_solicitada : 10,\n                                                                cantidad_despachada : 0,\n                                                                cantidad_pendiente : 10,\n                                                                cantidad_facturada : 0,\n                                                                valor_unitario: 8450,\n                                                                porcentaje_iva : 0,\n                                                                valor_unitario_con_iva: 8450,\n                                                                valor_iva: 0\n                                                             }\n                                           ]                               \n                               }\n                          ] \n   }\n"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "dusoft/app_modules/PedidosClientes/events/PedidosClientesEvents.js"
  },
  {
    "type": "sql",
    "url": "actualizar_responsables_pedidos",
    "title": "Actualizar Responsables Pedido",
    "name": "Actualizar_Responsables_Pedido",
    "group": "PedidosClientes_(sql)",
    "description": "Permite cambiar el estado actual del pedido, dependiendo en momento o gestion determinada en donde se encuentre.\nLos estados permitidos son:\n0 = No Asignado. Cuando se crea el pedido por primera vez\n1 = Asignado, cuando el pedido fue asignado a un operario de bodega para ser despachado\n2 = Auditado, Cuando se ha separado el pedido y lo estan auditando para verificar su correcta separacion.\n3 = En Despacho, Cuando se encuentra listo para ser despachado al lugar de destino.\n4 = Despachado, Cuando el pedido ha sido despachado en su total al lugar de destino.",
    "permission": {
      "name": "autenticado",
      "title": "Requiere Autenticacion",
      "description": "Requiere que el usuario esté autenticado.\n"
    },
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "Number",
            "field": "numero_pedido",
            "optional": false,
            "description": "Numero del pedido a asignar"
          },
          {
            "group": "Parameter",
            "type": "String",
            "field": "estado_pedido",
            "optional": false,
            "description": "Estado del pedido"
          },
          {
            "group": "Parameter",
            "type": "Function",
            "field": "callback",
            "optional": false,
            "description": "Funcion de retorno de informacion."
          }
        ]
      }
    },
    "success": {
      "examples": [
        {
          "title": "Este SQL se usa en:",
          "content": "   Modulo : PedidosClientes\n   Accion : Modelo - asignar_responsables_pedidos();\n"
        },
        {
          "title": "SQL.",
          "content": "        UPDATE ventas_ordenes_pedidos SET estado_pedido=$2 WHERE pedido_cliente_id=$1;\n"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "dusoft/app_modules/PedidosClientes/models/PedidosClienteModel.js"
  },
  {
    "type": "sql",
    "url": "actualizar_responsables_pedidos",
    "title": "Actualizar Responsables Pedido",
    "name": "Actualizar_Responsables_Pedido",
    "group": "PedidosClientes_(sql)",
    "description": "Asigna el Pedido a otro operario de bodega.",
    "permission": {
      "name": "autenticado",
      "title": "Requiere Autenticacion",
      "description": "Requiere que el usuario esté autenticado.\n"
    },
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "Number",
            "field": "numero_pedido",
            "optional": false,
            "description": "Numero del pedido a asignar"
          },
          {
            "group": "Parameter",
            "type": "String",
            "field": "estado_pedido",
            "optional": false,
            "description": "Estado del pedido"
          },
          {
            "group": "Parameter",
            "type": "Number",
            "field": "responsable",
            "optional": false,
            "description": "Id del Operario de bodega"
          },
          {
            "group": "Parameter",
            "type": "Number",
            "field": "usuario",
            "optional": false,
            "description": "Id del usuario que registra la asignacion."
          },
          {
            "group": "Parameter",
            "type": "Function",
            "field": "callback",
            "optional": false,
            "description": "Funcion de retorno de informacion."
          }
        ]
      }
    },
    "success": {
      "examples": [
        {
          "title": "Este SQL se usa en:",
          "content": "   Modulo : PedidosClientes\n   Accion : Modelo - asignar_responsables_pedidos();\n"
        },
        {
          "title": "SQL.",
          "content": "        UPDATE ventas_ordenes_pedidos_estado SET responsable_id=$3, fecha=NOW(), usuario_id=$4  WHERE pedido_cliente_id=$1 AND estado=$2;\n"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "dusoft/app_modules/PedidosClientes/models/PedidosClienteModel.js"
  },
  {
    "type": "sql",
    "url": "asignar_responsables_pedidos",
    "title": "Asignar Responsables",
    "name": "Asignar_Responsables",
    "group": "PedidosClientes_(sql)",
    "description": "Se le asignan pedidos a un operario de bodega para ser separados.",
    "permission": {
      "name": "autenticado",
      "title": "Requiere Autenticacion",
      "description": "Requiere que el usuario esté autenticado.\n"
    },
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "Number",
            "field": "numero_pedido",
            "optional": false,
            "description": "Numero del pedido a asignar"
          },
          {
            "group": "Parameter",
            "type": "String",
            "field": "estado_pedido",
            "optional": false,
            "description": "Estado del pedido"
          },
          {
            "group": "Parameter",
            "type": "Number",
            "field": "responsable",
            "optional": false,
            "description": "Id del Operario de bodega"
          },
          {
            "group": "Parameter",
            "type": "Number",
            "field": "usuario",
            "optional": false,
            "description": "Id del usuario que registra la asignacion."
          },
          {
            "group": "Parameter",
            "type": "Function",
            "field": "callback",
            "optional": false,
            "description": "Funcion de retorno de informacion."
          }
        ]
      }
    },
    "success": {
      "examples": [
        {
          "title": "Este SQL se usa en:",
          "content": "   Modulo : PedidosClientes\n   Accion : Controller - asignarResponsablesPedido();\n"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "dusoft/app_modules/PedidosClientes/models/PedidosClienteModel.js"
  },
  {
    "type": "sql",
    "url": "consultar_pedido",
    "title": "Consultar Pedido",
    "name": "Consultar_Pedido",
    "group": "PedidosClientes_(sql)",
    "description": "Consulta la información principal del pedido seleccionado.",
    "permission": {
      "name": "autenticado",
      "title": "Requiere Autenticacion",
      "description": "Requiere que el usuario esté autenticado.\n"
    },
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "Number",
            "field": "numero_pedido",
            "optional": false,
            "description": "Numero del Pedido"
          },
          {
            "group": "Parameter",
            "type": "Function",
            "field": "callback",
            "optional": false,
            "description": "Funcion de retorno de informacion."
          }
        ]
      }
    },
    "success": {
      "examples": [
        {
          "title": "Este SQL se usa en:",
          "content": "   Modulo : PedidosClientes\n   Accion : Evento - onNotificarPedidosActualizados();\n   \n   Modulo : PedidosClientes\n   Accion : Evento - onNotificacionOperarioPedidosAsignados();\n"
        },
        {
          "title": "SQL.",
          "content": "        select \na.pedido_cliente_id as numero_pedido, \nb.tipo_id_tercero as tipo_id_cliente, \nb.tercero_id as identificacion_cliente, \nb.nombre_tercero as nombre_cliente, \nb.direccion as direccion_cliente, \nb.telefono as telefono_cliente, \nc.tipo_id_vendedor, \nc.vendedor_id as idetificacion_vendedor, \nc.nombre as nombre_vendedor, \na.estado, \ncase when a.estado = 0 then 'Inactivo ' \nwhen a.estado = 1 then 'Activo' \nwhen a.estado = 2 then 'Anulado' \nwhen a.estado = 3 then 'Entregado' end as descripcion_estado, \na.estado_pedido as estado_actual_pedido, \ncase when a.estado_pedido = 0 then 'No Asignado' \nwhen a.estado_pedido = 1 then 'Asignado' \nwhen a.estado_pedido = 2 then 'Auditado' \nwhen a.estado_pedido = 3 then 'En Despacho' \nwhen a.estado_pedido = 4 then 'Despachado' end as descripcion_estado_actual_pedido, \na.fecha_registro \nfrom ventas_ordenes_pedidos a \ninner join terceros b on a.tipo_id_tercero = b.tipo_id_tercero and a.tercero_id = b.tercero_id \ninner join vnts_vendedores c on a.tipo_id_vendedor = c.tipo_id_vendedor and a.vendedor_id = c.vendedor_id \nwhere a.pedido_cliente_id = $1  \nAND (a.estado IN ('0','1','2','3')) order by 1 desc;\n"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "dusoft/app_modules/PedidosClientes/models/PedidosClienteModel.js"
  },
  {
    "type": "sql",
    "url": "consultar_detalle_pedido",
    "title": "Detalle Pedido",
    "name": "Detalle_Pedido",
    "group": "PedidosClientes_(sql)",
    "description": "Consulta toda la informacion detallada del pedido como productos, cantidades, precios, iva etc.",
    "permission": {
      "name": "autenticado",
      "title": "Requiere Autenticacion",
      "description": "Requiere que el usuario esté autenticado.\n"
    },
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "Number",
            "field": "numero_pedido",
            "optional": false,
            "description": "Numero del Pedido"
          },
          {
            "group": "Parameter",
            "type": "Function",
            "field": "callback",
            "optional": false,
            "description": "Funcion de retorno de informacion."
          }
        ]
      }
    },
    "success": {
      "examples": [
        {
          "title": "Este SQL se usa en:",
          "content": "   Modulo : PedidosClientes\n   Accion : Controller - listaPedidosOperariosBodega();\n"
        },
        {
          "title": "SQL.",
          "content": "        select\na.pedido_cliente_id as numero_pedido,\na.codigo_producto,\nfc_descripcion_producto(a.codigo_producto) as descripcion_producto,\na.numero_unidades as cantidad_solicitada,\na.cantidad_despachada,\na.numero_unidades - a.cantidad_despachada as cantidad_pendiente,\na.cantidad_facturada,\na.valor_unitario,\na.porc_iva as porcentaje_iva,\n(a.valor_unitario+(a.valor_unitario*(a.porc_iva/100)))as valor_unitario_con_iva,\n(a.numero_unidades*(a.valor_unitario*(a.porc_iva/100))) as valor_iva\nfrom ventas_ordenes_pedidos_d a where a.pedido_cliente_id = $1 ;\n"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "dusoft/app_modules/PedidosClientes/models/PedidosClienteModel.js"
  },
  {
    "type": "sql",
    "url": "insertar_responsables_pedidos",
    "title": "Ingresar Responsables Pedido",
    "name": "Ingresar_Responsables_Pedido",
    "group": "PedidosClientes_(sql)",
    "description": "Ingresar el responsable del pedido asignado",
    "permission": {
      "name": "autenticado",
      "title": "Requiere Autenticacion",
      "description": "Requiere que el usuario esté autenticado.\n"
    },
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "Number",
            "field": "numero_pedido",
            "optional": false,
            "description": "Numero del pedido a asignar"
          },
          {
            "group": "Parameter",
            "type": "String",
            "field": "estado_pedido",
            "optional": false,
            "description": "Estado del pedido"
          },
          {
            "group": "Parameter",
            "type": "Number",
            "field": "responsable",
            "optional": false,
            "description": "Id del Operario de bodega"
          },
          {
            "group": "Parameter",
            "type": "Number",
            "field": "usuario",
            "optional": false,
            "description": "Id del usuario que registra la asignacion."
          },
          {
            "group": "Parameter",
            "type": "Function",
            "field": "callback",
            "optional": false,
            "description": "Funcion de retorno de informacion."
          }
        ]
      }
    },
    "success": {
      "examples": [
        {
          "title": "Este SQL se usa en:",
          "content": "   Modulo : PedidosClientes\n   Accion : Modelo - asignar_responsables_pedidos();\n"
        },
        {
          "title": "SQL.",
          "content": "        INSERT INTO ventas_ordenes_pedidos_estado( pedido_cliente_id, estado, responsable_id, fecha, usuario_id) VALUES ($1, $2, $3, now(), $4);\n"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "dusoft/app_modules/PedidosClientes/models/PedidosClienteModel.js"
  },
  {
    "type": "sql",
    "url": "listar_pedidos_del_operario",
    "title": "Listar Pedidos Operarios",
    "name": "Listar_Pedidos_Operarios",
    "group": "PedidosClientes_(sql)",
    "description": "Listar los pedidos asignados a un operario de bodega.",
    "permission": {
      "name": "autenticado",
      "title": "Requiere Autenticacion",
      "description": "Requiere que el usuario esté autenticado.\n"
    },
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "Number",
            "field": "responsable",
            "optional": false,
            "description": "Nombre del Operario"
          },
          {
            "group": "Parameter",
            "type": "Number",
            "field": "pagina",
            "optional": false,
            "description": "Número de la pagina que requiere traer registros"
          },
          {
            "group": "Parameter",
            "type": "Number",
            "field": "limite",
            "optional": false,
            "description": "Cantidad de resgistros por pagina, si no se envia el limite default es 1000"
          },
          {
            "group": "Parameter",
            "type": "Function",
            "field": "callback",
            "optional": false,
            "description": "Funcion de retorno de informacion."
          }
        ]
      }
    },
    "success": {
      "examples": [
        {
          "title": "Este SQL se usa en:",
          "content": "   Modulo : PedidosClientes\n   Accion : Controller - listaPedidosOperariosBodega();\n"
        },
        {
          "title": "SQL.",
          "content": "    select \n    a.pedido_cliente_id as numero_pedido, \n    b.tipo_id_tercero as tipo_id_cliente, \n    b.tercero_id as identificacion_cliente, \n    b.nombre_tercero as nombre_cliente, \n    b.direccion as direccion_cliente, \n    b.telefono as telefono_cliente, \n    c.tipo_id_vendedor, \n    c.vendedor_id as idetificacion_vendedor, \n    c.nombre as nombre_vendedor, \n    a.estado, \n    case when a.estado = 0 then 'Inactivo' \n    when a.estado = 1 then 'Activo' \n    when a.estado = 2 then 'Anulado' \n    when a.estado = 3 then 'Entregado' end as descripcion_estado, \n    a.estado_pedido as estado_actual_pedido, \n    case when a.estado_pedido = 0 then 'No Asignado' \n    when a.estado_pedido = 1 then 'Asignado' \n    when a.estado_pedido = 2 then 'Auditado' \n    when a.estado_pedido = 3 then 'En Despacho' \n    when a.estado_pedido = 4 then 'Despachado' end as descripcion_estado_actual_pedido, \n    a.fecha_registro,\n    d.responsable_id,\n    e.nombre as responsable_pedido,\n    d.fecha as fecha_asignacion_pedido \n    from ventas_ordenes_pedidos a \n    inner join terceros b on a.tipo_id_tercero = b.tipo_id_tercero and a.tercero_id = b.tercero_id \n    inner join vnts_vendedores c on a.tipo_id_vendedor = c.tipo_id_vendedor and a.vendedor_id = c.vendedor_id \n    inner join ventas_ordenes_pedidos_estado d on a.pedido_cliente_id = d.pedido_cliente_id and a.estado_pedido = d.estado\n    inner join operarios_bodega e on d.responsable_id = e.operario_id\n    where d.responsable_id = $1  \n    and a.estado_pedido = '1' \n    AND (a.estado IN ('1'))   \n    order by by d.fecha desc limit $2 offset $3 ;;\n"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "dusoft/app_modules/PedidosClientes/models/PedidosClienteModel.js"
  },
  {
    "type": "sql",
    "url": "listar_pedidos_clientes",
    "title": "Pedidos Clientes",
    "name": "Pedidos_Clientes",
    "group": "PedidosClientes_(sql)",
    "description": "Lista todos los pedidos realizados a clientes.",
    "permission": {
      "name": "autenticado",
      "title": "Requiere Autenticacion",
      "description": "Requiere que el usuario esté autenticado.\n"
    },
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "field": "empresa_id",
            "optional": false,
            "description": "Identificador de la Empresa que realizó el pedido"
          },
          {
            "group": "Parameter",
            "type": "String",
            "field": "termino_busqueda",
            "optional": false,
            "description": "Termino por el cual desea filtrar lo pedidos.\n                   Se puede filtrar por:\n                   numero del pedido\n                   identificacion del tercero\n                   nombre del tercero\n                   direccion\n                   telefono\n                   identificacion del vendedor\n                   nombre del vendedor."
          },
          {
            "group": "Parameter",
            "type": "Number",
            "field": "pagina",
            "optional": false,
            "description": "Numero de la pagina, actualmente se traen 1000 registros por pagina (Cambiar en configuraciones de empresa)"
          },
          {
            "group": "Parameter",
            "type": "Function",
            "field": "callback",
            "optional": false,
            "description": "Funcion de retorno de informacion."
          }
        ]
      }
    },
    "success": {
      "examples": [
        {
          "title": "Este SQL se usa en:",
          "content": "   Modulo : PedidosClientes\n   Accion : Controller - listarPedidosClientes();\n"
        },
        {
          "title": "SQL.",
          "content": "        select \na.pedido_cliente_id as numero_pedido, \nb.tipo_id_tercero as tipo_id_cliente, \nb.tercero_id as identificacion_cliente, \nb.nombre_tercero as nombre_cliente, \nb.direccion as direccion_cliente, \nb.telefono as telefono_cliente, \nc.tipo_id_vendedor, \nc.vendedor_id as idetificacion_vendedor, \nc.nombre as nombre_vendedor, \na.estado, \ncase when a.estado = 0 then 'Inactivo ' \nwhen a.estado = 1 then 'Activo' \nwhen a.estado = 2 then 'Anulado' \nwhen a.estado = 3 then 'Entregado' end as descripcion_estado, \na.estado_pedido as estado_actual_pedido, \ncase when a.estado_pedido = 0 then 'No Asignado' \nwhen a.estado_pedido = 1 then 'Asignado' \nwhen a.estado_pedido = 2 then 'Auditado' \nwhen a.estado_pedido = 3 then 'En Despacho' \nwhen a.estado_pedido = 4 then 'Despachado' end as descripcion_estado_actual_pedido, \na.fecha_registro \nfrom ventas_ordenes_pedidos a \ninner join terceros b on a.tipo_id_tercero = b.tipo_id_tercero and a.tercero_id = b.tercero_id \ninner join vnts_vendedores c on a.tipo_id_vendedor = c.tipo_id_vendedor and a.vendedor_id = c.vendedor_id \nwhere a.empresa_id = $1 \nand (   a.pedido_cliente_id ilike $2  \nor b.tercero_id ilike $2 \nor b.nombre_tercero ilike $2 \nor b.direccion ilike $2  \nor b.telefono ilike $2   \nor c.vendedor_id ilike $2 \nor c.nombre ilike $2) \nAND (a.estado IN ('0','1','2','3')) order by 1 desc  limit $3 offset $4\n"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "dusoft/app_modules/PedidosClientes/models/PedidosClienteModel.js"
  },
  {
    "type": "post",
    "url": "/api/PedidosClientes/listaPedidosOperarioBodega",
    "title": "Listar Pedidos Operarios",
    "name": "listaPedidosOperarioBodega",
    "group": "PedidosClientes",
    "description": "Proporciona una lista con todos los pedidos de clientes asignados a un operario de bodega",
    "permission": {
      "name": "autenticado",
      "title": "Requiere Autenticacion",
      "description": "Requiere que el usuario esté autenticado.\n"
    },
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "field": "usuario_id",
            "optional": false,
            "description": "Identificador del Usuario."
          },
          {
            "group": "Parameter",
            "type": "String",
            "field": "auth_token",
            "optional": false,
            "description": "Token de Autenticación, este define si el usuario esta autenticado o no."
          },
          {
            "group": "Parameter",
            "type": "Number",
            "field": "operario_id",
            "optional": false,
            "description": "Identificador asignado al operario de Bodega."
          },
          {
            "group": "Parameter",
            "type": "Number",
            "field": "pagina_actual",
            "optional": false,
            "description": "Numero de la pagina que requiere."
          },
          {
            "group": "Parameter",
            "type": "Number",
            "field": "limite",
            "optional": true,
            "description": "Cantidad de registros por cada pagina."
          }
        ]
      }
    },
    "success": {
      "examples": [
        {
          "title": "Ejemplo Válido del Request.",
          "content": "   HTTP/1.1 200 OK\n   {  \n        session: {              \n            usuario_id: 'jhon.doe',\n            auth_token: 'asdf2hgt56hjjhgrt-mnjhbgfd-asdfgyh-ghjmnbgfd'\n        },\n        data : {\n            pedidos_clientes : { \n                                operario_id:  19,\n                                pagina_actual : 1,\n                                limite : 40\n                            }\n        }\n   }\n"
        },
        {
          "title": "Respuesta-Exitosa:",
          "content": "   HTTP/1.1 200 OK\n   {\n     service : '/api/PedidosClientes/listaPedidosOperarioBodega',   \n     msj : 'Lista Pedidos Clientes',\n     status: '200',\n     obj : {\n                pedidos_clientes : [ \n                                      {   \n                                           numero_pedido: 33872,\n                                           tipo_id_cliente: 'CE',\n                                           identificacion_cliente: '10365',\n                                           nombre_cliente: 'CLINICA SANTA GRACIA DUMIAN MEDICAL\n                                           direccion_cliente: 'CALLE 14 15-49',\n                                           telefono_cliente: '8236444',\n                                           tipo_id_vendedor: 'CC ',\n                                           idetificacion_vendedor: '94518917',\n                                           nombre_vendedor: 'GUSTAVO ADOLFO MEJIA',\n                                           estado: '1',\n                                           descripcion_estado: 'Activo',\n                                           estado_actual_pedido: '1',\n                                           descripcion_estado_actual_pedido: 'Separado',\n                                           fecha_registro: '2014-01-21T17:28:50.700Z',\n                                           responsable_id: 19,\n                                           responsable_pedido: 'Ixon Eduardo Niño',\n                                           fecha_asignacion_pedido: '2014-03-04T17:44:30.911Z',\n                                           lista_productos:[\n                                                             {\n                                                                numero_pedido : 33872,\n                                                                codigo_producto : '1145C1131279',\n                                                                descripcion_producto : 'OFTAFLOX . UNGUENTO OFTALMICO | TUBO X 5GR. SCANDINAVIA',\n                                                                cantidad_solicitada : 10,\n                                                                cantidad_despachada : 0,\n                                                                cantidad_pendiente : 10,\n                                                                cantidad_facturada : 0,\n                                                                valor_unitario: 8450,\n                                                                porcentaje_iva : 0,\n                                                                valor_unitario_con_iva: 8450,\n                                                                valor_iva: 0\n                                                             }\n                                           ] \n                                       }\n                                    ]\n           }\n   }\n"
        }
      ]
    },
    "error": {
      "examples": [
        {
          "title": "Respuesta-Error:",
          "content": "   HTTP/1.1 404 Not Found\n   {\n     service : '/api/PedidosClientes/listaPedidosOperarioBodega',   \n     msj : 'Mensaje Error',\n     status: 404,\n     obj : {},\n   }\n"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "dusoft/app_modules/PedidosClientes/controllers/PedidosClienteController.js"
  },
  {
    "type": "post",
    "url": "/api/PedidosFarmacias/listaPedidosOperarioBodega",
    "title": "Asignar Responsables",
    "name": "Asignar_Responsables.",
    "group": "Pedidos_Farmacias",
    "description": "Asignar o delegar los pedidos a un operario de bodega para su correspondiente separacion.",
    "permission": {
      "name": "autenticado",
      "title": "Requiere Autenticacion",
      "description": "Requiere que el usuario esté autenticado.\n"
    },
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "field": "usuario_id",
            "optional": false,
            "description": "Identificador del Usuario."
          },
          {
            "group": "Parameter",
            "type": "String",
            "field": "auth_token",
            "optional": false,
            "description": "Token de Autenticación, este define si el usuario esta autenticado o no."
          },
          {
            "group": "Parameter",
            "type": "String[]",
            "field": "pedidos",
            "optional": false,
            "description": "Lista de pedidos"
          },
          {
            "group": "Parameter",
            "type": "Number",
            "field": "estado_pedido",
            "optional": false,
            "description": "ID del estado a asignar"
          },
          {
            "group": "Parameter",
            "type": "Number",
            "field": "responsable",
            "optional": false,
            "description": "Operario de Bodega al que se le asigna el pedido."
          }
        ]
      }
    },
    "success": {
      "examples": [
        {
          "title": "Ejemplo Válido del Request.",
          "content": "   HTTP/1.1 200 OK\n   {  \n        session: {              \n            usuario_id: 'jhon.doe',\n            auth_token: 'asdf2hgt56hjjhgrt-mnjhbgfd-asdfgyh-ghjmnbgfd'\n        },\n        data : {\n            asignacion_pedidos :  { \n                                    pedidos : [],\n                                    estado_pedido: '',\n                                    responsable : ''\n                                }\n        }\n   }\n"
        },
        {
          "title": "Respuesta-Exitosa:",
          "content": "   HTTP/1.1 200 OK\n   {\n     service : '/api/PedidosFarmacias/listaPedidosOperarioBodega',   \n     msj : 'Asignacion de Resposables',\n     status: '200',\n     obj : {\n           }\n   }\n"
        }
      ]
    },
    "error": {
      "examples": [
        {
          "title": "Respuesta-Error:",
          "content": "   HTTP/1.1 404 Not Found\n   {\n     service : '/api/PedidosFarmacias/listaPedidosOperarioBodega',   \n     msj : 'Mensaje Error',\n     status: 404,\n     obj : {},\n   }\n"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "dusoft/app_modules/PedidosFarmacias/controllers/PedidosFarmaciasController.js"
  },
  {
    "type": "post",
    "url": "/api/PedidosFarmacias/obtenerEmpresas",
    "title": "Obtener Empresas",
    "name": "Obtener_Empresas",
    "group": "Pedidos_Farmacias",
    "description": "Listas las empresas a las que el usuario autenticado tiene permiso para ver pedidos de farmacias",
    "permission": {
      "name": "autenticado",
      "title": "Requiere Autenticacion",
      "description": "Requiere que el usuario esté autenticado.\n"
    },
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "field": "usuario_id",
            "optional": false,
            "description": "Identificador del Usuario."
          },
          {
            "group": "Parameter",
            "type": "String",
            "field": "auth_token",
            "optional": false,
            "description": "Token de Autenticación, este define si el usuario esta autenticado o no."
          }
        ]
      }
    },
    "success": {
      "examples": [
        {
          "title": "Ejemplo Válido del Request.",
          "content": "   HTTP/1.1 200 OK\n   {  \n        session: {              \n            usuario_id: 123456,\n            auth_token: 'asdf2hgt56hjjhgrt-mnjhbgfd-asdfgyh-ghjmnbgfd'\n        },\n        data : { }\n   }\n"
        },
        {
          "title": "Respuesta-Exitosa:",
          "content": "   HTTP/1.1 200 OK\n   {\n     service : '/api/PedidosFarmacias/obtenerEmpresas',   \n     msj : 'Lista de Empresas',\n     status: '200',\n     obj : {\n                empresas : [\n                                {\n                                    empresa_id: '03',\n                                    tipo_identificacion: 'NIT',\n                                    identificacion: '830080649',\n                                    razon_social: 'DUANA & CIA LTDA'.\n                                }\n                ]\n           }\n   }\n"
        }
      ]
    },
    "error": {
      "examples": [
        {
          "title": "Respuesta-Error:",
          "content": "   HTTP/1.1 404 Not Found\n   {\n     service : '/api/PedidosFarmacias/obtenerEmpresas',   \n     msj : 'Mensaje Error',\n     status: 404,\n     obj : {},\n   }\n"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "dusoft/app_modules/PedidosFarmacias/controllers/PedidosFarmaciasController.js"
  },
  {
    "type": "post",
    "url": "/api/PedidosFarmacias/listarPedidos",
    "title": "Listar Pedidos",
    "name": "listaPedidos",
    "group": "Pedidos_Farmacias",
    "description": "Proporciona un listado de Pedidos de Farmacia, permitiendo filtrar por los campos,\nnumero de pedido, empresa, bodega, usuario que realizo el pedido.",
    "permission": {
      "name": "autenticado",
      "title": "Requiere Autenticacion",
      "description": "Requiere que el usuario esté autenticado.\n"
    },
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "field": "usuario_id",
            "optional": false,
            "description": "Identificador del Usuario."
          },
          {
            "group": "Parameter",
            "type": "String",
            "field": "auth_token",
            "optional": false,
            "description": "Token de Autenticación, este define si el usuario esta autenticado o no."
          },
          {
            "group": "Parameter",
            "type": "Number",
            "field": "empresa_id",
            "optional": false,
            "description": "ID de la empresa."
          },
          {
            "group": "Parameter",
            "type": "String",
            "field": "termino_busqueda",
            "optional": false,
            "description": "Termino por el cual se desea filtrar los pedidos."
          },
          {
            "group": "Parameter",
            "type": "Number",
            "field": "pagina_actual",
            "optional": false,
            "description": "Pagina Actual, Para la paginación de los datos."
          }
        ]
      }
    },
    "success": {
      "examples": [
        {
          "title": "Ejemplo Válido del Request.",
          "content": "   HTTP/1.1 200 OK\n   {  \n        session: {              \n            usuario_id: 'jhon.doe',\n            auth_token: 'asdf2hgt56hjjhgrt-mnjhbgfd-asdfgyh-ghjmnbgfd'\n        },\n        data : {\n            pedidos_farmacias : { \n                                empresa_id:  '',\n                                termino_busqueda:  '',\n                                pagina_actual:  ''\n                            }\n        }\n   }\n"
        },
        {
          "title": "Respuesta-Exitosa:",
          "content": "   HTTP/1.1 200 OK\n   {\n     service : '/api/PedidosFarmacias/listarPedidos',   \n     msj : 'Lista Pedidos Farmacias',\n     status: '200',\n     obj : {\n                pedidos_farmacias : [ \n                                         {  \n                                            numero_pedido: 65774,\n                                            farmacia_id: 'FD',\n                                            empresa_id: 'FD',\n                                            centro_utilidad: '18',\n                                            bodega_id: '18',\n                                            nombre_farmacia: 'FARMACIAS DUANA',\n                                            nombre_bodega: 'POPAYAN',\n                                            usuario_id: 1350,\n                                            nombre_usuario: 'MAURICIO BARRIOS',\n                                            estado_actual_pedido: '1',\n                                            descripcion_estado_actual_pedido: 'Separado',\n                                            fecha_registro: '2014-05-28T00:00:00.000Z'                                               \n                                         }                                       \n                                    ]\n           }\n   }\n"
        }
      ]
    },
    "error": {
      "examples": [
        {
          "title": "Respuesta-Error:",
          "content": "   HTTP/1.1 404 Not Found\n   {\n     service : '/api/PedidosFarmacias/listarPedidos',   \n     msj : 'Mensaje Error',\n     status: 404,\n     obj : {},\n   }\n"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "dusoft/app_modules/PedidosFarmacias/controllers/PedidosFarmaciasController.js"
  },
  {
    "type": "post",
    "url": "/api/PedidosFarmacias/listaPedidosOperarioBodega",
    "title": "Listar Pedidos Operarios",
    "name": "listaPedidosOperarioBodega",
    "group": "Pedidos_Farmacias",
    "description": "Proporciona una lista con todos los pedidos de farmacias asignados a un operario de bodega",
    "permission": {
      "name": "autenticado",
      "title": "Requiere Autenticacion",
      "description": "Requiere que el usuario esté autenticado.\n"
    },
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "field": "usuario_id",
            "optional": false,
            "description": "Identificador del Usuario."
          },
          {
            "group": "Parameter",
            "type": "String",
            "field": "auth_token",
            "optional": false,
            "description": "Token de Autenticación, este define si el usuario esta autenticado o no."
          },
          {
            "group": "Parameter",
            "type": "Number",
            "field": "operario_id",
            "optional": false,
            "description": "Identificador asignado al operario de Bodega."
          },
          {
            "group": "Parameter",
            "type": "Number",
            "field": "pagina_actual",
            "optional": false,
            "description": "Numero de la pagina que requiere."
          },
          {
            "group": "Parameter",
            "type": "Number",
            "field": "limite",
            "optional": true,
            "description": "Cantidad de registros por cada pagina."
          }
        ]
      }
    },
    "success": {
      "examples": [
        {
          "title": "Ejemplo Válido del Request.",
          "content": "   HTTP/1.1 200 OK\n   {  \n        session: {              \n            usuario_id: 'jhon.doe',\n            auth_token: 'asdf2hgt56hjjhgrt-mnjhbgfd-asdfgyh-ghjmnbgfd'\n        },\n        data : {\n            pedidos_farmacias : { \n                                operario_id:  19,\n                                pagina_actual : 1,\n                                limite : 40\n                            }\n        }\n   }\n"
        },
        {
          "title": "Respuesta-Exitosa:",
          "content": "   HTTP/1.1 200 OK\n   {\n     service : '/api/PedidosFarmacias/listaPedidosOperarioBodega',   \n     msj : 'Lista Pedidos Farmacias',\n     status: '200',\n     obj : {\n                pedidos_farmacias : [ \n                                         {  \n                                            numero_pedido: 65774,\n                                            farmacia_id: 'FD',\n                                            empresa_id: 'FD',\n                                            centro_utilidad: '18',\n                                            bodega_id: '18',\n                                            nombre_farmacia: 'FARMACIAS DUANA',\n                                            nombre_bodega: 'POPAYAN',\n                                            usuario_id: 1350,\n                                            nombre_usuario: 'MAURICIO BARRIOS',\n                                            estado_actual: '1',\n                                            descripcion_estado_actual_pedido: 'Separado',\n                                            fecha_registro: '2014-05-28T00:00:00.000Z',\n                                            responsable_id: 19,\n                                            responsable_pedido: 'Ixon Eduardo Niño',\n                                            fecha_asignacion_pedido: '2014-07-08T14:11:16.901Z' \n                                         }                                       \n                                    ]\n           }\n   }\n"
        }
      ]
    },
    "error": {
      "examples": [
        {
          "title": "Respuesta-Error:",
          "content": "   HTTP/1.1 404 Not Found\n   {\n     service : '/api/PedidosFarmacias/listaPedidosOperarioBodega',   \n     msj : 'Mensaje Error',\n     status: 404,\n     obj : {},\n   }\n"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "dusoft/app_modules/PedidosFarmacias/controllers/PedidosFarmaciasController.js"
  },
  {
    "type": "sql",
    "url": "crear_operarios_bodega",
    "title": "Insertar Operarios Bodega",
    "name": "Insertar_Operarios_Bodega",
    "group": "Terceros_(sql)",
    "description": "Inserta un operario de Bodega.",
    "permission": {
      "name": "autenticado",
      "title": "Requiere Autenticacion",
      "description": "Requiere que el usuario esté autenticado.\n"
    },
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "field": "nombre_operario",
            "optional": false,
            "description": "Nombre del Operario"
          },
          {
            "group": "Parameter",
            "type": "String",
            "field": "usuario_id",
            "optional": false,
            "description": "Identifiador del usuario que registra la actualización."
          },
          {
            "group": "Parameter",
            "type": "String",
            "field": "estado",
            "optional": false,
            "description": "Estado del registro '1' = activos, '0' = Inactivos"
          },
          {
            "group": "Parameter",
            "type": "Function",
            "field": "callback",
            "optional": false,
            "description": "Funcion de retorno de informacion."
          }
        ]
      }
    },
    "success": {
      "examples": [
        {
          "title": "Este SQL se usa en:",
          "content": "   Modulo : \n   Accion :\n"
        },
        {
          "title": "SQL.",
          "content": "    INSERT INTO operarios_bodega (nombre, usuario_id, estado) VALUES ( $1, $2, $3 );\n"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "dusoft/app_modules/Terceros/models/TercerosModel.js"
  },
  {
    "type": "sql",
    "url": "listar_operarios_bodega",
    "title": "Listar Operarios Bodega",
    "name": "Listar_Operarios_Bodega",
    "group": "Terceros_(sql)",
    "description": "Selecciona todos los operarios de bodega.",
    "permission": {
      "name": "autenticado",
      "title": "Requiere Autenticacion",
      "description": "Requiere que el usuario esté autenticado.\n"
    },
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "field": "termino_busqueda",
            "optional": false,
            "description": "Filtra los operarios de bodega por el campo Nombre."
          },
          {
            "group": "Parameter",
            "type": "String",
            "field": "estado_registro",
            "optional": false,
            "description": "Estado del registro ejemplo: '' = Todos los operarios, '1' = Operarios activos, '0' = Operarios Inactivos"
          },
          {
            "group": "Parameter",
            "type": "Function",
            "field": "callback",
            "optional": false,
            "description": "Funcion de retorno de informacion."
          }
        ]
      }
    },
    "success": {
      "examples": [
        {
          "title": "Este SQL se usa en:",
          "content": "   Modulo : \n   Accion :\n"
        },
        {
          "title": "SQL.",
          "content": "    select \n       a.operario_id, \n       a.nombre as nombre_operario, \n       a.usuario_id, \n       b.usuario as descripcion_usuario, \n       a.estado, \n       case when a.estado='1' then 'Activo' else 'Inactivo' end as descripcion_estado \n       from operarios_bodega a \n       left join system_usuarios b on a.usuario_id = b.usuario_id \n       where a.nombre ilike $1 and a.estado = $2 order by 2\n"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "dusoft/app_modules/Terceros/models/TercerosModel.js"
  },
  {
    "type": "sql",
    "url": "modificar_operarios_bodega",
    "title": "Modificar Operarios Bodega",
    "name": "Modificar_Operarios_Bodega",
    "group": "Terceros_(sql)",
    "description": "Actualiza los datos de un operario de bodega.",
    "permission": {
      "name": "autenticado",
      "title": "Requiere Autenticacion",
      "description": "Requiere que el usuario esté autenticado.\n"
    },
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "Number",
            "field": "operario_id",
            "optional": false,
            "description": "Identificador o Primary Key del Operario de bodega."
          },
          {
            "group": "Parameter",
            "type": "String",
            "field": "nombre_operario",
            "optional": false,
            "description": "Nombre del Operario"
          },
          {
            "group": "Parameter",
            "type": "String",
            "field": "usuario_id",
            "optional": false,
            "description": "Identifiador del usuario que registra la actualización."
          },
          {
            "group": "Parameter",
            "type": "String",
            "field": "estado",
            "optional": false,
            "description": "Estado del registro '1' = activos, '0' = Inactivos"
          },
          {
            "group": "Parameter",
            "type": "Function",
            "field": "callback",
            "optional": false,
            "description": "Funcion de retorno de informacion."
          }
        ]
      }
    },
    "success": {
      "examples": [
        {
          "title": "Este SQL se usa en:",
          "content": "   Modulo : \n   Accion :\n"
        },
        {
          "title": "SQL.",
          "content": "    UPDATE operarios_bodega SET nombre= $2, usuario_id=$3, estado=$4 WHERE operario_id = $1 ;\n"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "dusoft/app_modules/Terceros/models/TercerosModel.js"
  },
  {
    "type": "sql",
    "url": "seleccionar_operario_bodega",
    "title": "Seleccionar Operarios Bodega",
    "name": "Seleccionar_Operarios_Bodega",
    "group": "Terceros_(sql)",
    "description": "Selecciona los operarios de bodega (tabla operarios_bodega) filtrados por el id",
    "permission": {
      "name": "autenticado",
      "title": "Requiere Autenticacion",
      "description": "Requiere que el usuario esté autenticado.\n"
    },
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "Number",
            "field": "operario_id",
            "optional": false,
            "description": "Operario de Bodega al que se le asigna el pedido."
          },
          {
            "group": "Parameter",
            "type": "Function",
            "field": "callback",
            "optional": false,
            "description": "Funcion de retorno de informacion."
          }
        ]
      }
    },
    "success": {
      "examples": [
        {
          "title": "Este SQL se usa en:",
          "content": "   Modulo : PedidosClientes\n   Accion : Evento - onNotificacionOperarioPedidosAsignados();\n"
        },
        {
          "title": "SQL.",
          "content": "   select \n   operario_id, \n   nombre as nombre_operario, \n   usuario_id, \n   estado \n   from operarios_bodega where operario_id = $1\n"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "dusoft/app_modules/Terceros/models/TercerosModel.js"
  }
] });