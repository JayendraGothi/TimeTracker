/**
 * Created by jayendra on 2/3/14.
 */
/**
 * Created by jayendra on 20/2/14.
 */

/**
 * Holds time Page Controllers
 * @type {module|*}
 */
var timeControllersApp = angular.module("timeControllersApp", ["categoryServicesApp", "validationService"]);

timeControllersApp.controller('TimeController', [
    "$scope",
    "CategoryFactory",
    "ValidationFactory",
    '$q',
    function ($scope, CategoryFactory, ValidationFactory, $q) {

        // Table Header for UI
        $scope.timeHeaders = [];
        $scope.categories = [];

        // Time page will show data from startDate to endDate.
        $scope.startDate = "";
        $scope.endDate = "";

        // All Projects under Category name.
        $scope.projectCategories = {};

        $scope.addNewTimeLine = function () {
            /*var dates = {};
             for (var date = $scope.startDate; date <= $scope.endDate; date = getTomorrow(date,1)) {
             if (!dates.hasOwnProperty(date)) {
             dates[date] = 0;
             }
             }*/
            $scope.timeDateData.push({categories: {}, time: {}});
        }
        /**
         * Set UserDocId.
         * @returns {Promise.promise|*}
         */
        var setDocId = function () {
            var deferred = $q.defer();
            CategoryFactory.getUserDocId().success(function (data) {
                deferred.resolve(data);
            });
            return deferred.promise;
        };

        /**
         * Get date with difference of offset.
         * @param date
         * @param offset
         * @returns {number}
         */
        var getTomorrow = function (date, offset) {
            if (offset != 0 && !offset) {
                offset = 1;
            }
            date = new Date(date);
            //This is the actual catch used in this function
            date = new Date(new Date(date).setDate(date.getDate() + offset));
            return Date.parse(date.getFullYear() + "/" + (date.getMonth() + 1) + "/" + date.getDate());
        };

        /**
         * Changes $scope.timeHeaders According to the startDate and EndDate
         * @param startDate
         * @param endDate
         */
        var changeTableHeaderTime = function (startDate, endDate) {
            for (var date = startDate; date <= endDate; date = getTomorrow(date, 1)) {
                $scope.timeHeaders.push(date);
            }
        };

        /**
         * Set $scope.categories.
         * Also set $scope.projectCategories.
         */
        var setCategories = function () {
            if ($scope.categories) {
                CategoryFactory.getProjectCategories().success(function (data) {
                    $scope.categories = data.rows;

                    // Set ProjectCategories.
                    angular.forEach($scope.categories, function (value, key) {
                        $scope.projectCategories[value.id] = CategoryFactory.getCategoryValueByDocId(value.id);
                    });
                });
            }
        };

        /**
         * Get time Data of user.
         * Converts it into specific JSON so that it can be easily used in UI.
         * @param startDate
         * @param endDate
         */
        var getTimeData = function (startDate, endDate) {

            // Convert startDate and endDate into Date format.
            startDate = new Date(startDate);
            endDate = new Date(endDate);

            // Stringify startDate and endDate into string format that is easily understand by couchDB.
            var stringStartDate = (startDate.getFullYear() + "/" + (startDate.getMonth() + 1) + "/" + startDate.getDate());
            var stringEndDate = (endDate.getFullYear() + "/" + (endDate.getMonth() + 1) + "/" + endDate.getDate());

            setDocId().then(function (result) {

                // Gets all the time data from user doc from startDate to endDate.
                CategoryFactory.getTimeData(result, stringStartDate, stringEndDate).success(function (data) {
                    $scope.timeDateData = [];
                    // Loop through each date returned from server.
                    angular.forEach(data, function (value, key) {
                        var date = key;

                        // Loop through each Category time JSON.
                        angular.forEach(value, function (value, key) {
                            var added = false;

                            // Loop through timeDateData.
                            // See if the category sequence is already present.
                            for (var i in $scope.timeDateData) {

                                // If it is present enter new row with key as date and value as time.
                                if (angular.equals($scope.timeDateData[i].categories, value.categories)) {
                                    $scope.timeDateData[i].time[date] = value.time;
                                    added = true;
                                }
                            }
                            // if it is not present add new row in timeDateData.
                            if (!added) {
                                var dates = {};
                                dates[date] = value.time;
                                $scope.timeDateData.push({
                                    categories: value.categories,
                                    time: dates
                                });
                            }
                        });
                    });
                    saveUserDoc();
                    // If the dates between startDate and endDate do not have any data.
                    // it will add 0 in place of that.
                    /*angular.forEach($scope.timeDateData, function (value, key) {
                     for (var date = $scope.startDate; date <= $scope.endDate; date = getTomorrow(date,1)) {
                     if (!value.time.hasOwnProperty(date)) {
                     value.time[date] = 0;
                     }
                     }
                     });*/
                });
            });
        };

        var getAllValidateData = function () {
            var categories = [];
            angular.forEach($scope.timeDateData, function (value, key) {
                categories.push(value.categories);
            });
            ValidationFactory.getAllValidations(categories).success(function (data) {

            });
        }

        var saveUserDoc = function () {
            var dataToSave = {};
            angular.forEach($scope.timeDateData, function (outValue, outKey) {
                angular.forEach(outValue.time, function (value, key) {
                    if (!dataToSave.hasOwnProperty((key))) {
                        dataToSave[key] = [];
                    }
                    if (value != null && value != 0) {
                        dataToSave[key].push({categories: outValue.categories, time: value});
                    }
                })
            });
            setDocId().then(function (result) {
                CategoryFactory.saveUserDoc(result, dataToSave);
            });
        }

// Initialize TimeController.
        var init = function () {

            // Today's Date.
            var today = Date.parse(new Date());

            $scope.startDate = getTomorrow(today, -1 * new Date(today).getDay());
            $scope.endDate = getTomorrow(today, (6 - new Date(today).getDay()));

            // Set all categories
            setCategories();

            // Set table Header data.
            changeTableHeaderTime($scope.startDate, $scope.endDate);

            // Get user time data.
            getTimeData($scope.startDate, $scope.endDate);

        };
        init();
        $scope.$watch('timeDateData', function (newValue, oldValue) {

        }, true);
    }])
;
