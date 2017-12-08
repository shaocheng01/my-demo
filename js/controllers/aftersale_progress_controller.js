/**
 * Created by Dell6440 on 2017/6/20.
 */
myApp.controller('aftersaleCtrl',['$scope','$location','$http','$rootScope','$state','$window',function ($scope,$location,$http,$rootScope,$state,$window) {

    $scope.data = {
        statusData: [],
        contentData: [],
        curNode: '',
        jsessionId: '',
        serviceId: '',
        indicate: '',
        saleTypeOne: [{'index': 1, 'name': '提交申请'},{'index': '', 'name': ''},{'index': 2, 'name': '客服受理'},{'index': '', 'name': ''},{'index': 3, 'name': '完成退款'}],
        saleTypeTwo: [{'index': 1, 'name': '提交申请'},{'index': 2, 'name': '客服受理'},{'index': 3, 'name': '寄回商品'},{'index': 4, 'name': '客服确认'},{'index': 5, 'name': '完成退款'}],
        saleTypeThree: [{'index': 1, 'name': '提交申请'},{'index': 2, 'name': '客服受理'},{'index': 3, 'name': '寄回商品'},{'index': 4, 'name': '客服确认'},{'index': 5, 'name': '完成换货'}],
        saleInfos: [],
        orderItemId: '',
        sendFlag: false,
        forbidden: false
    };

    if($rootScope.urlParameter('serviceId')){
        $scope.data.serviceId = $rootScope.urlParameter('serviceId');
    }
    if($rootScope.urlParameter('jsessionId')){
        $scope.data.jsessionId = $rootScope.urlParameter('jsessionId');
    }

    $scope.page = {
        submitBtnClick: function () {
            if($scope.data.forbidden) {
                return;
            }
            if($scope.data.sendFlag == true) {
                return;
            }
            var company = $.trim($('#company').val());
            var number = $.trim($('#number').val());
            if(!company) {
                $('.toast').text('请输入公司名称').fadeIn();
                setTimeout(function () {
                    $('.toast').fadeOut();
                },2000);
            }

            if(!number) {
                $('.toast').text('请输入快递单号').fadeIn();
                setTimeout(function () {
                    $('.toast').fadeOut();
                },2000);
            }

            if(company && number) {
                $scope.data.sendFlag = true;
                var dataInfo = JSON.stringify({
                    "serviceId":$scope.data.serviceId,"loCompany":company,"loNumber":number
                });
                var req = $rootScope.aesFunc('order', 'waitUserSendGoods', dataInfo, $scope.data.jsessionId);

                $rootScope.AjaxFunc('order/mallAfterSaleApi/waitUserSendGoods', req, function (res) {
                    if(res.code == 1) {
                        $window.location.reload();
                    }
                    $scope.data.sendFlag = false;
                });
            }
        },
        getData: function () {
            var dataInfo = JSON.stringify({
                "serviceId":$scope.data.serviceId,"messageType":"0"
            });
            var req = $rootScope.aesFunc('order', 'queryOrderAfterSaleInfos', dataInfo, $scope.data.jsessionId);
            $rootScope.AjaxFunc('order/mallAfterSaleInfoApi/queryOrderAfterSaleInfo', req, function (res) {
                // console.log(res);
                if(res.code == "1") {
                    $scope.data.curNode = res.data.node;
                    if(res.data.saleType == "1") {
                        $scope.data.statusData = $scope.data.saleTypeOne;
                        setTimeout(function () {
                            $(".progress-node:odd").css({'visibility': 'hidden'});
                        }, 0);
                    }

                    if(res.data.saleType == "2") {
                        $scope.data.statusData = $scope.data.saleTypeTwo;
                    }
                    if(res.data.saleType == "3") {
                        $scope.data.statusData = $scope.data.saleTypeThree;
                    }
                    $scope.data.saleInfos = res.data.saleInfos.reverse();
                    var org =  Math.floor($scope.data.saleInfos[0][1][0].organization);

                    if(org == 14 || org == 30 || org == 62) {
                        $scope.data.forbidden = true;

                    }
                    // console.log($scope.data.saleInfos )
                    $scope.data.orderItemId = res.data.orderItemId;
                    var detail_data = $scope.data.saleInfos;
                    var len = detail_data.length;
                    for(var i=0; i<len; i++) {
                        if(detail_data[i][2]==1) {
                            for(var j=0; j<detail_data[i][1].length; j++) {
                                if(detail_data[i][1][j].sName == "photos") {
                                    detail_data[i][1][j].showImg = JSON.parse(detail_data[i][1][j].sValue).urls;
                                }
                            }
                        }
                    }
                }
            });
        },
        openSupplementPage: function () {
            if($scope.data.forbidden) {
                return;
            }
            clientInterface.toSupplementPage($scope.data.serviceId,$scope.data.orderItemId,function () {
                // orderItemId
            })
        },
        openApplicationPage: function () {
            if($scope.data.forbidden) {
                return;
            }
            clientInterface.toApplicationPage($scope.data.serviceId,$scope.data.orderItemId,function () {

            })
        },
        showBigPicture: function (bigImg) {
            $('.masker-bigImg').show();
            $('.masker-bigImg img').attr('src', bigImg);
            $rootScope.maskerStopScroll('.masker-bigImg');
        },
        hideMasker: function () {
            $('.masker-bigImg').hide();
            $rootScope.maskerCanScroll('.masker-bigImg');
        },
        confirmBtnOnClick: function () {    //确认收货按钮
            if($scope.data.forbidden) {
                return;
            }
            if($scope.data.sendFlag == true) {
                return;
            }
            $scope.data.sendFlag = true;
            var dataInfo = JSON.stringify({
                "serviceId":$scope.data.serviceId,"messageType":"0"
            });
            var req = $rootScope.aesFunc('order', 'queryOrderAfterSaleInfos', dataInfo, $scope.data.jsessionId);
            $rootScope.AjaxFunc('order/mallAfterSaleApi/userReceiveGoods', req, function (res) {
                if(res.msg == 'success') {
                    $window.location.reload();
                }
                $scope.data.sendFlag = false;
            });
        }
    };

    $scope.page.getData();
}]);





















