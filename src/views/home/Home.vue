<template>
  <div class="demo-collapse">
    <el-collapse accordion v-model="actionNames">
      <el-collapse-item name="1" title="集群资源">
        <el-row :gutter="10">
          <el-col :span="5">
            <el-card class="home-node-card" :body-style="{ padding: '10px' }">
              <div class="el-progress-div">
                <!-- el-progress: 进度视图组件 -->
                <!-- stroke-width：宽度 -->
                <!-- show-text： 描述信息-->
                <!-- type="circle": 类型是圆的 -->
                <!-- percentage: 信息 -->
                <el-progress
                  :stroke-width="20"
                  :show-text="false"
                  type="circle"
                  :percentage="(activeNamespaceNum / namespaceTotal) * 100"
                ></el-progress>
              </div>
              <div>
                <p>命名空间: Active/总量</p>
                <p class="home-node-card-num">
                  {{ activeNamespaceNum }}/{{ namespaceTotal }}
                </p>
              </div>
            </el-card>
          </el-col>
          <el-col :span="5">
            <el-card class="home-node-card" :body-style="{ padding: '10px' }">
              <div>
                <p>实例数 (Pod)</p>
                <p class="home-node-card-num">
                  {{ podTotalNum }}
                </p>
              </div>
            </el-card>
          </el-col>
          <el-col :span="5">
            <el-card class="home-node-card" :body-style="{ padding: '10px' }">
              <div>
                <p>服务数 (Service)</p>
                <p class="home-node-card-num">
                  {{ svcTotal }}
                </p>
              </div>
            </el-card>
          </el-col>
        </el-row>
      </el-collapse-item>
      <el-collapse-item name="2" title="节点资源">
        <el-row :gutter="10" style="margin-bottom: 10px">
          <el-col :span="5">
            <el-card class="home-node-card" :body-style="{ padding: '10px' }">
              <div class="el-progress-div">
                <!-- el-progress: 进度视图组件 -->
                <!-- stroke-width：宽度 -->
                <!-- show-text： 描述信息-->
                <!-- type="circle": 类型是圆的 -->
                <!-- percentage: 信息 -->

                <el-progress
                  :stroke-width="20"
                  :show-text="false"
                  type="circle"
                  :percentage="(readyNodeTotal / nodeTotal) * 100"
                ></el-progress>
              </div>
              <div>
                <p>节点: Ready/总数量</p>
                <p class="home-node-card-num">
                  {{ readyNodeTotal }}/{{ nodeTotal }}
                </p>
              </div>
            </el-card>
          </el-col>
          <el-col :span="5">
            <el-card class="home-node-card" :body-style="{ padding: '10px' }">
              <div class="el-progress-div">
                <!-- el-progress: 进度视图组件 -->
                <!-- stroke-width：宽度 -->
                <!-- show-text： 描述信息-->
                <!-- type="circle": 类型是圆的 -->
                <!-- percentage: 用于关联进度组件的百分比显示样式 -->
                <el-progress
                  :stroke-width="20"
                  :show-text="false"
                  type="circle"
                  :percentage="(allocatableCpuNum / cpuTotal) * 100"
                ></el-progress>
              </div>
              <div>
                <p>CPU: 可分配/容量</p>
                <p class="home-node-card-num">
                  {{ allocatableCpuNum }}/{{ cpuTotal }}
                </p>
              </div>
            </el-card>
          </el-col>
          <el-col :span="5">
            <el-card class="home-node-card" :body-style="{ padding: '10px' }">
              <div class="el-progress-div">
                <!-- el-progress: 进度视图组件 -->
                <!-- stroke-width：宽度 -->
                <!-- show-text： 描述信息-->
                <!-- type="circle": 类型是圆的 -->
                <!-- percentage: 信息 -->

                <el-progress
                  :stroke-width="20"
                  :show-text="false"
                  type="circle"
                  :percentage="(allocatableMemNum / memTotal) * 100"
                ></el-progress>
              </div>
              <div>
                <p>内存: 可分配/容量</p>
                <p class="home-node-card-num">
                  {{ allocatableMemNum }}G/{{ memTotal }}G
                </p>
              </div>
            </el-card>
          </el-col>
          <el-col :span="5">
            <el-card class="home-node-card" :body-style="{ padding: '10px' }">
              <div class="el-progress-div">
                <!-- el-progress: 进度视图组件 -->
                <!-- stroke-width：宽度 -->
                <!-- show-text： 描述信息-->
                <!-- type="circle": 类型是圆的 -->
                <!-- percentage: 信息 -->

                <el-progress
                  :stroke-width="20"
                  :show-text="false"
                  type="circle"
                  :percentage="(allocatablePodNum / podTotal) * 100"
                ></el-progress>
              </div>
              <div>
                <p>POD: 可分配/容量</p>
                <p class="home-node-card-num">
                  {{ allocatablePodNum }}/{{ podTotal }}
                </p>
              </div>
            </el-card>
          </el-col>
        </el-row>
      </el-collapse-item>
      <el-collapse-item name="3" title="资源统计">
        <el-row :gutter="10">
          <el-col :span="24" style="margin-bottom: 10px">
            <el-card class="home-dash-card" :body-style="{ padding: '10px' }">
              <!-- 这个div就是画图的内容，echarts初始化后会绑定到这个id上展示出来 -->
              <div
                v-loading="dashLoading"
                id="resourceNumDash"
                style="height: 300px"
              ></div>
            </el-card>
          </el-col>
        </el-row>
      </el-collapse-item>
    </el-collapse>
  </div>
