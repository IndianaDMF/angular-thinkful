var angular = require('angular');
var makeEditableModule = require('./makeEditableDir.js');
var appCtrl = require('./app-ctrl.js');
var app = angular.module('app',[]);

app.controller('ctrl', appCtrl);
app.directive('makeEditable', makeEditableModule);