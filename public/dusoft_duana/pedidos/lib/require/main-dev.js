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
        select:"../../../../javascripts/select2",
        loader:"../includes/loader/loader",
        config:"../includes/config/Config",
        socket:"/socket.io/socket.io",
        socketservice:"../includes/socket/socket",
        uiselect2:"../../../../javascripts/uiselect2"
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
        "select":{
            deps:["jquery"]
        },

        "config":{
            deps:["angular"]
        },
        "socketservice":{
            deps:["socket"]
        },
        "uiselect2":{
            deps:["angular","select"]
        }
    }
});
 
requirejs([
    "app"
]);