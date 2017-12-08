/**
 * Created by Dell6440 on 2017/5/17.
 */

myApp.controller('storeCtrl',['$scope','$location','$http','$rootScope','$state','$stateParams','$window',function ($scope,$location,$http,$rootScope,$state,$stateParams,$window) {
    $scope.data = {
        isShowStore: 0,
        isActive: '1',
        collectStore: '',
        collectPro: '',
        shopName: '',
        ellipsis: 0,
        bodyData: [],
        storeLogo: '',
        isfixed: false,
        jsessionId: '',
        shopId: '',
        errorText: '未找到此店铺，点击屏幕重试',
        errorImg: 'imgs/store-empty.png',
        showErrorPage: '',
        noProduct: false
    };

    $('.pros-list,.webIndexView').css('background-color','#f4f4f4');

    if($rootScope.urlParameter('shopId')){
        $scope.data.shopId = $rootScope.urlParameter('shopId');
    }
    if($rootScope.urlParameter('jsessionId')){
        $scope.data.jsessionId = $rootScope.urlParameter('jsessionId');
        // console.log($scope.data.jsessionId)
    }

    clientInterface.getJSessionId( function (jsessionId) { //获得用户登录初始信息
        if(jsessionId) {
            $scope.data.jsessionId = jsessionId;
        }
    });

    clientInterface.appCollection( function (pid, collection) { //获得app收藏商品信息，h5页面修改状态
         if(pid && collection) {
            // console.log('+++++++++++++',pid, '++++++++++++++++++++++',collection,'++++++++++++++++++');
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


    if($stateParams.shopId != ':shopId') {
        $scope.data.shopId = $stateParams.shopId;
        $scope.data.jsessionId = $stateParams.jsessionId;
    }

    $rootScope.checked_type = '1';
    $rootScope.price_types = true;

    $scope.page = {
        getShopData: function () {
            var dataInfo = JSON.stringify({
               "shopId": $scope.data.shopId
            });
            var req = $rootScope.aesFunc('mallShop', 'queryMallShop', dataInfo, $scope.data.jsessionId);

            $rootScope.AjaxFunc('user/mallShop/queryMallShop', req, function (res) {
                // console.log(res)
                if(res.code == "1") {
                    if(res.data.storeStatus !=1) {
                        $scope.data.showErrorPage = 1;
                    }

                    $scope.data.showErrorPage = 0;
                    $scope.data.isShowStore = 1;
                    $scope.data.shopName = res.data.shopName;
                    $scope.data.storeLogo = res.data.shopUrl;

                    if($scope.data.shopName.length>14) {
                        $scope.data.shopName = $scope.data.shopName.substr(0,14) + '...';
                    }

                    if(res.data.collection == "1") {
                        $scope.data.collectStore = 1;
                    }
                    if(res.data.collection == "0") {
                        $scope.data.collectStore = 0;
                    }
                }
                if(res.code == "-1") {
                    $scope.data.showErrorPage = 1;
                } else {
                    $scope.data.showErrorPage = 0;
                }
            });
        },

        toLicensePage: function (shopId) {
            $state.go('license', {'shopId': shopId});
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

        collectStore: function () {
            if($scope.data.collectStore == 0) {  // todo 判断当前用户是否登录
                var dataInfo = JSON.stringify({
                    "opeId": $scope.data.shopId,"flag":"1","type":"2"
                });
                var req = $rootScope.aesFunc('favorite', 'saveOrUpdate', dataInfo, $scope.data.jsessionId); //memberId:就是userId,memberId:会员ID，opeId：商品ID 或者 商铺ID，type:商品--1 商铺--2 其他--3，flag:状态--0 取消 1 关注
                $rootScope.AjaxFunc('user/favorite/saveOrUpdate', req, function (res) {
                    if(res.code == "1005") {
                        window.clientInterface.openLoginPage(function (jsessionId) {
                            $scope.data.jsessionId = jsessionId;
                        });
                    }
                    if(res.code == "1" && res.msg == "success") {
                        clientInterface.h5CollectionShop($scope.data.shopId, '1', function () {});
                        $scope.data.collectStore = 1;
                        $('.toast').text('收藏成功').fadeIn();
                        setTimeout(function () {
                            $('.toast').fadeOut();
                        },2000);
                    }
                });
            }else {
                var dataInfo = JSON.stringify({
                    "opeId": $scope.data.shopId,"flag":"0","type":"2"
                });
                req = $rootScope.aesFunc('favorite', 'saveOrUpdate', dataInfo, $scope.data.jsessionId);
                $rootScope.AjaxFunc('user/favorite/saveOrUpdate', req, function (res) {
                    if(res.code == "1" && res.msg == "success") {
                        clientInterface.h5CollectionShop($scope.data.shopId, '0', function () {});
                        $('.toast').text('取消收藏成功').fadeIn();
                        setTimeout(function () {
                            $('.toast').fadeOut();
                        },2000);
                        $scope.data.collectStore = 0;
                    }
                })
            }
        },

        toDetailPage: function (pid, pLable) {
            clientInterface.toProductDetails(pid, pLable,function (res) {});
        },

        openCustomService: function () {
            if(!$scope.data.jsessionId) {
                window.clientInterface.openLoginPage(function (jsessionId) {
                    $scope.data.jsessionId = jsessionId;

                    var serviceKey;
                    var shopName;
                    var dataInfo = JSON.stringify({
                        "shopId": $scope.data.shopId,
                        "jsessionId": $scope.data.jsessionId
                    });
                    var req = $rootScope.aesFunc('mallShop','getAppkeyByShopId',dataInfo,$scope.data.jsessionId); //跳转客服获取店铺shopKey
                    $rootScope.AjaxFunc('user/mallShop/getAppkeyByShopId', req, function (res) {
                        // console.log(res);
                        if(res.code == "1" && res.data.appKey != 'null') {
                            serviceKey = res.data.appKey;
                            shopName = res.data.shopName;
                            clientInterface.toCustomService(serviceKey,shopName,function () {});
                        } else {
                            $('.toast-long').text('该商家暂未开通客服服务').fadeIn();
                            setTimeout(function () {
                                $('.toast-long').fadeOut();
                            },2000);
                        }
                    });
                });
            } else {
                var serviceKey;
                var shopName;
                var dataInfo = JSON.stringify({
                    "shopId": $scope.data.shopId,
                    "jsessionId": $scope.data.jsessionId
                });
                var req = $rootScope.aesFunc('mallShop','getAppkeyByShopId',dataInfo,$scope.data.jsessionId); //跳转客服获取店铺shopKey
                $rootScope.AjaxFunc('user/mallShop/getAppkeyByShopId', req, function (res) {
                    // console.log(res);
                    if(res.code == "1" && res.data.appKey) {
                        serviceKey = res.data.appKey;
                        shopName = res.data.shopName;
                        clientInterface.toCustomService(serviceKey,shopName,function () {});
                    } else {
                        $('.toast-long').text('该商家暂未开通客服服务').fadeIn();
                        setTimeout(function () {
                            $('.toast-long').fadeOut();
                        },2000);
                    }
                });
            }

        },

        refreshPage: function () {
            $scope.data.showErrorPage = 0;
            $window.location.reload();
        }
    };

    $(window).on('scroll', function() {
        var $this = $(this),
            $storeHeader = $('.store-header'),
            imgHeight = $storeHeader.height(),
            scrollTop = $this.scrollTop();

        if (scrollTop > imgHeight) {
            $scope.$apply(function () {
                $scope.data.isfixed = true;
            });
        } else {
            $scope.$apply(function () {
                $scope.data.isfixed = false;
            });
        }
    });

    //第一次进入 综合排序页面
    $scope.productsSelectionData = function(pages,select_id,me){
        var price_sort;
        if(select_id == "4") {
            if($rootScope.price_types){
                price_sort = "DESC"; //降序
            }else {
                price_sort = "ASC"; //升序
            }
        } else {
            price_sort = "";
        }

        if(!$scope.data.shopId) {
            $scope.data.showErrorPage = 1;
            return;
        }

        var dataInfo = JSON.stringify({
            "pageNo":pages,"pageSize":6,"param":{"orderField":select_id,"orderType":price_sort,"tag":"shopId="+$scope.data.shopId
        }});

        var req = $rootScope.aesFunc('searchEs', 'list', dataInfo, $scope.data.jsessionId);
        $rootScope.AjaxFunc('search/searchEs/list', req, function (res) {
            // console.log(res);
            if(res.code == "1") {
                var newData = res.data.products;
                var newObj = {};
                for(var i=0; i<newData.length; i++) {
                    newObj = {
                        collection: newData[i].collection,
                        mallProduct: newData[i]
                    };
                    $scope.data.bodyData.push(newObj);
                }
                if($scope.data.bodyData.length < 7) {
                    setTimeout(function () {
                        $('.dropload-noData').html('');
                    },0);
                }
                $scope.data.ellipsis = 1;
                $('.clickOn').stop().hide();
                if(!res.data.hasNext){
                    // 锁定
                    me.lock();
                    // 无数据
                    me.noData();
                }
                me.resetload(); //初始化
            }

            if ($scope.data.bodyData.length == 0) {
                $scope.data.noProduct = true;
            } else {
                $scope.data.noProduct = false;
            }
        });
    };
    //上拉加载
    var timer,pages;
    $scope.changeTabsId = function(select_id){
        if(select_id=="4"){
            $rootScope.price_types = !$rootScope.price_types;
        }
        $scope.data.isActive = select_id;
        $rootScope.checked_type = select_id;
        clearTimeout(timer);
        pages = 0; //页数
        $scope.data.bodyData = [];
        timer = setTimeout(function(){
            $('.dropload-down').remove(); //清除加载栏
            $('.content').dropload({
                scrollArea : window,
                domDown : {
                    domClass   : 'dropload-down',
                    domRefresh : '<div class="dropload-refresh dropload_text">< img src="img/arrow.png"/><span>上拉加载更多</span></div>',
                    domLoad    : '<div class="dropload-load"><span class="loading"></span>加载中...</div>',
                    domNoData  : '<div class="dropload-noData">亲，我是有底线的呦</div>'
                },
                loadDownFn : function(me){  //上拉加载
                    $('.clickOn').stop().show();
                    pages++;
                    $scope.productsSelectionData(pages,$rootScope.checked_type,me);
                },
                threshold : 20,
                distance: 80
            });
        },0);
    };
    $scope.changeTabsId("1");
    $scope.page.getShopData();
}]);
