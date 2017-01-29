'use strict';
// @ngInject
module.exports = function ($scope, $route) {
    var self = this;
    
    $scope.getDetails = function(country) {
        var url = '/countries/:' + country.countryCode + '/capital';
        this.go(url);
    }
    
    self.getRouteData = function($route){
        if($route !== undefined && 
        $route.current !== undefined && 
        $route.current.locals !== undefined &&
        $route.current.locals.countryData !== undefined){
            return $route.current.locals.countryData.geonames.country; 
        }
        
        return null;
    };  
    
    var routeData = self.getRouteData($route);
    if(routeData !== null){
        $scope.countries = routeData;         
    };
    
    $scope.showTransistion(false);
};