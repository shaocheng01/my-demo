/**
 * Created by Dell6440 on 2017/8/4.
 */
myApp.controller('walletCtrl',['$scope','$location','$http','$rootScope','$state',function ($scope,$location,$http,$rootScope,$state) {
    $scope.data = {
        headerDatas: '',
        jsessionId: '',
        listDetails: [],
        cashWithdrawMoney: '',
        showEmpty: false,
        setCode: '',
        trueName: ''
    };

    $('.wallet-detail').hide();

    if($rootScope.urlParameter('jsessionId')){
        $scope.data.jsessionId = $rootScope.urlParameter('jsessionId');
    }

    $scope.clickCashBtn = function (setCode, money,trueName) {
        clientInterface.toCashPage(setCode,money,trueName,function () {})
    };

    $scope.getData = function (pages,me) {
        var dataInfo = JSON.stringify({"pageNo":pages,"pageSize":6});
        var req = $rootScope.aesFunc('flowRecordApi', 'queryFlowRecord', dataInfo, $scope.data.jsessionId);
        $rootScope.AjaxFunc('pay/flowRecordApi/queryFlowRecord', req, function (res) {
            // console.log(res);
            if(res.code == '1') {
                if(!res.data.accountFlow.data || res.data.accountFlow.data.length ==0) {
                    $scope.data.showEmpty = true;
                }
                $scope.data.headerDatas = res.data.accountItem;
                $scope.data.listDetails = $scope.data.listDetails.concat(res.data.accountFlow.data);
                // console.log($scope.data.listDetails)
                var show_money = res.data.accountItem.cashWithdrawMoney;
                $scope.data.cashWithdrawMoney = show_money.toString();
                $scope.data.setCode = res.data.flowRecordStep;
                $scope.data.trueName = res.data.accountItem.userName;
                $('.wallet-detail').show();

                $('.clickOn').stop().hide();
                if(!res.data.accountFlow.hasNext){
                    // 锁定
                    me.lock();
                    // 无数据
                    me.noData();
                }
                me.resetload(); //初始化
            }
        });
    };

    var timer,pages;
    $scope.getSinglePageData = function(){
        clearTimeout(timer);
        pages = 0; //页数
        timer = setTimeout(function(){
            $('.dropload-down').remove(); //清除加载栏
            $('.content').dropload({
                scrollArea : window,
                domDown : {
                    domClass   : 'dropload-down',
                    domRefresh : '<div class="dropload-refresh dropload_text">< img src="img/arrow.png"/><span>上拉加载更多</span></div>',
                    domLoad    : '<div class="dropload-load"><span class="loading"></span>加载中...</div>',
                    // domNoData  : '<div class="dropload-noData">亲，我是有底线的呦</div>'
                    domNoData  : '<div class="dropload-noData"></div>'
                },
                loadDownFn : function(me){  //上拉加载
                    $('.clickOn').stop().show();
                    pages++;
                    $scope.getData(pages,me);
                },
                threshold : 20,
                distance: 80
            });
        },0);
    };
    $scope.getSinglePageData();

}]);
