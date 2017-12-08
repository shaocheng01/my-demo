//************* 活动楼层 *************
myApp.controller('activity_floor',['$scope','$location','$http','$rootScope','$state','$stateParams',function ($scope,$location,$http,$rootScope,$state,$stateParams) {

	$scope.data={
		mini_img_url:"activity_floor",
		mini_list:[1,2,3,4,5,6,7,8,9,10]
	};

    $rootScope.changeTitle('玛雅六月开业盛典');
	function swiperslide(){
		//分会场小图
		var mini_swiper = new Swiper('#mini_swiper',{
		    slidesPerView : 'auto',
            freeMode : true,
		    slideToClickedSlide : true,
		    observer: true,//修改swiper自己或子元素时，自动初始化swiper
		    observeParents: true//修改swiper的父元素时，自动初始化swiper
		});
	}
	setTimeout(function(){
		swiperslide();
	},100);
	//获取数据
	$scope.lists = [];
	function list_json(){
	    var result;
		$.ajax({
	    	type: "get",
	        dataType:'json',
	        url : 'data/activity_floor.json?t=20170925',
	        async:false,//改成同步加载了
	        success : function(data){
	           	result = data.floor_list;
	        }
	    });
	    return result;
    }
   	$scope.lists = list_json();
	// 	点击滚动到相对应的楼层位置
	$scope.scrollPage = function(index){
		var top = $(".top_banner").outerHeight()+$("#mini_swiper").outerHeight();
		var floor_height = $(".floor_list").outerHeight();
		var top_ = top+floor_height*index;
        $("html,body").stop().animate({scrollTop:top_},500);
	};
	//跳转
	$scope.goNext = function(index,url){
		$state.go("activity_floor_detail",{'indexs': index});
	};
	//跳转原生
	$scope.toDetailPage = function (pid, pLable) {
        clientInterface.toProductDetails(pid, pLable,function (res) {});
    };

	$scope.goTop = function () {
        $("html,body").stop().animate({scrollTop:0},500);
    };

}]);
//************* 活动分会场 *************
myApp.controller('activity_floor_detail',['$scope','$location','$http','$rootScope','$state','$stateParams',function ($scope,$location,$http,$rootScope,$state,$stateParams) {
    $('html,body').css('background','#f4f4f4');
    if($stateParams.indexs) {
        $scope.show_index = Number($stateParams.indexs);
    };
    var num_index = $scope.show_index+1;
    var mini_title = "分会场";
    switch (num_index){
        case 1:
            mini_title = "吃货食堂";
            break;
        case 2:
            mini_title = "美轮美“换”";
            break;
        case 3:
            mini_title = "玛雅美人季";
            break;
        case 4:
            mini_title = "狂欢小儿国";
            break;
        case 5:
            mini_title = "国王生活馆";
            break;
        case 6:
            mini_title = "开业享放“价”";
            break;
        case 7:
            mini_title = "精致更精彩";
            break;
        case 8:
            mini_title = "奢品攻新季";
            break;
        case 9:
            mini_title = "燃情之夜";
            break;
        case 10:
            mini_title = "天下任我行";
            break;
        case 11:
            mini_title = "品牌盛宴";
            break;
    };
    $rootScope.changeTitle(mini_title);
    //获取数据
    function list_json(){
        var result;
        $.ajax({
            type: "get",
            dataType:'json',
            url : 'data/activity_floor.json?t=20170925',
            async:false,//改成同步加载了
            success : function(data){
                var num = $scope.show_index+1;
                result = data["floor"+num];
            }
        });
        return result;
    }

    function brand_json(){
        var result;
        $.ajax({
            type: "get",
            dataType:'json',
            url : 'data/brand_party.json?t=20170925',
            async:false,//改成同步加载了
            success : function(data){
                result = data;
            }
        });
        return result;
    }
//	$scope.floor_detail = [];
	if(num_index == 11) {
        $scope.floor_detail = brand_json();
    } else {
        $scope.floor_detail = list_json();
    };
    //跳转原生
    $scope.toDetailPage = function (pid, pLable) {
        clientInterface.toProductDetails(pid, pLable,function (res) {});
    };
}]);
//************* 红包规则 *************
myApp.controller('rule',['$scope','$location','$http','$rootScope','$state','$stateParams',function ($scope,$location,$http,$rootScope,$state,$stateParams) {
    $rootScope.changeTitle('红包规则');
    $scope.rule_unm = ["01","02","03","04","05","06","07","08","09","10"];
    if(isAndroid){
    	$scope.isAndroidOrIos = true;
    }else if(isiOS){
    	$scope.isAndroidOrIos = false;
    };
}]);

