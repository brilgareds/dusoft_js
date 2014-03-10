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
        bootstrap:"../../../../javascripts/bootstrap/bootstrap",
        facturacion: "../facturacion/js/models/",
        nggrid:"../../../../javascripts/angular/ng-grid",
        jquery:"../../../../javascripts/jquery",
        treemenu:"../includes/menu/myTree",
        tree:"../../../../javascripts/jstree",
        config:"../includes/config/Config",
        loader:"../includes/loader/loader",
        i18n:"http://code.angularjs.org/1.0.8/i18n/angular-locale_es-es"
    },
    shim: {
        "angular": {
            deps:["jquery"],
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
        "config":{
            deps:["angular"]
        },
        "i18n":{
            deps:["angular"]
        }
    }
});
 
requirejs([
    "app"
]);