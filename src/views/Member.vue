<template>
     <el-row class="body">
        <el-col :xs="{span:24}" :sm="{span:24}" :md="{span:24}" :lg="{span:18,offset:3}" class="main">
            <div class="banner">
            {{member.nickName}}的代码人生
            </div>
          <el-row :gutter="20" class="content">
            <el-col :xs="{span:24}" :sm="{span:24}" :md="{span:24}" :lg="{span:18}">
                <div class="block">
                    <el-timeline style="margin-top: 20px">
                        <el-timeline-item v-for="question in questions" :key="question.id" :timestamp="question.gmtCreate | dataFormat('yyyy-MM-dd')" placement="top">
                            <el-card body-style="padding: 0 20px">
                                <h4>{{question.title}}</h4>
                                <p>{{question.memberNickName}} 提交于 {{question.gmtCreate | dataFormat('yyyy-MM-dd hh:mm:ss')}}</p>
                                <!-- v-if="member.id == LoginId" -->
                                <div style="float:right;">
                                    <el-button type="text" @click="edit(question.id)">编辑</el-button>
                                    <el-button type="text" @click="deleteQuestion(question.id)">删除</el-button>
                                </div>
                            </el-card>
                        </el-timeline-item>
                    </el-timeline>
                </div>
            </el-col>

            <el-col :span="6" class="hidden-md-and-down">
                <el-card class="box-card">
                    <el-avatar shape="square" style="display: block; margin: 0 auto;" :src="member.avatar"></el-avatar>
                    <div v-for="o in 4" :key="o" class="text item">
                        {{'列表内容 ' + o }}
                    </div>
                </el-card>
            </el-col>
          </el-row>
        </el-col>
        <div class="_bg"></div>
    </el-row>
</template>
<script>
export default {
    data(){
        return{
            LoginId:'',
            member:'',
            questions:[],
        }
    },
    methods:{
        edit(questionId){
            this.$router.push({ name: 'publish', query: { questionId: questionId}})
        },
        deleteQuestion(questionId){
            axios.get('http://localhost:8001/question/deleteById/'+ questionId).then(function(resp){
                
            });
        },
    },
    created(){
        let id = this.$route.params.id;
        const _this = this;
        axios.get('http://localhost:8001/question/listByMember/'+id+'/0/1').then(function(resp){
            _this.questions = resp.data.data.records;
        });
         axios.get('http://localhost:8003/member/profile/'+id).then(function(resp){
            _this.member = resp.data.data;
        });
        this.LoginId = localStorage.getItem('id');
    }
}
</script>
<style scoped>
._bg{
    z-index: -1;
    bottom: 0;
    background-repeat: no-repeat;
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    background-position: 50% 100%;
    background-size: cover;
    background-image: url(../img/slot1.jpg);
}
.main{
    background-color: #fff;
    min-height: 650px;
}
.timeline{
    padding: 0 !important;
}
.banner{
    height: 80px;
    background-color: #000;
    color: #fff;
    margin-top: -1px;
    line-height: 80px;
    font-size: 28px;
}
</style>