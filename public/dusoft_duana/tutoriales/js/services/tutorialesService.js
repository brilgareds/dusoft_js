define(["angular", "js/services"], function(angular, services) {


    services.factory('tutorialesService', 
                    ['$rootScope', 'Request', 'API',
                     "Usuario","$modal","localStorageService","TutorialH",
                    
        function($rootScope, Request, API,
                $modal,Usuario,localStorageService,TutorialH) {

            var self = this;
            
            
           /**
            * @author Cristian Ardila
            * +Descripcion Funcion encargada de obtener los registros de los
            *              tutoriales a traves de una ruta de servicio
            * @fecha 2017/16/03
            */
            self.listarVideoTutoriales = function(obj, callback){
                
                Request.realizarRequest(API.TUTORIALES.LISTAR_VIDEOS,"POST", obj, function(data){    
                    callback(data);                        
                });
            };
            
            /**
             * @author Cristian Ardila
             * +Descripcion Metodo encargado de convertir a objeto los registros
             *              de la lista de videos
             * @fecha 2017/03/16
             */
            self.renderlListarVideoTutoriales = function(tutoriales){                                          
                var resultado = [];                  
                tutoriales.forEach(function(row) {                    
                    var tutoriales = TutorialH.get(row.tag,row.tipo,row.titulo,row.descripcion,row.path,row.fecha_registro);
                    resultado.push(tutoriales);                                      
                });   
                 
                return resultado;               
            };
            
        return this;
    }]);
         
});



