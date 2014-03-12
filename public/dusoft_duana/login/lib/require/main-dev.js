requirejs.config({
 
    baseUrl: './',
 
    paths: {
        app: 'js/app',
        angular: "../../javascripts/angular/angular",
        route: "../../javascripts/angular/angular-ui-router",
        controllers: "js/controllers/",
        directive:"js/directive",
        models:"js/models",
        includes:"../includes/",
        bootstrap:"../../javascripts/bootstrap/bootstrap",
        bootstrapjs:"../../javascripts/bootstrap/bootstrap.min",
        jquery:"../../javascripts/jquery",
        treemenu:"../includes/myTree",
        tree:"../../../../javascripts/jstree",
        loader:"../includes/loader/loader",
        storage:"../../javascripts/angular/storage"
    },
    shim: {
        "angular": {
            exports: "angular"
        },
        "route": {
            deps: ["angular"]
        },
        "bootstrap":{
            deps:["angular"]
        },
        "bootstrapjs":{
            deps:["jquery"]
        },
        "tree":{
            deps:["jquery"]
        },
        "treemenu":{
            deps:["tree"]
        },
        "storage":{
            deps:["angular"]
        }
    }
});
 
requirejs([
    "app"
]);