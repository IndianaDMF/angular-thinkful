'use strict';
// @ngInject
module.exports = function ($scope, $route) {
    var self = this;
    var data = $route.current.locals.countryDetails;
    var country = data[0];
    var capital = data[1];
    var neighbors = data[2];
    
    self.parsePopulation = function(data) {
        if (data !== undefined && data.population !== undefined) {
            return data.population;
        }
        return 'N/A';
    };

    self.parseNeighbors = function(data) {
        var neighbors = '';
        if (data !== undefined && data.geonames !== undefined && data.geonames.length > 0) {
            for (var i = 0; i < 3; ++i) {
                var current = data.geonames[i];
                if (current !== undefined) {
                    neighbors += current.countryName + ' ';
                }
            }
        }

        if (neighbors === '') {
            neighbors = 'None';
        }

        return neighbors;
    };
    
    country.capitalPopulation = self.parsePopulation(capital.data.geonames[0]);
    country.neighbors = self.parseNeighbors(neighbors.data);
    $scope.country = country;
    $scope.showTransistion(false);
};