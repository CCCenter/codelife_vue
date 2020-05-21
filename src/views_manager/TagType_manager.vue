<template>
<div style="background-color: #fff;width:100%">
    <el-card class="box-card" shadow="never">
        <div slot="header" class="clearfix">
            <el-breadcrumb separator-class="el-icon-arrow-right">
              <el-breadcrumb-item :to="{ path: '/index_manager' }">首页</el-breadcrumb-item>
              <el-breadcrumb-item>标签分类</el-breadcrumb-item>
            </el-breadcrumb>
            <el-button @click="dialog()" style="float: right; padding: 3px 0" type="text">添加分类</el-button>
        </div>
       <el-table
    :data="data"
    :default-sort = "{prop: 'gmtCreate', order: 'descending'}"
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
      label="类型编号"
      width="300">
    </el-table-column>
    <el-table-column
      prop="tagType"
      label="标签类型"
      width="300">
    </el-table-column>
    <el-table-column
      prop="tagCount"
      label="标签总数"
      width="300">
    </el-table-column>
    <!-- :formatter="formatList" -->
    <el-table-column
      fixed="right"
      label="操作"
      width="160">
      <template slot-scope="scope">
        <el-button
         @click="goTag(scope.$index, data)"
          type="text"
          size="small">
          查看
        </el-button>
        <el-button
          @click="deleteRow(scope.$index, data)"
          type="text"
          size="small">
          删除
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
    title="添加标签分类"
    :visible.sync="dialogVisible"
    width="40%"
    >
    <el-divider content-position="left">分类添加</el-divider>
    <el-form :model="tagTypeForm" status-icon ref="ruleForm" label-width="100px" class="demo-ruleForm">
      <el-form-item label="分类名称" prop="tagType"
        :rules="[
            { required: true, message: '分类名称不能为空'},
        ]"
      >
        <el-input v-model="tagTypeForm.tagType" autocomplete="off"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" style="float:right" @click="submitForm('ruleForm')">提交</el-button>
      </el-form-item>
    </el-form>

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
   data() {
      return {
        tagTypeForm:{
          tagType:'',
        },
        dialogData:[],
        dialogVisible: false,
        currentPage: 1,
        size:6,
        total:1,
        data:[],
      }
    },
     methods: {
        submitForm(formName) {
            const _this = this;
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    axios.post('http://localhost:8005/tagType/create',_this.tagTypeForm,{headers: {'Authorization': 'Bearer ' + localStorage.getItem("managerToken")}}).then(function(resp){
                        console.log(resp);
                        if(resp.data.code == 700){

                        }
                        else if(resp.data.code == 200){
                            _this.$notify({
                                title: '添加成功',
                                message: '标签添加成功',
                                type: 'success'
                            });
                        }else{
                            _this.$notify({
                                title: '添加失败',
                                message: '标签添加失败',
                                type: 'error'
                            });
                        }
                    });
                } else {
                    return false;
                }
            });
        },
        deleteRow(index, rows) {
            const _this = this;
            this.$confirm('此操作将会删除此分类下的所有标签, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
            axios.delete("http://localhost:8005/tagType/deleteById/" + rows[index].id,{},{headers: {'Authorization': 'Bearer ' + localStorage.getItem("managerToken")}}).then(function(resp){
                if(resp.status == 200 && resp.data.code == 200){
                    _this.$message({
                        type: 'success',
                        message: '删除成功!'
                    });
                    rows.splice(index, 1);
                }else if(resp.data.code == 700){
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
                }else{
                    _this.$message({
                        type: 'error',
                        message: '删除失败'
                    });
                }
            });
            }).catch(() => {
                _this.$message({
                    type: 'info',
                    message: '已取消删除'
                });
            });
        },
        goTag(index, rows){
          this.$router.push('/tag_manager/' + rows[index].id);
          // console.log('/tag_manager/' + rows[index].id);
        },
        dialog(){
          this.dialogVisible = true;
        },
        handleSizeChange(val) {
            this.size = val;
            const _this = this;
            axios.get('http://localhost:8005/tagType/list/'+_this.currentPage+'/'+_this.size).then(function(resp){
                _this.data = resp.data.data.records;
            });
        },
        handleCurrentChange(val) {
            console.log(`当前页: ${val}`);
            this.currentPage = val;
            const _this = this;
            axios.get('http://localhost:8005/tagType/list/'+_this.currentPage+'/'+_this.size).then(function(resp){
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
        typeFormat(row, column){
            let data = row[column.property];
            if(data == 0){
                return "回复问题";
            }else if (data == 1){
                return "回复评论";
            }
        },
    },
    created(){
        const _this = this;
        axios.get('http://localhost:8005/tagType/list/0/6').then(function(resp){
            _this.data = resp.data.data.records;
            _this.total=resp.data.data.total;
            console.log(resp.data.data);
        });
    }
}
</script>