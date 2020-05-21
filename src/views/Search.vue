<template>
    <div>
      <div class="search_bar">
        <img class="img"
          src="..\img\search.png"
          @click="index"
          title="首页"
        />
        <el-autocomplete
          class="input"
          v-model="keyword"
          :fetch-suggestions="querySearch"
          placeholder="请输入内容"
          :trigger-on-focus="false"
          @select="handleSelect"
          @input="input"
        >
          <el-button slot="append" icon="el-icon-search" @click="search"></el-button>
        </el-autocomplete>
      </div>
      <div class="_bg"></div>
    </div>
</template>
<script>
export default {
    data() {
      return {
        restaurants: [],
        list:[],
        keyword: '',
      };
    },
    methods: {
       createList() {
          const _this = this;
          let myArray=[];
          axios.get("api?&wd=" + _this.keyword +'&cb=sug').then(function(resp){
            var str = resp.data.substr(4,(resp.data.length-6));
            var jsonObj = eval('(' + str+ ')');
            for (let i = 0; i <  jsonObj.s.length; i++) {
              const element = jsonObj.s[i];
              var obj = {"value":element};
              myArray.push(obj);
            }
          });
          setTimeout(() => {
            this.list = JSON.parse(JSON.stringify(myArray));
          }, 500);
      },
      querySearch(queryString, cb) {
        const _this = this;
        this.createList();
        setTimeout(() => {
            cb(_this.list);
          }, 500);
        // 调用 callback 返回建议列表的数据
      },
      handleSelect(item) {
        console.log(item);
      },
      search(){
        this.$router.push({name: 'index', query: {keyword: this.keyword}});
      },
      input(){
        this.restaurants = this.list;
      },
      index(){
        this.$router.push('index');
      }
    },
};
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
      background-image: url(../img/slot.jpg);
  }
.img{
  cursor: pointer;
  display: block;
  margin: 10px auto;
}
.search_bar{
  position: absolute; left: 50%; top: 40%;
  transform: translate(-50%, -50%);
}
.input{
  width:460px;
}
</style>