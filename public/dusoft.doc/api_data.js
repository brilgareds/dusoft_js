define({ api: [
  {
    "type": "post",
    "url": "/api/PedidosClientes/listaPedidosOperarioBodega",
    "title": "Pedidos Clientes Asignados a Operario de Bodega",
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
          }
        ]
      }
    },
    "success": {
      "examples": [
        {
          "title": "Ejemplo Válido del Request.",
          "content": "   HTTP/1.1 200 OK\n   {  \n        session: {              \n            usuario_id: 'jhon.doe',\n            auth_token: 'asdf2hgt56hjjhgrt-mnjhbgfd-asdfgyh-ghjmnbgfd'\n        },\n        data : {\n            lista_pedidos : { \n                                operario_id:  19\n                            }\n        }\n   }\n"
        },
        {
          "title": "Respuesta-Exitosa:",
          "content": "   HTTP/1.1 200 OK\n   {\n     service : '/api/PedidosClientes/listaPedidosOperarioBodega',   \n     msj : 'Listado Pedidos Clientes',\n     status: '200',\n     obj : {\n                pedidos_clientes : [ \n                                      {   \n                                           numero_pedido: 33872,\n                                           tipo_id_cliente: 'CE',\n                                           identificacion_cliente: '10365',\n                                           nombre_cliente: 'CLINICA SANTA GRACIA DUMIAN MEDICAL\n                                           direccion_cliente: 'CALLE 14 15-49',\n                                           telefono_cliente: '8236444',\n                                           tipo_id_vendedor: 'CC ',\n                                           idetificacion_vendedor: '94518917',\n                                           nombre_vendedor: 'GUSTAVO ADOLFO MEJIA',\n                                           estado: '1',\n                                           descripcion_estado: 'Activo',\n                                           estado_actual_pedido: '1',\n                                           descripcion_estado_actual_pedido: 'Separado',\n                                           fecha_registro: '2014-01-21T17:28:50.700Z',\n                                           responsable_id: 19,\n                                           responsable_pedido: 'Ixon Eduardo Niño',\n                                           fecha_asignacion_pedido: '2014-03-04T17:44:30.911Z' \n                                       }\n                                    ]\n           }\n   }\n"
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
    "title": "Pedidos Farmacias Asignados a Operario de Bodega",
    "name": "listaPedidosOperarioBodega",
    "group": "PedidosFarmacias",
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
          "content": "   HTTP/1.1 200 OK\n   {  \n        session: {              \n            usuario_id: 'jhon.doe',\n            auth_token: 'asdf2hgt56hjjhgrt-mnjhbgfd-asdfgyh-ghjmnbgfd'\n        },\n        data : {\n            lista_pedidos : { \n                                operario_id:  19\n                            }\n        }\n   }\n"
        },
        {
          "title": "Respuesta-Exitosa:",
          "content": "   HTTP/1.1 200 OK\n   {\n     service : '/api/PedidosFarmacias/listaPedidosOperarioBodega',   \n     msj : 'Listado Pedidos Farmacias',\n     status: '200',\n     obj : {\n                pedidos_farmacias : [ \n                                         {  \n                                            numero_pedido: 65774,\n                                            farmacia_id: 'FD',\n                                            empresa_id: 'FD',\n                                            centro_utilidad: '18',\n                                            bodega_id: '18',\n                                            nombre_farmacia: 'FARMACIAS DUANA',\n                                            nombre_bodega: 'POPAYAN',\n                                            usuario_id: 1350,\n                                            nombre_usuario: 'MAURICIO BARRIOS',\n                                            estado_actual: '1',\n                                            descripcion_estado_actual_pedido: 'Separado',\n                                            fecha_registro: '2014-05-28T00:00:00.000Z',\n                                            responsable_id: 19,\n                                            responsable_pedido: 'Ixon Eduardo Niño',\n                                            fecha_asignacion_pedido: '2014-07-08T14:11:16.901Z' \n                                         }                                       \n                                    ]\n           }\n   }\n"
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