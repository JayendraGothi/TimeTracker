/**
 * Created by jayendra on 12/3/14.
 */

/*
 * This Module will hold all the constants required in this project
 * */
var DBConstantVariablesModule = angular.module('DBConstantVariablesModule', []);

DBConstantVariablesModule.constant('DBConstants', {
    DBServerUrl: 'http://127.0.0.1:5984',
    DBName: 'timetracker',
    CategoryDesign: 'Categorys',
    AllCategoriesView: 'all_categories',
    UpdateCategoryDoc: 'updateProjectCategoryName',
    UserDocShow: 'userDoc',
    UserDocLinkageDocId: 'UserDocLinkage',
    UserTimeDataShow: 'userTimeData'
});