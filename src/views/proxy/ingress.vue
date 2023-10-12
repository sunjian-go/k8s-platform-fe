<template>
  <div>
    <el-row>
      <!-- 头部1 -->
      <el-col :span="24">
        <div>
          <!-- 包一层卡片 -->
          <!-- shadow 属性设置卡片阴影出现的时机 -->
          <el-card
            class="deploy-head-card"
            shadow="never"
            :body-style="{ padding: '10px' }"
          >
            <!--不要单独使用el-col，会有bug，在外层加一层el-row比较保险  -->
            <el-row>
              <!-- 命名空间的下拉框 -->
              <el-col :span="6">
                <div>
                  <span>命名空间：</span>
                  <!-- 下拉框 -->
                  <!-- filterable：带搜索功能 -->
                  <!-- placeholder 默认提示 -->
                  <!-- label 显示内容 -->
                  <!-- value 绑定到v-model的值中 -->
                  <el-select
                    v-model="namespaceValue"
                    filterable
                    placeholder="请选择"
                  >
                    <el-option
                      v-for="(n, i) in namespaceList"
                      :key="i"
                      :label="n.metadata.name"
                      :value="n.metadata.name"
                    >
                    </el-option>
                  </el-select>
                </div>
              </el-col>
              <!-- 刷新按钮 -->
              <!-- :offset 指定该列在水平方向上的偏移量，即在左侧空出多少个网格单位的宽度。 -->
              <el-col :span="2" :offset="16">
                <el-button type="" @click="refulshButton()">
                  <el-icon><RefreshLeft /></el-icon>
                  <span>刷新</span>
                </el-button>
              </el-col>
            </el-row>
          </el-card>
        </div>
      </el-col>
      <!-- 头部2 -->
      <el-col :span="24">
        <div>
          <el-card
            class="deploy-body-card"
            shadow="never"
            :body-style="{ padding: '10px' }"
          >
            <el-row>
              <el-col :span="6">
                <div>
                  <el-button
                    icon="Edit"
                    type="primary"
                    style="border-radius: 4px"
                    v-loading.fullscreen.lock="fullscreenLoading"
                    @click="openbox"
                    >创建</el-button
                  >
                </div>
              </el-col>
            </el-row>
          </el-card>
        </div>
      </el-col>
      <!-- 数据表格 -->
      <el-col :span="24">
        <div>
          <el-card shadow="never" :body-style="{ padding: '10px' }">
            <div>
              <!-- row-key 用来定义行数据的key，结合expand-row-keys使用，往expandKeys中增加key来展开行 ,getRowKeys方法里面自带一个参数代表当前行对象-->
              <!-- expand-row-keys 展开的行的key数组,只有在 expand-row-keys 中的行才会被默认展开 -->
              <!-- expand-change 展开触发时，调用这个方法;该方法自动传入两个参数，分别是当前行对象，和当前展开行的数组 ，属于原生功能-->
              <el-table
                :data="ingList"
                style="width: 100%"
                v-loading="apploading"
                :row-key="getRowKeys"
                :expand-row-keys="expandKeys"
                @expand-change="expandChange"
              >
                <el-table-column width="20" />
                <el-table-column label="Ingress" align="left">
                  <template v-slot="scope">
                    <span
                      style="color: rgb(62, 165, 233)"
                      class="deploy-body-deployname"
                      >{{ scope.row.metadata.name }}</span
                    >
                  </template>
                </el-table-column>
                <el-table-column label="类" align="center">
                  <template v-slot="scope">
                    <el-tag type="success">{{
                      scope.row.spec.ingressClassName
                    }}</el-tag>
                  </template>
                </el-table-column>
                <el-table-column label="hosts" align="center">
                  <template v-slot="scope">
                    <div v-for="(v, i) in scope.row.spec.rules" :key="i">
                      <!-- :content="`${key}: ${val}`" 要想给参数赋值一个变量，必须前面用：绑定该变量才可以用 -->
                      <!-- el-popover: 弹出框 -->
                      <el-popover
                        style="width: 100%"
                        placement="top"
                        :width="300"
                        trigger="hover"
                        :content="`${v.host}`"
                      >
                        <template #reference>
                          <el-tag type="warning">{{ ellipsis(v.host) }}</el-tag>
                        </template>
                      </el-popover>
                    </div>
                  </template>
                </el-table-column>
                <el-table-column label="address" align="center">
                  <template v-slot="scope">
                    <span type="">{{
                      strToObj(
                        scope.row.metadata.annotations[
                          "field.cattle.io/publicEndpoints"
                        ]
                      )[0].addresses[0]
                    }}</span>
                  </template>
                </el-table-column>
                <el-table-column label="端口" align="center">
                  <template v-slot="scope">
                    <el-tag
                      type=""
                      v-if="
                        strToObj(
                          scope.row.metadata.annotations[
                            'field.cattle.io/publicEndpoints'
                          ]
                        )[0].port != 80
                      "
                      >80,
                      {{
                        strToObj(
                          scope.row.metadata.annotations[
                            "field.cattle.io/publicEndpoints"
                          ]
                        )[0].port
                      }}</el-tag
                    >
                    <el-tag type="" v-else>80</el-tag>
                  </template>
                </el-table-column>
                <el-table-column label="创建时间" align="center">
                  <template v-slot="scope">
                    <span>{{
                      timeTrans(scope.row.metadata.creationTimestamp)
                    }}</span>
                  </template>
                </el-table-column>
                <el-table-column label="操作" align="center" width="200">
                  <template v-slot="scope">
                    <!-- <el-row> -->
                    <!-- <el-col :span="4"> -->
                    <el-button
                      disabled="true"
                      type="danger"
                      icon="Delete"
                      @click="
                        handleConfirm(scope.row.metadata.name, '删除', deletePv)
                      "
                      >删除</el-button
                    >
                    <!-- </el-col>
                        </el-row> -->
                  </template>
                </el-table-column>
                <el-table-column>
                  <template #header>
                    <el-row :gutter="150">
                      <el-col :span="6"
                        ><el-input
                          placeholder="请输入"
                          v-model="searchValue"
                          style="width: 145px"
                        ></el-input
                      ></el-col>
                      <el-col :span="2"
                        ><el-button type="" @click="getPvs()"
                          >搜索</el-button
                        ></el-col
                      >
                    </el-row>
                  </template>
                </el-table-column>
              </el-table>
            </div>
          </el-card>
        </div>
      </el-col>
    </el-row>
    <div>
      <!-- 分页 -->
      <!-- current-page：当前页，跟后端page一致 -->
      <!-- page-size：单页大小，跟后端limit一致 -->
      <!-- :small：一个布尔值，用于控制分页组件的大小，如果设为true，则显示为小号组件。 -->
      <!-- :disabled：一个布尔值，用于禁用分页组件，如果设为true，则分页组件为禁用状态，用户无法进行翻页操作。 -->
      <!-- :background：一个布尔值，用于控制分页组件的背景颜色，如果设为true，则分页组件的背景为灰色。   -->
      <!-- layout：分页的布局，带有什么功能 -->
      <!-- :total：指定总共有多少条数据，用于计算总共有多少页。 -->
      <!-- size-change：单页大小改变后触发 -->
      <!-- current-change：页数改变后触发 -->
      <el-pagination
        :current-page="currentPage"
        :page-size="pagesize"
        :page-sizes="pageList"
        :small="small"
        :disabled="disabled"
        :background="background"
        layout="total, sizes, prev, pager, next, jumper"
        :total="ingtotal"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </div>
    <el-dialog title="创建Ing" v-model="scalestatus" width="25%" top="5%">
      <el-row>
        <el-col :span="24" style="display: flex; justify-content: center">
          <span style="display: flex; align-items: center; font-size: 16px"
            >Ing:
          </span>
          <el-input
            v-model="ing"
            style="width: 50%; padding-left: 10px"
          ></el-input>
        </el-col>
      </el-row>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="scalestatus = false">取 消</el-button>
          <el-button type="primary" @click="createIng">确 定</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>
