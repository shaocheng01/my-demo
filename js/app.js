/**
 * Created by Dell6440 on 2017/05/09.
 */
var myApp = angular.module("myApp", ['ui.router']);
var u = navigator.userAgent;
var isAndroid = u.indexOf('Android') > -1 || u.indexOf('Adr') > -1;
var isiOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/);

myApp.run(['$rootScope', '$location', '$timeout', '$http', '$q', '$state', '$window', '$templateCache','weiXinShare', function($rootScope, $location, $timeout, $http, $q, $state, $window, $templateCache,weiXinShare) {
	$rootScope.data_time = '获取验证码';
	$rootScope.signKey = 'TianSHI3FchIkhKK';
	$rootScope.globalData = {
		code_type: false,
		pages: 0,
		data_time: '获取验证码',
		isShowToast: false,
		toastText: '',
		
		titleName: ''
	};
	//公共变量 -- gao
	$rootScope.appInfo = {
		jsessionId:"", 	//用户唯一标识
		invite_code:"",		//邀请码
		invite_name:""		//用户名||手机号
	};
	$rootScope.getSignKey = function() {
		$http({
			method: "post",
			url: config.serverHost + 'sign/getSignKey',
			data: {},
		}).success(function(res) {
			if(res.code == "1") {
				localStorage.setItem('sk', res.data.newSignKey);
				$rootScope.signKey = res.data.newSignKey;
			}
		})
	};

	if(localStorage.getItem('sk')) {
		$rootScope.signKey = localStorage.getItem('sk');
	} else {
		$rootScope.getSignKey();
	};
	//清除 anjular.js HTML缓存
	var stateChangeSuccess = $rootScope.$on('$stateChangeSuccess', stateChangeSuccess);

	function stateChangeSuccess($rootScope) {
		$templateCache.removeAll();
	};

	//++++++++++++++++++++++++++    md5,aes加密数据处理公共方法    ++++++++++++++++++++++++++

	$rootScope.aesFunc = function(schema, type, dataInfo, j) { //md5,aes数据处理方法，ajax参数加密处理
		var obj = {
			"schema": schema,
			"deviceType": "2",
			"netWorkType": "1",
			"jsessionId": j,
			"type": type,
			"dataInfo": dataInfo
		};
		// console.log($rootScope.signKey );

		var sortObj = objKeySort(obj);
		var sourceVal = getObjVal(sortObj).replace(/\s/g, ' ');
		var md5str = md5(sourceVal).toUpperCase();
		obj.sign = md5str;
		var aesstr = JSON.stringify(obj);
		var aes = Encrypt(aesstr);
		var useData = {};
		var reval = JSON.stringify({
			'reqdata': aes
		});

		// console.log("加密中获取： ", $rootScope.signKey)

		function Encrypt(word) { //AES ECB加密方法
			var key = CryptoJS.enc.Utf8.parse($rootScope.signKey);
			var srcs = CryptoJS.enc.Utf8.parse(word);
			var encrypted = CryptoJS.AES.encrypt(srcs, key, {
				mode: CryptoJS.mode.ECB,
				padding: CryptoJS.pad.Pkcs7
			});
			return encrypted.toString();
		}

		function getObjVal(s) { //返回排序后的字符串
			var signKey = [$rootScope.signKey];
			var arr = ['#'];
			for(var i in s) {
				if(typeof s[i] == "object") {
					arr.push(s[i] + '#');
				} else {
					arr.push(s[i] + '#');
				}
			}
			return arr.concat(signKey).join('');
		}

		function objKeySort() {
			var newkey = Object.keys(obj).sort();
			var newObj = {};
			for(var i = 0; i < newkey.length; i++) { //遍历newkey数组
				newObj[newkey[i]] = obj[newkey[i]]; //向新创建的对象中按照排好的顺序依次增加键值对
			}
			return newObj; //返回排好序的新对象
		}
		useData.req = reval;
		return useData;
	};

	$rootScope.AjaxFunc = function(addr, param, successFunc) { //请求接口方法
		try {
			$http({
				url: config.serverHost + addr,
				data: param,
				method: 'post'
			}).success(function(res) {
				if(res.code == "9003") {
					$rootScope.getSignKey();
					$('.empty-page').show();
				}
				$('.empty-page').hide();
				successFunc(res);
			});
		} catch(e) {}
	};

	$rootScope.reloadBtnOnClick = function() {
		$window.location.reload();
	};

	$rootScope.urlParameter = function(key_name) { //获取URL参数方法
		var reg = new RegExp("(^|&)" + key_name + "=([^&]*)(&|$)");
		var urlBackData = decodeURI($location.url().split('?')[1]);
		if(urlBackData) {
			var rs = urlBackData.match(reg);
			if(rs != null) return unescape(rs[2]);
			return null;
		}
	};

	$rootScope.maskerCanScroll = function(ele) { //处理收益表蒙层弹框可滑动方法
		$(ele).unbind('touchmove');
	};

	$rootScope.maskerStopScroll = function(ele) { //处理收益表蒙层弹框可滑动方法
		$(ele).bind('touchmove', function(event) {
			event.preventDefault();
		}, false);
	};

	$rootScope.changeTitle = function(title_name) { //修改页面title方法
		// console.log(title_name);
		$rootScope.globalData.titleName = title_name;
		var $body = $('body');
		// hack在微信等webview中无法修改document.title的情况
		var $iframe = $('<iframe style="display:none;"></iframe>').on('load', function() {
			setTimeout(function() {
				$iframe.off('load').remove();
			}, 0);
		}).appendTo($body);
	};

	$rootScope.shareSource = function() {
		var ua = navigator.userAgent.toLowerCase(); //由于微信在6.0.2的时候做了新的策略，使得微信的分享功能在新版本变得不一样，为了兼容新旧版本，这里做了区分操作,新浪weibo客户端返回1，qq客户端返回2，微信小于6.0.2版本返回3，微信大于等于6.0.2版本返回4，其它返回0
		if(ua.match(/weibo/i) == "weibo") {
			return 1;
		} else if(ua.indexOf('qq/') != -1) {
			return 2;
		} else if(ua.match(/MicroMessenger/i)=="micromessenger"){
			var v_weixin = ua.split('micromessenger')[1];
			v_weixin = v_weixin.substring(1, 6);
			v_weixin = v_weixin.split(" ")[0];
			if(v_weixin.split('.').length == 2){
				v_weixin=v_weixin + '.0';
			}
			if(v_weixin < '6.0.2') {
				return 3;
			} else {
				return 4;
			};
		} else {
			return 0;
		};
	};
	//微信 的配置信息
	var isFrom = $rootScope.shareSource();
   	if(isFrom==2||isFrom==3||isFrom==4){
 		var ajax_url = location.origin + location.pathname + location.search;
		var dataInfo = JSON.stringify({
	           "shareUrl": ajax_url
	        });
		var req = $rootScope.aesFunc('weChat', 'share', dataInfo , "");
	
		function wein_data(){
		    var result;
		    $.ajax({
		    	type: "post",
		        dataType:'json',
		        url : config.serverHost+"user/weChat/share",
		        data: req,
		        async:false,//改成同步加载了
		        success : function(data){
		            result = data;
		        }
		    });
		    return result;
		}
		var data_weixin = wein_data();//这里可以直接拿到数据
		wx.config({
		    debug: false,
		    appId: config.weiXinAppId,//微信公众号ID
		    timestamp: data_weixin.data.timestamp,   /*时间戳*/
		    nonceStr: data_weixin.data.nonceStr,		/*随机串*/
		    signature: data_weixin.data.signature,	/*加密后的用户信息码*/
		    jsApiList: [
		    	'checkJsApi',
		        'onMenuShareTimeline',
		        'onMenuShareAppMessage',
		        'onMenuShareQQ',
		        'onMenuShareWeibo',
		        'onMenuShareQZone',
		        'hideMenuItems',
		        'showMenuItems',
		        'hideAllNonBaseMenuItem',
		        'showAllNonBaseMenuItem',
		        'translateVoice',
		        'startRecord',
		        'stopRecord',
		        'onVoiceRecordEnd',
		        'playVoice',
		        'onVoicePlayEnd',
		        'pauseVoice',
		        'stopVoice',
		        'uploadVoice',
		        'downloadVoice',
		        'chooseImage',
		        'previewImage',
		        'uploadImage',
		        'downloadImage',
		        'getNetworkType',
		        'openLocation',
		        'getLocation',
		        'hideOptionMenu',
		        'showOptionMenu',
		        'closeWindow',
		        'scanQRCode',
		        'chooseWXPay',
		        'openProductSpecificView',
		        'addCard',
		        'chooseCard',
		        'openCard'
		    ]
		});
 	};
 	//调用app分享、获取邀请码等逻辑方法
 	$rootScope.goAppOrDownload = function(url_,title,img,info,other_url){ //(分享地址，分享标题，分享图片，分享描述，连接需要的其他参数)
 		var share_url="";
 		var other_ = other_url?'&'+other_url:'';
 		//针对 分享出去的页面 -转发
 		if($rootScope.urlParameter('code')){
			$rootScope.appInfo.invite_code = $rootScope.urlParameter('code');
		};
		if($rootScope.urlParameter('inviteMobile')){
			$rootScope.appInfo.invite_name = $rootScope.urlParameter('inviteMobile');
		};
		//from: 0 非APP内; 分享出去的页面都要加上from=0
		if($rootScope.appInfo.invite_code){
			share_url = url_ + "code=" + $rootScope.appInfo.invite_code+"&inviteMobile="+$rootScope.appInfo.invite_name+"&from=0"+other_;
		   	//微信转发
			weiXinShare.share(share_url, title, info, img);
		};
		//针对 APP内页面
 		
		//获取邀请码
		function getCode(j){
			var dataInfo = JSON.stringify({});
			var req = $rootScope.aesFunc('userApi','getInviteId',dataInfo,j);
		   	$rootScope.AjaxFunc('user/userApi/getInviteId', req, function (res) {
		   		if (res.code == "1") {
		           	$rootScope.appInfo.invite_code = res.data.inviteId;
		           	$rootScope.appInfo.invite_name = res.data.inviteMobile;
		           	share_url = url_ + "code=" + $rootScope.appInfo.invite_code+"&inviteMobile="+$rootScope.appInfo.invite_name+"&from=0"+other_;
		      	}else if(res.code == "1005"){
		      		//未登录状态
		      		clientInterface.openLoginPage(function (j) {
		   				$rootScope.appInfo.jsessionId = j;
		   				getCode(j);
		            });
		      	};
		   	});
		};
		//获取用户登录ID
//		getCode($rootScope.appInfo.jsessionId);
		//如果没有invite_code 就通过jsessionId来获取invite_code
		if(!$rootScope.appInfo.invite_code){
			clientInterface.getJSessionId( function (j) { //获得用户登录初始信息
		   		if(j){
		   			$rootScope.appInfo.jsessionId = j;
		   			getCode(j);
		   		};
		    });
		};
		//调用原生分享
		$rootScope.click_share = function(){
			if($rootScope.appInfo.jsessionId){
				if($rootScope.appInfo.invite_code){
					var datas = {"title":title,"imgUrl":img,"link":share_url,"desc":info};
	    			clientInterface.goShare(datas ,function (res) {});
				}else{
					$rootScope.isShowPop("分享失败，请稍后重试");
				};
	   		}else{
	   			clientInterface.openLoginPage(function (j) {
	   				$rootScope.appInfo.jsessionId = j;
	   				getCode(j);
	            });
	   		};
		};
		var datas = {
			"code":$rootScope.appInfo.invite_code,
			"name":$rootScope.appInfo.invite_name
		};
		return datas
 	};
 	//弹框提示
	$rootScope.isShowPop = function(texts,time){
		var t = time?time:800;
		$('.toast-long').text(texts).fadeIn(0);
		setTimeout(function() {
			$('.toast-long').fadeOut();
		}, t);
	};
}]);
myApp.config(['$stateProvider', '$urlRouterProvider', '$httpProvider',
	function($stateProvider, $urlRouterProvider, $httpProvider) {
		'use strict';
		$stateProvider.state('store', { //店铺首页
			url: '/store/:shopId/:jsessionId',
			views: {
				'webIndexView': {
					templateUrl: 'pages/store.html',
					controller: 'storeCtrl'
				}
			}
		}).state('detail', { //商品详情页H5部分
			url: '/detail',
			views: {
				'webIndexView': {
					templateUrl: 'pages/product_detail.html',
					controller: 'detailCtrl'
				}
			}
		}).state('license', { //营业执照页
			url: '/license/:shopId',
			views: {
				'webIndexView': {
					templateUrl: 'pages/license.html',
					controller: 'licenseCtrl'
				}
			}
		}).state('track', { //订单跟踪页
			url: '/track',
			views: {
				'webIndexView': {
					templateUrl: 'pages/track.html',
					controller: 'trackCtrl'
				}
			}
		}).state('help', { //帮助中心页面
			url: '/help',
			views: {
				'webIndexView': {
					templateUrl: 'pages/help.html',
					controller: 'helpCtrl'
				}
			}
		}).state('helpDetail', { //帮助中心详情页
			url: '/helpDetail',
			views: {
				'webIndexView': {
					templateUrl: 'pages/help_detail.html',
					controller: 'helpCtrl'
				}
			}
		}).state('activitystore', { //店铺专题活动页
			url: '/activitystore',
			views: {
				'webIndexView': {
					templateUrl: 'pages/activity_store.html',
					controller: 'activityStoreCtrl'
				}
			}
		}).state('activitycentre', { //会场专题活动页
			url: '/activitycentre',
			views: {
				'webIndexView': {
					templateUrl: 'pages/activity_centre.html',
					controller: 'activityCentreCtrl'
				}
			}
		}).state('activitybrand', { //品牌专题活动页
			url: '/activitybrand',
			views: {
				'webIndexView': {
					templateUrl: 'pages/activity_brand.html',
					controller: 'activityBrandCtrl'
				}
			}
		}).state('activityproduct', { //产品专题活动页
			url: '/activityproduct/:channelId/:specialId/:jsessionId',
			views: {
				'webIndexView': {
					templateUrl: 'pages/activity_product.html',
					controller: 'activityProCtrl'
				}
			}
		}).state('aftersale', {
			url: '/aftersale',
			views: {
				'webIndexView': {
					templateUrl: 'pages/aftersale_progress.html',
					controller: 'aftersaleCtrl'
				}
			}
		}).state('agreement', {
			url: '/agreement',
			views: {
				'webIndexView': {
					templateUrl: 'pages/agreement.html'
				}
			}
		}).state('secret', {
			url: '/secret',
			views: {
				'webIndexView': {
					templateUrl: 'pages/secret.html'
				}
			}
		}).state('coupon', {
			url: '/coupon',
			views: {
				'webIndexView': {
					templateUrl: 'pages/coupon.html'
				}
			}
		}).state('faq', {
			url: '/faq',
			views: {
				'webIndexView': {
					templateUrl: 'pages/faq.html'
				}
			}
		}).state('delivery', {
			url: '/delivery',
			views: {
				'webIndexView': {
					templateUrl: 'pages/delivery.html'
				}
			}
		}).state('receipt', {
			url: '/receipt',
			views: {
				'webIndexView': {
					templateUrl: 'pages/receipt.html'
				}
			}
		}).state('hse', { //帮助中心二级页面
			url: '/hse',
			views: {
				'webIndexView': {
					templateUrl: 'pages/hse.html',
					controller: 'hseCtrl'
				}
			}
		}).state('hsea', { //三级页面退换货政策
			url: '/hsea',
			views: {
				'webIndexView': {
					templateUrl: 'pages/hsea.html'
				}
			}
		}).state('hseb', { //三级页面退货流程
			url: '/hseb',
			views: {
				'webIndexView': {
					templateUrl: 'pages/hseb.html'
				}
			}
		}).state('hsec', { //三级页面退款流程
			url: '/hsec',
			views: {
				'webIndexView': {
					templateUrl: 'pages/hsec.html'
				}
			}
		}).state('hsed', { //三级页面换货流程
			url: '/hsed',
			views: {
				'webIndexView': {
					templateUrl: 'pages/hsed.html'
				}
			}
		}).state('hsee', { //三级页面退换货运费
			url: '/hsee',
			views: {
				'webIndexView': {
					templateUrl: 'pages/hsee.html'
				}
			}
		}).state('chart', { //收益表
			url: '/chart',
			views: {
				'webIndexView': {
					templateUrl: 'pages/chart.html',
					controller: 'chartCtrl'
				}
			}
		}).state('wallet', { //钱包
			url: '/wallet',
			views: {
				'webIndexView': {
					templateUrl: 'pages/wallet.html',
					controller: 'walletCtrl'
				}
			}
		}).state('pocket', { //红包
			url: '/pocket',
			views: {
				'webIndexView': {
					templateUrl: 'pages/pocket.html',
					controller: 'redPocketCtrl'
				}
			}
		}).state('rule', { //抢红包规则
			url: '/rule',
			views: {
				'webIndexView': {
					templateUrl: 'pages/rule.html',
					controller: 'rule'
				}
			}
		}).state('share', { //分享
			url: '/share',
			views: {
				'webIndexView': {
					templateUrl: 'pages/share.html',
					controller: 'shareCtrl'
				}
			}
		}).state('invite_new_user', { //2000元大礼包 邀请新用户
			url: '/invite_new_user',
			views: {
				'webIndexView': {
					templateUrl: 'pages/invite_new_user.html',
					controller: 'invite_new_user'
				}
			}
		}).state('code', { //扫二维码跳转页
			url: '/code',
			views: {
				'webIndexView': {
					templateUrl: 'pages/code.html'
				}
			}
		}).state('error', { //链接地址错误提示页
			url: '/error',
			views: {
				'webIndexView': {
					templateUrl: 'pages/error.html'
				}
			}
		}).state('activity_floor', { //活动楼层
			url: '/activity_floor',
			views: {
				'webIndexView': {
					templateUrl: 'pages/activity_floor.html',
					controller: 'activity_floor'
				}
			}
		}).state('activity_floor_detail', { //活动楼层详情
			url: '/activity_floor_detail/:indexs',
			views: {
				'webIndexView': {
					templateUrl: 'pages/activity_floor_detail.html',
					controller: 'activity_floor_detail'
				}
			}
		}).state('article_list', { //文章列表
			url: '/article_list',
			views: {
				'webIndexView': {
					templateUrl: 'pages/article_list.html',
					controller: 'article_list'
				}
			}
		}).state('article_detail', { //文章详情
			url: '/article_detail',
			views: {
				'webIndexView': {
					templateUrl: 'pages/article_detail.html',
					controller: 'article_detail'
				}
			}
		}).state('article_flour', { //文章详情
            url: '/article_flour',
            views: {
                'webIndexView': {
                    templateUrl: 'pages/article_flour.html',
                    controller: 'article_detail'
                }
            }
        }).state('article_xiuxiu', { //文章详情
            url: '/article_xiuxiu',
            views: {
                'webIndexView': {
                    templateUrl: 'pages/article_xiuxiu.html',
                    controller: 'article_detail'
                }
            }
        })
        .state('buy_warehouse', { //仓买产品列表
			url: '/buy_warehouse',
			views: {
				'webIndexView': {
					templateUrl: 'pages/buy_warehouse.html',
					controller: 'buy_warehouse'
				}
			}
		})
        .state('brand_party', { //品牌盛宴
            url: '/brand_party',
            views: {
                'webIndexView': {
                    templateUrl: 'pages/brand_party.html'
                    // controller: 'brand_party'
                }
            }
        }).state('carnival', { //1026-1105狂欢购
            url: '/carnival',
            views: {
                'webIndexView': {
                    templateUrl: 'pages/carnival.html',
                    controller: 'carnival'
                }
            }
        }).state('download', { //1026-1105狂欢购
            url: '/download',
            views: {
                'webIndexView': {
                    templateUrl: 'pages/download.html',
                    controller: 'download'
                }
        	}
        }).state('double', { //11.11抢先购
            url: '/double',
            views: {
                'webIndexView': {
                    templateUrl: 'pages/double.html',
                    controller: 'double'
                }
            }
        }).state('activity_six',{//发现好物
        	url:'/activity_six',
        	views:{
        		'webIndexView':{
        			templateUrl:'pages/activity_six.html',
        			controller:'activity_six'
        		}
        	}
        	
        }).state('activity_good',{//水壶
        	url:'/activity_good',
        	views:{
        		'webIndexView':{
        			templateUrl:'pages/activity_good.html',
         			controller:'activity_good'
        		}
        	}
        }).state('activity_redwine',{//红酒
        	url:'/activity_redwine',
        	views:{
        		'webIndexView':{
        			templateUrl:'pages/activity_redwine.html',
	     			controller:'activity_redwine'
        		}
        	}
        }).state('activity_wristwatch',{//腕表
        	url:'/activity_wristwatch',
        	views:{
        		'webIndexView':{
        			templateUrl:'pages/activity_wristwatch.html',
	     			controller:'activity_wristwatch'
        		}
        	}
        }).state('activity_jewelry',{//珍珠
        	url:'/activity_jewelry',
        	views:{
        		'webIndexView':{
        			templateUrl:'pages/activity_jewelry.html',
	     			controller:'activity_jewelry'
        		}
        	}
        }).state('activity_tea',{//茶
        	url:'/activity_tea',
        	views:{
        		'webIndexView':{
        			templateUrl:'pages/activity_tea.html',
	     			controller:'activity_tea'
        		}
        	}
        }).state('activity_food',{//食品活动页
            url:'/activity_food',
            views:{
                'webIndexView':{
                    templateUrl:'pages/activity_food.html',
                    controller:'activity_food'
                }
            }
        }).state('demo',{//demo
            url:'/demo',
            views:{
                'webIndexView':{
                    templateUrl:'pages/demo.html',
                    controller:'demo'
                }
            }
        })

		$urlRouterProvider.otherwise('/error');

		// 使angular $http post提交和jQuery一致
		$httpProvider.defaults.headers.put['Content-Type'] = 'application/x-www-form-urlencoded';
		$httpProvider.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';
		// Override $http service's default transformRequest
		$httpProvider.defaults.transformRequest = [function(data) {
			/**
			 * The workhorse; converts an object to x-www-form-urlencoded serialization.
			 * @param {Object} obj
			 * @return {String}
			 */
			var param = function(obj) {
				var query = '';
				var name, value, fullSubName, subName, subValue, innerObj, i;

				for(name in obj) {
					value = obj[name];

					if(value instanceof Array) {
						for(i = 0; i < value.length; ++i) {
							subValue = value[i];
							fullSubName = name + '[' + i + ']';
							innerObj = {};
							innerObj[fullSubName] = subValue;
							query += param(innerObj) + '&';
						}
					} else if(value instanceof Object) {
						for(subName in value) {
							subValue = value[subName];
							fullSubName = name + '[' + subName + ']';
							innerObj = {};
							innerObj[fullSubName] = subValue;
							query += param(innerObj) + '&';
						}
					} else if(value !== undefined && value !== null) {
						query += encodeURIComponent(name) + '=' + encodeURIComponent(value) + '&';
					}
				}

				return query.length ? query.substr(0, query.length - 1) : query;
			};

			return angular.isObject(data) && String(data) !== '[object File]' ? param(data) : data;
		}];
	}
]);