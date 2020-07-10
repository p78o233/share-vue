<template>
    <div>
        <div style="margin-top: 10px;">
            <el-form ref="searchForm" :model="searchForm" label-width="80px">
                <el-form-item label="活动名称">
                    <el-input v-model="searchForm.name"></el-input>
                </el-form-item>
                <el-form-item label="活动名称">
                    <el-input v-model="searchForm.name"></el-input>
                </el-form-item>
                <el-form-item label="操作">
                    <el-select v-model="searchForm.cate">
                        <el-option label="全部" value="0">全部</el-option>
                        <el-option label="买入" value="1">买入</el-option>
                        <el-option label="卖出" value="2">卖出</el-option>
                    </el-select>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="getBuySellNoticePage()">查询</el-button>
                    <el-button type="info" @click="insertBuySellNotice()">新增</el-button>
                </el-form-item>
            </el-form>
        </div>
        <el-card class="box-card">
            <el-table
                    :data="buySellNoticeList"
                    style="width: 100%">
                <el-table-column
                        prop="stockNum"
                        label="股票编号"
                        align="center"
                        width="180">
                </el-table-column>
                <el-table-column
                        prop="stockName"
                        label="股票名称"
                        align="center"
                        width="180">
                </el-table-column>
                <el-table-column
                        prop="price"
                        label="目标价格"
                        align="center"
                        width="180">
                </el-table-column>
                <el-table-column
                        label="操作"
                        align="center"
                        width="180">
                    <template slot-scope="scope">
                        {{scope.row.cate | setCateFilter}}
                    </template>
                </el-table-column>
                <el-table-column
                        prop="content"
                        label="描述"
                        align="center"
                        width="180">
                </el-table-column>
                <el-table-column
                        label="创建时间"
                        align="center"
                        width="180">
                    <template slot-scope="scope">
                        {{scope.row.createTime | timeFilter}}
                    </template>
                </el-table-column>
                <el-table-column
                        label="修改时间"
                        align="center"
                        width="180">
                    <template slot-scope="scope">
                        {{scope.row.modifyTime | timeFilter}}
                    </template>
                </el-table-column>
                <el-table-column label="操作" width="180" align="center">
                    <template slot-scope="scope">
                        <el-button type="text" icon="el-icon-edit" @click="editBuySellNotice(scope.row)">修改</el-button>
                        <el-button type="text" icon="el-icon-delete" class="red" @click="deleteBuySellNotice(scope.row.id)">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <el-pagination
                    @size-change="buySellSizeChange"
                    @current-change="buySellCurrentChange"
                    :current-page="searchForm.page"
                    :page-sizes="[10, 20, 30, 40,50]"
                    :page-size="searchForm.pageSize"
                    layout="total, sizes, prev, pager, next, jumper"
                    :total="searchForm.total">
            </el-pagination>
        </el-card>

        <!--新增修改弹窗开始-->
        <el-dialog
                :title="buySellNoticeTitle"
                :visible.sync="buySellNoticeVisible"
                width="60%"
                :before-close="buySellNoticeClose">
                <el-form ref="ioeBuySellNoticeData" :model="ioeBuySellNoticeData" label-width="80px">
                    <el-form-item label="股票编号">
                        <el-input v-model="ioeBuySellNoticeData.stockNum"></el-input>
                    </el-form-item>
                    <el-form-item label="股票名称">
                        <el-input v-model="ioeBuySellNoticeData.stockName"></el-input>
                    </el-form-item>
                    <el-form-item label="目标价格">
                        <el-input v-model="ioeBuySellNoticeData.price"></el-input>
                    </el-form-item>
                    <el-form-item label="操作">
                        <el-select v-model="ioeBuySellNoticeData.cate">
                            <el-option label="买入" value="1" key="b1"></el-option>
                            <el-option label="卖出" value="2" key="b2"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="描述">
                        <el-input type="textarea" v-model="ioeBuySellNoticeData.content"></el-input>
                    </el-form-item>
                </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="buySellNoticeVisible = false">取 消</el-button>
                <el-button type="primary" @click="submitBuySellNotice()">确 定</el-button>
            </span>
        </el-dialog>
        <!--新增修改弹窗结束-->
    </div>
</template>

