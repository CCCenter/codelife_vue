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
                v-model="question.valueContent"
                ref="md"
                @change="change"
                @imgAdd="$imgAdd"
                style="min-height: 600px"/>

                <!-- 已选标签 -->
                <div class='tag-bar' >
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
                        <el-tabs v-model="activeName" type="border-card" @tab-click="handleClick">
                            <el-tab-pane v-for="tagType in tagTypes" :label="tagType.tagType" :name="tagType.id +''" :key="tagType.id" @click="getTagList(tagType.id)">
                                 <el-tag
                                    class="tag-list"
                                    :key="tag.id"
                                    size="mini"
                                    v-for="tag in tagList"
                                    :disable-transitions="false"
                                    @click="addTag(tag)">
                                    {{tag.tagName}}
                                </el-tag>
                            </el-tab-pane>
                        </el-tabs>
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
            activeName: '1',
            question:{
                id:'',
                title:'',
                memberId:'',
                htmlContent:'',
                valueContent:'',
                tags:[],
                description:'',
            },
            tags:[],
            tagTypes:[],
            tagList: [],
        }
    },
    methods: {
        handleClick(tab, event) {
            const _this = this;
            axios.get('http://localhost:8005/tag/list/' + tab.name).then(function(resp){
                _this.tagList = resp.data.data;
            });
      },
        // 所有操作都会被解析重新渲染
        change(value, render){
            // render 为 markdown 解析后的结果[html]
            this.question.htmlContent = render;
            localStorage.setItem(localStorage.getItem("id")+":content",this.question.valueContent);

        },
        // 将图片上传到服务器，返回地址替换到md中
        // 绑定@imgAdd event
        $imgAdd(pos, $file){
            // 第一步.将图片上传到服务器.
           var formdata = new FormData();
           let $vm = this.$refs.md;
           formdata.append('file', $file);
           axios({
               url: 'http://localhost:9001/file/uploadFile',
               method: 'post',
               data: formdata,
               headers: { 'Content-Type': 'multipart/form-data' },
           }).then((resp) => {
               // 第二步.将返回的url替换到文本原位置![...](0) -> ![...](url)
               // $vm.$img2Url 详情见本页末尾
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
            axios.post("http://localhost:8001/question/createOrUpdate",this.question,{headers: {'Authorization': 'Bearer ' + localStorage.getItem("token")}}).then(function(resp){
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
            this.tags.splice(this.tags.indexOf(tag),1)
            this.question.tags = this.tags.join(",");
            localStorage.setItem(localStorage.getItem("id")+":tags",this.question.tags);
        },
        addTag(tag){
            var isRepetition = false;
            this.tags.forEach(item =>{
                if(item == tag.tagName){
                    isRepetition = true;
                }
            });
                if(!isRepetition){
                this.tags.push(tag.tagName);
            }
            this.question.tags = this.tags.join(",");
            localStorage.setItem(localStorage.getItem("id")+":tags",this.question.tags);
        }
    },
    created() {
        let questionId = this.$route.query.id;
        this.question.id = questionId;
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
                _this.question.valueContent = resp.data.data.valueContent;
                _this.question.description = resp.data.data.description;
                _this.question.tags = resp.data.data.tags;
                _this.question.memberId = resp.data.data.memberId;
                _this.tags = _this.question.tags.split(",");
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
                if(localStorage.getItem(localStorage.getItem("id")+":tags")){
                    this.tags=localStorage.getItem(localStorage.getItem("id")+":tags").split(",");
                    this.question.tags=localStorage.getItem(localStorage.getItem("id")+":tags").split(",");
                }
            }
        }

        axios.get('http://localhost:8005/tagType/list').then(function(resp){
            _this.tagTypes = resp.data.data;
        });

        axios.get('http://localhost:8005/tag/list/1').then(function(resp){
            _this.tagList = resp.data.data;
        });
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