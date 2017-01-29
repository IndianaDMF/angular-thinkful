'use strict';
// @ngInject

module.exports = function(){
	return{
		restrict: 'A',
		templateUrl: 'makeEditable.html',
		transclude: true,
		scope: true,
		link:function(scope, elem, attrs){
			scope.editable=false;
		}
	}
}