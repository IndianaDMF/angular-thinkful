
describe('main', function () {
	var controller;
	var $scope;
	// mocks	
	var mockToastr = {
        pop: function(state, title, message){
            
        }
    }
	
	beforeEach(function () {
		module('pnmApp');
	});

	describe('controller', function () {
		beforeEach(inject(function ($rootScope, $location, $controller) {			
			$scope = $rootScope.$new();
			controller = $controller('mainCtrl', {
				$scope: $scope,
				$location: $location,
                toaster: mockToastr
			});
		}));

		it('should exist', function () {
			expect(controller).toBeDefined();
		});

		it('scope has tabs', function () {			
			expect($scope.tabs).toBeDefined();
            expect($scope.tabs.length).toBe(2);
		});
		
		it('should be able to select a tab', function(){			
			expect($scope.setSelectedTab).toBeDefined();
		});
        
        it('should be able to set active tab', function(){
            $scope.selectedTab = 'blah';
            var actual = $scope.tabClass('blah');
            expect(actual).toBe('active');
        });
        
        it('should be able to set inactive tab', function(){
            $scope.selectedTab = 'blah';
            var actual = $scope.tabClass('pants');
            expect(actual).toBe('');
        });
        
        it('notify should exist', function(){
           expect($scope.notify).toBeDefined(); 
        });
        
        it('notification should pop a message', function(){
           spyOn(mockToastr, 'pop');
           $scope.notify('someState', 'someMessage');
           expect(mockToastr.pop).toHaveBeenCalled(); 
           expect(mockToastr.pop).toHaveBeenCalledWith('someState', '', 'someMessage');
        });        
	});
});