/**
 * Created by Dell6440 on 2017/8/7.
 */
myApp.controller('redPocketCtrl',['$scope','$location','$http','$rootScope','$state','$stateParams','countdown',function ($scope,$location,$http,$rootScope,$state,$stateParams,countdown) {

    $scope.data = {
        iDay_p: '',
        iHour_p: '',
        iMin_p: '',
        iSec_p: '',
        isStart: '',
        jsessionId: '',
        price: '',
        residueCount: '',
        envelopeId: '',
        isShowRecord: false,
        listItem: [],
        overplusCount: ''
    };

    // var timer = 10000;
    // countdown.showTime(timer/1000, $scope.data);
    // countdown.changetime(timer/1000,$scope.data);

    if($rootScope.urlParameter('jsessionId')){
        $scope.data.jsessionId = $rootScope.urlParameter('jsessionId');
    }

    $rootScope.getPocketData = function () {
        var dataInfo = '{}';
        var req = $rootScope.aesFunc('redEnvelope', 'show', dataInfo, $scope.data.jsessionId);
        $rootScope.AjaxFunc('235/redEnvelope/show', req, function (res) {
            // console.log(res);
            if(res.code == 1) {
                if(res.data) {
                    $scope.data.price = res.data.price;
                    $scope.data.residueCount = res.data.residueCount;
                    $scope.data.envelopeId = res.data.envelopeId;
                    $scope.data.isStart = res.data.mark;
                    var timer = res.data.countDown;
                    if(timer) {
                        countdown.showTime(timer/1000, $scope.data);
                        countdown.changetime(timer/1000,$scope.data);
                    }

                    if($scope.data.isStart == null) {
                        $scope.data.isStart = -1;
                    }
                }

                if(res.data == null) {
                    clientInterface.grabPacket(0,'', $scope.data.envelopeId,function () {});
                }
            }
        });
    };

    $scope.grabBtnClick = function () {
        if(!$scope.data.jsessionId) {
            // $scope.data.isShowRecord = false;
            window.clientInterface.openLoginPage(function (jsessionId) {
                $scope.data.jsessionId = jsessionId
            });
            return false;
        }

        $scope.data.isShowRecord = true;

        // if($scope.data.residueCount == "0") {
        //     clientInterface.grabPacket(0,'', $scope.data.envelopeId,function () {
        //         console.log('回调成功了')
        //     });
        //     return;
        // }

        var dataInfo = JSON.stringify({
            "envelopeId":$scope.data.envelopeId
        });
        var req = $rootScope.aesFunc('redEnvelope', 'grab', dataInfo, $scope.data.jsessionId);
        $rootScope.AjaxFunc('235/redEnvelope/grab', req, function (res) {
            // console.log(res);
            if(res.code == 1) {
                var isSuccess,grabPrice;
                if(res.data.status == 1) {
                    isSuccess = 1;
                    grabPrice = res.data.snagPrice;
                    clientInterface.grabPacket(isSuccess,grabPrice, $scope.data.envelopeId,function () {
                        // console.log('回调成功了')
                    })
                }
                if($scope.data.residueCount == "0" || res.data.status == "-2" || res.data.status == "0" || res.data.status == "2" || res.data.status == "3") {
                    isSuccess = 0;
                    grabPrice = '';
                    clientInterface.grabPacket(isSuccess,grabPrice, $scope.data.envelopeId,function () {
                        // console.log('回调成功了')
                    })
                }

                $scope.data.overplusCount = res.data.overplusCount;
                $scope.data.listItem = res.data.orders;
            }
        });
    };

    $scope.goBuyBtnClick = function () {
        clientInterface.toHomePage(function () {
            // console.log('回调成功了')
        })
    };

    $rootScope.getPocketData();
}]);
