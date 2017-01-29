describe('api service', function () {
    var apiSvc;
    var $httpBackend, $rootScope, $q;

    beforeEach(function () {
        module('pnmApp');
    });

    beforeEach(inject(function ($injector) {
        $httpBackend = $injector.get('$httpBackend');
        $rootScope = $injector.get('$rootScope');
        $q = $injector.get('$q');
        apiSvc = $injector.get('apiSvc');
    }));

    afterEach(function () {
        $httpBackend.verifyNoOutstandingExpectation();
        $httpBackend.verifyNoOutstandingRequest();
    });

    it('should be defined', function () {
        expect(apiSvc).toBeDefined();
    });

    it('get phone list should exist', function () {
        expect(apiSvc.getPhoneMaster).toBeDefined();
    });

    it('get data should exist', function () {
        expect(apiSvc.getData).toBeDefined();
    });
    
    it('save phone should exist', function () {
        expect(apiSvc.savePhone).toBeDefined();
    });
});
