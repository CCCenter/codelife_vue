<template>
<div style="background-color: #fff;width:100%">
    <el-card class="box-card" shadow="never">
        <div slot="header" class="clearfix">
            <el-breadcrumb separator-class="el-icon-arrow-right">
              <el-breadcrumb-item :to="{ path: '/index_manager' }">首页</el-breadcrumb-item>
              <el-breadcrumb-item>总览</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
            <el-row :gutter="12">
            <el-col :span="8">
            <el-card class="box-card" shadow="hover">
                <div slot="header" class="clearfix">
                    <span>用户管理</span>
                </div>
                <h1>昨日新增 : {{member.dayOne}}</h1>
                <h1>7日新增 : {{member.daySeven}}</h1>
            </el-card>
            </el-col>
            <el-col :span="8">
            <el-card class="box-card" shadow="hover">
                <div slot="header" class="clearfix">
                    <span>问题管理</span>
                </div>
                  <h1>昨日新增 : {{question.dayOne}}</h1>
                <h1>7日新增 : {{question.daySeven}}</h1>
            </el-card>
            </el-col>
            <el-col :span="8">
            <el-card class="box-card" shadow="hover">
                <div slot="header" class="clearfix">
                    <span>评论管理</span>
                </div>
                  <h1>昨日新增 : {{comment.dayOne}}</h1>
                <h1>7日新增 : {{comment.daySeven}}</h1>
            </el-card>
            </el-col>
        </el-row>
    </el-card>
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
export default {
   data() {
      return {
          member:{
            dayOne:'',
            daySeven:'',
          },
          question:{
            dayOne:'',
            daySeven:'',
          },
          comment:{
            dayOne:'',
            daySeven:'',
          },
      }
    },
    methods: {
    },
    created(){
        const _this = this;
        axios.get('http://localhost:8001/question/increased/1').then(function(resp){
            _this.question.dayOne = resp.data.data;
        });
        axios.get('http://localhost:8002/comment/increased/1').then(function(resp){
            _this.comment.dayOne = resp.data.data;
        });
        axios.get('http://localhost:8003/member/increased/1').then(function(resp){
            _this.member.dayOne = resp.data.data;
        });
        axios.get('http://localhost:8001/question/increased/7').then(function(resp){
            _this.question.daySeven = resp.data.data;
        });
        axios.get('http://localhost:8002/comment/increased/7').then(function(resp){
            _this.comment.daySeven = resp.data.data;
        });
        axios.get('http://localhost:8003/member/increased/7').then(function(resp){
            _this.member.daySeven = resp.data.data;
        });
    }
}
</script>