//************* 文章列表 发现好货 *************
myApp.controller('article_list',['$scope','$location','$http','$rootScope','$state','$stateParams',function ($scope,$location,$http,$rootScope,$state,$stateParams) {
	$('html,body').css('background','#f4f4f4');
	$rootScope.changeTitle('发现好货');
    //跳转原生
    $scope.toDetailPage = function (pid, pLable) {
        clientInterface.toProductDetails(pid, pLable,function (res) {});
    };
	//跳转
    $scope.goNext = function(urls){
        $state.go(urls);
//      $state.go(urls, {"from":"app"});
    };
}]);

//************* 文章详情页面 *************
myApp.controller('article_detail',['$scope','$location','$http','$rootScope','$state','$stateParams','weiXinShare',function ($scope,$location,$http,$rootScope,$state,$stateParams,weiXinShare) {
    var title = $('.homeRecordTitle').text();
    $('html,body').css('background','#fff');
    $(".headLineText img").css({'width':'100%','display':'block'});
	$rootScope.changeTitle(title);
	
	var url_ = config.urlIp + "#/" + $('.url_').text()+'?';
	//调用app分享、获取邀请码等逻辑方法
	var invite_data = $rootScope.goAppOrDownload(url_,title,shareData.shopping_treasure.img, shareData.shopping_treasure.info);
	//点击产品的判断
    $scope.toDetailPage = function (pid, pLable) {
		//来自app--跳转产品详情
      	if($scope.isFromApp){
      		clientInterface.toProductDetails(pid,pLable,function (res) {});
      	}else{
      		var app_url = "mayaliuyue://maya1618/app/shopdetails?productId="+pid+"&productLable="+pLable;
      		var other_url = config.urlIp+"#/invite_new_user?inviteId="+invite_data.code+"&inviteMobile="+invite_data.name;
      		$scope.isHaveApp(app_url, other_url);
      	};
    };
}]);

