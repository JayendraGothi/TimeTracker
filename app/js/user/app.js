'use strict';

/* App Module */

var userApp = angular.module('userApp', [
    'ngRoute',
    'categoryServicesApp',
    'timeControllersApp',
    'headfootmodule',
    'validationService'
]);

userApp.config(['$routeProvider',
    function ($routeProvider) {
        $routeProvider.
            when('/login', {
                templateUrl: 'index.html',
                controller: 'LoginController'
            }).
            when('/usertime', {
                templateUrl: 'partials/user/usertime.html',
                controller: 'TimeController'
            }).
            otherwise({
                redirectTo: '/usertime'
            });
    }]);
