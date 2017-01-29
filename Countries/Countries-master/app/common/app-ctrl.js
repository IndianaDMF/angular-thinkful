'use strict';
// @ngInject
module.exports = function ($scope, $location){    
    $scope.showTransistion = function(show){        
        $scope.isLoading = show;
    };

    $scope.go = function( path ){
        $scope.showTransistion(true);
        $location.path(path);
    };
};

