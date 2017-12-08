/**
 * Created by Dell6440 on 2017/6/3.
 */
myApp.controller('activityBrandCtrl',['$scope','$location','$http','$rootScope','$state','$window',function ($scope,$location,$http,$rootScope,$state,$window) {
    $scope.data = {
        isShowPage: 0,
        current: 0,
        ellipsis: 0,
        productListData: [],
        productCollectData: [],
        useData: [],
        bodyData: [],
        navData: [],
        adPictureUrl: '',
        jsessionId: '',
        channelId: '',
        specialId: '',
        errorText: '页面飘走了，点击屏幕重试',
        errorImg: 'imgs/piao.png',
        showErrorPage: ''
    };

    $('.pros-list,.webIndexView').css('background-color','#f4f4f4');

    $scope.setSwiper = function () {
        setTimeout(function () {
            var swiper = new Swiper('.swiper-container',{
                slidesPerView: 'auto',
                // resistanceRatio : 0,
                observer: true,//修改swiper自己或子元素时，自动初始化swiper
                observeParents:true,
                slideToClickedSlide:true,
                freeMode : true
                // centeredSlides:true
            });
        },5);
    };
    $scope.setSwiper();


    if($rootScope.urlParameter('channelId')){
        $scope.data.channelId = $rootScope.urlParameter('channelId');
        // console.log($rootScope.urlParameter('channelId'))
    }
    if($rootScope.urlParameter('specialId')){
        $scope.data.specialId = $rootScope.urlParameter('specialId');
        // console.log($rootScope.urlParameter('specialId'))
    }
    if($rootScope.urlParameter('jsessionId')){
        $scope.data.jsessionId = $rootScope.urlParameter('jsessionId');
        // console.log($rootScope.urlParameter('jsessionId'))
    }

    clientInterface.getJSessionId( function (jsessionId) { //获得用户登录初始信息
        if(jsessionId) {
            $scope.data.jsessionId = jsessionId;
        }
        // console.log('传入参数:', jsessionId);
    });

    clientInterface.appCollection( function (pid, collection) { //获得app收藏商品信息，h5页面修改状态
        if(pid && collection) {
            var len = $scope.data.bodyData.length;
            for(var i=0; i<len; i++) {
                if($scope.data.bodyData[i].mallProduct.productId == pid ) {
                    $scope.$apply(function(){
                        $scope.data.bodyData[i].collection = collection;
                    });
                    break;
                }
            }
        }
    });


    $scope.page = {
        refreshPage: function () {
            $scope.data.showErrorPage = 0;
            $window.location.reload();
        },
        setCurrent: function (index) {
            var dataInfo = JSON.stringify({
                "channelId": $scope.data.channelId, "specialId": $scope.data.specialId
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
                    $scope.data.productCollectData = res.data.specialTypeInfoDto;
                    // console.log(res.data);
                    $scope.data.bodyData = [];
                    $scope.data.useData = $scope.data.productCollectData[index].resultSpecialForProduct;
                    // console.log($scope.data.useData);
                    $scope.data.current = index;
                    var len= $scope.data.useData.length;
                    var productObj = {};
                    // console.log(len);
                    for(var i=0;i<len;i++) {
                        productObj = {
                            collection: $scope.data.useData[i].collection,
                            mallProduct: $scope.data.useData[i].esProductDto
                        };
                        // console.log(productObj);
                        $scope.data.bodyData.push(productObj);
                        if($scope.data.useData[i].esProductDto.productTitle) {
                            if($scope.data.useData[i].esProductDto.productTitle.length>=8) {  //todo
                                $scope.data.ellipsis = 1;
                            }
                        }
                    }
                }
            });
        },
        collectProduct: function (collect, index, pId) {
            // console.log(collect, index);
            if (collect == "0") {
                var dataInfo = JSON.stringify({
                    "opeId":pId,"flag":"1","type":"1"
                });
                var req = $rootScope.aesFunc('favorite','saveOrUpdate',dataInfo,$scope.data.jsessionId);
                $rootScope.AjaxFunc('user/favorite/saveOrUpdate', req, function (res) {
                    if (res.code == "1005") {
                        window.clientInterface.openLoginPage(function (jsessionId) {
                            $scope.data.jsessionId = jsessionId;
                        });
                    }
                    if (res.code == "1") {
                        $scope.data.bodyData[index].collection = 1;
                        clientInterface.h5Collection(pId, '1', function () { //H5页面收藏了商品，返回客户端页面，*客户端*要改变收藏状态
                            // console.log('传入了参数');
                        });
                        $('.toast').text('收藏成功').fadeIn();
                        setTimeout(function () {
                            $('.toast').fadeOut();
                        }, 2000);
                    }
                });
            }
            if (collect == "1") {
                var dataInfo = JSON.stringify({
                    "opeId":pId,"flag":"0","type":"1"
                });
                var req = $rootScope.aesFunc('favorite','saveOrUpdate',dataInfo,$scope.data.jsessionId);
                $rootScope.AjaxFunc('user/favorite/saveOrUpdate', req, function (res) {
                    if (res.code == "1") {
                        $scope.data.bodyData[index].collection = 0;
                        $('.toast').text('取消收藏成功').fadeIn();
                        clientInterface.h5Collection(pId, '0', function () { //H5页面收藏了商品，返回客户端页面，*客户端*要改变收藏状态
                            // console.log('传入了参数');
                        });
                        setTimeout(function () {
                            $('.toast').fadeOut();
                        }, 2000);
                        // console.log('取消收藏商品成功了');
                    }
                });
            }
        },
        toDetailPage: function (pid, pLable) {
            clientInterface.toProductDetails(pid, pLable,function (res) {
                // console.log(res)
            });
        }

    };
    $scope.page.setCurrent(0);

}]);
