<template>
    <el-row class="body">
      <div class="like-bar" style="">
        <span v-if="isLike != 1" class="el-icon-star-off" @click="like(1)"></span>
        <span v-if="isLike == 1" class="el-icon-star-on" style="color:#499ef3;" @click="like(0)" ></span>
      </div>
        <el-col :xs="{span:24}" :sm="{span:24}" :md="{span:24}" :lg="{span:18,offset:3}" class="main">
          <el-row :gutter="20" class="content">
            <el-col :xs="{span:24}" :sm="{span:24}" :md="{span:24}" :lg="{span:18}">
                <h1 class="title">{{question.title}}</h1>
                <div class="question-info">
                  <router-link style=" text-decoration: none;" :to="{path:'/member/'+ question.memberId}">
										<span class="author-info">{{ question.memberNickName}}</span>
									</router-link>
                  <span class="author-info"> | 浏览数：{{ question.viewCount}}</span>
                  <el-link  @click="goEdit()" style="float: right;font-size: 12px;" v-if="question.memberId === this.member.id" icon="el-icon-edit">编辑</el-link>
                </div>

                <el-divider class="hr"></el-divider>
                <!-- markdown 编辑器 -->
                <mavon-editor
                  class="md"
                  :value="question.htmlContent"
                  :subfield="false"
                  :defaultOpen="'preview'"
                  :toolbarsFlag="false"
                  :editable="false"
                  :scrollStyle="true"
                  :ishljs="true"
                  style="min-height: 0"
                ></mavon-editor>
              <el-divider class="hr"></el-divider>
              <!-- 评论区 -->
                <el-card class="box-card">
                  <div slot="header" class="clearfix">
                    <span>评论</span>
                    <!-- <el-button style="float: right; padding: 3px 0" type="text">操作按钮</el-button> -->
                  </div>
                  <!-- 发起评论 -->
                  <div>
                    <el-avatar shape="square" :size="20" :src="member.avatar"></el-avatar>
                    <span class="name">{{member.nickName}}</span>
                    <el-input
                      style="margin:15px 0 10px 0;"
                      type="textarea"
                      :rows="2"
                      :placeholder="placeholder"
                      v-model="editComment.content">
                    </el-input>
                      <el-button style="float:right; padding: 4px;margin-bottom:12px" type="primary" @click="comment()">发表评论</el-button>
                  </div>
                  <el-divider></el-divider>
                  <el-dialog
                    title="提示"
                    :visible.sync="centerDialogVisible"
                    width="30%"
                    center>
                    <span>请填写内容</span>
                    <span slot="footer" class="dialog-footer">
                      <el-button type="primary" @click="centerDialogVisible = false">确 定</el-button>
                    </span>
                  </el-dialog>
                  <!-- 评论列表 -->
                  <div v-if="comments.total == 0">暂无评论</div>

                  <div class="comment" v-for="comment in comments.records" :key="comment.id">
                    <div class="commentor">
                      <el-avatar class="avatar" shape="square" :size="20" :src="comment.commentatorAvatar"></el-avatar>
                      <span class="name">{{comment.commentatorNickName}}</span>
                      <el-button style="float: right; padding: 3px 0" type="text" @click="comm2(comment.id,comment.commentator,comment.commentatorNickName)">回复</el-button>
                       </div>
                    <div class="content">{{comment.content}}</div>
                    <el-collapse accordion v-if="comment.commentCount != 0"  @change="loadComment(comment.id)">
                        <el-collapse-item>
                          <template slot="title">
                            <el-button
                              style="float: right; padding: 3px 0"
                              type="text">展开回复{{comment.commentCount}}
                            </el-button>
                          </template>
                      <!-- 二级评论 -->
                      <div class="comment2" :id="comment.id">
                        <div v-for="comment2 in comment.comment2" :key="comment2.id" >
                            <div class="commentor">
                            <el-avatar class="avatar" shape="square" :size="20" :src="comment2.commentatorAvatar"></el-avatar>
                            <span class="name">{{comment2.commentatorNickName}} 回复 {{comment2.commentator2NickName}}</span>
                            <el-button style="float: right; padding: 3px 0" type="text" @click="comm2(comment.id,comment2.commentator,comment2.commentatorNickName)">回复</el-button>
                            </div>
                            <div class="content">{{comment2.content}}</div>
                        </div>
                      </div>
                        </el-collapse-item>
                    </el-collapse>
                  </div>

                  <div class="block">
                    <span class="demonstration"></span>
                    <el-pagination
                      small
                      layout="prev, pager, next"
                      :total="comments.total"
                      :page-size="comments.size"
                      :current-page="comments.current"
                      :hide-on-single-page="hiddenPage"
                       @current-change="page"
                      >
                    </el-pagination>
                  </div>
                </el-card>
            </el-col>

            <el-col :span="6"  class="hidden-md-and-down">
              <div class="">
                <el-card shadow="hover">
                  <div slot="header" class="clearfix">
                     <span>发起人</span>
                  </div>
                  <el-row>
                    <el-col :span="7" ><el-avatar shape="square" :size="50" :src="question.memberAvatar"></el-avatar></el-col>
                    <el-col :span="17">
                      <span>{{question.memberNickName}}</span>
                    </el-col>
                  </el-row>
                  <el-divider></el-divider>
                  <!-- tag 标签 -->
                  <div>
                    <el-tag
                      class="tag-list"
                      :key="tag.name"
                      size="mini"
                      v-for="tag in tags"
                      :disable-transitions="false"
                    >
                    <router-link style="text-decoration:none;color:#499ef3;" :to="{name:'index',query:{tag:tag}}" >{{tag}}</router-link>
                    </el-tag>
                  </div>
                  <el-divider></el-divider>
                  <!-- 相关问题 -->
                  <div>
                      问题推荐
                      <el-card shadow="hover" body-style="padding:5px" style="margin:5px 0" v-for="question in relationQuestions" :key='question.id'>
                        <div class="hot">
                          <a style="cursor: pointer;" @click="getQuestion(question.id)"><h3>{{ question.title }}</h3></a>
                          <div class="user-bar">
                            <el-avatar shape="square" style="vertical-align:middle;" :size="14" :src="question.memberAvatar"></el-avatar>
                            <a href=""><span class="author-info">{{question.memberNickName}}</span></a>
                          </div>
                        </div>
                    </el-card>
                  </div>
                </el-card>
              </div>
            </el-col>
          </el-row>
        </el-col>
    </el-row>
