'use strict';
// @ngInject
module.exports = function ($routeProvider) {
    $routeProvider
        .when('/countries', {
            templateUrl: 'countries/countries.html',
            controller: 'ccCountriesCtrl',
            resolve: {
                countryData: function (geo) {
                    return geo.getCountries();
                }
            }
        })
        .when('/countries/:country/capital', {
            templateUrl: 'details/countryDetails.html',
            controller: 'ccDetailsCtrl',
            resolve: {
                countryDetails: function ($route, geo) {
                    var countryCode = $route.current.params.country.replace(':', '');
                    return geo.getDetails(countryCode);
                }
            }
        })
        .otherwise({
            templateUrl: 'home/home.html',
            controller: 'ccHomeCtrl'
        });
};
