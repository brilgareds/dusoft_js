requirejs.config({
 
    baseUrl: './',
 
    paths: {
        app: 'js/app',
        angular: "../../javascripts/angular/angular",
        route: "../../javascripts/angular/angular-ui-router",
        controllers: "js/controllers/",
        models:"js/models",
        bootstrap:"../../javascripts/bootstrap/bootstrap"
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
        }
    }
});
 
requirejs([
    "app"
]);