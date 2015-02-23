define(["angular", "js/models"], function(angular, models) {

    models.factory('Modulo', [function() {

            function Modulo(id, parent, text, url) {
                this.id = (id) ?"modulo_"+id:0;
                this.parent = (parent) ?"modulo_"+parent:"#" ;
                this.text = text || "";
                this.url = url || "";
                this.modulo_id = id || 0;
                this.parent_id = parent || "#";
                
            }
            
            this.get = function(id, parent, text, url) {
                return new Modulo(id, parent, text, url);
            };

            return this;
        }]);
});