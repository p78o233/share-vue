<template>
    <div>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item>
                    <i class="el-icon-lx-cascades"></i> 观察的数据
                </el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <!--筛选条件开始-->
        <div class="handle-box">
            <el-input v-model="searchParams.stockNum" placeholder="股票编号" class="handle-input mr10"></el-input>
            <el-divider></el-divider>
            <el-input v-model="searchParams.stockName" placeholder="股票名" class="handle-input mr10"></el-input>
            <el-divider></el-divider>
            <el-button type="primary" icon="el-icon-search" @click="getStockList()">搜索</el-button>
            <el-button plain icon="el-icon-plus" @click="addStock()">创建新的观察数据</el-button>
        </div>
        <!--筛选条件结束-->
        <el-divider></el-divider>
        <!--表格开始-->
        <el-table
                :data="stockList"
                border
                class="table"
                ref="stockListTable"
                header-cell-class-name="table-header"
        >
            <!--<el-table-column prop="id" label="ID" width="55" align="center"></el-table-column>-->
            <el-table-column prop="stockNum" label="编码" align="center"></el-table-column>
            <el-table-column prop="stockName" label="名称" align="center"></el-table-column>
            <el-table-column label="创建时间" align="center">
                <template slot-scope="scope">
                    {{scope.row.createTime | formatDataStamp}}
                </template>
            </el-table-column>
            <el-table-column label="类别" align="center">
                <template slot-scope="scope">
                    <div v-if="scope.row.category == 1">
                        股票
                    </div>
                    <div v-else-if="scope.row.category == 2">
                        基金
                    </div>
                    <div v-else-if="scope.row.category == 3">
                        黄金
                    </div>
                    <div v-else-if="scope.row.category == 4">
                        期货
                    </div>
                </template>
            </el-table-column>
            <el-table-column prop="weight" label="权重" align="center"></el-table-column>
            <el-table-column label="操作" width="180" align="center">
                <template slot-scope="scope">
                    <el-button type="text" icon="el-icon-edit" @click="editStock(scope.row)">修改</el-button>
                    <el-button type="text" icon="el-icon-view" @click="lookRectChart(scope.row)">查看最近走势</el-button>
                    <el-button type="text" icon="el-icon-delete" class="red" @click="deleteStock(scope.row)">删除
                    </el-button>
                </template>
            </el-table-column>
        </el-table>
        <!--表格结束-->
        <!--分页控件开始-->
        <div class="block">
            <el-pagination
                    @size-change="pageSizeChange"
                    @current-change="pageChange"
                    :page-sizes="[10, 20, 30, 50]"
                    :page-size=searchParams.pageSize
                    layout="sizes, prev, pager, next"
                    :total=stockCount>
            </el-pagination>
        </div>
        <!--分页控件结束-->
        <!--新增修改观察数据开始-->
        <el-dialog
                :title="ioeStockTitle"
                :visible.sync="ioeStockVisible"
                width="90%"
                :before-close="ioeStockhandleClose">
            <el-form ref="ioeStockForm" :model="ioeStockData" label-width="80px">
                <el-form-item label="股票编号">
                    <el-input v-model="ioeStockData.stockNum" :disabled="ioeStockStatus=='edit'"
                              @change="stockNumChange()"></el-input>
                </el-form-item>
                <el-form-item label="股票名称">
                    <el-input v-model="ioeStockData.stockName" :disabled="true"></el-input>
                </el-form-item>
                <el-form-item label="权重">
                    <el-input v-model="ioeStockData.weight"></el-input>
                </el-form-item>
                <el-form-item label="类别">
                    <el-radio-group v-model="ioeStockData.category">
                        <el-radio :label="1" value="1">股票</el-radio>
                    </el-radio-group>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
            <el-button @click="ioeStockhandleClose()">取 消</el-button>
            <el-button type="primary" @click="saveStock()">确 定</el-button>
            </span>
        </el-dialog>
        <!--新增修改观察数据结束-->

        <!--查看最近走势开始-->
        <el-dialog
                :title="rectChart.title"
                :visible.sync="rectChart.visible"
                width="90%"
                :before-close="rectChartClose">
            <el-select v-model="rectChart.size" placeholder="请选择" @change="lookRectChartSearch()">
                <el-option
                        v-for="item in rectChart.options"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                </el-option>
            </el-select>
            最小值：{{rectChart.min}}
            最大值：{{rectChart.max}}
            <div id="myChart" :style="{width: '100%', height: '800px'}"></div>
        </el-dialog>
        <!--查看最近走势结束-->
    </div>
