
angular.module('pnmApp', ['ngMessages',
                            'toaster',
                            'ngAnimate',                            
                            'ui.router', 
                            'ui.bootstrap', 
                            'ui.grid', 
                            'LocalStorageModule'])
    .factory('apiSvc', function ($http, $q, localStorageService) {
        var phoneMasterKey = 'phonesMaster';
        var service = {};
        service.getData = function (listType) {
            var defer = $q.defer();
            var url = 'data.json';
            $http({ method: 'GET', url: url })
                .then(function (response) {
                    defer.resolve(response.data[listType]);
                })
            return defer.promise;
        }

        service.getPhoneMaster = function () {
            var defer = $q.defer();
            var temp = localStorageService.get(phoneMasterKey);
            if (temp === null) {
                // initialize with json data
                service.getData('numbers').then(function (data) {
                    localStorageService.set(phoneMasterKey, JSON.stringify(data));
                    defer.resolve(data);
                });
            } else {
                defer.resolve(JSON.parse(temp));
            }
            return defer.promise;
        }
        
        service.getProfile = function(id){
            var defer = $q.defer();
            service.getData('profiles').then(function(data){
                if(data){
                    for(var outer = 0; outer< data.length; ++outer){
                        var pairs = data[outer].pairedDnis;
                        for(var inner = 0; inner < pairs.length; ++inner){
                            if(pairs[inner].id == id){
                                defer.resolve(data[outer]);
                                break;
                            }
                        }
                    }
                    defer.resolve({valid:true,message:'no match'});
                }
                else{
                    defer.resolve({valid:false,message:'no data'});
                }
            });
            return defer.promise;
        }
        
        service.saveProfile = function(profile){
            var defer = $q.defer();
            // not doing anything at this point
            return defer.promise;
        }

        service.savePhone = function (phone) {
            var defer = $q.defer();            
            service.getPhoneMaster().then(function(data){                
                var isDupe = false;
                for(var i = 0; i < data.length; ++i){
                    if(data[i]['number'] === phone['number']){
                        isDupe = true;
                        break;
                    }
                }    
                if(!isDupe){
                    phone.id = data.length + 1;
                    phone.status = 'Unassigned';
                    phone.route = '';
                    data.push(phone);
                    localStorageService.set(phoneMasterKey, JSON.stringify(data));  
                    defer.resolve({valid:true, message: 'Phone number added!'});
                }
                else{
                    defer.resolve({valid:false, message: 'Duplicate phone number'})
                }                
            });
            return defer.promise;
        }
        return service;
    })
    .controller('mainCtrl', 
        function ($scope, $location, toaster) {
        $scope.tabs = [
            { link: 'numbers', label: 'Numbers' },
            { link: 'admin', label: 'Admin' }
        ];
        
        if($location.$$path === '/admin'){
            $scope.selectedTab = $scope.tabs[1];            
        }
        else{
            $scope.selectedTab = $scope.tabs[0];    
        }        
        
        $scope.setSelectedTab = function (tab) {
            $scope.selectedTab = tab;
        }
        $scope.tabClass = function (tab) {
            if ($scope.selectedTab === tab) {
                return 'active';
            } else {
                return '';
            }
        }  
        
        $scope.notify = function(state, message){
            toaster.pop(state, '', message);
        }        
    })
    .controller('numbersCtrl', function ($scope, apiSvc, uiGridConstants) {
        $scope.showInfo = function(entity){
            console.log(entity);
        };
        
        $scope.numberOptions = {
            enableSorting: true,
            enableFiltering: true
        };

        $scope.numberOptions.columnDefs = [
            { field: 'id', visible: false },
            { field: 'number', 
                displayName: 'Number',
                sort:{direction:uiGridConstants.ASC, priority:1},
                cellTemplate: '<a ui-sref="numbers.details({id:row.entity.id})">{{row.entity.number}}</a>'},
            { field: 'route' },
            { field: 'company' },
            { field: 'department' },
            { field: 'carrier' },
            { field: 'serviceType' },
            // { field: 'status' }, todo: mark number as red if inactive otherwise do nothing
            { field: 'notes' }
        ];

        apiSvc.getPhoneMaster().then(function (data) {
            $scope.numberOptions.data = data;
        });    
       
    })
    .controller('routingCtrl', function($scope, $stateParams, apiSvc){
        $scope.id=$stateParams.id;
        apiSvc.getData('numbers').then(function(data){
            for(var i = 0; i<data.length; ++i){
                if(data[i].id == $scope.id){
                    $scope.route = data[i].route;
                    break;
                }
            }
        })
    })
    .directive('admin', function($q, apiSvc,result){
        return {
            restrict: 'E',
            templateUrl: 'templates/admin.html',
            scope:{
                mode:'@',
                notifyFn: '&onNotify'
            },           
            link: function(scope, elem, attrs){
                $q.all([apiSvc.getData('carriers'),
                            apiSvc.getData('companies'),
                            apiSvc.getData('serviceTypes'),
                            apiSvc.getData('status')])
                .then(function(resolveData){
                    scope.carriers = resolveData[0];
                    scope.serviceTypes = resolveData[2];
                    scope.statuses = resolveData[3];
                    scope.companies = resolveData[1];
                });
                
                var mode = attrs.mode;
                switch(mode){
                    case 'create':
                        scope.title='Enter Phone Information';
                        scope.saveBtn='Create';
                        break;
                    case 'edit':
                        scope.title='Edit Phone Information';
                        scope.saveBtn='Save';
                        break;                    
                }

                scope.submitted=false;

                scope.save = function () {            
                    scope.submitted=true;       
                    if (scope.phoneForm.$valid) {
                        apiSvc.savePhone(scope.phone).then(function(data){
                            if(data.valid){
                                scope.submitted=false;    
                                if(scope.notifyFn !== undefined){                                
                                    scope.notifyFn({state: result.success, message: data.message});
                                }   
                            } 
                            else{
                                if(scope.notifyFn !== undefined){                                
                                    scope.notifyFn({state: result.fail, message: data.message});
                                }                                 
                            }   
                        });                 
                    }
                };

                scope.reset = function () {
                    scope.phone = {};
                    scope.submitted=false;
                    scope.phoneForm.$setPristine();
                    scope.phoneForm.$setUntouched();
                };
            }
        }
    })
    .directive('attendant', function(apiSvc){
        return {
            restrict: 'E',
            templateUrl: 'templates/attendantDetails.html',
            scope: {
                id: '@'
            },
            link: function(scope,elem,attrs){
                scope.dnisOptions = {};
                scope.attributeOptions = {};
                scope.attendant = {};
                   
                scope.attendant.hubs = [];
                apiSvc.getData('hubs').then(function(data){                    
                    scope.attendant.hubs = data;
                });
                
                apiSvc.getProfile(scope.id).then(function(data){                    
                    scope.attendant.description = data.description;                    
                    var hubs = scope.attendant.hubs;
                    for(var i = 0; i<hubs.length; ++i){
                        if(hubs[i].number === data.hub){
                            scope.attendant.hub = {hubId: hubs[i].hubId, number:hubs[i]['number'] };                            
                            break;
                        }
                    }
                                
                    scope.dnisOptions.columnDefs=[
                        { field: 'id', visible: false },
                        { field: 'number'}
                    ];                    
                    
                    scope.attributeOptions.columnDefs=[
                        { field: 'key' },
                        { field: 'value' }
                    ];
                    scope.dnisOptions.data = data.pairedDnis;
                    scope.attributeOptions.data = data.attributes;
                })
                
                scope.save = function(){
                    apiSvc.saveProfile(scope);                    
                }                   
            }           
        }
    })
    .config(function($stateProvider, $urlRouterProvider){
        $urlRouterProvider            
            .otherwise('/numbers');                
        
        $stateProvider
            .state('admin', {                       
                url: '/admin',
                templateUrl: 'templates/adminTab.html'
            })
            .state('numbers',{
                url:'/numbers',
                controller: 'numbersCtrl',
                templateUrl: 'templates/numbersTab.html'
            })
            .state('numbers.details', {
               url:'/details/:id',
               controller: 'routingCtrl',
               templateUrl: 'templates/routing.html'
            })            
    }) 
    .config(function (localStorageServiceProvider) {
        localStorageServiceProvider.setPrefix('pnm');
    })   
    .value('result', {         
         success:'success',
         fail:'error'
    }) 
    .filter('tel', function(){
        return function(input){
            if(!input) {return '';}
            
            var value = input.toString().trim().replace(/^\+/, '');
            if(value.match(/[^0-9]/)){
                return input;
            }
            var area, localExch, subscriber;
            area = input.slice(0,3);
            localExch = input.slice(3,6);
            subscriber = input.slice(6);
            return area + '-' + localExch + '-' + subscriber;            
        }
    });
