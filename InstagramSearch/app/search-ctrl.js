/**
 * Created by dustinf on 10/31/2015.
 */
(function(){
    angular.module('searchApp')
        .controller('searchCtrl', ['$scope', '$http','$log', '$q','config', function($scope, $http, $log, $q,config){
            $scope.photos = [];

            function wait() {
                var defer = $q.defer();
                setTimeout(function(){
                    defer.resolve();
                }, 5000);
                return defer.promise;
            }

            $scope.search = function(){
                if($scope.searchForm.$valid){
                    $scope.photos = [];
                    var q = $scope.query;
                    $scope.query = '';
                    $scope.queryText = "Searching Instagram for photos tagged with '" + q + "'";
                    var url = "https://api.instagram.com/v1/tags/"+q+"/media/recent?callback=JSON_CALLBACK&client_id=" + config.userId;

                    $http({
                        method:'JSONP',
                        url: url}
                    ).then(function successCallback(response){
                            if(response.data.meta.code !== 400) {
                                var results = response.data.data;
                                if (results.length > 0) {
                                    for (var i = 0; i < results.length; ++i) {
                                        var imageObj = results[i];
                                        $scope.photos.push({
                                            link: imageObj.link,
                                            likes: imageObj.likes.count,
                                            source: imageObj.images.low_resolution.url
                                        });
                                    }
                                    $scope.numberOfPhotos = "Found " + results.length + " images";
                                } else {
                                    $scope.queryText = "Nothing found for " + q;
                                }
                            }else{
                                $scope.queryText = "Search for " + q + " not allowed";
                            }
                        },function errorCallback(response){
                            $log.error(response);
                            $scope.queryText = "An error has occurred please check your query and try again";
                        })
                    .then(wait).then(function(){
                            $scope.queryText='';
                        });
                }
            };
        }]);
})();