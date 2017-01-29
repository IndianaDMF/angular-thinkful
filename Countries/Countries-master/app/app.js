'use strict';

var angular = require('angular');    
var X2JS = require('x2js');

require('angular-route');
require('angular-local-storage');

var appConfig = require('./config.js');

// controllers
var commonCtrl = require('./common/app-ctrl.js');
var countriesCtrl = require('./countries/countries-ctrl.js');
var homeCtrl = require('./home/home-ctrl.js');
var countryDetailsCtrl = require('./details/countryDetails-ctrl.js');

// services
var geoService = require('./services/geo-svc.js');

// route
var routing = require('./common/app-rt.js');

var app =
    angular.module('ccApp', [
        'ngRoute',
        'LocalStorageModule'
    ]);

app.config(routing);
app.config(function (localStorageServiceProvider) {
    localStorageServiceProvider.setPrefix('countries');
});

app.value('config', appConfig);
app.value('x2js', new X2JS());

app.factory('geo', geoService);

app.controller('ccCtrl', commonCtrl);
app.controller('ccHomeCtrl', homeCtrl);
app.controller('ccDetailsCtrl', countryDetailsCtrl);
app.controller('ccCountriesCtrl', countriesCtrl);