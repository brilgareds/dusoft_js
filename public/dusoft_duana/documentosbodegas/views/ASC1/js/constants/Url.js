define(["angular"], function (angular) {
    var Url = angular.module('Url', []);
    var BASE_URL = "/api";
    var data = {
        'API': {
            'BASE_URL': BASE_URL,
            'RADICACION': {
                'LISTAR_CONCEPTO': BASE_URL + "/Radicacion/listarConcepto",

                'LISTAR_FACTURA': BASE_URL + "/Radicacion/listarFactura",

                'GUARDAR_CONCEPTO': BASE_URL + "/Radicacion/guardarConcepto",

                'GUARDAR_FACTURA': BASE_URL + "/Radicacion/guardarFactura",
                
                'MODIFICAR_FACTURA': BASE_URL + "/Radicacion/modificarFactura",
                
                'SUBIR_ARCHIVO': BASE_URL + "/Radicacion/subirArchivo",
                
                'SUBIR_ARCHIVO_FACTURA': BASE_URL + "/Radicacion/subirArchivoFactura",
                
                'AGRUPAR_FACTURA': BASE_URL + "/Radicacion/agruparFactura",         
                
                'LISTAR_AGRUPAR': BASE_URL + "/Precios_productos/listarAgrupar",
                
                'MODIFICAR_ENTREGADO': BASE_URL + "/Radicacion/modificarEntregado",
                
                'ELIMINAR_GRUPO_FACTURA':BASE_URL + "/Radicacion/eliminarGrupoFactura",
                
                'LISTAR_FACTURA_ENTREGADO' :BASE_URL + "/Radicacion/listarFacturaEntregado",
                
                'AGREGAR_FACTURA_ENTREGADO' :BASE_URL + "/Radicacion/agregarFacturaEntregado",
                
                'PLANILLA_RADICACION' :BASE_URL + "/Radicacion/planillaRadicacion",
                
                'MODIFICAR_NOMBRE_ARCHIVO' :BASE_URL + "/Radicacion/modificarNombreArchivo"               
                
               
            },  
            'PARAMETRIZACION': {
                'LISTAR_MUNICIPIO': BASE_URL + "/Ciudades/listar"
            }
        }
    };

    angular.forEach(data, function (key, value) {
        Url.constant(value, key);
    });

    return Url;
});



UsernameAdmin_User = 'Admin_User';
Password = 'Admin_Passw';

acuerdoFisicoFacturacionElectronica = true;
adjuntarPdfNotificaciones = false;
adjuntarXmlNotificaciones = false;
cantidadDiasAceptacionAutomatica = 3;
codigoCiudad = 91001;
codigoDepartamento = 91;
codigoPais = 'CO';
direccion = 0;
emailPrincipal = 'julieta@gmail.com';
enviarCorreoCertificado = true;
enviarCorreoDeBienvenida = true;
enviarFisico = false;
enviarNotificaciones = false;
enviarPlataformaFacturacion = false;
formatoFactura = 'PDF';
naturaleza = 'NATURAL';
telefono = 3147913;

codigoDian = 13;
numeroIdentificacion = 41906804;

apellidos = 'GUERRERO RAMIREZ';
nombre = 'JULIETA LILI';
tiposRepresentacion = 'R-99-PJ';

generarContrasena = true;
nombreUsuario = 41906804;



