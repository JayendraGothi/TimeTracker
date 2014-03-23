/**
 * Created by Jayendra on 23/2/14.
 */

/*Login Module:
 This module helps user to login to website
 and it checks username and password using couchdb database
 */
var login = angular.module('login', ['CornerCouch', 'ngRoute', 'headfootmodule']);
login.config(function ($routeProvider, $httpProvider) {
    $httpProvider.defaults.withCredentials = true;
});
/**
 * Constants for projectServiceApp
 * */
login.constant('DB', {
    'DBUrl': 'http://127.0.0.1:5984'
});

login.controller('LoginController', [
    '$scope',
    'cornercouch',
    '$location' ,
    'DB',
    function ($scope, cornercouch, $location, DB) {

        /*
         Variable holding username and password of user
         Initial value set to empty string
         */
        $scope.user = {
            username: '',
            password: ''
        };

        /*Variable storing error status*/
        $scope.error = {
            show: false,
            blank: false,
            incorrect: false
        };
        /*Local Variable holding server and database objects*/
        var server = cornercouch("http://127.0.0.1:5984")
        /*
         Login function
         This function uses Cookies based authentication.
         A feature provided by CouchDB.
         takes in 2 variables from Login form
         @param:     username
         @param:     password
         @return:    encrypted cookies if credentials are correct
         else display error to user
         */
        $scope.login = function () {
            if ($scope.user.username == '' || $scope.user.password == '') {
                $scope.error.blank = true;
                $scope.error.incorrect = false;
            } else {
                $scope.error.blank = false;
                var login = server.login($scope.user.username, $scope.user.password);
                login.success(function (data) {
                    console.log("Successfully Logged in");
                    for (role in data.roles) {
                        console.log(role);
                        if (data.roles[role] == 'admins') {
                            window.location.assign('admin.html');
                        } else if (data.roles[role] == 'users') {
                            window.location.assign('user.html');
                        }
                    }
                });
                login.error(function (jqXHR, textStatus, errorThrown) {
                    $scope.error.incorrect = true;
                });
            }
            if ($scope.error.blank == true || $scope.error.incorrect == true) {
                $scope.error.show = true;
            }
        };
        /*
         Logout function
         deletes encrypted cookie
         */
        $scope.logout = function () {
            var logout = server.logout();
            logout.success(function (data) {
                console.log(data);
            });
            logout.error(function (jqXHR, textStatus, errorThrown) {
                console.log(errorThrown);
            });
        }
    }]);