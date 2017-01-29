/**
 * Created by dustinf on 11/5/2015.
 */
(function(){
    'use strict';

    angular.module('tipApp')
        .controller('tipCtrl', ['$scope', '$log', function ($scope, $log) {
            $scope.submitted=false;
            $scope.calculate = function () {
                $scope.submitted=true;
                if($scope.$$childTail.detailsForm.$valid) {
                    var taxRate = $scope.meal.taxRate / 100;
                    var tipRate = $scope.meal.tipRate / 100;

                    //charges
                    var subTotal = $scope.meal.price + ($scope.meal.price * taxRate);
                    $scope.charges.subTotal = subTotal;

                    var tip = subTotal * tipRate;
                    $scope.charges.tip = tip;
                    $scope.charges.total = tip + subTotal;

                    //running totals
                    $scope.earnings.numberOfMeals = $scope.earnings.numberOfMeals + 1;
                    $scope.earnings.tipTotal = $scope.earnings.tipTotal + tip;
                    $scope.earnings.tipPerMeal = $scope.earnings.tipTotal / $scope.earnings.numberOfMeals;
                }
                $log.info($scope.$$childTail.detailsForm.$valid);
            };

            $scope.clearDetails = function () {
                clearAll();
                resetForm();
            };

            $scope.cancel = function(){
                setMealDefaults();
            };

            //private
            function clearAll(){
                $scope.submitted=false;
                setMealDefaults();
                setEarningsDefaults();
                setChargesDefaults();
            }

            function resetForm(){
                setEarningsDefaults();
            }

            function setMealDefaults(){
                $scope.meal = {};
                //test values
                //$scope.meal.price = 15.00;
                //$scope.meal.taxRate = 9.87;
                //$scope.meal.tipRate = 20;
            }

            function setEarningsDefaults(){
                $scope.earnings = {};
                $scope.earnings.numberOfMeals = 0;
                $scope.earnings.tipTotal = 0;
                $scope.earnings.tipPerMeal = 0;
            }

            function setChargesDefaults(){
                $scope.charges = {};
                $scope.charges.subTotal = 0;
                $scope.charges.tip = 0;
                $scope.charges.total = 0;
            }

            clearAll();
    }]);
})();