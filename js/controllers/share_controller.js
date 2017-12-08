/**
 * Created by Dell6440 on 2017/8/23.
 */
myApp.controller('shareCtrl', ['$scope', '$location', '$http', '$rootScope', '$state', 'getCode', 'weiXinShare', function($scope, $location, $http, $rootScope, $state, getCode, weiXinShare) {
	
	$scope.data = {
		phone: '',
		phoneCode: '',
		inviteId: '',
		downloadUrl: config.urlIp+"#/download"
	};
	if($rootScope.urlParameter('jsessionId')) {
		$scope.data.jsessionId = $rootScope.urlParameter('jsessionId');
	}
	if($rootScope.urlParameter('inviteId')) {
		$scope.data.inviteId = $rootScope.urlParameter('inviteId');
	}
	$rootScope.changeTitle('快来领2000元新人大礼包！');

	var masker = $('.share-login-wp');
	var successToast = $('#success');
	var failedToast = $('#failed');
	// var source = $rootScope.shareSource();

	
	//  分享
	var share_url = config.urlIp + "#/share?inviteId=" + $scope.data.inviteId;
	weiXinShare.share(share_url, shareData.red_packet.title, shareData.red_packet.info, shareData.red_packet.img);

	$scope.getGiftBtnClick = function() {
		masker.show();
		failedToast.stop().hide();
		successToast.stop().hide();
		$scope.codeNumber = "";
		$scope.phoneNumber = "";
	};

	$scope.closeButtonClick = function() {
		masker.hide();
	};
	//获取验证码
	$scope.getCodeBtnClick = function() {
		if($rootScope.globalData.code_type == true) {
			return;
		}
		$rootScope.globalData.code_type = true;
		var reg = /^1[3|4|5|7|8][0-9]{9}$/; //验证规则
		var phone = $('#phone').val();
		var flag = reg.test(phone); //true
		// console.log($rootScope.globalData.code_type);

		if(flag) {
			$scope.getCode(phone);
			getCode.getCodes();
			$scope.data.phone = phone;
		} else {
			$('.toast').text('请输入正确的手机号').fadeIn(0);
			setTimeout(function() {
				$('.toast').fadeOut();
			}, 800);
			$rootScope.globalData.code_type = false;
		}
	};
	//立即领取
	$scope.only_click = true;
	$scope.maskerGetGiftBtn = function() {
		var phone = $('#phone').val();
		var codeNumber = $('#phone-code').val();
		var reg = /^1[3|4|5|7|8][0-9]{9}$/; //验证规则
		var flag = reg.test(phone);
		if(phone && codeNumber) {
			if(!flag) {
				$scope.phoneNumber = "";
				$scope.codeNumber = "";
				$('.toast').text('请输入正确的手机号').stop().fadeIn(0);
				setTimeout(function() {
					$('.toast').stop().fadeOut();
				}, 800);
				return;
			};
			if($scope.only_click) {
				$scope.only_click = false;
				var dataInfo = JSON.stringify({
					"serialNumber": "",
					"mobileNumber": phone,
					"mobileCode": codeNumber,
					"inviteId": $scope.data.inviteId
				});
				var req = $rootScope.aesFunc('userLogin', 'receiveNewCoupon', dataInfo, '');
				$rootScope.AjaxFunc('user/userLogin/receiveNewCoupon', req, function(res) {
					// console.log(res)
					if(res.code == "1007") {
						$('.toast').text('验证码有误').stop().fadeIn(0);
						setTimeout(function() {
							$('.toast').stop().fadeOut();
						}, 800);
					} else if(res.code == "xx002") { //code=xx002 手机号被注册，不是新用户
						failedToast.stop().show();
						successToast.stop().hide();
                       	setTimeout(function () {
                           failedToast.stop().hide();
                           masker.hide();
                           window.location.href = $scope.data.downloadUrl;
                        },3000);
                    } else if(res.code == "1") { //领取成功
						successToast.stop().show();
						failedToast.stop().hide();
                        setTimeout(function () {
                           successToast.stop().hide();
                           masker.hide();
                           window.location.href = $scope.data.downloadUrl;
                        },3000);
                    } else {
						$('.toast').text(res.msg).stop().fadeIn(0);
						setTimeout(function() {
							$('.toast').stop().fadeOut();
						}, 800);
					};
					$scope.phoneNumber = "";
					$scope.codeNumber = "";
					$scope.only_click = true;
				});
			};
		} else {
			$('.toast').text('请完善您的信息').stop().fadeIn(0);
			setTimeout(function() {
				$('.toast').stop().fadeOut();
			}, 800);
		};

	};
	$scope.getCode = function(phone) {
		var dataInfo = JSON.stringify({
			"mobileNumber": phone,
			"codeType": "1"
		});
		var req = $rootScope.aesFunc('send', 'mobile', dataInfo, '');
		$rootScope.AjaxFunc('user/send/mobile', req, function(res) {
			// console.log(res)
			if(res.code == "1") {
				$scope.data.phoneCode = res.data.mobileCode;
			}
		});
	};
	//下载
	$scope.upDown = function(phone) {
		if(isAndroid){
			var dataInfo = JSON.stringify({
				"version": "1.0.0",
				"innerVersion": "100",
				"appType": "2"
			});
			$(".black_pop").stop().fadeIn(0);
			var req = $rootScope.aesFunc('appApi', 'validateVersion', dataInfo, '');
			$rootScope.AjaxFunc('user/appApi/validateVersion', req, function(res) {
				$(".black_pop").stop().fadeOut(0);
				location.href = res.data.downloadAddr;
			});
		}else if(isiOS){
			location.href = "https://itunes.apple.com/us/app/%E7%8E%9B%E9%9B%85%E5%85%AD%E6%9C%88-%E6%96%B0%E4%BA%BA%E9%80%812000%E5%85%83%E5%A4%A7%E7%A4%BC%E5%8C%85/id1289197873?l=zh&ls=1&mt=8";
		};
		
	};
}]);

