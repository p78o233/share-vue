<template>
    <div>
        <!--筛选条件开始-->
        <el-card class="box-card searchCard">
            <span style="display: block;margin-bottom: 5px;">筛选条件</span>
            <div style="margin-bottom: 5px;">
                <el-select v-model="searchData.weight" placeholder="请选择">
                    <el-option
                            v-for="item in options"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                    </el-option>
                </el-select>
            </div>
            <el-button type="primary" round icon="el-icon-plus" @click="addSearchStock()"></el-button>
            <div v-for="(item,index) in searchData.stockNums" style="margin-top: 5px;margin-bottom: 5px;">
                <el-input v-model="searchData.stockNums[index]" style="display: inline-block;width: 90%;"></el-input>
                <el-button type="danger" round icon="el-icon-delete" @click="deleteSearchStock(index)"
                           style="float: right;"></el-button>
            </div>
            <el-button type="primary" plain @click="getNowData()">搜索</el-button>
            <div v-if="searchData.stockNums.length != 0">
                <el-button type="danger" plain @click="cleanSearch()">清空筛选条件</el-button>
            </div>
        </el-card>
        <!--筛选条件结束-->
        <el-table
                :data="nowRecordList"
                style="width: 100%">
            <el-table-column
                    prop="stockName"
                    label="名字"
                    align="center"
                    width="180">
            </el-table-column>
            <el-table-column
                    prop="stockNum"
                    label="编号"
                    align="center"
                    width="180">
            </el-table-column>
            <el-table-column
                    prop="heightPriceHis"
                    label="历史最高价"
                    align="center"
                    width="180">
            </el-table-column>
            <el-table-column
                    prop="lastestTwenHeight"
                    label="二十天最高价"
                    align="center"
                    width="180">
            </el-table-column>
            <el-table-column
                    prop="lastestTenHeight"
                    label="十天最高价"
                    align="center"
                    width="180">
            </el-table-column>
            <el-table-column
                    prop="yesterdayPrice"
                    label="昨日价格"
                    align="center"
                    width="180">
            </el-table-column>
            <el-table-column
                    prop="nowPrice"
                    label="当前价格"
                    align="center"
                    width="180">
            </el-table-column>
            <el-table-column
                    prop="rate"
                    label="当前涨跌幅"
                    align="center"
                    width="180">
            </el-table-column>
            <el-table-column
                    prop="lastestTenLow"
                    label="十天内最低价"
                    align="center"
                    width="180">
            </el-table-column>
            <el-table-column
                    prop="lastestTwenLow"
                    label="二十天最低价"
                    align="center"
                    width="180">
            </el-table-column>
            <el-table-column
                    prop="lowPriceHis"
                    label="历史最低价"
                    align="center"
                    width="180">
            </el-table-column>
            <el-table-column
                    prop="avgRaiseCycle"
                    label="平均涨周期"
                    align="center"
                    width="180">
            </el-table-column>
            <el-table-column
                    prop="avgDropCycle"
                    label="平均跌周期"
                    align="center"
                    width="180">
            </el-table-column>
            <el-table-column
                    prop="avgRaise"
                    label="连续涨天数平均值"
                    align="center"
                    width="180">
            </el-table-column>
            <el-table-column
                    prop="avgRaise"
                    label="连续跌天数平均值"
                    align="center"
                    width="180">
            </el-table-column>
            <el-table-column
                    prop="stauts"
                    label="上个交易日涨跌情况"
                    align="center"
                    width="180">
            </el-table-column>
            <el-table-column
                    prop="lastDays"
                    label="已经持续当前状况多少天"
                    align="center"
                    width="180">
            </el-table-column>
            <el-table-column
                    prop="nowStatus"
                    label="当前状态"
                    align="center"
                    width="180">
            </el-table-column>
        </el-table>
    </div>
</template>

<script>
    export default {
        name: 'getRecordNow',
        data: function() {
            return {
                searchData: {//筛选条件
                    userId: sessionStorage.getItem('stockUserId'),
                    weight: 0,
                    stockNums: []
                },
                nowRecordList: [],//当前数据
                options: [{
                    value: 0,
                    label: '全部'
                }, {
                    value: 1,
                    label: '有权重'
                }],
            };
        },
        methods: {
            cleanSearch() {
                // 清空筛选条件
                this.searchData.stockNums = [];
                this.getNowData();
            },
            deleteSearchStock(index) {
                // 删除筛选条件
                this.searchData.stockNums.splice(index, 1);
            },
            addSearchStock() {
                // 添加数据
                this.searchData.stockNums.push('');
            },
            getNowData() {
                // 获取当前的信息
                this.api.checkNowPrice(this.searchData.userId, this.searchData.weight, this.searchData.stockNums).then(res => {
                    this.nowRecordList = res.data;
                });
            }
        },
        mounted() {
            this.getNowData();
        }
    };
</script>

<style>
    .searchCard {
        border: 1px;
        min-height: 100px;
        width: 100%;
    }
</style>
