<template>
     <el-row class="body">
        <el-col :xs="{span:24}" :sm="{span:24}" :md="{span:18,offset:3}" :lg="{span:18,offset:3}" class="main">
          <el-row  :gutter="20">
            <el-col :span="18">
                <div class="title">问题发起</div>
                <el-divider class="hr"></el-divider>
                <div class="title">输入标题:</div>

                <el-input
                placeholder="请输入标题"
                @input="inputTitle"
                v-model="question.title"
                clearable>
                </el-input>

                <div class="title">问题简述:</div>
                <el-input
                type="textarea"
                @input="inputDescription"
                autosize
                placeholder="请输入内容"
                v-model="question.description">
                </el-input>

                <div class="title">问题补充:</div>

                <mavon-editor
                v-model="content"
                ref="md"
                @change="change"
                @imgAdd="$imgAdd"
                style="min-height: 600px"/>

                <div class='tag-bar'>
                    <el-tag
                    :key="tag"
                    v-for="tag in tags"
                    closable
                    :disable-transitions="false"
                    @close="handleClose(tag)">
                    {{tag}}
                </el-tag>
                    <div >
                        <h5>添加标签</h5>
                        <el-tag
                        class="tag-list"
                        :key="tag"
                        size="mini"
                        v-for="tag in tagList"
                        :disable-transitions="false"
                        @click="addTag(tag)">
                        {{tag}}
                        </el-tag>
                    </div>
                </div>
                <div>
                <el-button type="primary" style="float:right;" @click="submit()" round>发布问题</el-button></div>
            </el-col>
            <el-col :span="6" class="">
              <el-card class="box-card">
                <div slot="header" class="clearfix">
                    <span>问题发起指南</span>
                </div>
                <div>
                    <ul>
                        <li>问题标题: 请用精简的语言描述您发布的问题，不超过25字</li>
                        <li>问题补充: 详细补充您的问题内容，并确保问题描述清晰直观, 并提供一些相关的资料：</li>
                    </ul>
                </div>
            </el-card>
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
    components: {
        mavonEditor,
    },
    data() {
        return {
            question:{
                title:'',
                content:'',
                tags:'',
                description:'',
            },
            tags: [
            ],
            tagList: [
                'vue.js',
                'Spring',
                'Spring Cloud',
                'Spring Boot',
                'Elasticsearch'
            ],
            content:'', // 输入的markdown
        }
    },
    methods: {
        // 所有操作都会被解析重新渲染
        change(value, render){
            // render 为 markdown 解析后的结果[html]
            this.question.content = render;
            localStorage.setItem(localStorage.getItem("id")+":content",this.content);
        },
        // 将图片上传到服务器，返回地址替换到md中
        // 绑定@imgAdd event
        $imgAdd(pos, $file){
            // 第一步.将图片上传到服务器.
           var formdata = new FormData();
           let $vm = this.$refs.md;
           formdata.append('file', $file);
           console.log(1);
           axios({
               url: 'http://localhost:9001/file/uploadFile',
               method: 'post',
               data: formdata,
               headers: { 'Content-Type': 'multipart/form-data' },
           }).then((resp) => {
               // 第二步.将返回的url替换到文本原位置![...](0) -> ![...](url)
               // $vm.$img2Url 详情见本页末尾
               console.log(resp.data.data);
               $vm.$img2Url(pos, resp.data.data);
           })
        },
        inputTitle(value){
            localStorage.setItem(localStorage.getItem("id")+":title",value);
        },
        inputDescription(value){
            localStorage.setItem(localStorage.getItem("id")+":description",value);
        },
        // 提交
        submit(){
            const _this = this;
            axios.post("http://localhost:8001/question/create",this.question,{headers: {'Authorization': 'Bearer ' + localStorage.getItem("token")}}).then(function(resp){
                if(resp.status==200&&resp.data.code==200){
                    _this.$notify({
                        title:"问题发布成功",
                        type: 'success',
                        offset: 100,
                        duration : 1000,
                    });
                    //清除缓存
                    localStorage.removeItem(localStorage.getItem("id")+":title");
                    localStorage.removeItem(localStorage.getItem("id")+":content");
                    localStorage.removeItem(localStorage.getItem("id")+":description");
                    localStorage.removeItem(localStorage.getItem("id")+":tags");
                    localStorage.removeItem(localStorage.getItem("id")+":questionTags");

                    _this.$router.push("/index");
                }else if(resp.status==200&&resp.data.code==700){
                    _this.$confirm('登录信息过期是否登录?', '提示', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'warning'
                        }).then(() => {
                            _this.$router.push("/login")
                        }).catch(() => {
                        _this.$message({
                            type: 'info',
                            message: '取消登录'
                        });
                    });
                }else{
                    console.log(resp);
                    _this.$notify({
                        title:"服务器繁忙！稍后再试。",
                        type: 'warning',
                        offset: 100,
                        duration : 1000,
                    });
                }
            });
        },
        handleClose(tag) {
            this.tags.splice(this.tags.indexOf(tag), 1);
        },
        addTag(tag){
            var isRepetition = false;
            this.tags.forEach(item =>{
                if(item == tag){
                   isRepetition = true;
                }
            });
            if(!isRepetition){
                this.tags.push(tag);
                if(this.question.tags == '' || this.question.tags == null){
                    this.question.tags =  tag;
                }else{
                    this.question.tags = this.question.tags + "," + tag;
                    localStorage.setItem(localStorage.getItem("id")+":questionTags",this.question.tags);
                }
                localStorage.setItem(localStorage.getItem("id")+":tags",JSON.stringify(this.tags));
            }
        }
    },
    created() {
        let questionId = this.$route.query.questionId;
        const _this = this;
        if(questionId != undefined){
            axios.get("http://localhost:8001/question/get/"+questionId).then(function(resp){
                if(resp.data.data.memberId  != localStorage.getItem("id")){
                    _this.$router.push({
                        path: '/question/'+questionId,
                    })
                    return ;
                }
                _this.question.title = resp.data.data.title;
                _this.content = resp.data.data.content;
                _this.question.description = resp.data.data.description;
                _this.tags = resp.data.data.tags;
            });
        }else{
            axios.post("http://localhost:9000/passport/profile",{},{headers: {'Authorization': 'Bearer ' + localStorage.getItem("token")}}).then(function(resp){
                if(resp.data.code==700){
                    _this.$router.push("/login")
                }
            });
            if(localStorage.getItem(localStorage.getItem("id")+":content") != null){
                this.content= localStorage.getItem(localStorage.getItem("id")+":content");
                this.question.title= localStorage.getItem(localStorage.getItem("id")+":title");
                this.question.description= localStorage.getItem(localStorage.getItem("id")+":description");
                this.question.tags= localStorage.getItem(localStorage.getItem("id")+":questionTags");
                this.tags= JSON.parse(localStorage.getItem(localStorage.getItem("id")+":tags"));
            }
        }
    }
}
</script>
<style scoped>
.main{
    margin-top: 25px;
    margin-bottom: 25px;
    background-color: #ffffff;
    padding: 10px;
}
.body{
    background-color: #f5f6f7;
}
.title{
    height: 35px;
    line-height: 35px;
    margin-bottom: 5px;
}
.hr{
    margin-top: 0;
}
  .el-tag + .el-tag {
    margin-left: 10px;
    margin-bottom: 10px;
  }
  .tag-bar{
      padding: 25px;
  }
  .tag-list{
       cursor: pointer;
  }
</style>