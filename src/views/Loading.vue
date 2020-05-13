<template>
    <div>
        <span>登录中。。一面内没跳转点击
            <router-link to="/login">跳转主页</router-link>
        </span>
    </div>
</template>
<script>
export default {
    data(){
        return{
            token:'',
        };
        },created(){
            const _this = this;
            var token = this.$route.query.token;
            localStorage.setItem("token",token);
            axios.post("http://localhost:9000/passport/profile",{},{headers: {'Authorization': 'Bearer ' + token}}).then(function(resp){
                console.log(resp);
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
        　　    window.location.href = 'http://localhost:8080/#/index';
            // _this.$route.push("/index")
        　　},1000);
        }
}
</script>
<style scoped>

</style>