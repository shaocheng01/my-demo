/**
 * Created by Dell6440 on 2017/6/9.
 */
myApp.controller('licenseCtrl',['$scope','$location','$http','$rootScope','$state','$stateParams',function ($scope,$location,$http,$rootScope,$state,$stateParams) {

    $scope.data = {
        licenseImg: '',
        shopId: ''
    };

    if($stateParams.shopId != ':shopId') {
        $scope.data.shopId = $stateParams.shopId;
    }

    $scope.getData = function () {
        var dataInfo = JSON.stringify({
            "shopId": $scope.data.shopId
        });
        var req = $rootScope.aesFunc('mallChannel','queryBusinesslicense',dataInfo,'');
        $rootScope.AjaxFunc('user/mallShop/queryBusinesslicense',req,function (res) {
            // console.log(res)
            if(res.code == "1") {
                $scope.data.licenseImg = res.data.licenseImg;
            }
        });
    };
    $scope.getData();
}]);
