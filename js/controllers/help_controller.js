/**
 * Created by Dell6440 on 2017/5/23.
 */
myApp.controller('helpCtrl',['$scope','$location','$http','$rootScope','$state',function ($scope,$location,$http,$rootScope,$state) {
    $scope.goNext = function(urls){
    	$state.go(urls);
    	if(urls=='faq'){
    		clientInterface.h5HelpCenterProblem({} ,function (res) {});
    	};
    };
}]);