</template>

<script>
//引入echarts
import * as echarts from "echarts";
import common from "../common/Config";
import httpClient from "../../utils/request";
export default {
  data() {
    return {
      dashLoading: false,
      actionNames: ["1", "2", "3"],
      nodeTotal: 0,
      readyNodeTotal: 0,
      allocatableCpuNum: 0,
      cpuTotal: 0,
      allocatableMemNum: 0,
      memTotal: 0,
      allocatablePodNum: 0,
      podTotal: 0,
      activeNamespaceNum: 0,
      namespaceTotal: 0,
      podTotalNum: 0,
      svcTotal: 0,
      getNodesData: {
        url: common.K8sGetNodeList,
      },
      getNamespaceData: {
        url: common.k8sNamespaceList,
      },
      getPodData: {
        url: common.K8sGetPodList,
      },
      getSvcData: {
        url: common.K8sGetSvcs,
      },
      //每个namespace中pod的数量[{namespace:"default",pod_num:5}]
      podNumDash: null,
      podNumNp: [],
      podNumNpData: {
        url: common.K8sGetPodNum,
      },
      resourcesNumDash: null,
      deploymentNumNp: [],
      deploymentNumNpData: {
        url: common.K8sGetNamespaceDeploymentNum,
      },
      getAllResourceData: {
        url: common.K8sGetAllResources,
      },
      resourcesNp: [],
    };
  },
  methods: {
    //获取namespace中所有资源
    getAllResourceNum() {
      this.dashLoading = true;
      httpClient
        .get(this.getAllResourceData.url)
        .then((res) => {
          this.resourcesNp = res.data;
          this.getResourcesNumDash();
        })
        .catch((res) => {
          this.$message.error({
            message: "获取资源失败：" + res.err,
          });
        })
        .finally(() => {
          this.dashLoading = false;
        });
    },
    getResourcesNumDash() {
      //若实例已经初始化了，则销毁实例
      // if (
      //   this.resourcesNumDash != null &&
      //   this.resourcesNumDash != "" &&
      //   this.resourcesNumDash != undefined
      // ) {
      //   this.resourcesNumDash.dispose();
      // }
      //初始化实例，绑定到dom上,只能用普通变量来接echarts的初始化，用正常的响应式变量会在点击legend名字的时候报错
      let resourcesNumDash = echarts.init(
        document.getElementById("resourceNumDash")
      );
      //echarts作图配置
      resourcesNumDash.setOption({
        //标题及字体颜色
        title: {
          text: "Resources per Namespace",
          //textStyle: 字体颜色
          textStyle: { color: "rgb(134,135,136)" },
        },
        //图表颜色
        color: [
          "#67E0E3",
          "#9FE6B8",
          "#FFDB5C",
          "#ff9f7f",
          "#F72727",
          "#E062AE",
          "#E690D1",
          "#e7bcf3",
          "#9d96f5",
          "#8378EA",
          "#96BFFF",
        ],
        //提示框
        tooltip: {
          //触发类型坐标轴触发，axis：代表坐标轴
          trigger: "axis",
          //'cross' 十字准星指示器
          axisPointer: {
            type: "cross",
            label: {
              backgroundColor: "#76baf1",
            },
          },
        },
        //图表中的最上面的数据类型解释
        legend: {
          data: [
            "Pods",
            "Deployments",
            "DaemonSets",
            "StatefulSets",
            "Services",
          ],
        },
        //图表数据集
        dataset: {
          //维度定义，默认第一个元素表示x轴的数据，其他都是y轴数据
          dimensions: [
            "namespace",
            "podNum",
            "deployNum",
            "daemonsetNum",
            "statefulsetNum",
            "svcNum",
          ],
          //源数据
          source: this.resourcesNp,
        },
        //x轴属性
        xAxis: {
          //category类目轴，value数值轴，time时间轴，log对数轴
          type: "category",
          //轴标签
          axisLabel: {
            //坐标轴刻度标签的显示间隔，在类目轴中有效.0显示所有
            interval: 0,
            //格式化轴标签
            formatter: function (value) {
              return value.length > 5 ? value.substring(0, 5) + "..." : value;
            },
          },
        },
        //y轴属性
        yAxis: [
          //数值轴
          { type: "value" },
        ],
        //定义系列，用于指定一组数值以及他们映射成的图
        series: [
          {
            //name是legend对应的值
            name: "Pods",
            //bar柱状图，line折线图，pie饼图等等
            type: "bar",
            //每个类目的值标签，配置
            label: {
              //是否显示值
              show: true,
              //显示的位置
              position: "top",
            },
          },
          {
            //name是legend对应的值
            name: "Deployments",
            //bar柱状图，line折线图，pie饼图等等
            type: "bar",
            //每个类目的值标签，配置
            label: {
              //是否显示值
              show: true,
              //显示的位置
              position: "top",
            },
          },
          {
            //name是legend对应的值
            name: "DaemonSets",
            //bar柱状图，line折线图，pie饼图等等
            type: "bar",
            //每个类目的值标签，配置
            label: {
              //是否显示值
              show: true,
              //显示的位置
              position: "top",
            },
          },
          {
            //name是legend对应的值
            name: "StatefulSets",
            //bar柱状图，line折线图，pie饼图等等
            type: "bar",
            //每个类目的值标签，配置
            label: {
              //是否显示值
              show: true,
              //显示的位置
              position: "top",
            },
          },
          {
            //name是legend对应的值
            name: "Services",
            //bar柱状图，line折线图，pie饼图等等
            type: "bar",
            //每个类目的值标签，配置
            label: {
              //是否显示值
              show: true,
              //显示的位置
              position: "top",
            },
          },
        ],
      });
    },
    getPods() {
      httpClient
        .get(this.getPodData.url)
        .then((res) => {
          console.log("获取到pod总数为：", res.data.total);
          this.podTotalNum = res.data.total;
        })
        .catch((res) => {
          this.$message.error({
            message: "获取pod信息  失败：" + res.err,
          });
        });
    },
    getSvcs() {
      httpClient
        .get(this.getSvcData.url)
        .then((res) => {
          this.svcTotal = res.data.total;
          console.log("aaaaa:", res);
        })
        .catch((res) => {
          this.$message.error({
            message: "获取svc信息  失败：" + res.err,
          });
        });
    },
    getNamespaces() {
      httpClient
        .get(this.getNamespaceData.url)
        .then((res) => {
          // console.log("获取到namespace为：", res.data.namespaces);
          this.namespaceTotal = res.data.total;
          for (let n in res.data.namespaces) {
            if (res.data.namespaces[n].status.phase == "Active") {
              this.activeNamespaceNum = this.activeNamespaceNum + 1;
            }
          }
        })
        .catch((res) => {
          this.$message.error({
            message: "获取namespace信息  失败：" + res.err,
          });
        });
    },
    getNodes() {
      httpClient
        .get(this.getNodesData.url)
        .then((res) => {
          console.log("获取到node信息为：", res.data.items);
          this.nodeTotal = res.data.total;
          for (let i in res.data.items) {
            if (res.data.items[i].status.conditions[4].status == "True") {
              this.readyNodeTotal = this.readyNodeTotal + 1;
              this.cpuTotal =
                this.cpuTotal + parseInt(res.data.items[i].status.capacity.cpu);
              this.allocatableCpuNum =
                this.allocatableCpuNum +
                parseInt(res.data.items[i].status.allocatable.cpu);
              this.memTotal =
                this.memTotal +
                parseInt(
                  res.data.items[i].status.capacity.memory.replace("Ki", "") /
                    1024 /
                    1024
                );
              this.allocatableMemNum =
                this.allocatableMemNum +
                parseInt(
                  res.data.items[i].status.allocatable.memory.replace(
                    "Ki",
                    ""
                  ) /
                    1024 /
                    1024
                );
              this.podTotal =
                this.podTotal +
                parseInt(res.data.items[i].status.capacity.pods);
              this.allocatablePodNum =
                this.allocatablePodNum +
                parseInt(res.data.items[i].status.allocatable.pods);
            }
          }
        })
        .catch((res) => {
          this.$message.error({
            message: "获取node信息  失败：" + res.err,
          });
        });
    },
  },
  beforeMount() {
    this.getNodes();
    this.getNamespaces();
    this.getPods();
    this.getSvcs();
    this.getAllResourceNum();
  },
};
</script>
<!-- scoped: 表示样式只在本页面生效，配合/deep/使用 -->
<style scoped>
/deep/ .el-collapse-item__header {
  font-size: 16px;
}
.home-node-card {
  border-radius: 20px;
  text-align: center;
  background-color: rgb(250, 253, 255);
}
.home-node-card-title {
  font-size: 12px;
}
.home-node-card-num {
  font-size: 22px;
  font-weight: bold;
  color: rgb(63, 92, 135);
}
/deep/ .el-progress-circle {
  height: 80px !important;
  width: 80px !important;
  margin-top: -20px;
}
.el-progress-div {
  display: flex;
  align-items: center; /* 垂直居中 */
  float: left;
  padding-top: 20%;
}
.home-dash-card {
  border-radius: 1px;
}
</style>
