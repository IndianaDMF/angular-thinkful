
describe('attendant directive', function () {    
    var $compile, $scope, $httpBackend, $q, mockData, mockApiSvc;           
     mockData = {
        "hubs": [{"id": 1,"name": "hubs"}]
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
        var deferred = $q.defer();
        mockApiSvc = { 'getData': jasmine.createSpy('getData spy') };
        mockApiSvc.getData.and.returnValue(deferred.promise);        
    }));
    
    it('should create the form', inject(function() {            
        var compileFn = $compile('<attendant id="{{id}}"></attendant>');
        var elem = compileFn($scope);        
        $scope.$digest();
        expect(elem.find('form').length).toBe(1);
    }));
    
     it('should get profile data by id', inject(function() {            
        var compileFn = $compile('<attendant id="5"></attendant>');
        var elem = compileFn($scope);        
        $scope.$digest();
        expect(elem.isolateScope().id).toEqual('5');
    }));
    
    //todo: more tests. tired of it for now    
    
    afterEach(function(){
       $httpBackend.flush();
       $httpBackend.verifyNoOutstandingRequest();
       $httpBackend.verifyNoOutstandingExpectation(); 
    });
});