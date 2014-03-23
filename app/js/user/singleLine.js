/**
 * Created by jayendra on 3/3/14.
 */
var singleLine = angular.module("singleLine", ['categoryServices']);

singleLine.controller('singleLineController', ["$scope", "Category", function ($scope, Category) {

}]);
singleLine.directive('line', function () {
    return {
        restrict: 'E',
        replace: true,
        controller: 'singleLineController',
        templateUrl: 'admin/singleline.html'
    };
});