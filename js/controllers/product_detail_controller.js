/**
 * Created by Dell6440 on 2017/5/11.
 */

myApp.controller('detailCtrl',['$scope','$location','$http','$rootScope','$state',function ($scope,$location,$http,$rootScope,$state) {

    $scope.data = {
        current: "1",
        standardData: [],
        productLable: '',
        imgData: [],
        showAll: false,
        showAllBtn: false,
        text: '展开',
        selfText: '',
        showPrice: false,
        showTips: false,
        showaftersale: true
    };


    if($rootScope.urlParameter('productLable')){
        $scope.data.productLable = $rootScope.urlParameter('productLable');
    }

    $scope.page = {
        setCurrent: function (param) {
            $scope.data.current = param;
        },
        getDetailData: function () {
            var dataInfo = JSON.stringify({
                "productLable":$scope.data.productLable
            });
            var req = $rootScope.aesFunc('product', 'queryProductInfo', dataInfo,'');
            $rootScope.AjaxFunc('product/product/queryProductIntroduction', req, function (res) {
                if(res.code == "1") {
                    // console.log(res);
                    var introductionMap = res.data.specPackagMap;
                    for(var i in introductionMap) {
                        introductionItem = {
                            name: i,
                            text: introductionMap[i]
                        };
                        $scope.data.standardData.push(introductionItem);

                        if($scope.data.standardData.length>6) {
                            $scope.data.showAllBtn = true;
                        }

                    }
                    if(res.data.statement) {
                        $scope.data.selfText = res.data.statement;
                    }

                    // console.log($scope.data.standardData);
                    // $scope.data.imgData = JSON.parse(res.data.introduction);
                    // console.log(typeof(JSON.parse(res.data.introduction)));
                    $('.detail-text').append(res.data.introduction);
                    $('.detail-text img').css({'width':'100%','height':'initial','display':'block'});
                    $('.detail-text div').css({'width':'100%','height':'initial','box-sizing': 'border-box'});
                }
            });

        },
        showAllBtnClick: function () {
            $scope.data.showAll = !$scope.data.showAll;
            if($scope.data.showAll) {
                $scope.data.text = '收起';
            }
            if(!$scope.data.showAll) {
                $scope.data.text = '展开';
            }
        },
        showaftersale: function () {
            $scope.data.showaftersale = !$scope.data.showaftersale;
            if($scope.data.showaftersale) {
                $('.show-aftersale').show();
            }
            if(!$scope.data.showaftersale) {
                $('.show-aftersale').hide();
            }
        },
        showTips: function () {
            $scope.data.showTips = !$scope.data.showTips;
            if($scope.data.showTips) {
                $('.show-tips').show();
            }
            if(!$scope.data.showTips) {
                $('.show-tips').hide();
            }
        },
        showPrice: function () {
            $scope.data.showPrice = !$scope.data.showPrice;
            if($scope.data.showPrice) {
                $('.show-price').show();
            }
            if(!$scope.data.showPrice) {
                $('.show-price').hide();
            }
        }
    };

    $scope.page.getDetailData();
}]);