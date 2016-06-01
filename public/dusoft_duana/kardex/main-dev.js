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
        socketservice:"../includes/socket/socket",
        uiselect2:"../../javascripts/uiselect2",
        select:"../../javascripts/select2",
        desktopNotify:"../../javascripts/notifications/desktop-notify-min",
        webNotification:"../../javascripts/notifications/angular-web-notification"
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
        },
        "select":{
            deps:["jquery"]
        },
        "uiselect2":{
            deps:["angular","select"]
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