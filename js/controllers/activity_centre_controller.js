/**
 * Created by Dell6440 on 2017/6/3.
 */
myApp.controller('activityCentreCtrl',['$scope','$location','$http','$rootScope','$state','$window',function ($scope,$location,$http,$rootScope,$state,$window) {

    $scope.data = {
        isShowPage: 0,
        current: 0,
        navData: [],
        bodyData: [],
        isfixed: false,
        adPictureUrl: '',
        channelId: '',
        specialId: '',
        jsessionId: '',
        timer: '',
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
    $scope.page = {
        refreshPage: function () {
            $scope.data.showErrorPage = 0;
            $window.location.reload();
        },
        setCurrent: function (index) {
            $scope.data.current = index;
            var obj = document.getElementById(index);
            var oPos = obj.offsetTop;
            return window.scrollTo(0, oPos-40);
        },
        toDetailPage: function (pid, pLable) {
            clientInterface.toProductDetails(pid, pLable,function (res) {
                // console.log(res)
            });
        },
        getData: function () {
            var dataInfo = JSON.stringify({
                "channelId": $scope.data.channelId, "specialId":$scope.data.specialId
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
                    var centreData = res.data.specialInfoForSpecialDtos;
                    var len = centreData.length;
                    for(var i=0; i<len; i++) {
                        var navObj = {};
                        navObj = {"name": centreData[i].specialName, "productList": centreData[i].specialProductList,"channelId":centreData[i].channelId,"specialId":centreData[i].specialId};
                        $scope.data.navData.push(navObj);
                        $scope.data.scrollWidth.push((centreData[i].specialProductList.length*104/20 + 8.4));
                    }
                    // console.log($scope.data.navData);
                    // console.log($scope.data.scrollWidth);
                }
            });
        },
        toActivityProductPage: function (channelId, specialId) {
            $state.go('activityproduct', {'channelId':channelId,'specialId':specialId,'jsessionId':$scope.data.jsessionId});
        }
    };

    $(window).on('scroll', function() {
        var $this = $(this),
            $activityAd = $('.activity-ad'),
            mSingleImgHeight = $activityAd.height(),
            scrollTop = $this.scrollTop();

        if (scrollTop > mSingleImgHeight) {
            $scope.$apply(function () {
                $scope.data.isfixed = true;
            });
        } else {
            $scope.$apply(function () {
                $scope.data.isfixed = false;
            });
        }
    });
    $scope.page.getData();
}]);
