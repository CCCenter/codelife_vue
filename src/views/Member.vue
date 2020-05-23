<template>
  <el-row class="body">
    <el-col :xs="{span:24}" :sm="{span:24}" :md="{span:24}" :lg="{span:18,offset:3}" class="main">
      <div class="banner">{{member.nickName}}的代码人生</div>
      <el-row :gutter="20" class="content">
        <el-col :xs="{span:24}" :sm="{span:24}" :md="{span:24}" :lg="{span:18}">
          <div class="block">
            <el-timeline style="margin-top: 20px">
              <div v-if="!questions">暂无内容</div>
              <el-timeline-item
                v-for="question in questions"
                :key="question.id"
                :timestamp="question.gmtCreate | dataFormat('yyyy-MM-dd')"
                placement="top"
              >
                <el-card body-style="padding: 0 20px">
                  <h4>{{question.title}}</h4>
                  <span>{{question.memberNickName}} 提交于 {{question.gmtCreate | dataFormat('yyyy-MM-dd hh:mm:ss')}}</span>
                  <!-- v-if="member.id == LoginId" -->
                  <div style="float:right;">
                    <el-button type="text" @click="edit(question.id)">编辑</el-button>
                    <el-button type="text" @click="deleteQuestion(question.id)">删除</el-button>
                  </div>
                </el-card>
              </el-timeline-item>
              <el-pagination
                hide-on-single-page
                background
                style="margin-bottom:15px"
                layout="prev, pager, next"
                :page-size="pageSize"
                :total="total"
                @current-change="page"
              ></el-pagination>
            </el-timeline>
          </div>
        </el-col>
        <el-col :span="6" class="hidden-md-and-down">
          <el-card class="box-card">
            <div slot="header" class="clearfix">
              <el-avatar
                shape="square"
                style="display: block; margin: 0 auto;"
                :src="member.avatar"
              ></el-avatar>
            </div>
            <div>
              <div>昵称 : {{member.nickName}}</div>
              <div>提问数 : {{total}}</div>
              <div>码龄 : {{member.createTime | memberDate()}}</div>
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
  inject: ["reload"],
  data() {
    return {
      pageSize: 0,
      total: 0,
      LoginId: "",
      member: {
        nickName: "",
        avatar: ""
      },
      questions: []
    };
  },
  methods: {
    edit(questionId) {
      this.$router.push({ name: "publish", query: { id: questionId } });
    },
    deleteQuestion(questionId) {
      let id = this.$route.params.id;
      const _this = this;
            this.$confirm('此操作将解禁用该用户, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
              axios
        .delete("http://localhost:8001/question/deleteById/" + questionId, {
          headers: { Authorization: "Bearer " + localStorage.getItem("token") }
        })
        .then(function(resp) {
          if (resp.data.code == 700) {
            _this
              .$confirm("登录信息过期是否登录?", "提示", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning"
              })
              .then(() => {
                _this.$router.push({
                  name: "login",
                  query: { url: "member/" + id }
                });
              })
              .catch(() => {
                _this.$message({
                  type: "info",
                  message: "取消登录"
                });
              });
          }
        });
        this.reload();
            }).catch(() => {
                _this.$message({
                    type: 'info',
                    message: '已取消解禁'
                });
            });
    },
    page(value) {
      let id = this.$route.params.id;
      const _this = this;
      axios
        .get(
          "http://localhost:8001/question/listByMember/" +
            id +
            "/" +
            value +
            "/6"
        )
        .then(function(resp) {
          _this.questions = resp.data.data.records;
        });
    }
  },
  created() {
    let id = this.$route.params.id;
    const _this = this;
    axios
      .get("http://localhost:8001/question/listByMember/" + id + "/1/6")
      .then(function(resp) {
        _this.total = resp.data.data.total;
        _this.pageSize = resp.data.data.size;
        _this.questions = resp.data.data.records;
      });
    axios
      .get("http://localhost:8003/member/profile/" + id)
      .then(function(resp) {
        if (resp.data.data) {
          _this.member = resp.data.data;
        } else {
          _this.$router.push({ name: "NotFound" });
        }
      });
    this.LoginId = localStorage.getItem("id");
  }
};
</script>
<style scoped>
._bg {
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
.main {
  background-color: #fff;
  min-height: 650px;
}
.timeline {
  padding: 0 !important;
}
.banner {
  height: 80px;
  background-color: #000;
  color: #fff;
  margin-top: -1px;
  line-height: 80px;
  font-size: 28px;
}
</style>