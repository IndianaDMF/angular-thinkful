
describe('countries', function () {
	var controller;
	var $scope;
	// mocks	
	var mockGo = jasmine.createSpy('go');
	
	beforeEach(function () {
		module('ccApp');
	});

	describe('controller', function () {
		beforeEach(inject(function ($rootScope, $location, $controller) {			
			$scope = $rootScope.$new();
			controller = $controller('ccCtrl', {
				$scope: $scope,
				$location: $location
			});
		}));

		it('should exist', function () {
			expect(controller).toBeDefined();
		});

		it('scope has isLoading', function () {
			$scope.showTransistion(true);
			expect($scope.isLoading).toEqual(true);
		});
		
		it('go should show transition', function(){
			$scope.go(jasmine.any(String));
			expect($scope.isLoading).toEqual(true);
		});
	});
});