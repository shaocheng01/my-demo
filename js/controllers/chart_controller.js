/**
 * Created by Dell6440 on 2017/8/1.
 */
myApp.controller('chartCtrl',['$scope','$location','$http','$rootScope','$state',function ($scope,$location,$http,$rootScope,$state) {
    $scope.data = {
        chart1x: [],
        chart1y: [],
        currentMonth: '',
        selectDate: [],
        jsessionId: '',
        listItem: []
    };

    if($rootScope.urlParameter('jsessionId')){
        $scope.data.jsessionId = $rootScope.urlParameter('jsessionId');
    }

    // 基于准备好的dom，初始化echarts实例
    var myChart = echarts.init(document.getElementById('maintop'));
    var date = new Date;
    var year = date.getFullYear();
    var month = (date.getMonth()+1).toString();
    var resetMonth;
    $scope.data.currentMonth = month +'月';
    // console.log(month.length);
    if(month.length == 2) {
        resetMonth = month;
    } else {
        resetMonth = 0 + month;
    }
    
    $scope.getOpt1Data = function (date, status) {
        var dataInfo = JSON.stringify({
            "chooseDate":date, "selectStatus":status
        });
        var req = $rootScope.aesFunc('flowRecordApi', 'userIncomeStatementList', dataInfo, $scope.data.jsessionId);
        $rootScope.AjaxFunc('pay/flowRecordApi/userIncomeStatementList', req, function (res) {
            // console.log(res);
            if(res.data != null && res.data.length>0) {
                var monthArr = res.data;
                var newArr=[],y=[];
                for(var i=0; i<monthArr.length; i++) {
                    newArr.push(monthArr[i].months+ '月');
                    y.push(monthArr[i].totalAmount);
                }
                $scope.data.chart1x = newArr;
                $scope.data.chart1y = y;
                $scope.setOption1();
            }
        });
    };
    $scope.getOpt2Data = function (chooseDate) {
        $scope.data.listItem = [];
        var dataInfo = JSON.stringify({
            "chooseDate": chooseDate
        });
        // console.log(dataInfo)
        var req = $rootScope.aesFunc('flowRecordApi', 'userRecommendDividendList', dataInfo, $scope.data.jsessionId);
        $rootScope.AjaxFunc('pay/flowRecordApi/userRecommendDividendList', req, function (res) {
            // console.log(res);
            if(res.code == "1") {
                $scope.data.listItem = res.data;
            }
        });
    };
    $scope.getOpt1Data('', 2);  //2代表默认自动查询当前时间
    $scope.getOpt2Data(year + '-' + resetMonth);

    $scope.setOption1 = function() {
        option = {   // 指定图表的配置项和数据
            // tooltip : {
            //     trigger: 'axis',
            //     axisPointer: {
            //         type: 'cross',
            //         label: {
            //             backgroundColor: '#6a7985'
            //         }
            //     }
            // },
            grid: {
                left: '0',
                right: '8%',
                bottom: '3%',
                containLabel: true
            },
            xAxis : [
                {
                    type : 'category',
                    boundaryGap : false,
                    data: $scope.data.chart1x,
                    axisLine: {
                        show: false
                    },
                    axisTick: {
                        show: false
                    }
                }
            ],
            yAxis : [
                {
                    show: false,
                    type : 'value'
                }
            ],

            series : [
                {
                    name:'收益',
                    type:'line',
                    symbolSize: 10,
                    label: {
                        normal: {
                            show: true,
                            position: 'top',
                            textStyle : {
                                fontSize : '10',
                                color:'#999'
                            }
                        }
                    },
                    itemStyle : {
                        normal : {
                            color:'#FF8700',

                            lineStyle:{
                                color:'#FF8700'
                            }
                        }
                    },
                    areaStyle: {
                        normal : {
                            color: 'transparent'   //设置图表背景区域颜色
                        }
                    },
                    data: $scope.data.chart1y
                }
            ]
        };
        myChart.setOption(option);
    };

    $scope.selectMonth = function () {
        $('.masker').show();
        $('.chart-month').show();
        $rootScope.maskerStopScroll('.masker');
        var dataInfo = '{}';
        var req = $rootScope.aesFunc('flowRecordApi', 'queryDate', dataInfo, $scope.data.jsessionId);
        $rootScope.AjaxFunc('pay/flowRecordApi/queryDate', req, function (res) {
            if(res.data) {
                $scope.data.selectDate = res.data;
                // console.log($scope.data.selectDate)
            }
            // console.log(res);
        });
    };

    $scope.monthBtnClick = function (currmonth) {
        // console.log(currmonth);
        $('.masker').hide();
        $('.chart-month').hide();
        $scope.data.currentMonth = currmonth + '月';
        $rootScope.maskerCanScroll('.masker');
        $scope.getOpt1Data(currmonth, 1);
        $scope.getOpt2Data(currmonth);
    };

    $scope.hideChartMasker = function () {
        $('.masker').hide();
        $('.chart-month').hide();
        $rootScope.maskerCanScroll('.masker');
    };

    myChart.on('click', function (params) {
        // console.log(params);
        $scope.$apply(function(){
            $scope.data.currentMonth = params.name;
            // console.log($scope.data.currentMonth)
        });
        if(params.name == 0) {
            return;
        }
        var curMonth;
        if(params.name.length == 2) {
            curMonth = 0 + params.name.slice(0,1);
        } else {
            curMonth = params.name.slice(0,2);
        }
        // console.log(curMonth);
        $scope.getOpt2Data(year + '-' + curMonth+'');
    });

}]);
