var angular = require('angular');
var megaVideoDirectvie = require('./megaVideo-Dir.js');
var app = angular.module('app',[]);

app.directive('megaVideo', ['$sce', megaVideoDirectvie]);