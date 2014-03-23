/**
 * Created by jayendra on 22/3/14.
 */

var validationService = angular.module('validationService', [
    'CornerCouch',
    'DBConstantVariablesModule'
]);

validationService.factory('ValidationFactory', ['cornercouch', 'DBConstants',
    function (cornercouch, DBConstants) {
        // Database variables.
        var server = cornercouch(DBConstants.DBServerUrl, "JSONP");
        var database = server.getDB(DBConstants.DBName);

        function Validation() {
        }

        Validation.prototype.getAllValidations = function (validationData) {
            database.method = "POST";
            return database.show(DBConstants.CategoryDesign, 'validations', '688f6ecf25603b9ecd14ecc486003f42', validationData);
        }
        return new Validation();
    }
]);

