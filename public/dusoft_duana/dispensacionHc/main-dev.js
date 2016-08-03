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
        services:"js/services",
        bootstrap:"../../javascripts/bootstrap/bootstrap",
        bootstrap3:"../../javascripts/bootstrap/version_v3.1.1/bootstrap",
        nggrid:"../../javascripts/angular/ng-grid",
        jquery:"../../javascripts/jquery",
        treemenu:"../includes/menu/myTree",
        tree:"../../javascripts/jstree",
        loader:"../includes/loader/loader",
        url:"js/constants/Url",
        socket:"../includes/socket/socket.io/socket.io",
        socketservice:"../includes/socket/socket",        
        uiselect2: "../../javascripts/select",
        storage:"../../javascripts/angular/storage",
        httpinterceptor:"../includes/http/HttpInterceptor",
        d3:"../../javascripts/charts/d3.min",
        nvd3:"../../javascripts/charts/nv.d3.min",
        chart:"../../javascripts/charts/angularjs-nvd3-directives.min",
        desktopNotify:"../../javascripts/notifications/desktop-notify-min",
        webNotification:"../../javascripts/notifications/angular-web-notification",
    },
    shim: {
        "angular": {
            deps:["jquery", "tree"],
            exports: "angular"
        },
        "route": {
            deps: ["angular"]
        },
        "ngroute":{
            deps: ["angular"]
        },
        "bootstrap":{
            deps:["angular"]
        },
        "bootstrap3":{
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
        "socketservice":{
            deps:["socket"]
        },
        "uiselect2": {
            deps: ["angular", "jquery"]
        },
        "storage":{
            deps:["angular"]
        },
        "d3":{
            deps:["angular"]
        },
        "nvd3":{
            deps:["d3"]
        },
        "chart":{
            deps:["angular","nvd3"]
        },
        "desktopNotify":{
            deps:["angular"]
        },
        "webNotification":{
            deps:["desktopNotify"]
        }
    }
});
 
requirejs([
    "app"
]);