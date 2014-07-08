define({ api: [
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
          "content": "   HTTP/1.1 200 OK\n   {\n     service : '/api/PedidosClientes/listaPedidosOperarioBodega',   \n     msj : 'Lista Pedidos Clientes',\n     status: '200',\n     obj : {\n                pedidos_clientes : [ \n                                      {   \n                                           numero_pedido: 33872,\n                                           tipo_id_cliente: 'CE',\n                                           identificacion_cliente: '10365',\n                                           nombre_cliente: 'CLINICA SANTA GRACIA DUMIAN MEDICAL\n                                           direccion_cliente: 'CALLE 14 15-49',\n                                           telefono_cliente: '8236444',\n                                           tipo_id_vendedor: 'CC ',\n                                           idetificacion_vendedor: '94518917',\n                                           nombre_vendedor: 'GUSTAVO ADOLFO MEJIA',\n                                           estado: '1',\n                                           descripcion_estado: 'Activo',\n                                           estado_actual_pedido: '1',\n                                           descripcion_estado_actual_pedido: 'Separado',\n                                           fecha_registro: '2014-01-21T17:28:50.700Z',\n                                           responsable_id: 19,\n                                           responsable_pedido: 'Ixon Eduardo Niño',\n                                           fecha_asignacion_pedido: '2014-03-04T17:44:30.911Z' \n                                       }\n                                    ]\n           }\n   }\n"
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
  }
] });