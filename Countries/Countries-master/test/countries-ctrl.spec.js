
describe('countries', function () {
	var controller;	
	var $scope;
	// mocks
	var mockShowTS = jasmine.createSpy('showTransistion');	
	var mockGetDetails = jasmine.createSpy('getDetails');
	var mockGo = jasmine.createSpy('go');
	
	// fakes
	var fakeCountry = ['one', 'two'];
	var fakeRoute = {
		current: {
			locals: {
				countryData: {
					geonames: {
						country: fakeCountry
					}
				}
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
			$rootScope.go = mockGo;
			
			$scope = $rootScope.$new();
			$scope.getDetails = mockGetDetails;

			controller = $controller('ccCountriesCtrl', {
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
		
		it('should have countries', function(){
			expect($scope.countries).toBeDefined();
		});
		
		it('should get details', function(){
			$scope.getDetails(jasmine.any({}));
			expect(mockGo).toHaveBeenCalled();
		});
	});
});