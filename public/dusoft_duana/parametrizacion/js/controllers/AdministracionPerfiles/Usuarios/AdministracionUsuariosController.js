
define(["angular", "js/controllers", "js/models", "includes/classes/CentroUtilidad", "includes/classes/Bodega"], function(angular, controllers) {

    controllers.controller('AdministracionUsuariosController', [
        '$scope', '$rootScope', 'Request', '$modal', 'API',
        "socket", "$timeout", "$state", "AlertService",
        "Usuario", "$filter",
        "localStorageService", "STATIC", "EmpresaParametrizacion", "Rol", "Empresa_Modulo",
        "Modulo", "RolModulo", "ParametrizacionService", "CentroUtilidad", "Bodega",
        function($scope, $rootScope, Request, $modal,
                API, socket, $timeout, $state,
                AlertService, Usuario, $filter,
                localStorageService, STATIC, EmpresaParametrizacion, Rol, Empresa_Modulo,
                Modulo, RolModulo, ParametrizacionService, CentroUtilidad, Bodega) {

            var self = this;
            $scope.estadoBodegas = false;
            $scope.rootUsuario = {
            };

            $scope.rootModulos = {
            };

            $scope.rootUsuario.empresas = [];

            $scope.rootUsuario.termino_busqueda = "";
            $scope.rootUsuario.termino_busqueda_centro = "";
            $scope.rootUsuario.paginaactual = 1;
            $scope.rootUsuario.paginaActualCentros = 1;

            $scope.rootUsuario.session = {
                usuario_id: Usuario.getUsuarioActual().getId(),
                auth_token: Usuario.getUsuarioActual().getToken()
            };

            $scope.rootModulos.session = $scope.rootUsuario.session;

            $scope.rootUsuario.avatar = "";
            $scope.rootUsuario.avatar_empty = STATIC.BASE_IMG + "/avatar_empty.png";


            $scope.opciones_archivo = new Flow();
            $scope.opciones_archivo.target = API.USUARIOS.SUBIR_AVATAR_USUARIO;
            $scope.opciones_archivo.testChunks = false;
            $scope.opciones_archivo.singleFile = true;
            $scope.opciones_archivo.query = {
                session: JSON.stringify($scope.rootUsuario.session)
            };

            $scope.abrir = false;
            var fechaActual = new Date();


            $scope.listado_roles = {
                data: 'rootUsuario.empresaSeleccionada.getRoles()',
                enableColumnResize: true,
                enableRowSelection: false,
                columnDefs: [
                    {field: 'opciones', displayName: "", cellClass: "txt-center", width: "10%",
                        cellTemplate: '<div ng-if="row.entity.estado" style="color:#5cb85c;"><i class="glyphicon glyphicon-ok icon-success"></i></div>'},
                    {field: 'nombre', displayName: 'Rol'},
                    {field: 'observacion', displayName: 'Observacion'},
                    {field: 'opciones', displayName: "", cellClass: "txt-center dropdown-button", width: "18%",
                        cellTemplate: '<div class="btn-group">\
                                            <button class="btn btn-default btn-xs dropdown-toggle" data-toggle="dropdown">Acción <span class="caret"></span></button>\
                                            <ul class="dropdown-menu dropdown-options">\
                                                <li><a href="javascript:void(0);" ng-click="seleccionRol(row.entity);" >Seleccionar Rol</a></li>\
                                            </ul>\
                                        </div>'
                    }
                ]

            };


            $scope.listado_centros_utilidad = {
                data: 'rootUsuario.empresaSeleccionada.getCentrosUtilidad()',
               // enableColumnResize: true,
                enableRowSelection: false,
                showFilter: true,
                columnDefs: [
                    {field: 'opciones', displayName: "", cellClass: "txt-center", width: "10%",
                        cellTemplate: '<div ng-if="row.entity.estado" style="color:#5cb85c;"><i class="glyphicon glyphicon-ok icon-success"></i></div>'},
                    //{field: 'empresaId', displayName : 'Empresa', width:60},
                    {field: 'nombre', displayName: 'Nombre', cellTemplate: '<div style="font-size:13px" class="ngCellText">{{row.entity.codigo}} - {{row.entity.nombre}}</div>'},
                    {field: 'opciones', displayName: "", cellClass: "txt-center dropdown-button", width: "18%",
                        cellTemplate: '<div class="btn-group">\
                                            <button class="btn btn-default btn-xs dropdown-toggle" data-toggle="dropdown">Acción <span class="caret"></span></button>\
                                            <ul class="dropdown-menu dropdown-options">\
                                                <li><a href="javascript:void(0);" ng-click="seleccionarCentroUtilidad(row.entity);" >Listar Bodegas</a></li>\
                                                <li ng-if="row.entity.estado"><a href="javascript:void(0);" ng-click="removerCentroUtilidad(row.entity);" >Remover</a></li>\
                                            </ul>\
                                        </div>'
                    }
                ]
            };

            $scope.listado_bodegas = {
                data: 'rootUsuario.empresaSeleccionada.getCentroUtilidadSeleccionado().getBodegas()',
                enableColumnResize: true,
                enableRowSelection: false,
                showFilter: true,
                columnDefs: [
                    {field: 'opciones', displayName: "", cellClass: "txt-center", width: "10%",
                     headerCellTemplate: "<div class=\"ngHeaderSortColumn {{col.headerClass}}\" ng-style=\"{'cursor': col.cursor}\" ng-class=\"{ 'ngSorted': !noSortVisible }\"> \
                                            <div ng-click=\"col.sort($event)\" ng-class=\"'colt' + col.index\" class=\"ngHeaderText text-center\"> \
                                                {{col.displayName}} \
                                                <input type='checkbox' ng-model='estadoBodegas' ng-disabled='!rootUsuario.empresaSeleccionada.getCentroUtilidadSeleccionado().getBodegas() > 0' ng-change='onSeleccionMultipleBodegas(estadoBodegas)' > \
                                            </div> \
                                        </div>",
                        cellTemplate: '<div ng-if="row.entity.estado" style="color:#5cb85c;"><i class="glyphicon glyphicon-ok icon-success"></i></div>'},
                    {field: 'nombre', displayName: 'Observacion', cellTemplate: '<div style="font-size:13px" class="ngCellText">{{row.entity.codigo}} - {{row.entity.nombre}}</div>'},
                    {field: 'opciones', displayName: "", cellClass: "txt-center dropdown-button", width: "18%",
                        cellTemplate: '<div class="btn-group">\
                                            <button class="btn btn-default btn-xs dropdown-toggle" data-toggle="dropdown">Acción <span class="caret"></span></button>\
                                            <ul class="dropdown-menu dropdown-options">\
                                                <li ng-if="!row.entity.estado"><a href="javascript:void(0);" ng-click="onSeleccionarBodega(row.entity);" >Seleccionar</a></li>\
                                                <li ng-if="row.entity.estado"><a href="javascript:void(0);" ng-click="removerBodega(row.entity);" >Remover</a></li>\
                                            </ul>\
                                        </div>'
                    }
                ]
            };
            
            $scope.onSeleccionMultipleBodegas = function(estado){
                var bodegas = $scope.rootUsuario.empresaSeleccionada.getCentroUtilidadSeleccionado().getBodegas();
                
                if(bodegas.length === 0){
                    return;
                }
                
                var _bodegas = [];
                
                for(var i in bodegas){
                    _bodegas.push(bodegas[i].getCodigo());
                    bodegas[i].setEstado(estado);
                }
                
                
                self.seleccionarBodega(_bodegas, estado, function(bodegas) {
                });
                
                
            };

            self.inicializarUsuarioACrear = function() {
                $scope.rootUsuario.usuarioAGuardar = Usuario.get();
                $scope.rootModulos.moduloAGuardar = Modulo.get();
                $scope.rootUsuario.rolAGuardar = Rol.get();
            };

            self.esEmailValido = function(email) {
                var re = /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i;
                return re.test(email);
            };

            self.__validarCreacionUsuario = function() {
                var validacion = {
                    valido: true,
                    msj: ""
                };

                var usuario = $scope.rootUsuario.usuarioAGuardar;


                if (usuario.getNombre() === undefined || usuario.getNombre().length === 0) {
                    validacion.valido = false;
                    validacion.msj = "El usuario debe tener un nombre";
                    return validacion;
                }

                if (usuario.getNombreUsuario() === undefined || usuario.getNombreUsuario().length === 0) {
                    validacion.valido = false;
                    validacion.msj = "Debe tener un nombre de usuario";
                    return validacion;
                }

                if (usuario.getClave() && usuario.getClave().length > 0 || usuario.getId() === "") {

                    if (usuario.getClave().length < 5) {
                        validacion.valido = false;
                        validacion.msj = "El usuario debe tener una clave valida de 6 caracteres";
                        return validacion;
                    }

                    if (usuario.getClave() !== $scope.rootUsuario.confirmacionClave) {
                        validacion.valido = false;
                        validacion.msj = "Debe confirmar la clave";
                        return validacion;
                    }
                }



                if (usuario.getEmail() === undefined && usuario.getEmail().length === 0) {
                    validacion.valido = false;
                    validacion.msj = "El usuario debe tener un email";
                    return validacion;

                } else if (usuario.getEmail() !== $scope.rootUsuario.confirmacionEmail) {
                    validacion.valido = false;
                    validacion.msj = "Debe confirmar el email";
                    return validacion;
                }

                if (!self.esEmailValido(usuario.getEmail())) {
                    validacion.valido = false;
                    validacion.msj = "El email no es valido";
                    return validacion;
                }

                return validacion;

            };

            self.traerUsuarioPorId = function(usuario_id, callback) {

                var obj = {
                    session: $scope.rootUsuario.session,
                    data: {
                        parametrizacion_usuarios: {
                            usuario_id: usuario_id
                        }
                    }
                };

                Request.realizarRequest(API.USUARIOS.OBTENER_USUARIO_POR_ID, "POST", obj, function(data) {
                    //  console.log("informacion del usuario ",data);
                    if (data.status === 200) {
                        var _usuario = data.obj.parametrizacion_usuarios.usuario;

                        if (_usuario) {
                            $scope.rootUsuario.usuarioAGuardar = Usuario.get(_usuario.usuario_id, _usuario.usuario, _usuario.nombre);
                            $scope.rootUsuario.usuarioAGuardar.setFechaCaducidad(_usuario.fecha_caducidad_contrasena);
                            $scope.rootUsuario.usuarioAGuardar.setEmail(_usuario.email);
                            $scope.rootUsuario.confirmacionEmail = _usuario.email;
                            $scope.rootUsuario.usuarioAGuardar.setDescripcion(_usuario.descripcion);
                            $scope.rootUsuario.usuarioAGuardar.setRutaAvatar(_usuario.ruta_avatar);

                            if (_usuario.ruta_avatar) {

                                $scope.rootUsuario.avatar = STATIC.RUTA_AVATAR + _usuario.usuario_id + "/" + _usuario.ruta_avatar || "";
                            }
                        }

                        //empresa predeterminada
                        if (_usuario.empresa_id) {

                            //selecciona la empresa del dropdown
                            var empresas = $scope.rootUsuario.empresas;
                            for (var i in empresas) {
                                if (empresas[i].getCodigo() === _usuario.empresa_id) {
                                    $scope.rootUsuario.empresaSeleccionada = empresas[i];
                                    $scope.rootUsuario.empresaSeleccionada.setLoginEmpresaId(_usuario.login_empresas_id);
                                    $scope.rootUsuario.empresaSeleccionada.setPredeterminado(true);
                                    break;
                                }
                            }

                            var rol = Rol.get(
                                    _usuario.id_rol,
                                    _usuario.nombre_rol,
                                    _usuario.observacion_rol,
                                    $scope.rootUsuario.empresaSeleccionada.getCodigo()
                                    );

                            $scope.rootUsuario.rolAGuardar = rol;


                            self.traerModulosPorUsuario(function() {
                                self.traerModulos(function() {
                                    self.traerRoles();
                                });
                            });
                        }

                        callback();

                    } else {
                        AlertService.mostrarMensaje("warning", data.msj);
                    }

                });
            };


            self.traerEmpresas = function(callback) {
                var obj = {
                    session: $scope.rootUsuario.session,
                    data: {
                    }
                };

                Request.realizarRequest(API.MODULOS.LISTAR_EMPRESAS, "POST", obj, function(data) {
                    if (data.status === 200) {
                        $scope.rootUsuario.empresas = [];
                        var datos = data.obj.empresas;

                        for (var i in datos) {

                            var empresa = EmpresaParametrizacion.get(
                                    datos[i].razon_social,
                                    datos[i].empresa_id
                                    );

                            $scope.rootUsuario.empresas.push(empresa);

                            //se verifica cual es la empresa a la que pertenece el rol
                            /*if ($scope.rootUsuario.empresaSeleccionada.getCodigo() > 0) {
                             if ($scope.rootUsuario.empresaSeleccionada.getCodigo() === empresa.getCodigo()) {
                             $scope.rootUsuario.empresaSeleccionada = empresa;
                             }
                             }*/

                        }

                        callback();

                    }

                });
            };

            self.traerCentrosUtilidadUsuario = function(callback) {
                
                var obj = {
                    session: $scope.rootUsuario.session,
                    data: {
                        parametrizacion_usuarios: {
                            empresa_id: $scope.rootUsuario.empresaSeleccionada.getCodigo(),
                            usuario_id: $scope.rootUsuario.usuarioAGuardar.getId(),
                            pagina: $scope.rootUsuario.paginaActualCentros,
                            termino: $scope.rootUsuario.termino_busqueda_centro
                        }
                    }
                };

                Request.realizarRequest(API.USUARIOS.OBTENER_CENTROS_UTILIDAD_USUARIO, "POST", obj, function(data) {
                    if (data.status === 200) {
                        var datos = data.obj.parametrizacion_usuarios.centros_utilidad;
                        
                        $scope.rootUsuario.empresaSeleccionada.vaciarCentrosUtilidad();
                        self.agregarCentroUtilidad(datos, true);

                        callback();

                    }

                });
            };

            self.agregarCentroUtilidad = function(centrosUtilidad, seleccionado) {
                for (var i in centrosUtilidad) {
                    var _centroUtilidad = centrosUtilidad[i];

                    var centroUtilidad = CentroUtilidad.get(_centroUtilidad.descripcion, _centroUtilidad.centro_utilidad_id);
                    centroUtilidad.setEstado(Boolean(Number(_centroUtilidad.seleccionado_usuario)));
                    centroUtilidad.setEmpresaId(_centroUtilidad.empresa_id);

                    $scope.rootUsuario.empresaSeleccionada.agregarCentroUtilidad(centroUtilidad);
                }
            };


            self.traerBodegasUsuario = function(callback) {
                
                var obj = {
                    session: $scope.rootUsuario.session,
                    data: {
                        parametrizacion_usuarios: {
                            empresa_id: $scope.rootUsuario.empresaSeleccionada.getCentroUtilidadSeleccionado().getEmpresaId(),
                            centro_utilidad_id: $scope.rootUsuario.empresaSeleccionada.getCentroUtilidadSeleccionado().getCodigo(),
                            usuario_id: $scope.rootUsuario.usuarioAGuardar.getId()
                        }
                    }
                };

                Request.realizarRequest(API.USUARIOS.OBTENER_BODEGAS_USUARIO, "POST", obj, function(data) {
                    if (data.status === 200) {
                        var datos = data.obj.parametrizacion_usuarios.bodegas;

                        self.agregarBodegas(datos, true);
                        callback();

                    }

                });
            };


            self.agregarBodegas = function(bodegas, estado) {
                var centroUtilidad = $scope.rootUsuario.empresaSeleccionada.getCentroUtilidadSeleccionado();
                for (var i in bodegas) {
                    var _bodega = bodegas[i];

                    var bodega = Bodega.get(_bodega.descripcion, _bodega.bodega_id);
                    bodega.setEstado(Boolean(Number(_bodega.seleccionado_usuario)));

                    centroUtilidad.agregarBodega(bodega);

                }
            };


            self.deshabilitarBodegasUsuario = function(callback) {

                var obj = {
                    session: $scope.rootUsuario.session,
                    data: {
                        parametrizacion_usuarios: {
                            empresa_id: $scope.rootUsuario.empresaSeleccionada.getCodigo(),
                            centro_utilidad_id: $scope.rootUsuario.empresaSeleccionada.getCentroUtilidadSeleccionado().getCodigo(),
                            login_empresa_id: $scope.rootUsuario.empresaSeleccionada.getLoginEmpresaId()

                        }
                    }
                };

                Request.realizarRequest(API.USUARIOS.DESHABILITAR_BODEGAS, "POST", obj, function(data) {
                    if (data.status === 200) {
                        $scope.rootUsuario.empresaSeleccionada.getCentroUtilidadSeleccionado().vaciarBodegas();
                        $scope.rootUsuario.empresaSeleccionada.getCentroUtilidadSeleccionado().setEstado(false);
                        AlertService.mostrarMensaje("success", "El centro de utilidad y sus bodegas se removieron del usuario correctamente");
                    } else {
                        AlertService.mostrarMensaje("warning", "Se genero un error...");
                    }

                });
            };

            self.traerRoles = function(callback) {

                var parametros = {
                    session: $scope.rootUsuario.session,
                    data: {
                        parametrizacion_perfiles: {
                            empresa_id: $scope.rootUsuario.empresaSeleccionada.getCodigo(),
                            termino: $scope.rootUsuario.termino_busqueda,
                            pagina_actual: $scope.rootUsuario.paginaactual
                        }
                    }
                };

                ParametrizacionService.traerRoles(parametros, $scope.rootUsuario.empresaSeleccionada, true, function(success, msg) {
                    if (!success) {
                        AlertService.mostrarMensaje("warning", msg);

                    }
                    self.onMarcarRolUsuarioPorEmpresa();
                    if (callback) {
                        callback();
                    }
                });

            };


            //marca el rol seleccionado por empresa
            self.onMarcarRolUsuarioPorEmpresa = function() {
                var roles = $scope.rootUsuario.empresaSeleccionada.getRoles();
                if ($scope.rootUsuario.rolAGuardar) {
                    for (var i in roles) {
                        if (roles[i].getId() === $scope.rootUsuario.rolAGuardar.getId()) {
                            roles[i].setEstado(true);
                            //$scope.rootUsuario.rolAGuardar = roles[i];
                            $scope.rootUsuario.rolAGuardar.setEstado(true);
                            break;
                        }
                    }
                }
            };

            //trae todos los modulos que estan disponibles para la empresa seleccionada
            self.traerModulos = function(callback) {
                $scope.$broadcast("deshabilitarNodos");
                $scope.rootUsuario.empresaSeleccionada.vaciarListaEmpresas();

                var parametros = {
                    session: $scope.rootUsuario.session,
                    data: {
                        parametrizacion_roles: {
                            empresa_id: $scope.rootUsuario.empresaSeleccionada.getCodigo()
                        }
                    }
                };

                ParametrizacionService.traerModulos(parametros, $scope.rootUsuario.empresaSeleccionada, self.esModuloSeleccionado, function() {
                    // console.log("modulos del rol ",$scope.rootUsuario.rolAGuardar.getModulos() 
                    callback();
                });

            };

            //trae los modulos guardados para el usuario
            self.traerModulosPorUsuario = function(callback) {
                $scope.rootUsuario.rolAGuardar.vaciarModulos();


                var parametros = {
                    session: $scope.rootUsuario.session,
                    data: {
                        parametrizacion_usuarios: {
                            rol_id: $scope.rootUsuario.rolAGuardar.getId(),
                            empresa_id: $scope.rootUsuario.empresaSeleccionada.getCodigo(),
                            usuario_id: $scope.rootUsuario.usuarioAGuardar.getId()
                        }
                    }
                };

                ParametrizacionService.traerModulosPorUsuario(parametros, $scope.rootUsuario.rolAGuardar, function(success) {
                    if (success) {
                        /*var modulos = $scope.rootUsuario.rolAGuardar.getModulos();
                         for(var i in modulos){
                         console.log("id modulo ", modulos[i].getModulo().getId(), modulos[i].getModulo().getEstado())
                         }*/
                        callback();
                    }
                });

            };

            //se busca en el rol los modulo que le pertenecen
            self.esModuloSeleccionado = function(modulo) {
                var modulos = $scope.rootUsuario.rolAGuardar.getModulos();
                //console.log("modulos del rol ",modulos);
                for (var i in modulos) {
                    if (modulos[i].getModulo().getId() === modulo.getId() && modulos[i].getModulo().getEstado()) {
                        return modulos[i];
                    }
                }
                return null;
            };


            self.asignarRolUsuario = function(callback) {

                var obj = {
                    session: $scope.rootUsuario.session,
                    data: {
                        parametrizacion_usuarios: {
                            usuario_id: $scope.rootUsuario.usuarioAGuardar.getId(),
                            rol_id: $scope.rootUsuario.rolAGuardar.getId(),
                            empresa_id: $scope.rootUsuario.empresaSeleccionada.getCodigo()
                        }
                    }
                };

                Request.realizarRequest(API.USUARIOS.ASIGNAR_ROL_USUARIO, "POST", obj, function(data) {
                    if (data.status === 200) {
                        console.log("rol asignado ", data);
                        var login_empresa_id = data.obj.parametrizacion_usuarios.login_empresa_id;
                        $scope.rootUsuario.empresaSeleccionada.setLoginEmpresaId(login_empresa_id);
                        callback();
                    } else {
                        AlertService.mostrarMensaje("warning", "Se genero un error guardando el rol para el usuario");
                    }

                });
            };


            //agrega modulo al rol actual buscandolo en los modulos seleccionados para la empresa por el id, se retorna el modulo que se guardo
            self.agregarModulo = function(modulo_id, estado) {

                return ParametrizacionService.agregarModulo($scope.rootUsuario.rolAGuardar, $scope.rootUsuario.empresaSeleccionada, modulo_id, estado);

            };


            //basado en los modulos seleccionados, se envian para ser habilitardos para el usuario
            self.habilitarModulosRol = function(nodo, callback) {

                var obj = {
                    session: $scope.rootUsuario.session,
                    data: {
                        parametrizacion_usuarios: {
                            rolesModulos: nodo,
                            login_empresas_id: $scope.rootUsuario.empresaSeleccionada.getLoginEmpresaId()
                        }
                    }
                };


                Request.realizarRequest(API.USUARIOS.HABILITAR_MODULOS_USUARIO, "POST", obj, function(data) {
                    if (data.status === 200) {
                        console.log("moduolos asignados ", data);
                        AlertService.mostrarMensaje("success", "El modulo se habilito en el rol correctamente");
                        var rol = $scope.rootUsuario.rolAGuardar;
                        var ids = data.obj.parametrizacion_usuarios.ids;

                        //se asigna el id del rol_modulo guardado, ya sea que se modifique o cree
                        var modulos = rol.getModulos();
                        for (var i in ids) {

                            for (var ii in modulos) {
                                if (modulos[ii].getModulo().getId() === ids[i].modulo_id) {
                                    // console.log("buscando en ",modulos[ii].getModulo().getId(), " con ",ids[i].modulo_id, " login_modulos_empresas ",ids[i].login_modulos_empresas_id );
                                    modulos[ii].setUsuarioEmpresaId(ids[i].login_modulos_empresas_id);
                                    break;
                                }
                            }

                        }

                        callback();
                    } else {
                        AlertService.mostrarMensaje("warning", data.msj);
                    }

                });
            };

            self.seleccionarBodega = function(bodegas, estado, callback) {
                console.log("estado a cambiar ", estado)
                var centroUtilidad = $scope.rootUsuario.empresaSeleccionada.getCentroUtilidadSeleccionado();
                var obj = {
                    session: $scope.rootUsuario.session,
                    data: {
                        parametrizacion_usuarios: {
                            empresa_id: centroUtilidad.getEmpresaId(),
                            centro_utilidad_id: centroUtilidad.getCodigo(),
                            bodegas: bodegas,
                            login_empresa_id: $scope.rootUsuario.empresaSeleccionada.getLoginEmpresaId(),
                            estado: Number(estado)

                        }
                    }
                };

                Request.realizarRequest(API.USUARIOS.GUARDAR_CENTRO_UTILIDAD_BODEGA, "POST", obj, function(data) {
                    if (data.status === 200) {
                        var msg = "Bodegas asignadas correctamente";

                        if (!estado) {
                            msg = "Las bodegas se removieron correctamente";

                        } else {
                            centroUtilidad.setEstado(true);
                        }

                        AlertService.mostrarMensaje("success", msg);

                        callback(bodegas);

                        var bodegas = centroUtilidad.obtenerBodegasSeleccionadas();
                        if (bodegas.length === 0) {
                            centroUtilidad.setEstado(false);
                        }


                    } else {
                        AlertService.mostrarMensaje("warning", "Se genero un error asignando la bodega");
                    }

                });
            };

            $scope.seleccionarCentroUtilidad = function(centroUtilidad) {
                
                $scope.estadoBodegas = false;
                console.log("centro de utilidad >>>>>>>>>>>>>>>>>>>>>>>");
                
                $scope.rootUsuario.empresaSeleccionada.setCentroUtilidadSeleccionado(centroUtilidad);
                self.traerBodegasUsuario(function() {

                });
            };

            $scope.onSeleccionarBodega = function(bodega) {
                var estado = !bodega.getEstado();
                
                self.seleccionarBodega([bodega.getCodigo()], estado, function(bodegas) {
                    bodega.setEstado(estado);
                });
            };


            $scope.removerCentroUtilidad = function(centroUtilidad) {

                $scope.opts = {
                    backdrop: true,
                    backdropClick: true,
                    dialogFade: false,
                    keyboard: true,
                    template: ' <div class="modal-header">\
                                    <button type="button" class="close" ng-click="close()">&times;</button>\
                                    <h4 class="modal-title">Desea remover el centro de utilidad {{centroUtilidad.getNombre()}} del usuario?</h4>\
                                </div>\
                                <div class="modal-body">\
                                    <h5>Este centro de utilidad y las bodegas asociadas no estarán disponibles para el usuario. </h5>\
                                </div>\
                                <div class="modal-footer">\
                                    <button class="btn btn-warning" ng-click="close()">No</button>\
                                    <button class="btn btn-primary" ng-click="confirmar()" ng-disabled="" >Si</button>\
                                </div>',
                    scope: $scope,
                    controller: function($scope, $modalInstance) {
                        $scope.centroUtilidad = centroUtilidad;

                        $scope.confirmar = function() {
                            $scope.rootUsuario.empresaSeleccionada.setCentroUtilidadSeleccionado(centroUtilidad);
                            self.deshabilitarBodegasUsuario(function() {

                            });
                            $modalInstance.close();
                        };

                        $scope.close = function() {
                            $modalInstance.close();
                        };

                    },
                    resolve: {
                        centroUtilidad: function() {
                            return centroUtilidad;
                        }
                    }
                };
                var modalInstance = $modal.open($scope.opts);

            };

            $scope.removerBodega = function(bodega) {

                $scope.opts = {
                    backdrop: true,
                    backdropClick: true,
                    dialogFade: false,
                    keyboard: true,
                    template: ' <div class="modal-header">\
                                    <button type="button" class="close" ng-click="close()">&times;</button>\
                                    <h4 class="modal-title">Desea remover esta bodega del usuario?</h4>\
                                </div>\
                                <div class="modal-body">\
                                    <h5>Esta bodega no estará mas asociada al usuario. </h5>\
                                </div>\
                                <div class="modal-footer">\
                                    <button class="btn btn-warning" ng-click="close()">No</button>\
                                    <button class="btn btn-primary" ng-click="confirmar()" ng-disabled="" >Si</button>\
                                </div>',
                    scope: $scope,
                    controller: function($scope, $modalInstance) {

                        $scope.confirmar = function() {
                            $scope.onSeleccionarBodega(bodega);
                            $modalInstance.close();
                        };

                        $scope.close = function() {
                            $modalInstance.close();
                        };

                    },
                    resolve: {
                        bodega: function() {
                            return bodega;
                        }
                    }
                };
                var modalInstance = $modal.open($scope.opts);

            };

            $scope.onCambiarPredeterminadoEmpresa = function() {
                var obj = {
                    session: $scope.rootUsuario.session,
                    data: {
                        parametrizacion_usuarios: {
                            rol_id: $scope.rootUsuario.rolAGuardar.getId(),
                            empresa_id: $scope.rootUsuario.empresaSeleccionada.getCodigo(),
                            usuario_id: $scope.rootUsuario.usuarioAGuardar.getId(),
                            predeterminado: Number($scope.rootUsuario.empresaSeleccionada.getPredeterminado())
                        }
                    }
                };

                Request.realizarRequest(API.USUARIOS.CAMBAR_PREDETERMINADO_EMPRESA, "POST", obj, function(data) {
                    if (data.status === 200) {
                        AlertService.mostrarMensaje("success", "Se a seleccionado el rol como predeterminado");

                    } else {
                        AlertService.mostrarMensaje("warning", "Ha ocurrido un error...");
                    }

                });
            };

            $rootScope.$on("datosArbolCambiados", function(e, modulos) {
                $scope.$broadcast("datosArbolCambiados", modulos);
            });

            $rootScope.$on("onseleccionarnodo", function(e, modulo) {
                $scope.$broadcast("onseleccionarnodo", modulo.id);
            });


            $rootScope.$on("onSeleccionarOpcion", function(event, opcion) {
                $scope.rootModulos.moduloAGuardar.opcionAGuardar = opcion;
                var modulo_rol = self.esModuloSeleccionado($scope.rootModulos.moduloAGuardar);

                if (!opcion.estado || !modulo_rol) {
                    return;
                }

                var obj = {
                    session: $scope.rootUsuario.session,
                    data: {
                        parametrizacion_usuarios: {
                            opcion: opcion,
                            login_modulos_empresa_id: modulo_rol.getUsuarioEmpresaId()
                        }
                    }
                };

                Request.realizarRequest(API.USUARIOS.GUARDAR_OPCION, "POST", obj, function(data) {
                    if (data.status === 200) {
                        AlertService.mostrarMensaje("success", "Opcion guardada correctamente");

                    } else {
                        AlertService.mostrarMensaje("warning", data.msj);
                    }

                });
            });

            $scope.seleccionRol = function(rol) {

                $scope.opts = {
                    backdrop: true,
                    backdropClick: true,
                    dialogFade: false,
                    keyboard: true,
                    template: ' <div class="modal-header">\
                                    <button type="button" class="close" ng-click="close()">&times;</button>\
                                    <h4 class="modal-title">Desea asignar el rol al usuario?</h4>\
                                </div>\
                                <div class="modal-body">\
                                    <h5>Se sobreescribirán todos los permisos existentes, esta acción no puede deshacerse. </h5>\
                                </div>\
                                <div class="modal-footer">\
                                    <button class="btn btn-warning" ng-click="close()">No</button>\
                                    <button class="btn btn-primary" ng-click="confirmar()" ng-disabled="" >Si</button>\
                                </div>',
                    scope: $scope,
                    controller: function($scope, $modalInstance) {

                        $scope.confirmar = function() {
                            $scope.confirmarAsignarRol(rol);
                            $modalInstance.close();
                        };

                        $scope.close = function() {
                            $modalInstance.close();
                        };

                    },
                    resolve: {
                        rol: function() {
                            return rol;
                        }
                    }
                };
                var modalInstance = $modal.open($scope.opts);

            };

            $scope.confirmarAsignarRol = function(rol) {
                $scope.rootModulos.moduloAGuardar.vaciarOpciones();
                $scope.rootUsuario.rolAGuardar = rol;

                //cambia el estado de los roles
                var roles = $scope.rootUsuario.empresaSeleccionada.getRoles();
                for (var i in roles) {
                    roles[i].setEstado(false);
                }

                $scope.rootUsuario.rolAGuardar.setEstado(true);
                self.asignarRolUsuario(function() {
                    self.traerModulosPorUsuario(function() {
                        self.traerModulos(function() {

                        });
                    });
                });
            };

            $scope.onVolver = function() {
                $state.go("ListarUsuarios");
            };

            $scope.onLimpiarFormulario = function() {
                self.inicializarUsuarioACrear();
                $scope.rootUsuario.confirmacionEmail = "";
                $scope.rootUsuario.confirmacionClave = "";
                $scope.rootUsuario.avatar = "";
            };

            $scope.onBuscarRol = function($event) {
                if ($event.which === 13) {
                    $scope.rootUsuario.paginaactual = 1;
                    self.traerRoles();
                }
            };
            
            $scope.onBuscarCentroUtilidad = function($event) {
                if ($event.which === 13) {
                    $scope.rootUsuario.paginaActualCentros = 1;
                    self.traerCentrosUtilidadUsuario(function() {

                    });
                }
            };

            $scope.$on("modulosSeleccionados", function(e, modulos_seleccionado) {
                //determina el nodo que se va a guardar, de esta forma solo se envia los modulos del nodo
                var nodo = [];
                var modulo = self.agregarModulo(modulos_seleccionado.seleccionado, true);

                if (!modulo) {
                    return;
                }

                $scope.rootModulos.moduloAGuardar = modulo.getModulo();

                nodo.push(modulo);

                for (var i in modulos_seleccionado.padres) {
                    modulo = self.agregarModulo(modulos_seleccionado.padres[i], true);
                    nodo.push(modulo);
                }

                for (var ii in modulos_seleccionado.hijos) {
                    modulo = self.agregarModulo(modulos_seleccionado.hijos[ii], true);
                    nodo.push(modulo);
                }


                self.habilitarModulosRol(nodo, function() {

                });

            });


            $scope.$on("modulosDeshabilitados", function(e, modulos_seleccionados) {
                //console.log("modulos a deshabilitar ", modulos_seleccionados);

                //$scope.rootUsuario.rolAGuardar.vaciarModulos();
                //determina el nodo que se va a guardar, de esta forma solo se envia los modulos del nodo
                var nodo = [];

                var modulo = self.agregarModulo(modulos_seleccionados.seleccionado, false);

                if (!modulo) {
                    return;
                }

                $scope.rootModulos.moduloAGuardar = modulo.getModulo();

                nodo.push(modulo);

                //deshabilita los modulos padre si no posee algun modulo hijo seleccionado
                for (var i in modulos_seleccionados.padres) {
                    var hijos = $scope.obtenerHijosSeleccionados(modulos_seleccionados.padres[i]);
                    var modulo = self.agregarModulo(modulos_seleccionados.padres[i], false);

                    if (hijos.length === 0 && modulo) {

                        nodo.push(modulo);
                    }
                }

                for (var ii in modulos_seleccionados.hijos) {
                    modulo = self.agregarModulo(modulos_seleccionados.hijos[ii], false);
                    nodo.push(modulo);
                }

                self.habilitarModulosRol(nodo, function() {

                });

            });

            //evento que deshabilita los modulos padre si no tiene hijos seleccionados
            $scope.$on("deshabilitarNodosPadre", function(e, padre, hijos) {

                var nodo = [];


                if (hijos.length === 0) {


                    var modulo = self.agregarModulo(padre, false);
                    nodo.push(modulo);

                    self.habilitarModulosRol(nodo, function() {
                        console.log("deshabilitado padre >>>>>>>>>>>>>>>>>>>>>> ", padre, " hijos ", hijos);
                    });
                }
            });

            $scope.$on("traerOpcioesModuloSeleccionado", function(e, modulo_id) {
                //self.listarRolesModulosOpciones(modulo_id);
                $scope.rootModulos.moduloAGuardar = self.esModuloSeleccionado(Modulo.get(modulo_id)).getModulo();

                var obj = {
                    session: $scope.rootModulos.session,
                    data: {
                        parametrizacion_usuarios: {
                            modulo: {
                                id: modulo_id,
                                rol_modulo_id: 0,
                                rol_id: $scope.rootUsuario.rolAGuardar.getId(),
                                empresa_id: $scope.rootUsuario.empresaSeleccionada.getCodigo()
                            },
                            usuario_id: $scope.rootUsuario.usuarioAGuardar.getId()
                        }
                    }
                };

                Request.realizarRequest(API.USUARIOS.LISTAR_USUARIO_OPCIONES, "POST", obj, function(data) {
                    if (data.status === 200) {
                        var datos = data.obj.parametrizacion_usuarios.opciones_modulo;

                        //se emite el evento con los datos al controllador de opciones
                        $scope.$broadcast("traerOpcionesModulo", datos);

                    }

                });

            });

            $scope.onGuardarUsuario = function() {
                console.log("usuario a guardar ", $scope.rootUsuario.usuarioAGuardar);
                console.log("confirmar clave ", $scope.confirmarClave);

                var validacion = self.__validarCreacionUsuario();

                if (!validacion.valido) {
                    AlertService.mostrarMensaje("warning", validacion.msj);
                    return;
                }

                // $scope.rootRoles.rolAGuardar.setEmpresaId($scope.rootRoles.empresaSeleccionada.getCodigo());
                var usuario_guardar = angular.copy($scope.rootUsuario.usuarioAGuardar);


                var obj = {
                    session: $scope.rootUsuario.session,
                    data: {
                        parametrizacion_usuarios: {
                            usuario: usuario_guardar
                        }
                    }
                };

                Request.realizarRequest(API.USUARIOS.GUARDAR_USUARIO, "POST", obj, function(data) {
                    if (data.status === 200) {
                        var _usuario = data.obj.parametrizacion_usuarios.usuario;
                        if (_usuario) {
                            var id = _usuario.usuario_id;
                            $scope.rootUsuario.usuarioAGuardar.setId(id);
                        }

                        AlertService.mostrarMensaje("success", "Usuario guardado correctamente");


                    } else {
                        AlertService.mostrarMensaje("warning", data.msj);
                    }

                });


            };

            $scope.cargar_archivo = function($flow) {

                $scope.opciones_archivo = $flow;
            };

            $scope.subirImagenUsuario = function() {
                // Solo Subir Plano
                $scope.opciones_archivo.opts.query.data = JSON.stringify({
                    parametrizacion_usuarios: {
                        usuario_id: $scope.rootUsuario.usuarioAGuardar.getId()
                    }
                });

                $scope.opciones_archivo.upload();


            };

            $scope.respuestaImagenAvatar = function(file, message) {

                //$scope.opciones_archivo.cancel();
                var data = (message !== undefined) ? JSON.parse(message) : {};

                if (data.status === 200) {

                    AlertService.mostrarMensaje("success", "Avatar actualizado correctamente");

                } else {
                    AlertService.mostrarMensaje("success", "Se genero un error actualizando el avatar");
                }

            };

            //trae el rol seleccionado para la empresa por el usuario
            $scope.onEmpresaSeleccionada = function() {
                $scope.rootModulos.moduloAGuardar.vaciarOpciones();
                $scope.rootUsuario.termino_busqueda = "";
                var obj = {
                    session: $scope.rootUsuario.session,
                    data: {
                        parametrizacion_usuarios: {
                            usuario_id: $scope.rootUsuario.usuarioAGuardar.getId(),
                            empresa_id: $scope.rootUsuario.empresaSeleccionada.getCodigo()
                        }
                    }
                };

                Request.realizarRequest(API.USUARIOS.OBTENER_ROL_USUARIO, "POST", obj, function(data) {
                    // $scope.rootUsuario.empresaSeleccionada.setLoginEmpresaId(login_empresa_id);
                    if (data.status === 200) {
                        var _rol = data.obj.parametrizacion_usuarios.rol;
                        if (_rol) {

                            var rol = Rol.get(
                                    _rol.id,
                                    _rol.nombre_rol,
                                    _rol.observacion_rol,
                                    $scope.rootUsuario.empresaSeleccionada.getCodigo()
                                    );


                            $scope.rootUsuario.rolAGuardar = rol;
                            $scope.rootUsuario.empresaSeleccionada.setLoginEmpresaId(_rol.login_empresa_id);
                        }
                        self.traerModulosPorUsuario(function() {
                            self.traerModulos(function() {
                                self.traerRoles(function() {
                                    self.traerCentrosUtilidadUsuario(function() {

                                    });
                                });
                            });
                        });


                    } else {
                        AlertService.mostrarMensaje("warning", data.msj);
                    }

                });


            };

            $scope.paginaAnterior = function() {
                $scope.rootUsuario.paginaactual--;
                self.traerRoles();
            };

            $scope.paginaSiguiente = function() {
                $scope.rootUsuario.paginaactual++;
                self.traerRoles();
            };
            
            $scope.paginaAnteriorCentros = function() {
                if($scope.rootUsuario.paginaActualCentros === 1){
                    return;
                }
                
                $scope.rootUsuario.paginaActualCentros--;
                self.traerCentrosUtilidadUsuario(function() {

                });
            };

            $scope.paginaSiguienteCentros = function() {
                $scope.rootUsuario.paginaActualCentros++;
                self.traerCentrosUtilidadUsuario(function() {

                });
            };

            var usuario_id = localStorageService.get("usuario_id");
            self.inicializarUsuarioACrear();

            self.traerEmpresas(function() {

                if (usuario_id && usuario_id.length > 0) {
                    self.traerUsuarioPorId(usuario_id, function() {
                        if ($scope.rootUsuario.empresaSeleccionada) {
                            self.traerCentrosUtilidadUsuario(function() {

                            });
                        }
                    });
                }

            });


            $scope.$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams) {
                $scope.rootUsuarios = {};
                $scope.$$watchers = null;
            });

        }]);
});