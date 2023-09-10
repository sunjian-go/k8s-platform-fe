<template>
  <div class="main-body-div">
    <el-row>
      <!--img-->
      <el-col :span="24">
        <div>
          <img class="main-body-img" src="../../assets/img/403.png" alt="" />
        </div>
      </el-col>
      <!--描述-->
      <el-col :span="24">
        <div>
          <p class="status-code">403</p>
          <p class="status-describe">你暂时无权限访问该页面······</p>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<style scoped>
/* 图片属性 */

.main-body-img {
  margin-top: 100px;
}

/* 整体位置 */
.main-body-div {
  text-align: center;
  height: 100vh;
  width: 100vw;
}

/* 状态码 */
.status-code {
  margin-top: 20px;
  margin-bottom: 10px;
  font-size: 95px;
  font-weight: bold;
  color: rgb(54, 95, 230);
}

/* 描述 */
.status-describe {
  color: rgb(145, 143, 143);
}
</style>
