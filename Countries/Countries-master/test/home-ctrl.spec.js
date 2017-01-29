
describe('home controller', function(){
	var controller = null;
	var $scope = null;
	var showTS = jasmine.createSpy('showTransistion');
	
	beforeEach(function(){
		module('ccApp')
	});
	
	it('should exist', inject(function($rootScope, $controller){
		$rootScope.showTransistion = showTS;
		$scope = $rootScope.$new();
		controller = $controller('ccHomeCtrl',{
			$scope: $scope
		});
		
		expect(controller).toBeDefined();
	}));
	
	it('show transistion called', inject(function ($rootScope, $controller) {		
		$rootScope.showTransistion = showTS;
		$scope = $rootScope.$new();				

		controller = $controller('ccHomeCtrl', {
			$scope: $scope
		});
		
		expect(showTS).toHaveBeenCalledWith(jasmine.any(Boolean));
	}));
});

