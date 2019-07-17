
function Error() {
        this._excepciones = {};
    }

    Error.prototype.get_excepciones = function() {
        return this._razonSocial;
    }

    Error.prototype.set_excepciones = function(that,value) {
        this._razonSocial = value;
        //validacion Error
        if(value.estado === 'VE'){
            let subject = "Error al Facturar "+value.tipoDocumento+"-"+value.tipoDocumento;
            let message = "Error al Facturar <br><br>"+JSON.stringify(value);
            __enviar_correo_electronico(that, subject, message);
        }
    };
    
    function __enviar_correo_electronico(that,subject, message) {
        
    var fecha = new Date();
    
    var smtpTransport = that.emails.createTransport("SMTP", {
        host: G.settings.email_host, // hostname
        secureConnection: true, // use SSL
        port: G.settings.email_port, // port for secure SMTP
        auth: {
            user: G.settings.email_rotaciones,
            pass:  G.settings.email_rotaciones_pass
        }
    });

    var settings = {
        from: G.settings.email_rotaciones,
        to: G.settings.email_desarrollo1,//G.settings.email_mauricio_barrios + "," + G.settings.email_pedro_meneses
        cc: G.settings.email_desarrollo1+ "," + G.settings.email_desarrollo2,
        subject: subject,
        html: "<br>"+message
    };

    smtpTransport.sendMail(settings, function (error, response) {
        if (error !== null) {
            console.log("Error :: ",error);
            return;
        } else {            
            smtpTransport.close();
            console.log("Correo enviado");
            return;
        }
    });
}
;


module.exports = new Error;
