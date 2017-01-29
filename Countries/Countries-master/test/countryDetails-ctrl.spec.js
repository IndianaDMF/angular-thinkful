
describe('country details', function () {
	var controller;
	var $scope;
	// mocks
	var mockShowTS = jasmine.createSpy('showTransistion');
	// var mockparsePopulation = jasmine.createSpy('parsePopulation');
	// var mockParseNeighbors = jasmine.createSpy('parseNeighbors');
	
	// fakes
	var fakeCountry = {}
	var fakeCapital = {
		data: {
			geonames: ['']
		}
	}
	var fakeNeighbors = {
		neighbors: {
			data: {}
		}
	}
	var fakeRoute = {
		current: {
			locals: {
				countryDetails: [fakeCountry, fakeCapital, fakeNeighbors]
			}
		}
	}

	beforeEach(function () {
		module('ccApp');
	});

	describe('controller', function () {
		beforeEach(inject(function ($rootScope, $controller) {
			//parent
			$rootScope.showTransistion = mockShowTS;
			$scope = $rootScope.$new();			

			controller = $controller('ccDetailsCtrl', {
				$scope: $scope,
				$route: fakeRoute
			});			
		}));

		it('should exist', function () {
			expect(controller).toBeDefined();
		});

		it('show transistion called', function () {
			expect(mockShowTS).toHaveBeenCalledWith(false);
		});

		it('should have country', function () {
			expect($scope.country).toBeDefined();
		});
	});
});