//************* 仓买 *************
myApp.controller('buy_warehouse',['$scope','$location','$http','$rootScope','$state','$stateParams',function ($scope,$location,$http,$rootScope,$state,$stateParams) {
	$('html,body').css('background','#f4f4f4');
	$rootScope.changeTitle('仓买');
	//获取数据
    function list_json(){
        var result;
        $.ajax({
            type: "get",
            dataType:'json',
            url : 'data/buy_warehouse.json',
            async:false,//改成同步加载了
            success : function(data){
                result = data;
            }
        });
        return result;
    };
    $scope.buy_list = list_json();
    //跳转原生
	$scope.toDetailPage = function (pid, pLable) {
        clientInterface.toProductDetails(pid, pLable,function (res) {});
    };
}]);
//******************** 1026-1105狂欢购 了不起的国货 *********************
myApp.controller('carnival',['$scope','$location','$http','$rootScope','$state','$stateParams',function ($scope,$location,$http,$rootScope,$state,$stateParams) {
    $('html,body').css('background','#f4f4f4');
   	var title = "了不起的国货";
    $rootScope.changeTitle(title);
    // 获取数据
    $scope.lists = [];
    $scope.listsb = [];
    $scope.tags = ['59元马上抢','99元马上抢','199元马上抢','299元马上抢'];
    $scope.comment_url = "https://h.maya1618.com/#/activityproduct/:channelId/:specialId/:jsessionId?specialId=";
	//产品-更多
    $scope.areaLinks = ['241','243','240','239'];
    //中间图片的列表
    $scope.centerImgList = ["265","263","266","264","219","242"];
    //banner图连接
    $scope.bottomLinks = ['217','248','187','282','235','353'];
    function list_json(){
        var result;
        $.ajax({
            type: "get",
            dataType:'json',
            url : 'data/carnival.json',
            async:false,//改成同步加载了
            success : function(data){
                result = data.area_block_list;
            }
        });
        return result;
    }
    function listb_json(){
        var result;
        $.ajax({
            type: "get",
            dataType:'json',
            url : 'data/carnival.json',
            async:false,//改成同步加载了
            success : function(data){
                result = data.bottom_block_list;
            }
        });
        return result;
    }
    $scope.lists = list_json();
    $scope.listsb = listb_json();
    
    var url_ = config.urlIp + "#/carnival?";
	//调用app分享、获取邀请码等逻辑方法
	//var invite_data = $rootScope.goAppOrDownload(url_,title,shareData.shopping_treasure.img, shareData.shopping_treasure.info);
    //跳转原生
//  $scope.toDetailPage = function (pid, pLable) {
//		//来自app--跳转产品详情
//    	if($scope.isFromApp){
//    		clientInterface.toProductDetails(pid,pLable,function (res) {});
//    	}else{
//    		var app_url = "mayaliuyue://maya1618/app/shopdetails?productId="+pid+"&productLable="+pLable;
//    		var other_url = config.urlIp+"#/invite_new_user?inviteId="+invite_data.code+"&inviteMobile="+invite_data.name;
//    		$scope.isHaveApp(app_url, other_url);
//    	};
//  };
}]);
//********************** 11.11抢先购 **********************
myApp.controller('double',['$scope','$location','$http','$rootScope','$state','$stateParams',function ($scope,$location,$http,$rootScope,$state,$stateParams) {
    $rootScope.changeTitle('11.11抢先购');
	//  图片跳转的专题连接
	$scope.activity_url = config.urlIp+"#/activityproduct/:channelId/:specialId/:jsessionId?";
	//  小白点个数
	$scope.lightspot_indexf = [0,1,2,3,4,5,6,7,8,9];
	$scope.lightspot_index = [0,1,2,3,4,5,6,7,8,9];
	//活动产品的获取
	$scope.lists = [];
	function list_json(){
	    var result;
		$.ajax({
	    	type: "get",
	        dataType:'json',
	        url : 'data/double.json?t=20170925',
	        async:false,//改成同步加载了
	        success : function(data){
	           	result = data;
	        }
	    });
	    return result;
    };
    var double_datas = list_json();
	//男生女生展示产品
    $scope.manDot = double_datas.double_man;
  	$scope.womanDot = double_datas.double_woman;
  	$scope.currentwoman = double_datas.double_woman[0];
  	$scope.currentman = double_datas.double_man[0];
    //10个产品
   	$scope.lists = double_datas.floor_list[2]; //改变每天的活动产品
   	$scope.lists_x = $scope.lists[9];
    //中间图片的列表
    $scope.banner_url_link = [{
    	"title":"生活攻略",
    	"info":"Life",
    	"ids":["336","388","436","434","384","387"],
    	"url_index":1
    },{
    	"title":"时尚攻略",
    	"info":"Fashion",
    	"ids":["435","438","440","443","444","437"],
    	"url_index":7
    },{
    	"title":"美食攻略",
    	"info":"Food",
    	"ids":["439","441","442","386"],
    	"url_index":13
    }];
    //点击人物上 热点并显示相应产品
	$scope.double_click = function(ids){ //女孩的
		$scope.currentwoman =$scope.womanDot[ids]
	};
	$scope.double_click_man = function(idx){//男孩的
		$scope.currentman = $scope.manDot[idx]
	};

	//调用app分享、获取邀请码等逻辑方法
	var url_ = config.urlIp + "#/double?";
	var invite_data = $rootScope.goAppOrDownload(url_,shareData.double_eleven.title,shareData.double_eleven.img, shareData.double_eleven.info);
  	//跳转原生
    $scope.toDetailPage = function (pid, pLable) {
		//来自app--跳转产品详情
      	if($scope.isFromApp){
      		clientInterface.toProductDetails(pid,pLable,function (res) {});
      	}else{
      		var app_url = "mayaliuyue://maya1618/app/shopdetails?productId="+pid+"&productLable="+pLable;
      		var other_url = config.urlIp+"#/invite_new_user?inviteId="+invite_data.code+"&inviteMobile="+invite_data.name;
      		$scope.isHaveApp(app_url, other_url);
      	};
    };
}]);
//******************发现好物****************************
myApp.controller('activity_six',['$scope','$location','$http','$rootScope','$state','$stateParams',function($scope,$location,$http,$rootScope,$state,$stateParams){
	$rootScope.changeTitle('发现好物');
	$('html,body').css('background','#f4f4f4');
	 function brand_json(){
        var result;
        $.ajax({
            type: "get",
            dataType:'json',
            url : 'data/activity_six.json?t=20170925',
            async:false,//改成同步加载了
            success : function(data){
                result = data;
            }
        });
        return result;
    }
	$scope.floor_detail = brand_json();
	$scope.activity_good = function(index,url){
		$state.go("activity_good",{'indexs': index});
	};
	$scope.activity_redwine = function(index,url){
		$state.go("activity_redwine",{'indexs': index});
	};
	$scope.activity_wristwatch = function(index,url){
		$state.go("activity_wristwatch",{'indexs': index});
	};
	$scope.activity_jewelry = function(index,url){
		$state.go("activity_jewelry",{'indexs': index});
	};
	$scope.activity_tea = function(index,url){
		$state.go("activity_tea",{'indexs': index});
	};
	$scope.toDetailPage = function (pid, pLable) {
        clientInterface.toProductDetails(pid, pLable,function (res) {});
    };

}]);
//*******************过滤水壶********************
myApp.controller('activity_good',['$scope','$location','$http','$rootScope','$state','$stateParams',function($scope,$location,$http,$rootScope,$state,$stateParams){
	$rootScope.changeTitle('净水壶');
	$('html,body').css('background','#f4f4f4');
	 function brand_json(){
        var result;
        $.ajax({
            type: "get",
            dataType:'json',
            url : 'data/water.json?t=20170925',
            async:false,//改成同步加载了
            success : function(data){
                result = data;
            }
        });
        return result;
    }
	$scope.floor_detail = brand_json();
		//调用app分享、获取邀请码等逻辑方法
	var url_ = config.urlIp + "#/activity_good?";
	var invite_data = $rootScope.goAppOrDownload(url_,shareData.activity_good.info,shareData.activity_good.img,shareData.activity_good.title);
	//跳转原生
    $scope.toDetailPage = function (pid, pLable) {
		//来自app--跳转产品详情
      	if($scope.isFromApp){
      		clientInterface.toProductDetails(pid,pLable,function (res) {});
      	}else{
      		var app_url = "mayaliuyue://maya1618/app/shopdetails?productId="+pid+"&productLable="+pLable;
      		var other_url = config.urlIp+"#/invite_new_user?inviteId="+invite_data.code+"&inviteMobile="+invite_data.name;
      		$scope.isHaveApp(app_url, other_url);
      	};
    };
}]);
//******************红酒*************************
myApp.controller('activity_redwine',['$scope','$location','$http','$rootScope','$state','$stateParams',function($scope,$location,$http,$rootScope,$state,$stateParams){
	$rootScope.changeTitle('redwine');
	$('html,body').css('background','#f4f4f4');
	 function brand_json(){
        var result;
        $.ajax({
            type: "get",
            dataType:'json',
            url : 'data/redwine.json?t=20170925',
            async:false,//改成同步加载了
            success : function(data){
                result = data;
            }
        });
        return result;
    }
	$scope.floor_detail = brand_json();
	//调用app分享、获取邀请码等逻辑方法
	var url_ = config.urlIp + "#/activity_redwine?";
	var invite_data = $rootScope.goAppOrDownload(url_,shareData.activity_redwine.info,shareData.activity_redwine.img,shareData.activity_redwine.title);
	//跳转原生
    $scope.toDetailPage = function (pid, pLable) {
		//来自app--跳转产品详情
      	if($scope.isFromApp){
      		clientInterface.toProductDetails(pid,pLable,function (res) {});
      	}else{
      		var app_url = "mayaliuyue://maya1618/app/shopdetails?productId="+pid+"&productLable="+pLable;
      		var other_url = config.urlIp+"#/invite_new_user?inviteId="+invite_data.code+"&inviteMobile="+invite_data.name;
      		$scope.isHaveApp(app_url, other_url);
      	};
    };
}]);
//*************************腕表************************************
myApp.controller('activity_wristwatch',['$scope','$location','$http','$rootScope','$state','$stateParams',function($scope,$location,$http,$rootScope,$state,$stateParams){
	$rootScope.changeTitle('wristwatch');
	$('html,body').css('background','#f4f4f4');
	 function brand_json(){
        var result;
        $.ajax({
            type: "get",
            dataType:'json',
            url : 'data/watch.json?t=20171120',
            async:false,//改成同步加载了
            success : function(data){
                result = data;
            }
        });
        return result;
    }
	$scope.floor_detail = brand_json();
	//调用app分享、获取邀请码等逻辑方法
	var url_ = config.urlIp + "#/activity_wristwatch?";
	var invite_data = $rootScope.goAppOrDownload(url_,shareData.activity_wristwatch.info,shareData.activity_wristwatch.img,shareData.activity_wristwatch.title);
	//跳转原生
    $scope.toDetailPage = function (pid, pLable) {
		//来自app--跳转产品详情
      	if($scope.isFromApp){
      		clientInterface.toProductDetails(pid,pLable,function (res) {});
      	}else{
      		var app_url = "mayaliuyue://maya1618/app/shopdetails?productId="+pid+"&productLable="+pLable;
      		var other_url = config.urlIp+"#/invite_new_user?inviteId="+invite_data.code+"&inviteMobile="+invite_data.name;
      		$scope.isHaveApp(app_url, other_url);
      	};
    };
}]);

