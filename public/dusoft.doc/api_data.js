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
    "group": "Pedidos_Clientes",
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
    "group": "Pedidos_Clientes",
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
    "url": "onNotificacionOperarioPedidosAsignados",
    "title": "Notificación Pedidos Asignados",
    "name": "Notificación_Pedidos_Asignados",
    "group": "Pedidos_Clientes_Eventos",
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
          "content": "   HTTP/1.1 200 OK\n   {\n      pedidos_clientes : [ \n                            {\n                            } \n                          ] \n   }\n"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "dusoft/app_modules/PedidosClientes/events/PedidosClientesEvents.js"
  },
  {
    "type": "post",
    "url": "/api/PedidosClientes/listaPedidosOperarioBodega",
    "title": "Listar Pedidos Operarios",
    "name": "listaPedidosOperarioBodega",
    "group": "Pedidos_Clientes",
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
          }
        ]
      }
    },
    "success": {
      "examples": [
        {
          "title": "Ejemplo Válido del Request.",
          "content": "   HTTP/1.1 200 OK\n   {  \n        session: {              \n            usuario_id: 'jhon.doe',\n            auth_token: 'asdf2hgt56hjjhgrt-mnjhbgfd-asdfgyh-ghjmnbgfd'\n        },\n        data : {\n            pedidos_clientes : { \n                                operario_id:  19\n                            }\n        }\n   }\n"
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
          }
        ]
      }
    },
    "success": {
      "examples": [
        {
          "title": "Ejemplo Válido del Request.",
          "content": "   HTTP/1.1 200 OK\n   {  \n        session: {              \n            usuario_id: 'jhon.doe',\n            auth_token: 'asdf2hgt56hjjhgrt-mnjhbgfd-asdfgyh-ghjmnbgfd'\n        },\n        data : {\n            pedidos_farmacias : { \n                                operario_id:  19\n                            }\n        }\n   }\n"
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