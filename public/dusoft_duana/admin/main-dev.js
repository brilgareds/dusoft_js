requirejs.config({
 
    baseUrl: './',
 
   paths: {
        app: 'js/app',
        angular: "../../javascripts/angular/angular",
        route: "../../javascripts/angular/angular-ui-router",
        controllers: "js/controllers/",
        directive:"js/directive",
        models:"js/models",
        services:"js/services",
        includes:"../includes/",
        bootstrap:"../../javascripts/bootstrap/bootstrap",
        bootstrapjs:"../../javascripts/bootstrap/bootstrap.min",
        jquery:"../../javascripts/jquery",
        loader:"../includes/loader/loader",
        storage:"../../javascripts/angular/storage",
        url:"js/constants/Url"
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
        "storage":{
            deps:["angular"]
        },
        "url":{
            deps:["angular"]
        }
    }
});
 
requirejs([
    "app"
]);