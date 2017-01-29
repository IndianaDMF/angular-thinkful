/**
 * Created by dustinf on 11/5/2015.
 */
(function(){
    angular.module('tipApp')
        .config(['$routeProvider', function($routeProvider) {
            $routeProvider
                .when('/New-Meal', {
                    templateUrl : 'mealInfo.html'
                })
                .when('/My-Earnings', {
                    templateUrl : 'earnings.html'
                })
                .otherwise({
                    templateUrl : 'home.html',
                    controller : 'homeCtrl'
                });
        }])
        .run(function($rootScope, $location, $timeout) {
            clippy.load('Rover', function(agent){
                $rootScope.clippyAgent = agent;
                $rootScope.clippyAgent.show();
                $rootScope.clippyAgent.moveTo(500,450);//TODO: Fix fixed location
            });

            $rootScope.$on('$routeChangeError', function() {
                $location.path("/error");
            });
            $rootScope.$on('$routeChangeStart', function() {
                if($rootScope.clippyAgent) {
                    $rootScope.clippyAgent.play('Searching')
                }
            });
            $rootScope.$on('$routeChangeSuccess', function() {
                if($rootScope.clippyAgent) {
                    $timeout(function() {
                        $rootScope.clippyAgent.play('CharacterSucceeds');
                    }, 1000);
                }
            });
        });
})();