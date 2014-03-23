/**
 * Created by jayendra on 8/3/14.
 */

/**
 * Holds controllers which handles Project Category Menu UI and also access Project Category Services
 * Controllers:ProjectController, ProjectNameFormCtrl
 * @type {module|*}
 */
var projectControllerApp = angular.module('projectControllerApp', ['projectServiceApp', 'ui.bootstrap']);

/**
 * Called when the Controller object is created to send cookies with the next http request.
 */
projectControllerApp.config(function ($routeProvider, $httpProvider) {
    $httpProvider.defaults.withCredentials = true;
});

/**
 * ProjectController interacts with UI and Project Services.
 */
projectControllerApp.controller('ProjectController', [
    'ProjectCategoryFactory',
    '$scope',
    '$modal',
    '$rootScope',
    function (ProjectCategoryFactory, $scope, $modal, $rootScope) {

        // projectFactory Variable
        var projectCategoryService = new ProjectCategoryFactory();

        // Array of All Project Categories.
        $scope.projectCategories = null;

        // Single category used in new Category form.
        $scope.projectCategory = {
            id: "",
            name: "",
            isExisting: false
        };

        /**
         * Prepare form to update Project Category name
         * @param row
         */
        $scope.editProjectCategory = function (row) {
            /*$scope.projectCategory.id = row.id;
             $scope.projectCategory.name = row.value;
             $scope.projectCategory.isExisting = true;*/
            row.isExisting = true;
            row.name = row.value;
            openFancyBox(row);
        };
        $scope.addProjectCategory = function () {
            openFancyBox({id: "", name: "", isExisting: false});
        };

        $scope.setDocId = function (id) {
            $rootScope.docId = id;
        }
        /**
         * Get all Project Categories
         */
        var getProjectCategories = function () {
            var projects = projectCategoryService.getProjectCategories();
            projects.then(function (result) {
                $scope.projectCategories = result.data.rows;
                if (!$rootScope.docId) {
                    $rootScope.docId = $scope.projectCategories[0].id;
                }
            });
            projects.error(function () {
                $scope.projectCategories = {"value": "No Projects Defined"};

            });
        };

        /**
         * Synchronous call to GetProjectCategory to update UI Dynamically
         * */
        var getProjectCategoriesSync = function () {
            projectCategoryService.synchronousCategoryCall(function (data) {
                $scope.projectCategories = data.rows;
                $scope.$apply();//To Dynamically update UI
            });
        };

        /**
         * Opens the Fancy box form for user to update
         * @param row
         */
        var openFancyBox = function (row) {
            var modalInstance = $modal.open({
                templateUrl: 'categoryNameForm.html',
                controller: 'ProjectCategoryNameFormCtrl',
                resolve: {
                    projectCategories: function () {
                        return $scope.projectCategories;
                    },
                    projectCategory: function () {
                        return row;
                    }
                }
            });

            modalInstance.result.then(function () {
                getProjectCategoriesSync();
            }, function () {
            });
        };

        getProjectCategories();
    }]);

/**
 * Pop up screen Controller for Project Categories
 */
projectControllerApp.controller('ProjectCategoryNameFormCtrl', [
    '$scope',
    '$modalInstance',
    'projectCategories',
    'projectCategory',
    'ProjectCategoryFactory',
    function ($scope, $modalInstance, projectCategories, projectCategory, ProjectCategoryFactory) {

        // projectFactory Variable
        var projectCategoryService = new ProjectCategoryFactory();

        // Array of All Project Categories.
        $scope.projectCategories = projectCategories;

        // Single category used in new Category form.
        $scope.projectCategory = projectCategory;

        // Errors in user data
        $scope.errors = {
        };

        /**
         * Add New Project Category
         * @constructor
         */
        $scope.addProjectCategory = function () {
            if (isProjectValid($scope.projectCategory)) {
                projectCategoryService.setProjectCategory({
                    "name": $scope.projectCategory.name,
                    "type": "ProjectCategory"
                }).then(function () {
                        $modalInstance.close();
                    });
                $scope.projectCategory.isExisting = false;
                $scope.projectCategory.name = "";
            }
        };

        /**
         *  This function Updates Project Category name
         *  */
        $scope.updateProjectCategory = function () {
            if (isProjectValid($scope.projectCategory)) {
                projectCategoryService.updateProjectCategory($scope.projectCategory)
                    .success(function () {
                        $modalInstance.close();
                    });
                $scope.projectCategory.isExisting = false;
                $scope.projectCategory.id = "";
                $scope.projectCategory.name = "";
            }
        };

        /**
         * Set of validation to perform on project Category
         * @param project
         * @returns {boolean}
         */
        var isProjectValid = function (project) {
            $scope.errors.isEmpty = false;
            $scope.errors.duplicate = false;
            if (project.name == "" || project.name == null) {
                $scope.errors.isEmpty = true;
                return false;
            } else {
                for (var category in $scope.projectCategories) {
                    if ($scope.projectCategories.hasOwnProperty(category) &&
                        $scope.projectCategories[category].value == project.name) {
                        $scope.errors.duplicate = true;
                        return false;
                    }
                }
            }
            return true;
        };

        /**
         * Get backs to the main Screen
         */
        $scope.cancel = function () {
            $modalInstance.dismiss('cancel');
        };

    }
]);

