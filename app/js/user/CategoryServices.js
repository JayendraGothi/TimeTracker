/**
 * Created by jayendra on 22/2/14.
 */

/**
 *  Category service that access CornerCouch service and returns data
 * @type {module|*}
 */
var categoryServicesApp = angular.module('categoryServicesApp', [
    'CornerCouch',
    'DBConstantVariablesModule'
]);

categoryServicesApp.factory('CategoryFactory', ['cornercouch', 'DBConstants',
    function (cornercouch, DBConstants) {

        // Database variables.
        var server = cornercouch(DBConstants.DBServerUrl, "JSONP");
        var database = server.getDB(DBConstants.DBName);

        /**
         * Category Class: returned as a service
         * @constructor
         */
        function Category() {
        }

        /**
         * Get all Project Categories.
         * @returns {Project Categories and there doc id in json format}
         */
        Category.prototype.getProjectCategories = function () {
            return database.query(DBConstants.CategoryDesign, DBConstants.AllCategoriesView);
        };

        /**
         * Get all Projects present in docId.
         * @param docId
         * @returns {*}
         */
        Category.prototype.getCategoryValueByDocId = function (docId) {
            return database.getDoc(docId);
        };

        /**
         * Gets users couch document id.
         * This document id holds a document which carries all the user related time-data.
         * @returns {*|void}
         */
        Category.prototype.getUserDocId = function () {
            database.method = "POST";
            return database.show(DBConstants.CategoryDesign, DBConstants.UserDocShow, DBConstants.UserDocLinkageDocId);
        };

        /**
         * Get all user time data using docId from startDate to endDate.
         * @param docId
         * @param startDate
         * @param endDate
         * @returns {*|void}
         */
        Category.prototype.getTimeData = function (docId, startDate, endDate) {
            this.getUserDocId();
            database.method = "POST";
            return database.show(
                DBConstants.CategoryDesign,
                DBConstants.UserTimeDataShow,
                docId,
                {
                    'startDate': startDate,
                    'endDate': endDate
                }
            );
        };

        return new Category();
    }
]);