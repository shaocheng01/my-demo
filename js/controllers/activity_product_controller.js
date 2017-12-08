/**
 * Created by Dell6440 on 2017/6/3.
 */
myApp.controller('activityProCtrl',['$scope','$location','$http','$rootScope','$state','$stateParams','$window',function ($scope,$location,$http,$rootScope,$state,$stateParams,$window) {
    $scope.data = {
        isShowPage: 0,
        current: 0,
        adPictureUrl: '',
        bodyData: [],
        ellipsis: 0,
        ellipsisTxt: '',
        toastText: '',
        isShowToast: false,
        jsessionId: '',
        channelId: '',
        specialId: '',
        errorText: '页面飘走了，点击屏幕重试',
        errorImg: 'imgs/piao.png',
        showErrorPage: ''
    };

    $('.pros-list,.webIndexView').css('background-color','#f4f4f4');

    if($rootScope.urlParameter('channelId')){
        $scope.data.channelId = $rootScope.urlParameter('channelId');
    }
    if($rootScope.urlParameter('specialId')){
        $scope.data.specialId = $rootScope.urlParameter('specialId');
    }
    if($rootScope.urlParameter('jsessionId')){
        $scope.data.jsessionId = $rootScope.urlParameter('jsessionId');
    }

    clientInterface.getJSessionId( function (jsessionId) { //获得用户登录初始信息(客户端信息)
        if(jsessionId) {
            $scope.data.jsessionId = jsessionId;
        }
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


    if($stateParams.channelId != ':channelId') {
        $scope.data.channelId = $stateParams.channelId;
        $scope.data.specialId = $stateParams.specialId;
        $scope.data.jsessionId = $stateParams.jsessionId;
    }
    //获取邀请码等参数
	var invite_data = {};
    $scope.page = {
        refreshPage: function () {
            $scope.data.showErrorPage = 0;
            $window.location.reload();
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
                        });
                        setTimeout(function () {
                            $('.toast').fadeOut();
                        }, 2000);
                    }
                });
            }
        },

        getData: function () {
            var dataInfo = JSON.stringify({
                "channelId":  $scope.data.channelId, "specialId":$scope.data.specialId
            });
            var req = $rootScope.aesFunc('home', 'querySpecialInfo', dataInfo, $scope.data.jsessionId);
            $rootScope.AjaxFunc('search/home/querySpecialInfo', req, function (res) {
                if (res.code == "-1") {
                    $scope.data.showErrorPage = 1;
                    return;
                }
                if (res.code == "1") {
                    if (res.data == null) {
                        $scope.data.showErrorPage = 1;
                        return;
                    }
                    $scope.data.isShowPage = 1;
                    // console.log(res);
                    $scope.data.adPictureUrl = res.data.mainSpecialDto.adPictureUrl;
                    var productList = res.data.resultSpecialForProduct;
                    var length = productList.length;
                    var productObj = {};
                    for (var i = 0; i < length; i++) {
                        productObj = {
                            collection: productList[i].collection,
                            mallProduct: productList[i].esProductDto
                        };
                        $scope.data.bodyData.push(productObj);

                        if($scope.data.bodyData[i].mallProduct.productTitle) {
                            if ($scope.data.bodyData[i].mallProduct.productTitle.length >= 8) {  //todo
                                $scope.data.ellipsis = 1;
                            }
                        }
                    };
                    //改变标题
                    var title = res.data.mainSpecialDto.specialDesc;
                    $rootScope.changeTitle(title);
                    //调用app分享、获取邀请码等逻辑方法
                    var url_ = config.urlIp + "#/activityproduct/:channelId/:specialId/:jsessionId?";
					var other_url_data = "specialId="+$scope.data.specialId;
					invite_data = $rootScope.goAppOrDownload(url_,title,shareData.special_activity.img, shareData.special_activity.info,other_url_data);
                }
            });
        },
        //跳转原生
	    toDetailPage : function (pid, pLable) {
			//来自app--跳转产品详情
	      	if($scope.isFromApp){
	      		clientInterface.toProductDetails(pid,pLable,function (collectId, collected) {
	      			if (collectId || collected) {
	                    $scope.page.getData();
	                };
	      		});
	      	}else{
	      		var app_url = "mayaliuyue://maya1618/app/shopdetails?productId="+pid+"&productLable="+pLable;
	      		var other_url = config.urlIp+"#/invite_new_user?inviteId="+invite_data.code+"&inviteMobile="+invite_data.name;
	      		$scope.isHaveApp(app_url, other_url);
	      	};
	    }
    };
    $scope.page.getData();
}]);
