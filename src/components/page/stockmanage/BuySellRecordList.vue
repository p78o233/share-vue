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
                        <el-date-picker type="date" placeholder="选择日期" v-model="searchBuySellData.beginTime"
                                        style="width: 100%;"></el-date-picker>
                    </el-col>
                    <el-col class="line" :span="2">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;----</el-col>
                    <el-col :span="11">
                        <el-date-picker placeholder="选择日期" v-model="searchBuySellData.endTime"
                                        style="width: 100%;"></el-date-picker>
                    </el-col>
                </el-form-item>
            </el-form>
            <el-button size="small" @click="getBuySellRecordList()">搜索</el-button>
            <el-button size="small" type="primary" @click="addBuyRecord()">新增购买记录</el-button>
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
            <!--出售记录开始-->
            <el-table-column type="expand">
                <template slot-scope="props">
                    <el-card class="box-card" style="border: 1px solid black;">
                        <div style="text-align: center;font-size: 24px;">
                            出售记录
                        </div>
                        <el-button size="small" type="primary" @click="addSellRecord(props.row.id)">新增卖出记录</el-button>
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
                            <el-table-column label="操作" width="180" align="center">
                                <template slot-scope="scope">
                                    <el-button type="text" icon="el-icon-edit" @click="editSellRecrd(props.row.id,scope.row)">修改</el-button>
                                    <el-button type="text" icon="el-icon-delete" class="red" @click="deleteSellRecord(scope.row.id)">删除</el-button>
                                </template>
                            </el-table-column>
                        </el-table>
                    </el-card>
                </template>
            </el-table-column>
            <!--出售记录结束-->
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
            <el-table-column label="操作" width="180" align="center" fixed="right">
                <template slot-scope="scope">
                    <el-button type="text" icon="el-icon-edit" @click="editBuyRecrd(scope.row)">修改</el-button>
                    <el-button type="text" icon="el-icon-delete" class="red" @click="deleteBuyRecord(scope.row.id)">删除</el-button>
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
        <!--买入新增修改记录弹窗开始-->
        <el-dialog
                :title="ioeBuyRecordTitle"
                :visible.sync="ioeBuyRecordVisible"
                width="90%"
                :before-close="ioeBuyRecordClose">
            <el-form ref="form" :model="ioeBuyRecordData" label-width="80px">
                <el-form-item label="股票代码">
                    <el-input v-model="ioeBuyRecordData.stockNum" :disabled = "ioeBuyRecordStatus == 'edit'"></el-input>
                </el-form-item>
                <el-form-item label="买入价格">
                    <el-input v-model="ioeBuyRecordData.buyPrice"></el-input>
                </el-form-item>
                <el-form-item label="买入股数">
                    <el-input v-model="ioeBuyRecordData.buyNum"></el-input>
                </el-form-item>
                <el-form-item label="买入时间">
                    <el-col :span="11">
                        <el-date-picker
                                v-model="ioeBuyRecordData.buyTime"
                                type="datetime"
                                placeholder="选择日期时间">
                        </el-date-picker>
                    </el-col>
                </el-form-item>
                <el-form-item label="类型">
                    <el-radio-group v-model="ioeBuyRecordData.category" :disabled = "ioeBuyRecordStatus == 'edit'">
                        <el-radio label="1">股票</el-radio>
                    </el-radio-group>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="ioeBuyRecordVisible = false">取 消</el-button>
                <el-button type="primary" @click="saveBuyRecordClick()">确 定</el-button>
            </span>
        </el-dialog>
        <!--买入新增修改记录弹窗结束-->
        <!--卖出记录新增修改弹窗开始-->
        <el-dialog
                :title=ioeSellTitle
                :visible.sync="ioeSellVisible"
                width="90%"
                :before-close="ioeSellClose">
            <el-form ref="ioeSellRecordData" :model="ioeSellRecordData" label-width="80px">
                <el-form-item label="卖出价格">
                    <el-input v-model="ioeSellRecordData.sellPrice"></el-input>
                </el-form-item>
                <el-form-item label="卖出股数">
                    <el-input v-model="ioeSellRecordData.sellNum"></el-input>
                </el-form-item>
                <el-form-item label="卖出时间">
                    <el-col :span="11">
                        <el-date-picker
                                v-model="ioeSellRecordData.sellTime"
                                type="datetime"
                                placeholder="选择日期时间">
                        </el-date-picker>
                    </el-col>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="ioeSellVisible = false">取 消</el-button>
                <el-button type="primary" @click="saveSellRecordClick()">保 存</el-button>
            </span>
        </el-dialog>

        <!--卖出记录新增修改弹窗j结束-->
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
                    count: 0//当前条件记录行数
                },
                buySellDataList: [],//买入卖出记录
                ioeBuyRecordTitle:"",//买入卖出记录新增修改标题
                ioeBuyRecordVisible:false,//新增修改买入卖出记录弹窗是否显示
                ioeBuyRecordStatus:"",//购买记录弹窗当前状态
                ioeBuyRecordData:{//新增或修改买入记录数据
                    id:null,
                    buyPrice:0.0,
                    buyTime:"",
                    stockNum:"",
                    category:"1",
                    buyNum:0,
                    userId:sessionStorage.getItem("stockUserId")
                },
                ioeSellTitle:"",//卖出记录新增修改标题
                ioeSellRecordStatus:"",//新增修改卖出弹框状态
                ioeSellVisible:false,//新增修改卖出弹窗是否显示
                ioeSellRecordData:{//新增或修改卖出记录数据
                    id:null,
                    buyId:0,
                    sellPrice:0.0,
                    sellNum:0,
                    sellTime:"",
                    userId:sessionStorage.getItem("stockUserId")
                },
            };
        },
        methods: {
            deleteSellRecord(id){
              // 删除出售记录
                this.$confirm('此操作将删除该出售记录, 是否继续?', '删除出售记录提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.api.deleteSellRecord(id).then(res => {
                        if (res.ret == true) {
                            this.$message({
                                message: res.message,
                                type: 'success'
                            });
                            this.getBuySellRecordList();
                        }
                    });
                }).catch(() => {
                });

            },
            ioeSellClose(){
                // 出售记录弹窗关闭事件
                this.ioeSellVisible = false;
            },
            checkSaveSell(){
                // 检查卖出的数据填写
                if(this.ioeSellRecordData.sellPrice == 0.0 ||this.ioeSellRecordData.sellPrice == ""){
                    this.$message({
                        message: '警告，请填写出售价格',
                        type: 'warning'
                    });
                    return false
                }
                if(this.ioeSellRecordData.sellPrice == 0.0 ||this.ioeSellRecordData.sellPrice == ""){
                    this.$message({
                        message: '警告，请填写出售价格',
                        type: 'warning'
                    });
                    return false
                }
                if(this.ioeSellRecordData.sellTime == undefined ||this.ioeSellRecordData.sellTime == ""){
                    this.$message({
                        message: '警告，请填写出售时间',
                        type: 'warning'
                    });
                    return false
                }
                return true;
            },
            saveSellRecordClick(){
                // 新增或修改出售记录
                // 检查填入的数据
                if(this.checkSaveSell()) {
                    this.api.ioeSellRecord(this.ioeSellRecordData).then(res => {
                        this.$message({
                            message: res.message,
                            type: 'success'
                        });
                        this.ioeSellClose();
                        this.getBuySellRecordList();
                    });
                }else{
                    return;
                }
            },
            addSellRecord(id){
                // 新增卖出记录
                debugger
                this.ioeSellRecordData.id = null;
                this.ioeSellRecordData.buyId = id;
                this.ioeSellRecordData.sellPrice = 0.0;
                this.ioeSellRecordData.sellNum = 0
                this.ioeSellRecordData.sellTime = ""
                this.ioeSellVisible = true;
                this.ioeSellRecordStatus = "add"
                this.ioeSellTitle = "新增卖出记录"
            },
            editSellRecrd(id,row){
              // 修改卖出记录
                this.ioeSellRecordData.id = row.id;
                this.ioeSellRecordData.buyId = id;
                this.ioeSellRecordData.sellPrice = row.sellPrice;
                this.ioeSellRecordData.sellNum = row.sellNum
                this.ioeSellRecordData.sellTime = row.sellTime
                this.ioeSellVisible = true;
                this.ioeSellRecordStatus = "edit"
                this.ioeSellTitle = "修改卖出记录"
            },
            deleteBuyRecord(id){
                // 删除购买记录
                this.$confirm('此操作将删除该购买记录, 是否继续?', '删除购买记录提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.api.deleteBuyRecord(id).then(res => {
                        if (res.ret == true) {
                            this.$message({
                                message: res.message,
                                type: 'success'
                            });
                            this.getBuySellRecordList();
                        }
                    });
                }).catch(() => {
                });
            },
            editBuyRecrd(row){
                // 买入记录修改按钮
                this.ioeBuyRecordData.id = row.id;
                this.ioeBuyRecordData.buyPrice = row.buyPrice;
                this.ioeBuyRecordData.buyTime = row.buyTime;
                this.ioeBuyRecordData.stockNum = row.stockNum;
                this.ioeBuyRecordData.buyNum = row.buyNum;
                this.ioeBuyRecordData.category = row.category;
                this.ioeBuyRecordStatus = "edit";
                this.ioeBuyRecordTitle="修改购买记录";
                this.ioeBuyRecordVisible = true;
            },
            ioeBuyRecordClose(){
              // 新增或修改买入记录弹窗关闭事件
                this.ioeBuyRecordVisible = false;
            },
            checkSaveBuy(){
                if(this.ioeBuyRecordStatus == "add"){
                    if(this.ioeBuyRecordData.stockNum == "" || this.ioeBuyRecordData.stockNum == undefined) {
                        this.$message({
                            message: '警告，请填写股票编号',
                            type: 'warning'
                        });
                        return false;
                    }
                }
                if(this.ioeBuyRecordData.buyPrice == 0 || this.ioeBuyRecordData.buyPrice == "" || this.ioeBuyRecordData.buyPrice == undefined) {
                    this.$message({
                        message: '警告，请填写购买价格',
                        type: 'warning'
                    });
                    return false
                }
                if(this.ioeBuyRecordData.buyNum == 0 || this.ioeBuyRecordData.buyNum == "" || this.ioeBuyRecordData.buyNum == undefined) {
                    this.$message({
                        message: '警告，请填写购买数量',
                        type: 'warning'
                    });
                    return false;
                }
                if(this.ioeBuyRecordData.buyTime == "" || this.ioeBuyRecordData.buyTime == undefined) {
                    this.$message({
                        message: '警告，请填写购买日期',
                        type: 'warning'
                    });
                    return false;
                }
                return true;
            },
            saveBuyRecordClick(){
                // 新增或修改购买记录按钮
                // 新增或修改购买记录按钮
                if(this.checkSaveBuy()) {
                    this.api.ioeBuyRecord(this.ioeBuyRecordData).then(res => {
                        if (res.ret == true) {
                            this.$message({
                                message: res.message,
                                type: 'success'
                            });
                            this.getBuySellRecordList();
                            this.ioeBuyRecordVisible = false;
                        } else {
                            this.$message({
                                message: res.message,
                                type: 'warning'
                            });
                        }
                    });
                }else{
                    return;
                }
            },
            addBuyRecord(){
                // 添加购买记录
                this.ioeBuyRecordTitle = "新增购买记录"
                this.ioeBuyRecordVisible = true;
                this.ioeBuyRecordStatus = "add";
                this.ioeBuyRecordData.buyPrice = 0.0;
                this.ioeBuyRecordData.buyTime = "";
                this.ioeBuyRecordData.stockNum = "";
                this.ioeBuyRecordData.buyNum = 0;
            },
            buySellPageSizeChange(val) {
                // 买卖记录每页条数变化
                this.searchBuySellData.pageSize = val;
                this.getBuySellRecordList();
            },
            buySellPageChange(val) {
                // 买卖记录页码变化
                this.searchBuySellData.page = val;
                this.getBuySellRecordList();
            },
            getBuySellRecordList() {
                // 分页获取买入卖出记录
                if (this.searchBuySellData.beginTime == '' || this.searchBuySellData.beginTime == null) {
                    this.searchBuySellData.beginTime = null;
                } else {
                    this.searchBuySellData.beginTime = new Date(this.searchBuySellData.beginTime).getTime();
                }
                if (this.searchBuySellData.endTime == '' || this.searchBuySellData.endTime == null) {
                    this.searchBuySellData.endTime = null;
                } else {
                    this.searchBuySellData.endTime = new Date(this.searchBuySellData.endTime).getTime();
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