<script>
import common from "../common/Config";
import httpClient from "../../utils/request";
export default {
  data() {
    return {
      apploading: true,
      namespaceValue: "",
      namespaceList: [],
      namespaceListUrl: common.k8sNamespaceList,
      ingValue: "",
      ingList: [],
      ingtotal: 0,
      getIngData: {
        url: common.K8sGetIngresses,
        params: {
          name: "",
          namespace: "",
          limit: 10,
          page: 1,
        },
      },
      currentPage: 1,
      pagesize: 10,
      pageList: [10, 20, 30, 40],
      small: true,
      disabled: false,
      background: true,
      searchValue: "",
      //创建的时候置为true
      fullscreenLoading: false,
      //弹出框状态码
      scalestatus: false,
      ing: "",
      deleteIngData: {
        url: common.K8sDeleteIng,
        params: {
          name: "",
        },
      },
    };
  },
  methods: {
    //获取namespace列表
    getNamespaces() {
      httpClient
        .get(this.namespaceListUrl)
        .then((res) => {
          this.namespaceList = res.data.namespaces; //res.data.namespaces 是根据后端返回时的数据名写
          // console.log("获取数据为：", res.data.namespaces);
        })
        // 异常捕获
        .catch((res) => {
          this.$message.error({
            message: res.msg,
          });
          // console.log("报错为：", res);
        });
    },
    //转换时间戳
    timeTrans(timestamp) {
      let date = new Date(new Date(timestamp).getTime() + 8 * 3600 * 1000);
      date = date.toJSON();
      date = date.substring(0, 19).replace("T", " ");
      return date;
    },
    //labels显示长度限制
    ellipsis(labels) {
      // 判断lables的长度是否大于15，为true则0-20位正常显示，之后的显示...，为false则直接返回值
      return labels.length > 20 ? labels.substring(0, 25) + "..." : labels;
    },
    //获取ing列表
    getIngs() {
      this.getIngData.params.name = this.searchValue;
      this.getIngData.params.namespace = this.namespaceValue;
      this.getIngData.params.limit = this.pagesize;
      this.getIngData.params.page = this.currentPage;

      console.log("开始获取：", this.getIngData.params);
      //   this.apploading = true;
      httpClient
        .get(this.getIngData.url, {
          params: this.getIngData.params,
        })
        .then((res) => {
          this.ingList = res.data.items;
          this.ingtotal = res.data.total;
          console.log("获取到：", this.ingList, this.ingtotal);
          this.apploading = false;
        })
        .catch((res) => {
          console.log("报错为：", res.err);
          //this.apploading = false;
        });
    },
    //分页
    handleSizeChange(size) {
      console.log(`每页 ${size} 条`);
      this.pagesize = size;
      this.getIngs();
    },
    handleCurrentChange(page) {
      this.currentPage = page;
      console.log("当前页: ", this.currentPage);
      this.getIngs();
    },
    //刷新
    refulshButton() {
      this.searchValue = "";
      this.getIngs();
    },
    //将创建弹出框的状态码置为true
    openbox() {
      this.scalestatus = true;
    },
    //创建ing
    createIng() {
      //this.fullscreenLoading = true;
      alert("等待后续开发");
      this.scalestatus = false;
    },
    //删除ing
    deleteIng(ing) {
      console.log("要删除的namespoace是：", ing);
      this.deleteIngData.params.name = ing;
      httpClient
        .delete(this.deleteIngData.url, {
          params: this.deleteIngData.params,
        })
        .then((res) => {
          this.$message({
            type: "success",
            message: ing + "删除成功",
          });
        })
        .catch((res) => {
          this.$message({
            type: "info",
            message: ing + "删除失败",
          });
        });
    },
    //操作类提示框：重启、删除..
    handleConfirm(name, play, playFunc) {
      this.$confirm(
        "确认继续" + play + "Deployment [" + name + "] 操作吗？",
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
          center: true,
        }
      )
        .then(() => {
          playFunc(name);
          this.$message({
            type: "success",
            message: name + "已" + play,
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消" + play,
          });
        });
    },
    //字符串转对象
    strToObj(str) {
      return JSON.parse(str);
    },
  },
  beforeMount() {
    this.getNamespaces();
    this.getIngs();
  },
  // beforeMount钩子函数里面的东西在页面实例挂载之前就调用了，用于页面数据的初始化
  beforeMount() {
    //加载页面时先获取localStorage中的namespace值，若获取不到则默认default，放在下拉框第一位显示
    if (
      localStorage.getItem("namespace") !== "undefined" &&
      localStorage.getItem("namespace") !== null
    ) {
      this.namespaceValue = localStorage.getItem("namespace");
    }
    //然后去获取namespace列表
    this.getNamespaces();
    //获取deployment列表
    this.getIngs();
  },
  //watch是一个选项对象，用于监听数据的变化。
  watch: {
    //监听namespace的值,若发生变化，则执行handler方法中的内容
    namespaceValue: {
      handler() {
        //将namespace的值存入本地，用于刷新页面或者path切换后依旧能获取得之前设置的namespace值
        localStorage.setItem("namespace", this.namespaceValue);
        // 页面刷新或切换的时候，把页数重新置为1并且重新获取deployment列表
        this.currentPage = 1;
        this.getIngs();
      },
    },
  },
};
</script>
<style>
/* 卡片属性 */
.deploy-head-card,
.deploy-body-card {
  border-radius: 1px;
  margin-bottom: 5px;
}
.deploy-body-deployname:hover {
  color: rgb(84, 138, 238);
  cursor: pointer;
  font-weight: bold;
  font-size: 16px;
}
</style>
