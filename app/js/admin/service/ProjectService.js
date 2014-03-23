/**
 * Created by jayendra on 8/3/14.
 */

/**
 * Holds Services operating on Project related data.
 * @type {module|*}
 */
var projectServiceApp = angular.module('projectServiceApp', ['CornerCouch', 'DBConstantVariablesModule']);

/**
 * ProjectCategoryFactory is the service which will manipulate Project docs on couch DB.
 * @type {service|*}
 * @param {cornercouch: DataBase Service is used to performs all calls to couchdb database}
 * @param {DBConstants:  Constant Service holds all the constants}
 * @returns {Projects object: This object holds all the functions used for operations}
 */
projectServiceApp.factory('ProjectCategoryFactory', [
    'cornercouch',
    'DBConstants',
    function (cornercouch, DBConstants) {

        // Database objects
        var database = cornercouch(DBConstants.DBServerUrl).getDB(DBConstants.DBName);
        var databaseUrl = DBConstants.DBServerUrl + "/" + DBConstants.DBName;

        // Category class
        function Projects() {
        }

        /**
         * Using promise we can get all the Project Categories.
         * @returns {Promise}
         */
        Projects.prototype.getProjectCategories = function () {
            return database.query(DBConstants.CategoryDesign, DBConstants.AllCategoriesView);
        };

        /**
         * Creates new Project Category doc in database
         * @param newCategoryData
         * @returns {Promise}
         */
        Projects.prototype.setProjectCategory = function (newCategoryData) {
            var doc = database.newDoc(newCategoryData);
            return doc.save();
        };

        /**
         * Updates existing Project Category docs. By just changing its name attribute.
         * @param doc
         * @returns {*}
         */
        Projects.prototype.updateProjectCategory = function (doc) {
            database.method = "PUT";
            console.log(doc);
            return database.update(
                DBConstants.CategoryDesign,
                DBConstants.UpdateCategoryDoc,
                doc.id,
                {"name": doc.name}
            );
        };

        /**
         * Synchronously calls database to get all the Project categories name.
         * @param callback
         */
        Projects.prototype.synchronousCategoryCall = function (callback) {
            var allCategoryUrl = databaseUrl + "/_design/" + DBConstants.CategoryDesign +
                "/_view/" + DBConstants.AllCategoriesView;
            $.ajax({
                url: allCategoryUrl,
                type: "GET",
                cache: true,
                async: false,
                contentType: "application/javascript; charset=utf-8",
                dataType: "jsonp",
                jsonpCallback: "airport",
                success: function (data) {
                    callback(data);
                }
            });
        };

        return Projects;
    }
]);

projectServiceApp.factory('ProjectCategoryValuesServices', [
    'cornercouch',
    'DBConstants',
    function (cornercouch, DBConstants) {

        // Database objects
        var database = cornercouch(DBConstants.DBServerUrl).getDB(DBConstants.DBName);
        var databaseUrl = DBConstants.DBServerUrl + "/" + DBConstants.DBName;

        var ProjectDoc = function () {
        }
        ProjectDoc.prototype.getValues = function (docId) {
            return database.getDoc(docId);
        }
        return ProjectDoc;
    }
]);