projectControllerApp.controller('ProjectValuesController', [
    'ProjectCategoryValuesServices',
    '$scope',
    '$rootScope',
    '$modal',
    function (ProjectCategoryValuesServices, $scope, $rootScope, $modal) {

        // Project Document Factory Variable
        var projectCategoryService = new ProjectCategoryValuesServices();

        // Single Project
        $scope.project = {

        };

        // All Projects
        var getProjectValues = function () {
            $scope.projects = projectCategoryService.getValues($rootScope.docId);
        };

        /**
         * Watch the global variable docId.
         * if it's changed get the projects related to that id.
         */
        $scope.$watch('docId', function () {
            getProjectValues();
        });

        /**
         * Edit Existing Project Value
         * */
        $scope.editProject = function (project) {
            openFancyBox(project);
        }

        /**
         * Edit Existing Project Value
         * */
        $scope.addProject = function () {
            openFancyBox({key: new Date().getTime(), value: ""});
        }

        /**
         * Opens the Fancy box form for user to update Category Value
         * @param row
         */
        var openFancyBox = function (project) {
            var modalInstance = $modal.open({
                templateUrl: 'projectNameForm.html',
                controller: 'ProjectNameFormCtrl',
                resolve: {
                    projects: function () {
                        return $scope.projects;
                    },
                    project: function () {
                        return project;
                    }
                }
            });

            // Gets the result from the pop up box and save it.
            modalInstance.result.then(function (project) {
                if (project.value != "") {
                    $scope.projects.data[project.key] = project.value;
                } else {
                    delete $scope.projects.data[project.key];
                }
                saveProjects();
            });
        };

        /**
         * Save the Project Category doc
         */
        var saveProjects = function () {
            $scope.projects.save();
        };
    }
]);

/**
 * Pop up screen Controller for Projects
 */
projectControllerApp.controller('ProjectNameFormCtrl', [
    '$scope',
    '$modalInstance',
    'project',
    'projects',
    function ($scope, $modalInstance, project, projects) {

        // Errors in user data
        $scope.errors = {
        };

        // Single Project used in Project Edit form
        $scope.project = project;

        /**
         * Set of validation to perform on project
         * @param project
         * @returns {boolean}
         */
        var isProjectValid = function (project) {
            $scope.errors.isEmpty = false;
            $scope.errors.duplicate = false;
            if (project.value == "" || project.value == null) {
                $scope.errors.isEmpty = true;
                return false;
            } else {
                for (var key in projects.data) {
                    if (projects.data.hasOwnProperty(key) && projects.data[key] == project.value) {
                        $scope.errors.duplicate = true;
                        return false;
                    }
                }
            }
            return true;
        };

        /**
         * If data entered by user is valid.
         * Save it.
         */
        $scope.saveProject = function () {
            if (isProjectValid($scope.project)) {
                $modalInstance.close($scope.project);
            }
        };

        /**
         * If user want to delete the project.
         * Delete it.
         */
        $scope.deleteProject = function () {
            $scope.project.value = "";
            $modalInstance.close($scope.project);
        };

        /**
         * Get backs to the main Screen
         */
        $scope.cancel = function () {
            $modalInstance.dismiss('cancel');
        };
    }
]);