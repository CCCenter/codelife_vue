<template>
<div style="background-color: #fff;width:100%">
    <el-card class="box-card" shadow="never">
        <div slot="header" class="clearfix">
            <el-breadcrumb separator-class="el-icon-arrow-right">
              <el-breadcrumb-item :to="{ path: '/index_manager' }">首页</el-breadcrumb-item>
              <el-breadcrumb-item>用户列表</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
       <el-table
    :data="data"
    border
    stripe
    size="mini"
    style="width: 100%"
    max-height="700"
    >
    <el-table-column
      type="index"
      label="序号"
      width="50">
    </el-table-column>
    <el-table-column
      prop="id"
      label="用户编号"
      width="170">
    </el-table-column>
    <el-table-column
      prop="username"
      label="账号"
      width="180">
    </el-table-column>
    <el-table-column
      prop="nickName"
      label="昵称"
      width="120">
    </el-table-column>
    <el-table-column
      prop="createTime"
      :formatter="dataFormat"
      sortable
      label="创建时间"
      width="150">
    </el-table-column>
    <el-table-column
      prop="phone"
      label="手机号"
      width="100">
    </el-table-column>
    <el-table-column
      prop="source"
      label="用户来源"
      :formatter="sourceFormat"
      width="80">
    </el-table-column>
    <el-table-column
      prop="role"
      label="用户角色"
      :formatter="roleFormat"
      width="80">
    </el-table-column>
    <el-table-column
      prop="gender"
      label="性别"
      :formatter="genderFormat"
      width="100">
    </el-table-column>
     <el-table-column
      prop="city"
      label="城市"
      width="100">
    </el-table-column>
    <!-- :formatter="formatList" -->
    <el-table-column
      fixed="right"
      label="操作"
      width="100">
      <template slot-scope="scope">
        <el-button
          @click="dialogMember(scope.$index, data)"
          type="text"
          size="small">
          详细
        </el-button>
        <el-button
          v-if="data[scope.$index].role != 2"
          @click.native.prevent="forbiddenRow(scope.$index, data)"
          type="text"
          size="small">
          禁用
        </el-button>
        <el-button
          v-if="data[scope.$index].role == 2"
          @click.native.prevent="enableRow(scope.$index, data)"
          type="text"
          size="small">
          启用
        </el-button>
      </template>
    </el-table-column>
  </el-table>

  <div class="block" style="margin-top:10px;">
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="currentPage"
      :page-sizes="[6, 12]"
      :page-size="size"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total">
    </el-pagination>
  </div>
    </el-card>

  <el-dialog
    title="个人档案"
    :visible.sync="dialogVisible"
    width="60%"
    >
    <el-divider content-position="left">{{dialogData.nickName}}</el-divider>
    <el-container>
        <el-aside width="200px" style="border-right:#DCDFE6 1px solid;position: relative;">
            <img
            style="width: 100px; height: 100px; margin: 0 auto;"
            :src="dialogData.avatar"
            />
        </el-aside>
        <el-main>
            <el-form label-width="80px">
            <el-form-item label="用户名:">
                {{dialogData.username}}
            </el-form-item>
            <el-form-item label="昵　称:">
                {{dialogData.nickName}}
            </el-form-item>
            <el-form-item label="手机号:">
                {{dialogData.phone}}
            </el-form-item>
            <el-form-item label="创建时间:">
                {{dialogData.createTime | dataFormat("yyyy-MM-dd")}}
            </el-form-item>
            <el-form-item label="用户编号:">
                {{dialogData.id}}
            </el-form-item>
            </el-form>
        </el-main>
    </el-container>

  </el-dialog>
</div>

</template>
<style scoped>
  .clearfix:before,
  .clearfix:after {
    display: table;
    content: "";
  }
  img{
      position: absolute;
      top:50%;
      left: 50%;
      transform: translate(-50%,-50%);
  }
  .clearfix:after {
    clear: both
  }
