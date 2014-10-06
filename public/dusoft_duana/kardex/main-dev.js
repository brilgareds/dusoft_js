requirejs.config({
 
    baseUrl: './',
 
    paths: {
        app: 'js/app',
        angular: "../../javascripts/angular/angular",
        route: "../../javascripts/angular/angular-ui-router",
        controllers: "js/controllers/",
        includes:"../includes/",
        models:"js/models",
        directive:"js/directive",
        bootstrap:"../../javascripts/bootstrap/bootstrap",
        facturacion: "../facturacion/js/models/",
        nggrid:"../../javascripts/angular/ng-grid",
        jquery:"../../javascripts/jquery",
        treemenu:"../includes/menu/myTree",
        tree:"../../javascripts/jstree",
        url:"js/constants/Url",
        loader:"../includes/loader/loader",
        i18n:"../../javascripts/angular/es",
        httpinterceptor:"../includes/http/HttpInterceptor",
        storage:"../../javascripts/angular/storage",
        socket:"../includes/socket/socket.io/socket.io",
        socketservice:"../includes/socket/socket"
    },
    shim: {
        "angular": {
            deps:["jquery", "tree"],
            exports: "angular"
        },
        "route": {
            deps: ["angular"]
        },
        "bootstrap":{
            deps:["angular"]
        },
        "nggrid":{
            deps:["jquery", "angular"]
        },
        "tree":{
            deps:["jquery"]
        },
        "treemenu":{
            deps:["tree"]
        },
        "url":{
            deps:["angular"]
        },
        "i18n":{
            deps:["angular"]
        },
        "storage":{
            deps:["angular"]
        },
        "socketservice":{
            deps:["socket"]
        },
        "transition":{
            deps:["jquery"]
        }
    }
});
 
requirejs([
    "app"
]);