//邀请注册页面
myApp.controller('invite_new_user', ['$scope', '$location', '$http', '$rootScope', '$state', 'getCode', 'weiXinShare', function($scope, $location, $http, $rootScope, $state, getCode, weiXinShare) {
	$scope.data = {
		phone: '',
		phoneCode: '',
		inviteId: '',
		downloadUrl: config.urlIp+"#/download"
	};
	$scope.inviteMobile = ''
	if($rootScope.urlParameter('jsessionId') != 'undefined') {
		$scope.data.jsessionId = $rootScope.urlParameter('jsessionId');
	}
	if($rootScope.urlParameter('inviteId') != 'undefined') {
		$scope.data.inviteId = $rootScope.urlParameter('inviteId');
	}
	if($rootScope.urlParameter('inviteMobile') != 'undefined') {
		$scope.inviteMobile = $rootScope.urlParameter('inviteMobile');
	}
	$rootScope.changeTitle('快来领2000元新人大礼包！');

	//  分享
	var share_url = config.urlIp + "#/invite_new_user?inviteId=" + $scope.data.inviteId+"&inviteMobile="+$scope.inviteMobile;
	weiXinShare.share(share_url, shareData.red_packet.title, shareData.red_packet.info, shareData.red_packet.img);
	
	//获取验证码
	$rootScope.code_type = true;
	$scope.getCodeBtnClick = function(phone) {
		if($rootScope.code_type){
			if(phone){
				$rootScope.code_type = false;
				$scope.getCode(phone);
				getCode.getCodes();
			}else{
				$rootScope.isShowPop("请填写您的手机号码");
			};
		};
		
	};
	$scope.getCode = function(phone) {
		var dataInfo = JSON.stringify({
			"mobileNumber": phone,
			"codeType": "1"
		});
		var req = $rootScope.aesFunc('send', 'mobile', dataInfo, '');
		$rootScope.AjaxFunc('user/send/mobile', req, function(res) {
			if(res.code == "1") {
				
			}else{
				$rootScope.isShowPop(res.msg);
			};
		});
	};
	//立即领取
	function go_down(){
		setTimeout(function () {
			$state.go("download");
//         window.location.href = $scope.data.downloadUrl;
        },3000);
	};
	//立即下载
	$scope.go_down_now = function(){
		$state.go("download");
//		window.location.href = $scope.data.downloadUrl;
	};
	$scope.only_click = true;
	$scope.maskerGetGiftBtn = function(phone,codeNumber) {
		if(phone && codeNumber) {
			if($scope.only_click) {
				$scope.only_click = false;
				var dataInfo = JSON.stringify({
					"serialNumber": "",
					"mobileNumber": phone,
					"mobileCode": codeNumber,
					"inviteId": $scope.data.inviteId
				});
				var req = $rootScope.aesFunc('userLogin', 'receiveNewCoupon', dataInfo, '');
				$rootScope.AjaxFunc('user/userLogin/receiveNewCoupon', req, function(res) {
					// console.log(res)
					if(res.code == "1007") {
						$rootScope.isShowPop("验证码有误");
					} else if(res.code == "xx002") { //code=xx002 手机号被注册，不是新用户
						$rootScope.isShowPop("您已领取过大礼包，去平台参与其它优惠活动吧！",3000);
                       	go_down();
                    } else if(res.code == "1") { //领取成功
						$rootScope.isShowPop("恭喜你成为玛雅六月的一员，用你的大礼包购物去吧！",3000);
                       	go_down();
                    } else {
                    	$rootScope.isShowPop(res.msg);
					};
					$scope.input_phone = "";
					$scope.input_code = "";
					$scope.only_click = true;
				});
			};
		} else {
			$rootScope.isShowPop("请完善您的信息");
		};
	};
}]);

