(function(){
    angular.module('madLibsApp')
        .controller('storyCtrl', ['$scope','$log', function ($scope,$log) {
            $scope.formState="wordEntry";

            $scope.appReset = function(){
                $scope.formState="wordEntry";
                $scope.resetWords();
            };

            var formHelper = [];

            $scope.resetWords = function(){
                $scope.firstName="";
                $scope.job="";
                $scope.dirtyTask="";
                $scope.tediousTask="";
                $scope.celebrity="";
                $scope.skill="";
                $scope.adjective="";
                $scope.obnoxiousPerson="";
                $scope.number="";
                $scope.gender={};
            };

            $scope.$watch('gender.name', function (gender) {
                if ("male" === gender) {
                    $scope.gender.name = "male";
                    $scope.gender.pronounNominative = "he";
                    $scope.gender.possessivePronoun = "his";
                    $scope.gender.pronoun = "him";
                }
                else if($scope.wordForm.$pristine){
                    //do not default to female
                    $scope.gender={};
                }
                else {
                    $scope.gender.name = "female";
                    $scope.gender.pronounNominative = "she";
                    $scope.gender.pronoun = "her";
                    $scope.gender.possessivePronoun = "her";
                }
            });

            $scope.submitWords = function () {
                $log.info('wordForm.valid:' + $scope.wordForm.$valid);
                if(formHelper.length===0) {
                    formHelper = [
                        $scope.wordForm,
                        $scope.wordForm.firstName,
                        $scope.wordForm.job,
                        $scope.wordForm.dirtyTask,
                        $scope.wordForm.tediousTask,
                        $scope.wordForm.celebrity,
                        $scope.wordForm.skill,
                        $scope.wordForm.obnoxiousPerson,
                        $scope.wordForm.adjective,
                        $scope.wordForm.number
                    ];
                }

                if($scope.wordForm.$valid){
                    $scope.formState = "story";
                }
            };

            $scope.setTestwords = function(){
                $scope.firstName="Dustin";
                $scope.job="receiver";
                $scope.dirtyTask="garbage duty";
                $scope.tediousTask="inventory";
                $scope.celebrity="Mathew";
                $scope.skill="CTO";
                $scope.adjective="great";
                $scope.obnoxiousPerson="Fran Drescher";
                $scope.number=100;
            };

            $scope.setTestwords();
    }]);

})();