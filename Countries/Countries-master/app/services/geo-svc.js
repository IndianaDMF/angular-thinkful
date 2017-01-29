'use strict';
// @ngInject
module.exports = function ($http, $q, localStorageService, config, x2js) {
    var factory = {};

    var countryData;
    var countriesCache = 'countries';
    var neighborCache = 'neighbors:';
    var captialCache = 'capital:';

    function getUrl(endpoint) {
        var url = config.GeoProvider.URL + '/' + endpoint + 'username=' + config.GeoProvider.username;
        return url;
    }

    function getSearchQuery(capital) {
        /*
         http://www.geonames.org/export/geonames-search.html
         Url	»	api.geonames.org/search?
         Result	»	returns the names found for the searchterm as xml or json document, the search is using an AND operator

         Hint: you'll probably want to use: q, country, name_equals, and isNameRequired.
         http://api.geonames.org/searchJSON?q=london&maxRows=10&username=demo
         */
        return config.GeoProvider.URL + '/' + config.GeoProvider.Search + 'q=' + encodeURI(capital) + '&name_equals' + encodeURI(capital) + '&isNameRequired=true' + '&username=' + config.GeoProvider.username;
    }

    function getNeighborQuery(geonameId) {
        /*
         Url : api.geonames.org/neighbours?
         api.geonames.org/neighboursJSON?
         Parameters :
         geonameId : the geonameId for the neighbours (country or ADM)
         country: the country code (alternative parameter instead of the geonameId)
         Result : returns the neighbours of a toponym, currently only implemented for countries

         http://api.geonames.org/neighbours?geonameId=2658434&username=demo
         */
        return getUrl(config.GeoProvider.Neighbour) + '&geonameId=' + geonameId;
    }

    function findCountry(countryList, countryCode) {
        for (var i = 0; i < countryList.length; ++i) {
            var temp = countryList[i];
            if (countryCode === temp.countryCode) {
                return temp;
            }
        }
    }

    function getCachedCountries() {
        return JSON.parse(localStorageService.get(countriesCache));
    }

    factory.getCapital = function (country) {
        var url = getSearchQuery(country.capital);
        var defer = $q.defer();
        var temp = JSON.parse(localStorageService.get(captialCache + country.capital));
        if (temp !== null) {
            defer.resolve(temp);
            return defer.promise;
        }

        $http({
            method: 'GET',
            url:
             url
        }).then(function success(data) {
            localStorageService.set(captialCache + country.capital, JSON.stringify(data));
            defer.resolve(data);
        });
        return defer.promise;
    };

    factory.getCountries = function () {
        /*
         Url : api.geonames.org/countryInfo?
         Parameters : country (default = all countries)
         Example : http://api.geonames.org/countryInfo?username=demo
         */
        var defer = $q.defer();
        var temp = getCachedCountries();
        if (temp !== null) {
            defer.resolve(temp);
            return defer.promise;
        }

        $http({
            method: 'GET',
            url: getUrl(config.GeoProvider.CountryInfo)
        }).then(function success(data) {
            countryData = x2js.xml2js(data.data);
            localStorageService.set(countriesCache, JSON.stringify(countryData));
            defer.resolve(countryData);
        });
        return defer.promise;
    };

    factory.getNeighbors = function (id) {
        var url = getNeighborQuery(id);
        var defer = $q.defer();
        var temp = JSON.parse(localStorageService.get(neighborCache + id));
        if (temp !== null) {
            defer.resolve(temp);
            return defer.promise;
        }

        $http({
            method: 'GET',
            url: url
        }).then(function success(data) {
            localStorageService.set(neighborCache + id, JSON.stringify(data));
            defer.resolve(data);
        });

        return defer.promise;
    };

    factory.getDetails = function (countryCode) {
        // assuming we dont have a deep link to the view that consumes this on a fresh browser instance
        // then I can trust we have already cached the countries
        var countries = getCachedCountries();
        var country = findCountry(countries.geonames.country, countryCode);
        var countryDefer = $q.defer();
        countryDefer.resolve(country);

        var capitalPromise = factory.getCapital(country);
        var neighborPromise = factory.getNeighbors(country.geonameId);
        return $q.all([countryDefer.promise, capitalPromise, neighborPromise]);
    };

    return factory;
};