//APP下载页面
myApp.controller('download', ['$scope', '$location', '$http', '$rootScope', '$state', 'getCode', 'weiXinShare', function($scope, $location, $http, $rootScope, $state, getCode, weiXinShare){
	$('body,html').css('background','#F5F5F5');
	$scope.img_num = [1,2,3,4,5];
	$rootScope.changeTitle('玛雅六月');
	if(isAndroid){
		$scope.down_text = "普通下载";
	}else if (isiOS) {
		$scope.down_text = "去App Store下载";
//		location.href = "https://itunes.apple.com/us/app/%E7%8E%9B%E9%9B%85%E5%85%AD%E6%9C%88-%E6%96%B0%E4%BA%BA%E9%80%812000%E5%85%83%E5%A4%A7%E7%A4%BC%E5%8C%85/id1289197873?l=zh&ls=1&mt=8";
	};
	//下载
	$scope.upDown = function(phone) {
		if(isAndroid){
			var source = $rootScope.shareSource();
			if(source == 0){ //浏览器中
				var dataInfo = JSON.stringify({
					"version": "1.0.0",
					"innerVersion": "100",
					"appType": "2"
				});
				$(".black_pop").stop().fadeIn(0);
				var req = $rootScope.aesFunc('appApi', 'validateVersion', dataInfo, '');
				$rootScope.AjaxFunc('user/appApi/validateVersion', req, function(res) {
					$(".black_pop").stop().fadeOut(0);
					location.href = res.data.downloadAddr;
				});
			}else{
				$scope.isWeixin = 1;
			};
		}else if (isiOS) {
			location.href = "https://itunes.apple.com/us/app/%E7%8E%9B%E9%9B%85%E5%85%AD%E6%9C%88-%E6%96%B0%E4%BA%BA%E9%80%812000%E5%85%83%E5%A4%A7%E7%A4%BC%E5%8C%85/id1289197873?l=zh&ls=1&mt=8";
		};
	};
}]);









