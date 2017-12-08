/**
 * Created by Dell6440 on 2017/5/10.
 */

myApp.directive('collectProductTpl', function ($timeout) { //两列商品列表，带收藏按钮的模板
    return {
        restrict: 'EA',
        template: '<div class="pros-list">'+
                        '<div class="product-list-box" ng-repeat="item in data.bodyData track by $index">'+
                            '<div class="for-pid" pid={{item.mallProduct.productId}} ng-click="page.toDetailPage(item.mallProduct.productId, item.mallProduct.productLable)">'+
                                '<div class="product-list-img">'+
                                    '<img ng-src="{{item.mallProduct.pictureAddr}}" src="imgs/product-default.png">'+
                                    '<div class="product-tag">'+
                                        '<span class="product-sign straight-down" ng-if="item.mallProduct.activityType[0] == 1 || item.mallProduct.activityType[1] == 1">直降</span>'+
                                        '<span class="product-sign full-discount" ng-if="item.mallProduct.activityType[0] == 2 || item.mallProduct.activityType[1] == 2">满减</span>'+
                                    '</div>'+
                                '</div>'+
                                '<div class="product-list-text">'+
                                    '<div class="product-list-box-title">'+
                                        '<span class="self-store" ng-if="item.mallProduct.merchantType != 2 && item.mallProduct.merchantType">[自营]</span>' +
                                        '{{item.mallProduct.productName}}' +
                                    '</div>'+
                                    '<div class="product-list-detail" ng-class="{ellipsis: data.ellipsis == 1 }">{{item.mallProduct.productTitle}}</div>'+
                                '</div>'+
                            '</div>'+
                            '<div class="product-list-price">' +
                                '<span ng-bind="item.mallProduct.activityPrice?'+"'¥'+"+'item.mallProduct.activityPrice:'+"'¥'+"+'item.mallProduct.salePrice"></span>'+
                                '<span ng-if="item.mallProduct.activityPrice" class="salePrice" ng-bind="'+"'¥'+"+'item.mallProduct.salePrice"></span>' +
                                '<div class="vote-wp" ng-click="page.collectProduct(item.collection, $index,item.mallProduct.productId)">'+
                                    '<span class="vote" ng-class="{collected: item.collection == 1 }"></span>'+
                                '</div>'+
                            '</div>'+
                        '</div>'+
                  '</div>',
        replace: true
    };
});

myApp.directive('scrollProductTpl', function ($timeout) {//横向滚动的商品条
    return {
        restrict: 'EA',
        template:   '<ul class="activity-scroll-product-wrap" style="width: {{data.scrollWidth[$index]}}rem">'+
                        '<li class="activity-product" ng-repeat="item in item.productList" pid={{item.productId}} ng-click="page.toDetailPage(item.productId, item.productLable)">'+
                            '<div class="scroll-product-wp">'+
                                '<img ng-src="{{item.pictureAddr}}" src ="imgs/progress-def.png" class="activity-product-img">'+
                                '<div class="product-tag" id="product-tag">'+
                                    '<span class="product-sign straight-down" ng-if="item.activityType[0] == 1 || item.mallProduct.activityType[1] == 1">直降</span>'+
                                    '<span class="product-sign full-discount" ng-if="item.activityType[0] == 2 || item.mallProduct.activityType[1] == 2">满减</span>'+
                                '</div>'+
                            '</div>'+
                            '<div class="activity-product-title"><span class="self-store" ng-if="item.merchantType != 2 && item.merchantType">[自营]</span>{{item.productName}}</div>'+
                            '<div class="activity-product-detail">{{item.productTitle}}</div>'+
                            '<div class="activity-product-price">' +
                                '<span ng-bind="item.activityPrice?'+"'¥'+"+'item.activityPrice:'+"'¥'+"+'item.salePrice"></span>'+
                                '<span ng-if="item.activityPrice" class="salePrice" ng-bind="'+"'¥'+"+'item.salePrice"></span>' +
                            '</div>'+
                        '</li>'+
                        '<li class="show-more-box" ng-click="page.toActivityProductPage(item.channelId, item.specialId)">'+
                            '<img src="imgs/more.png" style="width: 100%;">'+
                        '</li>'+
                    '</ul>',
        replace: true
    }
});

