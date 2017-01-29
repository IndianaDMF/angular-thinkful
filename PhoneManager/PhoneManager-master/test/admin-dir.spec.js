
describe('admin directive', function () {    
    var $compile, $scope, $httpBackend, $q, mockData;
    mockData = {
        "carriers": [{"id": 1,"name": "carrier"}],
        "companies":[{"id": 1,"name": "company"}],
        "serviceTypes":[{"id": 1,"name": "type"}]
    };
    
    beforeEach(function () {
		 module('pnmApp','templates');
	});
    
    beforeEach(inject(function(_$q_, _$rootScope_, _$compile_, _$httpBackend_) {
        $q = _$q_;
        $compile = _$compile_;
        $scope = _$rootScope_.$new();        
        $httpBackend = _$httpBackend_;                
        $httpBackend.when('GET','data.json').respond(mockData);
        $scope.save = jasmine.createSpy("save spy").and.returnValue();
        $scope.notifyFn = jasmine.createSpy("notifyFn spy");
        $scope.$apply();
    }));
    
    it('should create the form', inject(function() {        
        var compileFn = $compile("<admin mode='create' on-notify='notify(state, message)'></admin>");
        var elem = compileFn($scope); 
        $httpBackend.flush();       
        $scope.$digest();
        expect(elem.find('form').length).toBe(1);
    }));
    
    it('form should have selects', inject(function() {        
        var compileFn = $compile("<admin mode='create' on-notify='notify(state, message)'></admin>");
        var elem = compileFn($scope); 
        $httpBackend.flush();       
        $scope.$digest();
        expect(elem.find('select').length).toEqual(3);
        expect(elem.find('select').eq(0).find('option').length).toEqual(2);
        expect(elem.find('select').eq(1).find('option').length).toEqual(2);
        expect(elem.find('select').eq(2).find('option').length).toEqual(2);
        expect(elem.isolateScope().submitted).toBe(false);            
    }));
    
    it('invalid form should notifiy', inject(function() {        
        var compileFn = $compile("<admin mode='create' on-notify='notify(state, message)'></admin>");
        var elem = compileFn($scope); 
        $httpBackend.flush();   
        $scope.$digest();
        elem.isolateScope().number = '555';      
        elem.isolateScope().phoneForm.$valid=false;  
        elem.find('button').eq(0).click();
        $scope.$digest();
        expect(elem.isolateScope().submitted).toBe(true);
        //TODO
        //expect($scope.notifyFn).toHaveBeenCalled();                    
    }));
    
    afterEach(function(){
       $httpBackend.verifyNoOutstandingRequest();
       $httpBackend.verifyNoOutstandingExpectation(); 
    });
});