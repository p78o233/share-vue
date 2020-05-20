<template>
    <div>
        <!--筛选操作框开始-->
        <el-card class="box-card">
            <el-form ref="searchBuySellData" :model="searchBuySellData" label-width="80px">
                <el-form-item label="股票编号">
                    <el-input v-model="searchBuySellData.stockNum"></el-input>
                </el-form-item>
                <el-form-item label="买入时间">
                    <el-col :span="11">
                        <el-date-picker type="date" placeholder="选择日期" v-model="searchBuySellData.beginTime" style="width: 100%;"></el-date-picker>
                    </el-col>
                    <el-col class="line" :span="2">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;----</el-col>
                    <el-col :span="11">
                        <el-date-picker placeholder="选择日期" v-model="searchBuySellData.endTime" style="width: 100%;"></el-date-picker>
                    </el-col>
                </el-form-item>
            </el-form>
            <el-button size="small" @click="getBuySellRecordList()">搜索</el-button>
            <el-button size="small" type = "primary">新增</el-button>
        </el-card>
        <!--筛选操作结束-->
        <!--数据展示列表开始-->
        <el-table
                :data="buySellDataList"
                border
                class="table"
                ref="buySellDataList"
                header-cell-class-name="table-header"
        >
            <el-table-column type="expand">
                <template slot-scope="props">
                    <el-card class="box-card">
                        <div style="text-align: center;font-size: 24px;">
                            出售记录
                        </div>
                        <el-table
                                :data="props.row.sellRecordList"
                                border
                                class="table"
                                header-cell-class-name="table-header"
                        >
                            <el-table-column
                                    prop="sellPrice"
                                    label="出售价格"
                                    align="center"
                                    width="180">
                            </el-table-column>
                            <el-table-column
                                    prop="profitAndLoss"
                                    label="利润"
                                    align="center"
                                    width="180">
                            </el-table-column>
                            <el-table-column
                                    prop="sellNum"
                                    label="出售股数"
                                    align="center"
                                    width="180">
                            </el-table-column>
                            <el-table-column
                                    label="出售日期"
                                    align="center"
                                    width="180">
                                <template slot-scope="scope">
                                    {{scope.row.sellTime | timeFilter}}
                                </template>
                            </el-table-column>
                        </el-table>
                    </el-card>
                </template>
            </el-table-column>
            <el-table-column
                    prop="stockNum"
                    label="股票编号"
                    align="center"
                    width="180">
            </el-table-column>
            <el-table-column
                    prop="stockName"
                    label="股票名字"
                    align="center"
                    width="180">
            </el-table-column>
            <el-table-column
                    prop="buyPrice"
                    label="买入价格"
                    align="center"
                    width="180">
            </el-table-column>
            <el-table-column
                    prop="buyNum"
                    label="买入股数"
                    align="center"
                    width="180">
            </el-table-column>
            <el-table-column
                    label="买入日期"
                    align="center"
                    width="180">
                <template slot-scope="scope">
                    {{scope.row.buyTime | timeFilterNoTime}}
                </template>
            </el-table-column>
        </el-table>
        <!--数据展示列表结束-->
        <!--数据展示分页控件开始-->
        <el-pagination
                @size-change="buySellPageSizeChange"
                @current-change="buySellPageChange"
                :current-page="searchBuySellData.page"
                :page-sizes="[10, 20, 30, 40,50]"
                :page-size="searchBuySellData.pageSize"
                layout="total, sizes, prev, pager, next, jumper"
                :total="searchBuySellData.count">
        </el-pagination>
        <!--数据展示分页控件结束-->
    </div>
</template>

<script>
    export default {
        name: 'BuySellRecordList',
        data: function() {
            return {
                searchBuySellData: {//买入卖出记录查询条件
                    userId: sessionStorage.getItem('stockUserId'),//用户id
                    stockNum: '',//股票编号
                    beginTime: '',//开始时间
                    endTime: '',//结束时间
                    page: 1,//页面
                    pageSize: 10,//分页大小
                    count:0,//当前条件记录行数
                },
                buySellDataList: []//买入卖出记录
            };
        },
        methods: {
            buySellPageSizeChange(val){
                // 买卖记录每页条数变化
                this.searchBuySellData.pageSize = val;
                this.getBuySellRecordList();
            },
            buySellPageChange(val){
                // 买卖记录页码变化
                this.searchBuySellData.page = val;
                this.getBuySellRecordList();
            },
            getBuySellRecordList() {
                // 分页获取买入卖出记录
                if (this.searchBuySellData.beginTime == '' ||this.searchBuySellData.beginTime == null) {
                    this.searchBuySellData.beginTime = null;
                }else{
                    this.searchBuySellData.beginTime = new Date(this.searchBuySellData.beginTime).getTime()
                }
                if (this.searchBuySellData.endTime == '' || this.searchBuySellData.endTime == null) {
                    this.searchBuySellData.endTime = null;
                }else{
                    this.searchBuySellData.endTime = new Date(this.searchBuySellData.endTime).getTime()
                }
                this.api.getBuySellRecordList(this.searchBuySellData).then(res => {
                    if (res.ret == true) {
                        this.buySellDataList = res.data.list;
                        this.searchBuySellData.count = res.data.count;
                    }
                });
            }
        },
        mounted() {
            this.getBuySellRecordList();
        },
        filters: {
            timeFilter: function(dateStamp) {
                dateStamp = dateStamp;
                var date = new Date(dateStamp);
                var YY = date.getFullYear() + '-';
                var MM = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-';
                var DD = (date.getDate() < 10 ? '0' + (date.getDate()) : date.getDate());
                var hh = (date.getHours() < 10 ? '0' + date.getHours() : date.getHours()) + ':';
                var mm = (date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes()) + ':';
                var ss = (date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds());
                return YY + MM + DD + ' ' + hh + mm + ss;
            },
            timeFilterNoTime: function(dateStamp) {
                dateStamp = dateStamp;
                var date = new Date(dateStamp);
                var YY = date.getFullYear() + '-';
                var MM = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-';
                var DD = (date.getDate() < 10 ? '0' + (date.getDate()) : date.getDate());
                return YY + MM + DD;
            }
        }
    };
</script>

<style scoped>

</style>
