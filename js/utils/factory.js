/**
 * Created by Dell6440 on 2017/5/10.
 */
//倒计时 的计算
myApp.factory('countdown', ["$q", "$log",'$rootScope', function($q, $log,$rootScope){
    var time1;
    function change_time(longtime,data){
        if(longtime>0){
            clearInterval(time1);
            time1 = setInterval(function(){
                $rootScope.$apply(function(){
                    longtime= longtime - 1;
                    var times = longtime;
                    show_time(times,data);
                });
            },1000);
        }
    }
    function show_time(times,data){
        if(times>0){
            data.iDay_p = fillZero(Math.ceil(parseInt(times/86400)),1);//先算出天数，60*60*24=86400
            times%=86400;//求余后剩的是一 "天" 内的 秒 数

            data.iHour_p = fillZero(Math.ceil(parseInt(times/3600)),2);//小时
            times%=3600;//求余后剩的是一 "小时" 内的 秒 数

            data.iMin_p = fillZero(Math.ceil(parseInt(times/60)),2);//分钟
            times%=60;//求余后剩的是一 "分钟" 内的 秒 数

            data.iSec_p = fillZero(Math.ceil(times),2);//秒
            // if(data.iDay_p>0){
            //     clearInterval(time1);
            // }
        }else{
            clearInterval(time1);
            data.iHour_p='00';data.iMin_p='00';data.iSec_p='00';
            $rootScope.getPocketData();
        }

//		console.log($rootScope.iDay+":"+$rootScope.iHour+":"+$rootScope.iMin+":"+$rootScope.iSec)
    }
    //位数不足的用0补充
    function fillZero(num, digit){
        var str=''+num;
        while(str.length<digit){
            str='0'+str;
        }
        return str;
    }
    return {
        changetime : change_time,
        showTime : show_time
    };
}]);
//获取验证码 倒计时
myApp.factory('getCode', ["$q", "$log",'$rootScope','$state', function($q, $log,$rootScope,$state){
    function getCode(){
        var time_num = 60;
        $('.get-code').addClass('got');
        $('.get_code').css('background','#ddd');
        $rootScope.data_time = "等待("+time_num+"s)";
        var timer = setInterval(function(){
            $rootScope.$apply(function(){
                if(time_num>0){
                    time_num--;
                    $rootScope.data_time = "等待("+time_num+"s)";
                }
                else{
                    clearInterval(timer);
                    $rootScope.data_time = '重新获取';
                    $rootScope.code_type = true;
                    $('.get-code').removeClass('got');
                    $('.get_code').css('background','#fdc146');
                }
            })
        },1000);
    }
    return {
        getCodes : getCode
    };
}]);

//微信分享的配置
myApp.factory('weiXinShare', ["$q", "$log",'$rootScope','$state', function($q, $log,$rootScope,$state){
	function goToShare(lineurl,shareTitle,descContent,imgUrl){
		
		var lineLink = lineurl;
		wx.ready(function () {
			// 1 判断当前版本是否支持指定 JS 接口，支持批量判断
//		    wx.checkJsApi({
//		      	jsApiList: [
//			        'onMenuShareTimeline',
//			        'onMenuShareAppMessage',
//			        'previewImage',
//			        'chooseWXPay',
//		      	],
//		      	success: function (res) {
//		        	console.log(res);
//		      	}
//		    });
			  
			//分享给朋友
		    wx.onMenuShareAppMessage({
		        title: shareTitle, // 分享标题
		        desc: descContent, // 分享描述
		        link: lineLink, // 分享链接
		        imgUrl: imgUrl, // 分享图标
		        type: 'link', // 分享类型,music、video或link，不填默认为link
            	dataUrl: '', // 如果type是music或video，则要提供数据链接，默认为空
		        success: function (res) {
//		      		alert("分享朋友成功");
		        },
		        cancel: function (res) {
//		        	alert("分享失败!");
		        }
		    });
			//分享给朋友圈
		    wx.onMenuShareTimeline({
		        title: shareTitle, // 分享标题
		        link: lineLink, // 分享链接
		        imgUrl: imgUrl, // 分享图标
		        success: function () { 
		//      	alert("分享朋友圈成功")
		        },
		        cancel: function () { }
		    });
		    //分享到QQ
		    wx.onMenuShareQQ({
				title: shareTitle,
				desc: descContent,
				link: lineLink,
				imgUrl: imgUrl,
				success: function () {},
				cancel: function () {}
		    });
		    //分享到微博
		    wx.onMenuShareWeibo({
		        title: shareTitle,
				desc: descContent,
				link: lineLink,
				imgUrl: imgUrl,
				success: function () {},
				cancel: function () {}
		    });
		});
		wx.error(function (res) {
			console.log(res.errMsg);
	    });
	};
	return {
		share : goToShare,
	};
}]);