<script>
    export default {
        name: 'buySellNotice',
        data: function() {
            return {
                searchForm: {//筛选条件
                    userId: sessionStorage.getItem('stockUserId'),
                    stockNum: '',
                    stockName: '',
                    cate: "0",
                    page:1,
                    pageSize: 10,
                    total: 0
                },
                buySellNoticeList: [],//买卖提示数据
                buySellNoticeTitle:'',//买入卖出弹窗标题
                buySellNoticeVisible:false,//买入卖出弹窗是否显示
                buySellNoticeStatus:'',//买入卖出弹窗状态
                ioeBuySellNoticeData:{//买入卖出对象
                    id:null,
                    stockNum:"",
                    stockName:"",
                    userId:sessionStorage.getItem('stockUserId'),
                    price:'',
                    cate:"1",
                    content:''
                },
            };
        },
        methods: {
            deleteBuySellNotice(id){
                // 删除买入卖出记录
                this.$confirm('此操作将永久删除买入卖出操作, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.api.deleteBuySellNotice(id).then(res => {
                       if(res.ret == true){
                           this.getBuySellNoticePage();
                           this.$message({
                               message: '操作成功',
                               type: 'success'
                           });
                       }else{
                           this.$message.error(res.message);
                       }
                    });
                }).catch(() => {

                });
            },
            editBuySellNotice(row){
                // 修改买入卖出记录点击事件
                this.buySellNoticeTitle = "修改"
                this.buySellNoticeStatus = "edit"
                this.cleanBuySellNoticeData()
                this.ioeBuySellNoticeData.id = row.id
                this.ioeBuySellNoticeData.stockNum = row.stockNum
                this.ioeBuySellNoticeData.stockName = row.stockName
                this.ioeBuySellNoticeData.price = row.price
                this.ioeBuySellNoticeData.cate = row.cate.toString()
                this.ioeBuySellNoticeData.content = row.content
                this.buySellNoticeVisible = true;
            },
            checkSubmitData(){
                // 检查买入卖出填的数据
                if(this.ioeBuySellNoticeData.stockNum == ''|| this.ioeBuySellNoticeData.stockNum == undefined){
                    this.$message({
                        message: '股票编号必填',
                        type: 'warning'
                    });
                    return false;
                }
                if(this.ioeBuySellNoticeData.stockName == ''|| this.ioeBuySellNoticeData.stockName == undefined){
                    this.$message({
                        message: '股票名称必填',
                        type: 'warning'
                    });
                    return false;
                }
                if(this.ioeBuySellNoticeData.price == ''|| this.ioeBuySellNoticeData.price == undefined){
                    this.$message({
                        message: '目标价格必填',
                        type: 'warning'
                    });
                    return false;
                }
                if(this.ioeBuySellNoticeData.cate == 0|| this.ioeBuySellNoticeData.cate == undefined){
                    this.$message({
                        message: '操作必选',
                        type: 'warning'
                    });
                    return false;
                }
                return true;
            },
            submitBuySellNotice(){
                // 提交买入卖出
                if(this.checkSubmitData()){
                    this.api.ioeBuySellNotice(this.ioeBuySellNoticeData).then(res => {
                       if(res.ret == true){
                           this.buySellNoticeVisible = false;
                           this.getBuySellNoticePage();
                       }else{
                           this.$message.error(res.message);
                       }
                    });
                }
            },
            cleanBuySellNoticeData(){
                // 清空买入卖出对象
                this.buySellNoticeTitle = ''
                this.ioeBuySellNoticeData.id = null;
                this.ioeBuySellNoticeData.stockNum = ''
                this.ioeBuySellNoticeData.stockName = ''
                this.ioeBuySellNoticeData.userId = sessionStorage.getItem('stockUserId')
                this.ioeBuySellNoticeData.price = ''
                this.ioeBuySellNoticeData.cate = "1"
                this.ioeBuySellNoticeData.content = ''
            },
            insertBuySellNotice(){
                // 新增买入卖出记录点击事件
                this.cleanBuySellNoticeData()
                this.buySellNoticeStatus = 'add'
                this.buySellNoticeVisible = true;
                this.buySellNoticeTitle = '新增'
            },
            buySellNoticeClose(){
                // 新增修改弹窗关闭事件
                this.buySellNoticeVisible = false
            },
            buySellSizeChange(val){
                // 分页大小变化
                this.searchForm.pageSize = val
                this.getBuySellNoticePage();
            },
            buySellCurrentChange(val){
                // 页码变化
                this.searchForm.page = val
                this.getBuySellNoticePage();
            },
            getBuySellNoticePage() {
                // 分页获取买入卖出提示数据
                if (this.searchForm.stockNum == '') {
                    this.searchForm.stockNum = null;
                }
                if (this.searchForm.stockName == '') {
                    this.searchForm.stockName = null;
                }
                this.api.getBuySellNotice(this.searchForm).then(res => {
                    this.buySellNoticeList = res.data.list;
                    this.searchForm.total = res.data.count;
                });
            }
        },
        mounted() {
            this.getBuySellNoticePage();
        },
        filters: {
            setCateFilter: function(cate) {
                let cateStr = '';
                switch (cate) {
                    case 1: {
                        return '买入';
                        break;
                    }
                    case 2: {
                        return '卖出';
                        break;
                    }
                }
            },
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
            }
        }
    };
</script>

<style scoped>

</style>
