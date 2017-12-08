/**
 * Created by Dell6440 on 2017/7/19.
 */
myApp.controller('hseCtrl',['$scope','$location','$http','$rootScope','$state',function ($scope,$location,$http,$rootScope,$state) {
	$scope.goNext = function(urls){
    	$state.go(urls);
    };
}]);