myApp.directive('scrollStoreTpl', function ($timeout) {//活动店铺页面横向滚动商品模板
    return {
        restrict: 'EA',
        template:   '<ul class="activity-scroll-product-wrap" style="width: {{data.scrollWidth[$index]}}rem">'+
                        '<li class="activity-product" ng-repeat="item in item.productList" pid={{item.productId}} ng-click="page.toDetailPage(item.productId, item.productLable)">'+
                            '<div class="scroll-product-wp">'+
                                '<img ng-src="{{item.pictureAddr}}" src ="imgs/progress-def.png" class="activity-product-img">'+
                                '<div class="product-tag" id="product-tag">'+
                                    '<span class="product-sign straight-down" ng-if="item.activityType[0] == 1 || item.mallProduct.activityType[1] == 1">直降</span>'+
                                    '<span class="product-sign full-discount" ng-if="item.activityType[0] == 2 || item.mallProduct.activityType[1] == 2">满减</span>'+
                                '</div>'+
                            '</div>'+
                            '<div class="activity-product-title"><span class="self-store" ng-if="item.merchantType != 2 && item.merchantType">[自营]</span>{{item.productName}}</div>'+
                            '<div class="activity-product-detail">{{item.productTitle}}</div>'+
                            '<div class="activity-product-price">' +
                                '<span ng-bind="item.activityPrice?'+"'¥'+"+'item.activityPrice:'+"'¥'+"+'item.salePrice"></span>'+
                                '<span ng-if="item.activityPrice" class="salePrice" ng-bind="'+"'¥'+"+'item.salePrice"></span>' +
                            '</div>'+
                        '</li>'+
                        '<li class="show-more-box" ng-click="page.toStorePage(item.shopId)">'+
                            '<img src="imgs/more.png" style="width: 100%;">'+
                        '</li>'+
                    '</ul>',
        replace: true
    }
});
//微信等浏览器中提示在 浏览器打开网页
myApp.directive('isShowWeixin',function () {
    return {
        restrict: 'EA',
        template: 
        '<div class="black_all_win" ng-if="isWeixin" ng-click="isShowWeixin()">'+
			'<img ng-if="isWeixin==1" src="imgs/weixin/android_browser_tips.png"/>'+
			'<img ng-if="isWeixin==2" src="imgs/weixin/ios_browser_tips.png"/>'+
		'</div>',
        replace: true,
        controller:['$scope','$http','$rootScope','$stateParams',function($scope,$http,$rootScope,$stateParams){
		    //是否来自app //from: 0 非APP内;
		    $scope.isFromApp = true;
		    //是否来自app 不是隐藏分享按钮
		   	$scope.isShowShar = true;
		    if($rootScope.urlParameter('from') == '0'){
		       	$scope.isFromApp = false;
		       	$scope.isShowShar = false;
		       	$scope.whereIsFrom = $rootScope.urlParameter('from');
		   	};
        	//在浏览器打开的提示
		    $scope.isShowWeixin = function(){
		    	$scope.isWeixin = undefined;
		    };
		    //是否下载APP的判断
		    $scope.isHaveApp = function(app_url,backup_url){ //(打开APP的连接，未安装APP需跳转的连接)
				var source = $rootScope.shareSource();
				if(source == 0){ //浏览器中
					if (isAndroid) {
						$('body').append("<iframe src='"+app_url+"' style='display:none'></iframe>");
						if(backup_url){  //如果没有下载APP 有backup_url就跳转没有就不跳
							var clickedAt = +new Date;
							setTimeout(function() {
								!window.document.webkitHidden && setTimeout(function() {
									if(+new Date - clickedAt < 2000) {
										window.location = backup_url;
									}
								}, 500);
							}, 1000);
						};
					}else if (isiOS) {
			            location.href = app_url;
			           	if(backup_url){
							var clickedAt = +new Date;
							setTimeout(function() {
								!window.document.webkitHidden && setTimeout(function() {
									if(+new Date - clickedAt < 2000) {
										window.location = backup_url;
									}
								}, 500);
							}, 1000);
						};
			        };
				}else{
					if(isAndroid){
						$scope.isWeixin = 1;
					}else if (isiOS) {
						$scope.isWeixin = 2;
					};
				};
			};
        }]
    };

});

