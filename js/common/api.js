/**
 * Created by Lj on 2017/3/31.
 * 与端沟通接口api
 */
window.requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame || window.msRequestAnimationFrame;

// 端沟通接口
window.platform = {
    type: '',
    nativeCallbacks: {},
    nativeInvoke: function(param, callBack) {
        if (callBack) {
            var callBackName = 'cb' + new Date().getTime() + 'Func';
            platform.nativeCallbacks[callBackName] = callBack;
            param.script = 'window.platform.nativeCallbacks.' + callBackName; //如果有回调，会在param参数新增key值：script
        }
        try {
            var paramString = JSON.stringify(param);
            if (platform.getType() == 'android' || platform.getType() == 'win') {

                window.jsInterface.jsToNative(paramString);
                // console.log('当前是Android或者windows设备')

            } else if (platform.getType() == 'ios') {

                window.webkit.messageHandlers.jsToNative.postMessage(paramString);
                // console.log('当前是iOS设备')

            } else {
                window.nativeObject.jsToNative(paramString);
            }
        } catch (e) {
            // console.log(e)
        }
    },
    getType: function() {
        if (this.type) {
            return this.type;
        }
        var u = navigator.userAgent;
        var isAndroid = u.indexOf('Android') > -1 || u.indexOf('Adr') > -1;
        var isiOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/);
        if (isAndroid) {
            this.type = 'android';
        } else if (isiOS) {
            this.type = 'ios';
        } else {
            this.type = 'win';
        }
        return this.type;
    }
};
/**
 * 与客户端通讯接口
 * @type {Object}
 */

window.clientInterface = {
    navigationBarFuncs: {},

    toProductDetails: function (pId, pLable, callBack) { //跳转到原生商品详情页
        var requestParam = {
            'action': 'toProductDetails',
            'param': {'productId':pId, 'productLable':pLable}
        };
        platform.nativeInvoke(requestParam,callBack);
    },

    getJSessionId: function (callBack) { //获取端上登录jsessionId
        var requestParam = {
            'action': 'getJSessionId'
        };
        platform.nativeInvoke(requestParam,callBack);
    },

    openLoginPage: function (callBack) { //调用原生登录页面
        var requestParam = {
            'action': 'openLoginPage'
        };
        platform.nativeInvoke(requestParam,callBack);
    },

    toCustomService: function (appKey,shopName,callBack) { //跳转智齿客服
        var requestParam = {
            'action': 'toCustomService',
            'param': {'appKey':appKey, 'shopName':shopName}
        };
        platform.nativeInvoke(requestParam,callBack);
    },

    toSupplementPage: function (serviceId,orderItemId,callBack) {//退换货进度页面跳转原生补充说明页面
        var requestParam = {
            'action': 'toSupplementPage',
            'param': {'serviceId':serviceId,'orderItemId':orderItemId}
        };
        platform.nativeInvoke(requestParam,callBack);
    },

    toApplicationPage: function (serviceId,orderItemId,callBack) {//退换货进度跳转申请成功页面
        var requestParam = {
            'action': 'toApplicationPage',
            'param': {'serviceId':serviceId,'orderItemId':orderItemId}
        };
        platform.nativeInvoke(requestParam,callBack);
    },

    h5Collection: function (pid, collection, callBack) {  // H5页面收藏了商品，返回客户端页面，*客户端*要改变收藏状态
        var requestParam = {
            'action': 'h5Collection',
            'param': {'productId':pid, 'collection':collection}
        };
        // console.log('已经通知app改变收藏状态');
        platform.nativeInvoke(requestParam,callBack);
    },

    h5CollectionShop: function (shopId, collection,callBack) {//h5收藏店铺，通知客户端改变店铺收藏状态
        var requestParam = {
            'action': 'h5CollectionShop',
            'param': {'shopId':shopId, 'collection':collection}
        };
        platform.nativeInvoke(requestParam,callBack);
    },

    appCollection: function (callBack) {   //app页面收藏了商品，返回h5时，*h5页面*改变收藏状态
        var requestParam = {
            'action': 'h5ChangeCollection'
        };

        // console.log('app返回了两个参数');
        platform.nativeInvoke(requestParam,callBack);
    },

    toCashPage: function (setCode,money,userName,callBack) {   //跳转原生去提现页面  userSettings = 1.需要实名认证 2.需要绑定银行卡 3.需要设置密码 4.全部设置完成，正常提现
        var requestParam = {
            'action': 'toCashPage',
            'param': {'userSettings':setCode, "money" : money, "userName": userName}
        };
        // console.log('跳转提现页面成功' + setCode, money);
        platform.nativeInvoke(requestParam,callBack);
    },

    toHomePage: function (callBack) {  //跳转APP首页方法
        var requestParam = {
            'action': 'toHomePage'
        };
        // console.log('跳转APP首页');
        platform.nativeInvoke(requestParam,callBack);
    },

    grabPacket: function (isSuccess,grabPrice,envelopeId, callBack) {  //判断抢红包是否成功，显示原生的蒙层页面:0失败，1成功
        var requestParam = {
            'action': 'grabPacket',
            'param': {'isSuccess':isSuccess, "price":grabPrice, "envelopeId":envelopeId}
        };
        // console.log('跳转抢红包成功或者失败页面成功');
        platform.nativeInvoke(requestParam,callBack);
    },
    goShare: function (data,callBack) {  //分享
        var requestParam = {
            'action': 'goShare',
            'param': data
        };
        platform.nativeInvoke(requestParam,callBack);
    },
    // 帮助中心-D-Plus埋点
    h5HelpCenterProblem: function (data,callBack) {  
        var requestParam = {
            'action': 'h5HelpCenterProblem',
            'param': data
        };
        platform.nativeInvoke(requestParam,callBack);
    }
};



















