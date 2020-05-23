<template>
<div style="background-color: #fff;width:100%">
    <el-card class="box-card" shadow="never">
        <div slot="header" class="clearfix">
            <el-breadcrumb separator-class="el-icon-arrow-right">
              <el-breadcrumb-item :to="{ path: '/index_manager' }">首页</el-breadcrumb-item>
              <el-breadcrumb-item>问题列表</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
       <el-table
    :data="questions"
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
      label="问题编号"
      width="170">
    </el-table-column>
    <el-table-column
      prop="title"
      label="标题"
      width="180">
    </el-table-column>
    <el-table-column
      prop="memberNickName"
      label="作者"
      width="120">
    </el-table-column>
    <el-table-column
      prop="gmtCreate"
      :formatter="dataFormat"
      sortable
      label="创建时间"
      width="150">
    </el-table-column>
    <el-table-column
      prop="likeCount"
      label="点赞数"
      width="80">
    </el-table-column>
    <el-table-column
      prop="commentCount"
      label="评论数"
      width="80">
    </el-table-column>
    <el-table-column
      prop="viewCount"
      label="浏览数"
      width="80">
    </el-table-column>
    <el-table-column
      prop="tags"
      label="标签"
      width="220">
    </el-table-column>
    <!-- :formatter="formatList" -->
    <el-table-column
      fixed="right"
      label="操作"
      width="100">
      <template slot-scope="scope">
        <el-button
          @click="dialogQuestion(scope.$index, questions)"
          type="text"
          size="small">
          详细
        </el-button>
        <el-button
          @click.native.prevent="deleteRow(scope.$index, questions)"
          type="text"
          size="small">
          移除
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
    :title="dialogData.title"
    :visible.sync="dialogVisible"
    width="60%"
    >
    <mavon-editor
      class="md"
      :value="dialogData.htmlContent"
      :subfield="false"
      :defaultOpen="'preview'"
      :toolbarsFlag="false"
      :editable="false"
      :scrollStyle="true"
      :ishljs="true"
      style="min-height: 100"
    ></mavon-editor>
  </el-dialog>
</div>

</template>
<style scoped>
  .clearfix:before,
  .clearfix:after {
    display: table;
    content: "";
  }
  .clearfix:after {
    clear: both
  }
</style>
<script>
import { mavonEditor } from 'mavon-editor'
import 'mavon-editor/dist/css/index.css'

export default {
   components: {
    mavonEditor,
  },
   data() {
      return {
        dialogData:[],
        dialogVisible: false,
        currentPage: 1,
        size:6,
        total:1,
        questions:[],
      }
    },
     methods: {
        deleteRow(index, rows) {
            const _this = this;
            this.$confirm('此操作将删除改问题, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
            axios.delete("http://localhost:8001/question/deleteById/" + rows[index].id,{headers: {'Authorization': 'Bearer ' + localStorage.getItem("managerToken")}}).then(function(resp){
                console.log(resp);
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
        dialogQuestion(index,rows){
          this.dialogVisible= true,
          this.dialogData = rows[index];
          console.log(this.dialogData);
        },
        handleSizeChange(val) {
            this.size = val;
            const _this = this;
            axios.get('http://localhost:8001/question/list/'+_this.currentPage+'/'+_this.size).then(function(resp){
                _this.questions = resp.data.data.records;
            });
        },
        handleCurrentChange(val) {
            console.log(`当前页: ${val}`);
            this.currentPage = val;
            const _this = this;
            axios.get('http://localhost:8001/question/list/'+_this.currentPage+'/'+_this.size).then(function(resp){
                _this.questions = resp.data.data.records;
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
        formatList : function(row,column){
            if(row[column.property] == null){
                return;
            }
             return row[column.property];
        }
    },
    created(){
        const _this = this;
        axios.get('http://localhost:8001/question/list/0/6').then(function(resp){
            _this.questions = resp.data.data.records;
            _this.total=resp.data.data.total;
            console.log(resp.data.data);
        });
    }
}
</script>