myApp.directive('toastTpl',function () { //提示模板，字数少的模板
    return {
        restrict: 'EA',
        template: '<div class="toast"></div>',
        replace: true
    };

});
//pop提示框，字数不限
myApp.directive('toastLong',function () {
    return {
        restrict: 'EA',
        template: '<div class="toast-long"></div>',
        replace: true
    };

});

myApp.directive('emptyTpl',function () { //接口返回控制，-1提示页面
    return {
        restrict: 'EA',
        template: '<div class="empty-page">' +
                        '<div class="wifi-icon"></div>'+
                        '<div class="wifi-text">当前网络不稳定</div>'+
                        '<div class="reload-btn" ng-click="reloadBtnOnClick()">重新加载</div>' +
                  '</div>',
        replace: true
    };

});

myApp.directive('loadingTpl',function () {  // loading图标
    return {
        restrict: 'EA',
        template: '<div class="loading-tpl">' +
                        '<div class="loading-circle">' +
                        '</div>' +
                        '<span class="loading-icon"></span>' +
                    '</div>',
        replace: true
    };
});

myApp.directive('loading',function () {  // loading图标
    return {
        restrict: 'EA',
        template: '<div class="black_pop"><div class="loading-circle loading_center"></div></div>',
        replace: true
    };
});

myApp.directive('errorPageTpl',function () {  // 异常页面模板
    return {
        restrict: 'EA',
        template: '<div class="error-page" ng-click="page.refreshPage()" ng-if="data.showErrorPage == 1">' +
                        '<div class="error-icon">' +
                        '<img ng-src="{{data.errorImg}}">' +
                        '</div>' +
                        '<div class="error-text">{{data.errorText}}</div>' +
                  '</div>',
        replace: true
    };
});

myApp.directive('goTop',function () {//返回顶部样式
    return {
        restrict: 'EA',
        template: '<div class="go-top" ng-click="goTop()"></div>',
        replace: true
    };

});

//分享的 正则判断
myApp.directive('inviteRegexp', ['$parse', function ($parse) {
    return {
        restrict: 'EA',
        controller:['$scope','$http','$rootScope','$state',function($scope,$http,$rootScope,$state){
        	//正则表达式判断
			var phones = $(".phone"),phones_re = /^1[3|4|5|7|8]\d{9}$/;
			var passwords = $(".password"),passwords_re = /^[a-z0-9]{6,20}$/i;
			var names = $('.name'),name_re = /^[\u4E00-\u9FA5]+$/;   
			names.blur(function(){
				if(!name_re.test(names.val())){
					names.val("");
					$scope.isShowPop('姓名格式不正确');
				};
			});
			phones.blur(function(){
				if(!phones_re.test(phones.val())){
					phones.val("");
					$scope.isShowPop('请输入正确的手机号');
					$rootScope.globalData.code_type = true;
				}else{
					$rootScope.globalData.code_type = false;
				};
			});
			passwords.blur(function(){
				if(!passwords_re.test(passwords.val())){
					passwords.val("");
					$scope.isShowPop('密码格式不正确');
				};
			});
        }]
    };
}]);

//死数据-横向产品
myApp.directive('productListX',function () {
    return {
        restrict: 'EAC',
        template: 
			'<div class="pro_box" ng-click="toDetailPage(product.productId,product.productLable)">'+
				'<div class="pro_img">'+
					'<img class="placeholder_big" ng-src="{{product.pictureAddr}}"/>'+
					'<text class="list_activity_logo">直降</text>'+
				'</div>'+
				'<p class="pro_title out_hidden2" ng-bind="product.productTitle"></p>'+
				'<div class="pro_price" >'+
					'<span class="ellipsis" ng-bind="product.activityPrice?'+"'¥'+"+'product.activityPrice:'+"'¥'+"+'product.salePrice"></span>'+
					'<span class="price_mini ellipsis" ng-if="product.activityPrice" ng-bind="'+"'¥'+"+'product.salePrice"></span>'+
				'</div>'+
			'</div>',
        replace: true
    };

});










