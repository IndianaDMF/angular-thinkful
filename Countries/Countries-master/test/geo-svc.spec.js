

describe('geo service', function () {
    var geoService;
    var $httpBackend, $rootScope, $q, localDatastore, config, x2js;

    beforeEach(function () {
        module('ccApp');
    });

    beforeEach(inject(function ($injector) {
        $httpBackend = $injector.get('$httpBackend');
        $rootScope = $injector.get('$rootScope');
        $q = $injector.get('$q');
        geoService = $injector.get('geo');
    }));

    afterEach(function () {
        $httpBackend.verifyNoOutstandingExpectation();
        $httpBackend.verifyNoOutstandingRequest();
    });

    it('should be defined', function () {
        expect(geoService).toBeDefined();
    });

    it('should get country details', function () {
        expect(geoService.getDetails).toBeDefined();
    });

    it('should get Neighbors', function () {
        expect(geoService.getNeighbors).toBeDefined();
    });

    it('should get countries', function () {
        expect(geoService.getCountries).toBeDefined();
    });

    it('should get capital', function () {
        expect(geoService.getCapital).toBeDefined();
    });
});
