<template>
        <div class="main">
            <el-card class="box-card">
                <div slot="header" class="clearfix">
                    <span>登陆</span>
                    <!-- <el-button style="float: right; padding: 3px 0" type="text">操作按钮</el-button> -->
                </div>
                    <el-container>
                    <el-main>
                        <img src="..\img\logo.png" alt="" style=" padding: 0 0 15px 0">
                        <div class="login-left">
                            <el-form :model="userFrom" status-icon :rules="rules" ref="userFrom" label-width="100px" class="demo-ruleForm">
                                    <el-input type="text" placeholder="邮箱/用户名" v-model="userFrom.username" autocomplete="off"></el-input>
                                    <el-input style="margin: 25px 0;" type="password" placeholder="密码" v-model="userFrom.password" autocomplete="off"></el-input>
                                    <el-checkbox style="margin-right: 10px;" v-model="checked">记住我</el-checkbox>
                                    <el-link style="" href="https://element.eleme.io" target="_blank">忘记密码</el-link>
                                    <el-button style="float:right" type="primary" @click="submitForm(userFrom)">登录</el-button>
                            </el-form>
                        </div>
                    </el-main>
                    <el-aside class="login-right">
                        <h3 >其他登录方式</h3>
                        <div>
                            <a @click="login_wb()" class="login-other" style="cursor: pointer;" ondragstart="return false">微博登录</a>
                            <a @click="login_github()" class="login-other" style="cursor: pointer;" ondragstart="return false">Github登录</a>
                        </div>
                    </el-aside>
                </el-container>
                <el-container class="login-footer">
                    <span>还没有账号?
                        <router-link to='/register' class="login">
							立即注册
						</router-link>
                    </span>
                </el-container>
            </el-card>
            <div class="_bg"></div>

            <el-dialog
                title="提示"
                :visible.sync="centerDialogVisible"
                width="30%"
                center>
                <span>{{ message }}</span>
                <span slot="footer" class="dialog-footer">
                    <el-button type="primary" @click="centerDialogVisible = false">确 定</el-button>
                </span>
            </el-dialog>
        </div>
</template>
<script>
export default {
    data() {
      return {
        message:"",
        centerDialogVisible: false,
        checked: true,
        userFrom: {
          username: '',
          password: '',
        },
        rules: {

        }
      };
    },
    methods: {
        login_wb(){
            window.location.href="https://api.weibo.com/oauth2/authorize?client_id=1386857352&redirect_uri=http://passport.codelife.com:9000/passport/vlogin";
        },
        login_github(){
            window.location.href="https://github.com/login/oauth/authorize?client_id=46a91cd8e9d8a254d9f5&redirect_uri=http://passport.codelife.com:9000/passport/callback&scope=user&state=1";
        },
        submitForm(userFrom) {
            let url = this.$route.query.url;
            console.log(url);
            const _this = this;
            if(_this.checked == true){
                localStorage.setItem("username", _this.userFrom.username);
                localStorage.setItem("password", _this.userFrom.password);
            }
            _this.message='';
            if(userFrom.username == '' || userFrom.password == ''){
                _this.message = "用户名或密码不能为空";
                _this.centerDialogVisible = true;
                return;
            }
            axios.post("http://localhost:9000/passport/login",userFrom).then(function(resp){
                if(resp.data.data == null){
                    _this.message = "用户名或密码错误，注意大小写。";
                    _this.centerDialogVisible = true;
                    return;
                }else{
                    localStorage.setItem("token",resp.data.data.token);
                    axios.post("http://localhost:9000/passport/profile",{},{headers: {'Authorization': 'Bearer ' + resp.data.data.token}}).then(function(resp){
                        if(resp.data.code == 200){
                            localStorage.setItem("avatar",resp.data.data.avatar);
                            localStorage.setItem("id",resp.data.data.id);
                            localStorage.setItem("nickName",resp.data.data.nickName);
                        }
                    });
                    _this.$notify({
                        title:"登陆成功",
                        type: 'success',
                        offset: 100,
                        duration : 1000,
                    });
                　　setTimeout(function(){
                        if(url){
                            _this.$router.push("/" + url);
                            return;
                        }else{
                            _this.$router.push("/index");
                        }
                　　},1000);
                }
            });
        },
    },
    created(){
        let url = this.$route.query.url;
        let errorCode = this.$route.query.errorCode;
        if(errorCode == 500){
            _this.$notify({
                title:"登陆超时",
                type: 'error',
                offset: 100,
                duration : 1000,
            });
        }
        console.log(url);
        this.userFrom.username = localStorage.getItem("username");
        this.userFrom.password = localStorage.getItem("password");
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
    .body{
      background-color: #f5f6f7;
    }
    .box-card{
        width: 700px;
        margin: 0 auto;
    }
    .main{
        padding: 10% 0 ;
    }
    .login-left{
        width: 300px;
        display: inline-block;
    }
    .login-right{
       border-left: 1px solid #c2c2c2;
       text-align: center;
    }
    .login-button{
       display: inline-block;
       margin: 0 15px 15px;
    }
    .login-other{
        display: block;
        width: 100px;
        height: 25px;
        background-color: #66b1ff;
        margin-left: 100px;
        margin-bottom: 15px;
        text-decoration:none;
        color: #000;
        padding: 5px;
    }
    .login-footer{
        background-color: #f5f5f5;
        height: 70px;
        padding: 25px;
        font-size: 12px;
    }
    .login-footer a{
        text-decoration: none;
        color: #66b1ff;
    }
</style>