define(["angular", "js/models", "includes/classes/Documento"], function(angular, models) {

    models.factory('DocumentoBodega', ["Documento" , "$filter", function(Documento, $filter) {

            var DocumentoBodega = Object.create(Documento.getClass().prototype);

            return DocumentoBodega;
        }]);
});