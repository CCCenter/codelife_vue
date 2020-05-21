<template>
    <el-row>
        <el-col :span="6" :offset="3">
            <el-card class="box-card">
                <el-image src="https://g.csdnimg.cn/static/404img/404_back.png"></el-image>
                你找的内容不存在!
                <router-link style=" text-decoration: none;"  to="/index">首页</router-link>
            </el-card>
        </el-col>
        <el-col :span="12">
            <el-page-header @back="goBack" title="首页" content="最热问题" style="padding-left:5px;height:50px;line-height : 50px; background-color: #fff;"></el-page-header>
          <el-card shadow="hover" style="margin-bottom:25px" v-for="question in questions" :key='question.id'>
                <div class="content">
                  <router-link :to="'question/' + question.id"><h3 v-html="question.title"></h3></router-link>
                  <div class="desc" style="text-overflow: ellipsis;overflow:hidden;white-space: nowrap;">{{question.description}}</div>
                  <div class="user-bar">
                    <el-avatar shape="square" style="vertical-align:middle;" :size="14" :src="question.memberAvatar"></el-avatar>
                    <router-link style=" text-decoration: none;" :to="{path:'/member/'+ question.memberId}">
                        <span class="author-info">{{ question.memberNickName}}</span>
                    </router-link>
                    <span class="author-info"> | {{question.gmtCreate  | formatData()}}</span>
                    <span style="float:right">
                      <a href=""><i class="el-icon-thumb icon"><span class="num">{{question.likeCount}}</span></i></a>
                      <a href=""><i class="el-icon-view icon"><span class="num">{{question.viewCount}}</span></i></a>
                      <a href=""><i class="el-icon-chat-line-round icon"><span class="num">{{question.commentCount}}</span></i></a>
                    </span>
                  </div>
                </div>
              </el-card>
        </el-col>
    </el-row>
</template>
<script>
export default {
    data(){
        return{
            questions:[],
        }
    },
    methods:{
        goBack(){
            this.$router.push("/index");
        }
    },
     created(){
    const _this = this;
    axios.get("http://localhost:8001/question/hotList").then(function(resp){
        _this.questions = resp.data.data;
    });
  },
}
</script>
<style scoped>
    .user-bar{
        font-size: 14px;
        color: #8a8a8a;
    }
    .desc{
    color: #8a8a8a;
    font-size: 14px;
    margin-top: 5px;
    margin-bottom: 5px;
  }
  .icon{
    margin-right: 15px;
  }
  .content h3{
    margin:0;
  }
    a{
    text-decoration:none;
    color:black;
  }

    a:hover{
    color:#499ef3;
  }
</style>