//*************************珍珠************************************
myApp.controller('activity_jewelry',['$scope','$location','$http','$rootScope','$state','$stateParams',function($scope,$location,$http,$rootScope,$state,$stateParams){
	$rootScope.changeTitle('jewelry');
	//$('html').css('background','#f4f4f4');
	 function brand_json(){
        var result;
        $.ajax({
            type: "get",
            dataType:'json',
            url : 'data/activity_jewelry.json?t=20171120',
            async:false,//改成同步加载了
            success : function(data){        
                result = data;
            }
        });
        return result;
    }
	$scope.floor_detail = brand_json();
			//调用app分享、获取邀请码等逻辑方法
	var url_ = config.urlIp + "#/activity_jewelry?";
	var invite_data = $rootScope.goAppOrDownload(url_,shareData.activity_jewelry.info,shareData.activity_jewelry.img,shareData.activity_jewelry.title);
	//跳转原生
    $scope.toDetailPage = function (pid, pLable) {
		//来自app--跳转产品详情
      	if($scope.isFromApp){
      		clientInterface.toProductDetails(pid,pLable,function (res) {});
      	}else{
      		var app_url = "mayaliuyue://maya1618/app/shopdetails?productId="+pid+"&productLable="+pLable;
      		var other_url = config.urlIp+"#/invite_new_user?inviteId="+invite_data.code+"&inviteMobile="+invite_data.name;
      		$scope.isHaveApp(app_url, other_url);
      	};
    };
}]);
//***********************养生茶***************************
myApp.controller('activity_tea',['$scope','$location','$http','$rootScope','$state','$stateParams',function($scope,$location,$http,$rootScope,$state,$stateParams){
	$rootScope.changeTitle('tea');
	$('html').css('background','#f4f4f4');
	 function brand_json(){
        var result;
        $.ajax({
            type: "get",
            dataType:'json',
            url : 'data/activity_tea.json?t=20171124',
            async:false,//改成同步加载了
            success : function(data){        
                result = data;
            }
        });
        return result;
    }
	$scope.floor_detail = brand_json();
			//调用app分享、获取邀请码等逻辑方法
	var url_ = config.urlIp + "#/activity_tea?";
	var invite_data = $rootScope.goAppOrDownload(url_,shareData.activity_tea.info,shareData.activity_tea.img,shareData.activity_tea.title);
	//跳转原生
    $scope.toDetailPage = function (pid, pLable) {
		//来自app--跳转产品详情
      	if($scope.isFromApp){
      		clientInterface.toProductDetails(pid,pLable, function(res) {});
      	}else{
      		var app_url = "mayaliuyue://maya1618/app/shopdetails?productId="+pid+"&productLable="+pLable;
      		var other_url = config.urlIp+"#/invite_new_user?inviteId="+invite_data.code+"&inviteMobile="+invite_data.name;
      		$scope.isHaveApp(app_url, other_url);
      	};
    };
}]);
//********************** 12.12食品活动页 **********************
myApp.controller('activity_food',['$scope','$location','$http','$rootScope','$state','$stateParams',function ($scope,$location,$http,$rootScope,$state,$stateParams) {
    $rootScope.changeTitle('12.12食品活动页');
    $('html').css('background','#f2f9eb');
    //活动产品的获取
    $scope.lists = [];
    $scope.lists1 = [];
    $scope.lists2 = [];
    function list_json(){
        var result;
        $.ajax({
            type: "get",
            dataType:'json',
            url : 'data/activity_food.json?t=20171205',
            async:false,//改成同步加载了
            success : function(data){
                result = data;
            }
        });
        return result;
    };
    var double_datas = list_json();

    //10个产品
    $scope.lists = double_datas.food_list[0]; //改变每天的活动产品
    $scope.lists_x = $scope.lists[9];
    //10个产品
    $scope.lists1 = double_datas.food_list[1]; //改变每天的活动产品
    $scope.lists_x1 = $scope.lists1[9];
    //10个产品
    $scope.lists2 = double_datas.food_list[2]; //改变每天的活动产品
    $scope.lists_x2 = $scope.lists2[9];

    //跳转原生
    $scope.toDetailPage = function (pid, pLable) {
        clientInterface.toProductDetails(pid, pLable,function (res) {});
    };
    //跳转
    $scope.goNext = function(urls){
        $state.go(urls);
//      $state.go(urls, {"from":"app"});
    };
}]);
//********************** demo **********************
myApp.controller('demo',['$scope','$location','$http','$rootScope','$state','$stateParams',function ($scope,$location,$http,$rootScope,$state,$stateParams) {
    $rootScope.changeTitle('demo');
    //  图片跳转的专题连接
    $scope.activity_url = config.urlIp+"#/activityproduct/:channelId/:specialId/:jsessionId?";
    //  小白点个数
    $scope.class_isthis = [0,1,2,3,4,5,6,7,8,9];
    $scope.lightspot_indexf = [0,1,2,3,4,5,6,7,8,9];
    $scope.lightspot_index = [0,1,2,3,4,5,6,7,8,9];
    //活动产品的获取
    $scope.lists = [];
    function list_json(){
        var result;
        $.ajax({
            type: "get",
            dataType:'json',
            url : 'data/double.json?t=20170925',
            async:false,//改成同步加载了
            success : function(data){
                result = data;
            }
        });
        return result;
    };
    var double_datas = list_json();
    //男生女生展示产品
    $scope.manDot = double_datas.double_man;
    $scope.womanDot = double_datas.double_woman;
    $scope.currentwoman = double_datas.double_woman[0];
    $scope.currentman = double_datas.double_man[0];

    $scope.womanDot1 = double_datas.floor_lists;
    $scope.currentwoman1 = double_datas.floor_lists[0];
    //10个产品
    $scope.lists = double_datas.floor_list[3]; //改变每天的活动产品
    $scope.lists_x = $scope.lists[9];
    //中间图片的列表
    $scope.banner_url_link = [{
        "title":"生活攻略",
        "info":"Life",
        "ids":["336","388","436","434","384","387"],
        "url_index":1
    },{
        "title":"时尚攻略",
        "info":"Fashion",
        "ids":["435","438","440","443","444","437"],
        "url_index":7
    },{
        "title":"美食攻略",
        "info":"Food",
        "ids":["439","441","442","386"],
        "url_index":13
    }];
    //点击人物上 热点并显示相应产品

    $scope.this_click = function(ids){ //女孩的
        $scope.currentwoman1 =$scope.womanDot1[ids]
    };
    $scope.double_click = function(ids){ //女孩的
        $scope.currentwoman =$scope.womanDot[ids]
    };
    $scope.double_click_man = function(idx){//男孩的
        $scope.currentman = $scope.manDot[idx]
    };

    //调用app分享、获取邀请码等逻辑方法
    var url_ = config.urlIp + "#/demo?";
    var invite_data = $rootScope.goAppOrDownload(url_,shareData.double_eleven.title,shareData.double_eleven.img, shareData.double_eleven.info);
    //跳转原生
    $scope.toDetailPage = function (pid, pLable) {
        //来自app--跳转产品详情
        if($scope.isFromApp){
            clientInterface.toProductDetails(pid,pLable,function (res) {});
        }else{
            var app_url = "mayaliuyue://maya1618/app/shopdetails?productId="+pid+"&productLable="+pLable;
            var other_url = config.urlIp+"#/invite_new_user?inviteId="+invite_data.code+"&inviteMobile="+invite_data.name;
            $scope.isHaveApp(app_url, other_url);
        };
    };
}]);