</template>
<script>
import 'element-ui/lib/theme-chalk/display.css';

import { mavonEditor } from 'mavon-editor'
import 'mavon-editor/dist/css/index.css'

export default {
  inject:['reload'],
  components: {
    mavonEditor,
  },
  data() {
    return {//value的值是经过markdown解析后的文本，可使用`@change="changeData"`在控制台打印显示
        centerDialogVisible: false,
        placeholder:"说点什么...",
        hiddenPage:true,
        isLike:'',
        member:{
          nickName:'',
          id:'',
          avatar: "",
        },
        tags:[],
        question:{},
        relationQuestions:[],
        editComment:{
          // 0 评论问题 1 回复评论
          type:'0',
          parentId:'',
          questionId:'',
          commentator:'',
          commentator2:'',
          content: '',
        },
        // 编辑内容
        comments:[],
    };
  }
  ,methods:{
    like(flag){
      const _this = this;
      let questionId = _this.$route.params.id;
      axios.post('http://localhost:8001/relation/followQuestion',{questionId:questionId},{headers: {'Authorization': 'Bearer ' + localStorage.getItem("token")}}).then(function(resp){
        console.log(resp);
        if(resp.data.code == 700){
          _this.$confirm('登录信息过期是否登录?', '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning'
              }).then(() => {
                  _this.$router.push( {name :"login" ,query: { url : "question/" + id}});
              }).catch(() => {
              _this.$message({
                  type: 'info',
                  message: '取消登录'
              });
          });
        }
        if(resp.data.code == 200){
            _this.$notify({
              title: '提示',
              type: 'success',
              message: resp.data.message,
              duration : 1000,
            });
          _this.isLike = flag;
        }
      });
    },
    getQuestion(id){
       this.$router.push("/question/" + id);
       this.reload();
    },
    goEdit(){
      let id = this.$route.params.id;
       this.$router.push({path:"/publish",query:{id:id}});
    },
    comment(){
      const _this = this;
      let id = _this.$route.params.id;
      this.editComment.questionId = id;
      if(this.editComment.content == "" || this.editComment.content == null){
        this.centerDialogVisible = true;
        return;
      }
      axios.post("http://localhost:8002/comment/create/",_this.editComment,{headers: {'Authorization': 'Bearer ' + localStorage.getItem("token")}}).then(function(resp){
       if(resp.data.code == 700){
          _this.$confirm('登录信息过期是否登录?', '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning'
              }).then(() => {
                  _this.$router.push( {name :"login" ,query: { url : "question/" + id}});
              }).catch(() => {
              _this.$message({
                  type: 'info',
                  message: '取消登录'
              });
          });
        }
        if(resp.data.code == 200){
          _this.editComment.content = '';
          _this.editComment.commentator2=_this.question.memberId;
          _this.editComment.parentId=_this.$route.params.id;
          _this.editComment.type = '0';
          _this.placeholder="说点什么...";
          axios.get("http://localhost:8002/comment/listByQuestion/"+_this.$route.params.id +"/1/5").then(function(resp){
            _this.comments=resp.data.data;
          });
        }
      });
    },
    comm2(id,commentator2,nickName){
      this.placeholder = "回复"+nickName;
      this.editComment.type=1;
      this.editComment.parentId=id;
      this.editComment.commentator=this.member.id;
      this.editComment.commentator2=commentator2;
    },
    loadComment(id){
      const _this = this;
      for(var i = 0; i < _this.comments.records.length; i++){
          if(_this.comments.records[i].id == id){
              if(_this.comments.records[i].comment2 != null){
                return;
              }
          }
        }
      axios.get("http://localhost:8002/comment/listByComment/"+id +"/1/5").then(function(resp){
        var records = resp.data.data.records;
        for(var i = 0; i < _this.comments.records.length; i++){
          if(_this.comments.records[i].id == id){
              _this.comments.records[i].comment2 = resp.data.data.records;
          }
        }
      });
    },
    page(currentPage){
      const _this = this;
      let id = _this.$route.params.id;
      axios.get("http://localhost:8002/comment/listByQuestion/"+id +"/"+ currentPage+"/5").then(function(resp){
        _this.comments=resp.data.data;
      });
    }
  },
  created(){
    const _this = this;
    this.member.id=localStorage.getItem("id");
    this.member.avatar=localStorage.getItem("avatar");
    let id = _this.$route.params.id;
    if(!id){
      _this.$router.push({ name: 'index'})
    }
    axios.get("http://localhost:8001/question/get/"+id).then(function(resp){
      if(resp.data.data){
        _this.question = resp.data.data;
        _this.editComment.commentator2=_this.question.memberId;
        _this.tags = _this.question.tags.split(",");
      }else{
        _this.$router.push({ name: 'NotFound'})
      }
    });
    axios.get("http://localhost:8002/comment/listByQuestion/"+id +"/1/5").then(function(resp){
      _this.comments=resp.data.data;
    });
    this.editComment.parentId=this.$route.params.id;
    this.editComment.commentator=this.member.id;
    var question = this.question;

    setTimeout(function(){
        axios.get("http://localhost:8001/question/list/" + _this.question.tags[0] + "/1/5").then(function(resp){
          for (let index = 0; index < resp.data.data.records.length; index++) {
            const element = resp.data.data.records[index];
            if(element.id != _this.question.id){
              _this.relationQuestions.push(element);
            }
          }
        });
    },500);

    axios.post('http://localhost:8001/relation/findRelation',{questionId:id,type:2,userId:localStorage.getItem("id")},).then(function(resp){
      console.log(resp.data.code );
      if(resp.data.code == 200){
        _this.isLike = 1;
      }
    });
  },
}
</script>
<style scoped>
    .body{
      background-color: #f5f6f7;
    }
    .main{
        margin-top: 25px;
        margin-bottom: 25px;
        background-color: #e6e6e6;
        padding: 25px;
    }
    .content{
      background-color: #fff;
      padding: 25px;
    }
    .like-bar{
      position: fixed;
      width:40px;
      font-size:40px;
      top:50%;left:3%;
      transform: translate(-50%,-50%);
      color: #C0C4CC;
    }
    .like-bar span:hover {
      color: rgb(73, 158, 243);
    }
    .hr{
    margin-top: 0;
    }
    .title{
      font-weight: 500;
    }
    .question-info{
      margin-bottom: 10px;
      font-size: 12px;
      color : #999;
    }
    .tag-list{
      margin: 5px;
      cursor: pointer;
    }
    .question-info a{
        text-decoration:none;
        color : #999;
      }
      .desc{
        color: #333;
        margin-bottom: 25px;
        font-size: 14px;
      }
      .commentor{
        height:20px;
        line-height: 20px;
      }
      .avatar{
        width: 20px;
        vertical-align:middle;
      }
      .name{
        font-weight: 600;
        margin-left: 10px;
      }
      .comment{
        border-bottom: 1px solid rgb(73, 158, 243);
        padding: 10px;
      }
      .comment2{
        margin-left: 50px;
        border-left: 3px solid rgb(73, 158, 243);
        padding: 5px;
      }
        .user-bar{
    font-size: 14px;
    color: #8a8a8a;
  }
  .hot a{
    padding: 0;
    text-decoration:none;
    color:black;
  }
  
 .hot a:hover{
    color:#499ef3;
  }
   .hot h3{
    margin:0;
    font-size: 14px;
    font-weight: 400;
  }
</style>