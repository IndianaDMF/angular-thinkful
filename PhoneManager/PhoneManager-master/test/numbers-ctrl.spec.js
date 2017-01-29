
describe('numbers', function () {
    var controller, $scope, $q, deferred;
    // mocks	
    var mockApiSvc;
    var mockPhoneList = {

    };

    beforeEach(function () {
        module('pnmApp');
    });

    describe('controller', function () {
        beforeEach(inject(function (_$q_, _$rootScope_, _$controller_) {
            $scope = _$rootScope_.$new();
            $q = _$q_;
            deferred = $q.defer();
            mockApiSvc = { 'getPhoneMaster': jasmine.createSpy('getPhoneMaster spy') };
            mockApiSvc.getPhoneMaster.and.returnValue(deferred.promise);
            controller = _$controller_('numbersCtrl', {
                $scope: $scope,
                apiSvc: mockApiSvc
            });
        }));

        it('should exist', function () {
            expect(controller).toBeDefined();
        });

        it('scope has grid options', function () {
            expect($scope.numberOptions).toBeDefined();
            expect($scope.numberOptions.enableSorting).toBe(true);
            expect($scope.numberOptions.enableFiltering).toBe(true);
        });

        it('grid has columns defined', function () {
            expect($scope.numberOptions.columnDefs).toBeDefined();
            expect($scope.numberOptions.columnDefs.length).toBe(8);
        });

        it('scope has data', inject(function ($rootScope) {            
            deferred.resolve(mockPhoneList);
            $rootScope.$apply();
            expect($scope.numberOptions.data).toBeDefined();
        }));
    });
});