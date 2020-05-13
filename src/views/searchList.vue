<template>

    <el-row class="body">
      <!--  -->
        <el-col :xs="{span:24}" :sm="{span:24}" :md="{span:18,offset:3}" :lg="{span:18,offset:3}" class="main">
          <el-row :gutter="20">
            <el-col :lg="18" :md="24" :xm="24" :xs="24">

              <el-card shadow="hover" style="margin-bottom:25px" v-for="question in questions" :key='question.id'>
                <div class="content">
                  <router-link :to="'question/' + question.id"><h3 v-html="question.title"></h3></router-link>
                  <div class="desc" style="text-overflow: ellipsis;overflow:hidden;white-space: nowrap;">{{question.description}}</div>
                  <div class="user-bar">
                    <el-avatar shape="square" style="vertical-align:middle;" :size="14" :src="question.memberAvatar"></el-avatar>
                    <a href=""><span class="author-info">{{question.memberNickName}}</span></a>
                    <span class="author-info"> | {{question.gmtCreate | formatData()}}</span>
                    <span style="float:right">
                      <a href=""><i class="el-icon-thumb icon"><span class="num">{{question.likeCount}}</span></i></a>
                      <a href=""><i class="el-icon-view icon"><span class="num">{{question.viewCount}}</span></i></a>
                      <a href=""><i class="el-icon-chat-line-round icon"><span class="num">{{question.commentCount}}</span></i></a>
                    </span>
                  </div>
                </div>
              </el-card>
                <el-pagination
                background
                layout="prev, pager, next"
                :page-size='pageSize'
                :total='total'
                @current-change="page">
                </el-pagination>

            </el-col>

            <el-col :span="6" class="hidden-md-and-down">
              <div class="">
                   <div class="news">
                <el-carousel height="150px" indicator-position="none">
                  <el-carousel-item  v-for="url in urls" :key="url">
                   <el-image :src="url"></el-image>
                  </el-carousel-item>
                </el-carousel>
              </div>
                <el-card shadow="hover">
                  最热问题

                  <el-card shadow="hover" body-style="padding:5px" style="margin:5px 0" v-for="question in questions" :key='question.id'>
                    <div class="hot">
                      <router-link :to="'question/' + question.id"><h3>{{ question.title }}</h3></router-link>
                      <div class="user-bar">
                        <el-avatar shape="square" style="vertical-align:middle;" :size="14" :src="question.memberAvatar"></el-avatar>
                        <a href=""><span class="author-info">{{question.memberNickName}}</span></a>
                      </div>
                    </div>
                </el-card>
                </el-card>
              </div>
            </el-col>
          </el-row>
        </el-col>
    </el-row>
</template>
<script>
import 'element-ui/lib/theme-chalk/display.css';

export default {
  data(){
    return {
      total:1,
      pageSize:2,
      questions : [

      ],
        urls: [
        'https://fuss10.elemecdn.com/a/3f/3302e58f9a181d2509f3dc0fa68b0jpeg.jpeg',
        'https://fuss10.elemecdn.com/1/34/19aa98b1fcb2781c4fba33d850549jpeg.jpeg',
        'https://fuss10.elemecdn.com/0/6f/e35ff375812e6b0020b6b4e8f9583jpeg.jpeg',
        'https://fuss10.elemecdn.com/9/bb/e27858e973f5d7d3904835f46abbdjpeg.jpeg',
        'https://fuss10.elemecdn.com/d/e6/c4d93a3805b3ce3f323f7974e6f78jpeg.jpeg',
        'https://fuss10.elemecdn.com/3/28/bbf893f792f03a54408b3b7a7ebf0jpeg.jpeg',
        'https://fuss10.elemecdn.com/2/11/6535bcfb26e4c79b48ddde44f4b6fjpeg.jpeg'
      ]
    }
  },
  methods:{
        page(currenPage){
        const _this = this;
        axios.get("http://localhost:8001/question/list/"+ (currenPage)+"/6").then(function(resp){
          // console.log(resp);
          // console.log(currenPage);
          _this.questions = resp.data.data.records;
          _this.pageSize = resp.data.data.size;
          _this.total = resp.data.data.total;
        })
      },
  },
  created(){
    const _this = this;
    var keyword = this.$route.query.keyword;
    console.log(keyword);
    
    if(keyword == '' || keyword == null){
      _this.$router.push("/search");
    }
    axios.get("http://localhost:8004/search/list?keyword=" + keyword).then(function(resp){
      console.log(resp.data);
      _this.questions = resp.data;
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
    .side{
      background-color: #000;
    }

    .el-header, .el-footer {
    background-color: #B3C0D1;
    color: #333;
    text-align: center;
    line-height: 60px;
  }
  .el-aside {
    background-color: #D3DCE6;
    color: #333;
    text-align: center;
    line-height: 200px;
  }
  .el-main {
    background-color: #E9EEF3;
    color: #333;
    text-align: center;
    line-height: 160px;
  }
  body > .el-container {
    margin-bottom: 40px;
  }
  .el-container:nth-child(5) .el-aside,
  .el-container:nth-child(6) .el-aside {
    line-height: 260px;
  }
  .el-container:nth-child(7) .el-aside {
    line-height: 320px;
  }
  .content h3{
    margin:0;
  }
  .content a{
    text-decoration:none;
    color:black;
  }

 .content a:hover{
    color:#499ef3;
  }
.author-info{
  color: #474747;
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
  .num{
    margin-left: 5px;
    color: #499ef3;
  }
  .title{
    background-color: #ffffff;
    height: 50px;
    line-height: 50px;
    font-size: 25px;
    padding-left: 50px;
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
    font-size: 16px;
  }
</style>