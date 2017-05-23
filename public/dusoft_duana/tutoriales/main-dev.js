requirejs.config({
 
    baseUrl: './',
 
   paths: {
        app: 'js/app',
        angular: "../../javascripts/angular/angular",
        route: "../../javascripts/angular/angular-ui-router",
        controllers: "js/controllers/",
        services: "js/services",
        includes:"../includes/",
        models:"js/models",
        directive:"js/directive",     
        bootstrap:"../../javascripts/bootstrap/bootstrap",
        nggrid:"../../javascripts/angular/ng-grid",
        jquery:"../../javascripts/jquery",
        treemenu:"../includes/menu/myTree",
        tree:"../../javascripts/jstree",
        select:"../../javascripts/select2",
        loader:"../includes/loader/loader",
        url:"js/constants/Url",
        socket:"../includes/socket/socket.io/socket.io",
        socketservice:"../includes/socket/socket",        
        uiselect2: "../../javascripts/select",
        bootstrapLib:"../../javascripts/bootstrap/bootstrap.min",
        storage:"../../javascripts/angular/storage",
        httpinterceptor:"../includes/http/HttpInterceptor",
        dragndropfile:"../../javascripts/dragndropfile/ng-flow-standalone",
        fileupload:"../../javascripts/fileupload/fileupload",
        desktopNotify:"../../javascripts/notifications/desktop-notify-min",
        webNotification:"../../javascripts/notifications/angular-web-notification",
        sanitize:"../../javascripts/angular/angular-sanitize.min",
        videogular: "../../javascripts/angular/videogular",
        vgcontrols: "../../javascripts/angular/vg-controls"       

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
        "bootstrapLib":{
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

        "url":{
            deps:["angular"]
        },
        "socketservice":{
            deps:["socket"]
        },
        "uiselect2":{
            deps:["angular","select"]
        },
//        "uiselect2":{
//            deps:["angular","jquery"]
//        },
        "storage":{
            deps:["angular"]
        },
        "dragndropfile":{
            deps:["angular"]
        },
        "fileupload":{
            deps:["angular"]
        },
        "desktopNotify":{
            deps:["angular"]
        },
        "webNotification":{
            deps:["desktopNotify"]
        },
        "sanitize":{
            deps:["angular"]
        },
        "videogular":{
            deps:["sanitize"]
        },
        "vgcontrols":{
            deps:["videogular"]
        }
        
    }
});
 
requirejs([
    "app"
]);