<template>
    <div>
        <el-table
                :data="settingData"
                style="width: 100%">
            <el-table-column
                    label="类别"
                    align="center"
                    width="250">
                <template slot-scope="scope">
                    {{scope.row.setCate | setCateFilter}}
                </template>
            </el-table-column>
            <el-table-column
                    prop="setVal"
                    label="值"
                    align="center"
                    width="180">
            </el-table-column>
            <el-table-column
                    label="操作"
                    align="center"
                    width="250">
                <template slot-scope="scope">
                    <el-button type="success" plain @click="editUserSetting(scope.row)">修改</el-button>
                </template>
            </el-table-column>
        </el-table>

        <!--修改弹窗开始-->
        <el-dialog
                title="修改设置"
                :visible.sync="editSettingVisible"
                width="70%"
                :before-close="editSettingClose">
            <el-form ref="editRow" :model="editRow" label-width="100px">
                <el-form-item :label="editRow.setCate | setCateFilter">
                    <el-input v-model="editRow.setVal" placeholder="请输入内容"></el-input>
                </el-form-item>

            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="editSettingClose">取 消</el-button>
                <el-button type="primary" @click="saveSettingBtn">确 定</el-button>
            </span>
        </el-dialog>
        <!--修改弹窗结束-->
    </div>
</template>

<script>
    export default {
        name: 'userSetting',
        data() {
            return {
                settingData: [],//基础信息
                editSettingVisible: false,//修改弹窗是否显示
                editRow: {}//修改数据
            };
        },
        methods: {
            saveSettingBtn(){
                // 保存修改基础信息
                this.api.editUserBaseSetting(this.editRow).then(res => {
                    if(res.ret==true){
                        this.$message({
                            message: '操作成功',
                            type: 'success'
                        });
                        this.editSettingVisible = false;
                        this.getUserBaseSetting();
                    }else{
                        this.$message.error(res.message);
                    }
                });
            },
            editSettingClose() {
                // 修改弹窗关闭事件
                this.editSettingVisible = false;
            },
            editUserSetting(row) {
                this.editSettingVisible = true;
                this.editRow = row;
            },
            getUserBaseSetting() {
                // 获取用户基础配置
                let param = {
                    userId: sessionStorage.getItem('stockUserId')
                };
                this.api.getUserBaseSetting(param).then(res => {
                    this.settingData = res.data;
                });
            }
        },
        mounted() {
            this.getUserBaseSetting();
        },
        filters: {
            setCateFilter: function(cate) {
                let cateStr = '';
                switch (cate) {
                    case 1: {
                        return '盈利百分比';
                        break;
                    }
                    case 2: {
                        return '亏损百分比';
                        break;
                    }
                }
            }
        }
    };
</script>

<style scoped>

</style>
