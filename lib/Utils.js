/*=====================================================================
 *  
 * 
 * Author : { developer.CO }
 *=====================================================================*/

exports.r = function(service, msj, status, obj) {
    return {service: service, msj: msj, status: status, obj: obj};
};




exports.validar_request = function() {


    return function(req, res, next) {

        var args = req.query;
        if (req.method === "POST")
            args = req.body;

        if (!!req.url.match(/^(\/api\/)/) || !!req.url.match(/^(\/login\/?)/)) {
            // Validar que el request sea el correcto
            if(G.utils.equals(args, G.settings.request))
                next();
            else
                res.send(G.utils.r(req.url, 'La sintaxis del request es invalida', 404, {}));
        } else {
            next();
        }

    };
};


/*=========================================
 * Compare Two Objects
 * =========================================*/

exports.equals = function(ob1, ob2) {

    if (ob2 === null || ob2 === undefined)
        return false;

    if (Object.keys(ob1).length != Object.keys(ob2).length)
        return false;

    for (var p in ob1)
    {
        // Evitamos navegar por las propiedades "heredadas"
        if (ob1.hasOwnProperty(p)) {

            if (!ob2.hasOwnProperty(p))
                return false; // No es una propiedad de x                 

            switch (typeof (ob1[p])) {
                case 'function':
                    return false;
                case 'object'://!p=='data' && 

                    if (p == 'data')
                        return true;

                    if (!this.equals(ob1[p], ob2[p]))  // Comparamos los objetos                               
                        return false;
                    break;
                default:
                    if (ob1[p] !== ob2[p])
                        //return false;     // Las propiedades tienes valores distintos
                        break;
            }
        }
    }

    return true;
}
