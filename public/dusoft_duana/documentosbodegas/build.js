({
 
   // baseUrl: '../../',
    name: "app",
    out: "dist/main.js",
    removeCombined: true,
	findNestedDependencies: true,
    mainConfigFile : "main-dev.js",
    insertRequire: ['app']
    //optimize:'none',
})
 