</style>
<script>
export default {
    inject:['reload'],
   data() {
      return {
        dialogData:[],
        dialogVisible: false,
        currentPage: 1,
        size:6,
        total:1,
        data:[],
      }
    },
     methods: {
        forbiddenRow(index, rows) {
            const _this = this;
            this.$confirm('此操作将禁用该用户, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
            axios.post("http://localhost:8003/member/disable/" + rows[index].id,{},{headers: {'Authorization': 'Bearer ' + localStorage.getItem("managerToken")}}).then(function(resp){
                if(resp.data.code == 700){
                    _this.$confirm("登录信息过期是否登录?", "提示", {
                    confirmButtonText: "确定",
                    cancelButtonText: "取消",
                    type: "warning"
                    }).then(() => {
                    _this.$router.push({name: "login_manager"});
                    }).catch(() => {
                        _this.$message({
                        type: "info",
                        message: "取消登录"
                        });
                    });
                }
                if(resp.status == 200 && resp.data.code == 200){
                    _this.$message({
                        type: 'success',
                        message: '禁用成功!'
                    });
                    _this.reload();
                }else{
                    _this.$message({
                        type: 'error',
                        message: '禁用失败'
                    });
                }
            });
            }).catch(() => {
                _this.$message({
                    type: 'info',
                    message: '已取消禁用'
                });
            });
        },
         enableRow(index, rows) {
            const _this = this;
            this.$confirm('此操作将解禁用该用户, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
            axios.post("http://localhost:8003/member/enable/" + rows[index].id,{},{headers: {'Authorization': 'Bearer ' + localStorage.getItem("managerToken")}}).then(function(resp){
                if(resp.status == 200 && resp.data.code == 200){
                    _this.$message({
                        type: 'success',
                        message: '解禁成功!'
                    });
                     _this.reload();
                }else{
                    _this.$message({
                        type: 'error',
                        message: '解禁失败'
                    });
                }
            });
            }).catch(() => {
                _this.$message({
                    type: 'info',
                    message: '已取消解禁'
                });
            });
        },
        dialogMember(index,rows){
          this.dialogVisible= true,
          this.dialogData = rows[index];
        },
        handleSizeChange(val) {
            this.size = val;
            const _this = this;
            axios.get('http://localhost:8003/member/list/'+_this.currentPage+'/'+_this.size).then(function(resp){
                _this.data = resp.data.data.records;
            });
        },
        handleCurrentChange(val) {
            this.currentPage = val;
            const _this = this;
            axios.get('http://localhost:8003/member/list/'+_this.currentPage+'/'+_this.size).then(function(resp){
                _this.data = resp.data.data.records;
            });
        },
        dataFormat: function (row, column) {
             if(row[column.property] == null){
                return;
            }
            let getDate = new Date(row[column.property]);
            let fmt = "yyyy-MM-dd hh:mm:ss";
            let o = {
                'M+': getDate.getMonth() + 1,
                'd+': getDate.getDate(),
                'h+': getDate.getHours(),
                'm+': getDate.getMinutes(),
                's+': getDate.getSeconds(),
                'q+': Math.floor((getDate.getMonth() + 3) / 3),
                'S': getDate.getMilliseconds()
            };
            if (/(y+)/.test(fmt)) {
                fmt = fmt.replace(RegExp.$1, (getDate.getFullYear() + '').substr(4 - RegExp.$1.length))
            }
            for (let k in o) {
                if (new RegExp('(' + k + ')').test(fmt)) {
                    fmt = fmt.replace(RegExp.$1, (RegExp.$1.length === 1) ? (o[k]) : (('00' + o[k]).substr(('' + o[k]).length)))
                }
            }
            return fmt;
        },
        roleFormat(row, column){
            let data = row[column.property];
            if(data == 0){
                return "会员";
            }else if (data == 1){
                return "管理员";
            }else if(data == 2){
                return "禁用";
            }
        },
        sourceFormat(row, column){
            let data = row[column.property];
            if(data == 1){
                return "微博";
            }else if (data == 2){
                return "GitHub";
            }else if(data == 3){
                return "禁用";
            }else{
                return "本站";
            }
        },
        genderFormat(row, column){
            let data = row[column.property];
            if(data == 'm'){
                return "男";
            }else if (data == 'f'){
                return "女";
            }else{
                return "保密";
            }
        },
    },
    created(){
        const _this = this;
        axios.get('http://localhost:8003/member/list/0/6').then(function(resp){
            _this.data = resp.data.data.records;
            _this.total=resp.data.data.total;
            console.log(resp.data.data);
        });
    }
}
</script>