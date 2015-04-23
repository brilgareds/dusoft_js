//main app module
 define(["angular", "route", "bootstrap","js/controllers",
  "js/services", "js/models", "nggrid",
  "js/directive", "controllers/productoscontroller","controllers/empresacontroller", 
  "models/EmpresaKardex", "includes/menu/menucontroller",  "url", "includes/header/HeaderController",
  "loader","models/ProductoMovimiento",  "includes/alert/Alert", "i18n", "httpinterceptor", "storage",
  "includes/classes/Usuario", "socketservice", "includes/http/Request","uiselect2",
  "includes/classes/CentroUtilidad","includes/classes/Bodega"
  ], function(angular,Agencia){
  /* App Module and its dependencies */
      var Kardex = angular.module('Kardex', [
          'ui.router',
          'controllers',
          'models',
          'directive',
          'ui.bootstrap',
          'ngGrid',
          'Url',
          "services",
          'LocalStorageModule',
          'ui.select2'
      ]); 
      
      Kardex.urlRouterProvider;
      Kardex.stateProvider;

      Kardex.config(["$stateProvider", "$urlRouterProvider", "$httpProvider", function($stateProvider, $urlRouterProvider,$httpProvider){

          // For any unmatched url, send to /route1
          //intercepta los http para validar el usuario
        $httpProvider.interceptors.push('HttpInterceptor');
          
         Kardex.urlRouterProvider = $urlRouterProvider;
         Kardex.stateProvider = $stateProvider;


    }]).run(["$rootScope", "localStorageService","$location","$state", function($rootScope, localStorageService,$location, $state){
        //se inicializa el usuario y la empresa para el modulo
         $rootScope.name = "Kardex";
         var vistaDefecto = "ListarProductos";
         
         $rootScope.$on("parametrizacionUsuarioLista",  function(e, parametrizacion){
            
             
            Kardex.urlRouterProvider.otherwise(vistaDefecto);
          
            Kardex.stateProvider
              .state('ListarProductos', {
                  url: "/ListarProductos",
                  text:"Listado de Productos",
                  templateUrl: "views/listarproductos.html",
                  controller:"productoscontroller"
              }).
              state('ListarProductos.verkardex', {
                  url: "/listarproductos.verkardex",
                  text:"Kardex",
                  templateUrl: "views/route1.item.html"
              });
              
            if($location.path() === ""){
                $state.go(vistaDefecto);
            } else {
                //se encarga de ir al ultimo path, despues que se configura las rutas del modulo
                $state.go($location.path().replace("/", ""));
            }

         });
         
    }]);

    angular.bootstrap(document, ['Kardex']);
    return Kardex;
});