/**
 * Created by jayendra on 2/3/14.
 */

/*
 Module created to handle header and footer directive
 */
var headfootmodule = angular.module("headfootmodule", []);
headfootmodule.directive("mainheader", function () {
    return {
        restrict: 'E',
        replace: true,
        templateUrl: 'partials/header.html'
    };
});

headfootmodule.directive("mainfooter", function () {
    return {
        restrict: 'E',
        replace: true,
        templateUrl: 'partials/footer.html'
    };
});