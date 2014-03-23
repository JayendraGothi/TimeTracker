/**
 * Created by jayendra on 8/3/14.
 */
'use strict';

/* Admin Module */

var adminApp = angular.module('adminApp', ['ngRoute', 'projectControllerApp', 'projectServiceApp']);

adminApp.config(['$routeProvider',
    function ($routeProvider) {
        $routeProvider.
            when('/projects', {
                templateUrl: 'partials/admin/projects.html',
                controller: 'ProjectController'
            }).
            otherwise({
                redirectTo: '/projects'
            });
    }]);
