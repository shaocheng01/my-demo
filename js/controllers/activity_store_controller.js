/**
 * Created by Dell6440 on 2017/6/2.
 */
myApp.controller('activityStoreCtrl',['$scope','$location','$http','$rootScope','$state','$window',function ($scope,$location,$http,$rootScope,$state,$window) {

    $scope.data = {
        isShowPage: 0,
        adPictureUrl: '',
        navData: [],
        specialId: '',
        channelId: '',
        jsessionId: '',
        scrollWidth: [],
        errorText: '页面飘走了，点击屏幕重试',
        errorImg: 'imgs/piao.png',
        showErrorPage: ''
    };

    $('.webIndexView').css('background-color','#f4f4f4');

    if($rootScope.urlParameter('channelId')){
        $scope.data.channelId = $rootScope.urlParameter('channelId');
    }
    if($rootScope.urlParameter('specialId')){
        $scope.data.specialId = $rootScope.urlParameter('specialId');
    }
    if($rootScope.urlParameter('jsessionId')){
        $scope.data.jsessionId = $rootScope.urlParameter('jsessionId');
    }
    clientInterface.getJSessionId( function (jsessionId) { //获得用户登录初始信息
        if(jsessionId) {
            $scope.data.jsessionId = jsessionId;
        }
    });


    $scope.page = {
        refreshPage: function () {
            $scope.data.showErrorPage = 0;
            $window.location.reload();
        },
        toDetailPage: function (pid, pLable) {
            clientInterface.toProductDetails(pid, pLable, function (res) {
                // console.log(res)
            });
        },
        getData: function () {
            var dataInfo = JSON.stringify({
                "channelId":$scope.data.channelId, "specialId":$scope.data.specialId
            });
            var req = $rootScope.aesFunc('home', 'querySpecialInfo', dataInfo, $scope.data.jsessionId);

            $rootScope.AjaxFunc('search/home/querySpecialInfo', req, function (res) {
                // console.log(res);
                if(res.code == "-1") {
                    $scope.data.showErrorPage = 1;
                    return;
                }
                if(res.code == "1") {
                    if(res.data == null) {
                        $scope.data.showErrorPage = 1;
                        return;
                    }
                    $scope.data.isShowPage = 1;
                    $scope.data.adPictureUrl = res.data.mainSpecialDto.adPictureUrl;
                    // console.log(res);

                    var centreData = res.data.specialTypeInfoDto;
                    var len = centreData.length;
                    for(var i=0; i<len; i++) {
                        var navObj = {};
                        navObj = {"name": centreData[i].specialTypeName, "productList": centreData[i].returnSpecialForTypeProduct,"shopId":centreData[i].specialTypeId};
                        $scope.data.navData.push(navObj);
                        $scope.data.scrollWidth.push((centreData[i].returnSpecialForTypeProduct.length*104/20 + 7.4));
                    }
                    // console.log($scope.data.navData);
                    // console.log($scope.data.scrollWidth);
                }
            });
        },
        toStorePage: function (shopId) {
            $state.go('store', {'shopId':shopId,'jsessionId':$scope.data.jsessionId});
        }
    };
    $scope.page.getData();
}]);