</template>

<script>
    export default {
        name: 'StockList',
        data: function() {
            return {
                searchParams: {//搜索参数
                    stockNum: '',//股票编号
                    stockName: '',//股票名
                    userId: sessionStorage.getItem('stockUserId'),//当前用户id
                    pageNum: 1,//当前页码
                    pageSize: 10//页面大小
                },
                stockCount: 0,//符合条件的总条数
                stockList: [],//根据条件查询出来的数据
                ioeStockTitle: '',//新增修改观察数据弹窗标题
                ioeStockVisible: false,//新增修改观察数据弹窗
                ioeStockStatus: '',//新增修改弹窗状态
                ioeStockData: {//新增修改数据
                    id: '',//主键
                    stockNum: '',//股票编号
                    stockName: '',//股票名称
                    category: 1,//1 股票 2基金 3黄金 4期货
                    weight: 0,//权重
                    userId: sessionStorage.getItem('stockUserId')//用户id
                },
                rectChart: {//最近走势弹窗
                    title: '',
                    visible: false,
                    size: 10,
                    stockNum: '',
                    stockName: '',
                    min:0,
                    max:0,
                    options:[
                        {
                            value:10,
                            label:'最近10日'
                        },
                        {
                            value:20,
                            label:'最近20日'
                        },
                        {
                            value:30,
                            label:'最近30日'
                        },
                        {
                            value:50,
                            label:'最近50日'
                        },
                        {
                            value:0,
                            label:'全部'
                        },
                    ],
                }
            };
        },
        methods: {
            rectChartClose(){
                // 查看最近走势弹窗关闭事件
                this.rectChart.visible = false;
            },
            lookRectChart(row) {
                // 查看最近趋势
                this.rectChart.size = 10;
                this.rectChart.stockNum = row.stockNum;
                this.rectChart.stockName = row.stockName;
                // this.rectChart.title = row.stockName+"最近走势";
                this.rectChart.visible = true;
                this.lookRectChartSearch();
            },
            lookRectChartSearch() {
                // 查询最近趋势网络请求

                // 基于准备好的dom，初始化echarts实例

                this.$nextTick(() => {
                    let sendData = {
                        'stockNum': this.rectChart.stockNum,
                        'size': this.rectChart.size
                    };
                    let that = this;
                    this.api.getStockRecordList(sendData).then(res => {
                        if (res.ret == true) {
                            console.log(res);
                            let dateList = [];
                            let beginList = [];
                            let endList = [];
                            let highList = [];
                            let lowList = [];
                            for(let i = 0;i<res.data.length;i++){
                                dateList.push(that.format(res.data[i].recordTime))
                                beginList.push(res.data[i].beginPrice);
                                endList.push(res.data[i].endPrice);
                                highList.push(res.data[i].highPrice);
                                lowList.push(res.data[i].lowPrice);
                            }
                            let max = 0;
                            for(let i = 0;i<highList.length;i++){
                                if(max<highList[i])
                                    max = highList[i]
                            }
                            let min = 0;
                            for(let i = 0;i<lowList[i];i++){
                                if(i==0){
                                    min = lowList[i]
                                }else{
                                    if(min>lowList[i]){
                                        min = lowList[i]
                                    }
                                }
                            }
                            that.rectChart.min = min;
                            that.rectChart.max = max;
                            max = max + max * 0.15;
                            min = min - min * 0.15;

                            let myChart = this.$echarts.init(document.getElementById('myChart'));
                            // 绘制图表
                            myChart.setOption({
                                title: { text: '' },
                                tooltip: {},
                                xAxis: {
                                    data: dateList
                                },
                                yAxis: {
                                    type: 'value',
                                    min: min,
                                    max: max,
                                },
                                series: [{
                                    name: '开始价格',
                                    type: 'line',
                                    data: beginList,
                                    smooth: true
                                    },
                                    {
                                        name: '结束价格',
                                        type: 'line',
                                        data: endList,
                                        smooth: true
                                    },
                                    {
                                        name: '最高价格',
                                        type: 'line',
                                        data: highList,
                                        smooth: true
                                    },
                                    {
                                        name: '最低价格',
                                        type: 'line',
                                        data: lowList,
                                        smooth: true
                                    },
                                ]
                            });
                        }
                    });
                });
            },
            add0(m) {
                // 时间加0
                return m < 10 ? '0' + m : m;
            },
            format(timeStamp) {
                //shijianchuo是整数，否则要parseInt转换
                var time = new Date(timeStamp);
                var y = time.getFullYear();
                var m = time.getMonth() + 1;
                var d = time.getDate();
                return y + '-' + this.add0(m) + '-' + this.add0(d) ;
            },
            getStockList() {
                // 获取页面显示数据
                this.api.getAllStock(this.searchParams).then(res => {
                    if (res.ret == true) {
                        console.log(res);
                        this.stockList = res.data.list;
                        this.stockCount = res.data.count;
                    }
                });
            },
            pageSizeChange(val) {
                // 页面数据大小变化
                this.searchParams.pageSize = val;
                this.getStockList();
            },
            pageChange(val) {
                // 页码变化
                this.searchParams.pageNum = val;
                this.getStockList();
            },
            editStock(row) {
                // 打开修改
                this.ioeStockStatus = 'edit';
                this.ioeStockTitle = '修改观察数据';
                this.ioeStockVisible = true;
                this.ioeStockData.id = row.id;
                this.ioeStockData.stockNum = row.stockNum;
                this.ioeStockData.stockName = row.stockName;
                this.ioeStockData.category = row.category;
                this.ioeStockData.weight = row.weight;
            },
            addStock() {
                // 新增观察数据
                this.ioeStockStatus = 'add';
                this.ioeStockTitle = '新增观察数据';
                this.ioeStockVisible = true;
            },
            ioeStockhandleClose() {
                // 新增修改弹窗关闭事件
                this.ioeStockStatus = '';
                this.ioeStockTitle = '';
                this.ioeStockVisible = false;
                this.resetIoeStockDialog();
            },
            resetIoeStockDialog() {
                // 重置新增弹窗绑定数据
                this.ioeStockData.id = '';
                this.ioeStockData.stockNum = '';
                this.ioeStockData.stockName = '';
                this.ioeStockData.category = 1;
                this.ioeStockData.weight = 0;
            },
            saveStock() {
                // 保存stock记录
                this.api.ioeStock(this.ioeStockData).then(res => {
                    if (res.ret == true) {
                        this.ioeStockhandleClose();
                        this.getStockList();
                    } else {
                        this.$message({
                            message: res.message,
                            type: 'warning'
                        });
                    }
                });
            },
            stockNumChange() {
                // 编写编号时获取名称
                let sendData = {
                    'stockNum': this.ioeStockData.stockNum
                };
                this.api.getStockNameByStockNum(sendData).then(res => {
                    this.ioeStockData.stockName = res.data;
                });
            },
            deleteStock(row) {
                // 删除观察数据
                let sendData = {
                    'userId': localStorage.getItem('stockUserId'),
                    'stockId': row.id
                };
                // sendData = JSON.stringify()
                this.api.deleteStock(sendData).then(res => {
                    if (res.ret == true) {
                        this.ioeStockhandleClose();
                        this.getStockList();
                    } else {
                        this.$message({
                            message: res.message,
                            type: 'warning'
                        });
                    }
                });
            }
        },
        mounted() {
            this.getStockList();
        },
        filters: {
            formatDataStamp: function(timeStamp) {
                let format = 'Y/M/D h:m:s';
                var formateArr = ['Y', 'M', 'D', 'h', 'm', 's'];
                var returnArr = [];

                var date = new Date(timeStamp);
                returnArr.push(date.getFullYear());
                returnArr.push(date.getMonth() + 1);
                returnArr.push(date.getDate());

                returnArr.push(date.getHours());
                returnArr.push(date.getMinutes());
                returnArr.push(date.getSeconds());

                for (var i in returnArr) {
                    format = format.replace(formateArr[i], returnArr[i]);
                }
                return format;
            }
        }
    };
</script>

<style scoped>

</style>
