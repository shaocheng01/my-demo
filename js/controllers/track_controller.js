/**
 * Created by Dell6440 on 2017/5/22.
 */
myApp.controller('trackCtrl',['$scope','$location','$http','$rootScope','$state',function ($scope,$location,$http,$rootScope,$state) {

    $scope.data = {
        isShowPage: 0,
        jsessionId: '',
        trackData: [],
        orderItemId: '',
        companyName: '',
        trackNumber: '',
        errorText: '物流信息还在途中哦',
        errorImg: 'imgs/delivery-empty.png',
        showErrorPage: ''
    };

    if($rootScope.urlParameter('orderItemId')){
        $scope.data.orderItemId = $rootScope.urlParameter('orderItemId');
    }
    if($rootScope.urlParameter('jsessionId')){
        $scope.data.jsessionId = $rootScope.urlParameter('jsessionId');
        // console.log($scope.data.jsessionId)
    }

    $scope.copy = function () {
        var clipboard = new Clipboard('.track-copy-btn');
        clipboard.on('success', function(e) {
            $('.toast').text('复制成功').fadeIn(0);
            setTimeout(function() {
                $('.toast').fadeOut();
            }, 800);
            // console.log(e.text);
        });
    };

    $scope.getData = function () {
        var dataInfo = JSON.stringify({
            "orderItemId":$scope.data.orderItemId
        });
        var req = $rootScope.aesFunc('order', 'queryOrderAfterSaleInfos', dataInfo, $scope.data.jsessionId);
        $rootScope.AjaxFunc('order/mallAfterSaleInfoApi/queryLogisticsInfos', req, function (res) {
            // console.log(res);
            if(res.code == 1 && res.data.data && res.data.status == "200") {
                $scope.data.isShowPage = 1;
                $scope.data.companyName = res.data.companyName;
                $scope.data.trackNumber = res.data.nu;
                $scope.data.trackData = res.data.data;
                // console.log($scope.data.companyName)
            }
            if( !res.data || !res.data.data || !res.data.status || res.data.status!=200) {
                $scope.data.isShowPage = 0;
                $scope.data.showErrorPage = 1;
            }
        });
    };
    $scope.getData();
}]);
