<template lang="">
  <el-container class="el-container">
    <el-header style="height: 20vh">
      <div>
        <el-row>
          <el-col :span="24" style="height: 2vh"> </el-col>
          <el-col :span="24">
            <el-card
              ><span style="font-size: 20px; font-weight: bold"
                >主机名：{{ nodename }}</span
              ></el-card
            >
          </el-col>
          <el-col :span="24" style="padding-top: 5px">
            <el-row :gutter="12">
              <el-col :span="8">
                <el-card shadow="always" class="card-child-card">
                  <span class="head-card-span">IP地址：</span
                  ><span class="head-card-span2">{{ node.ip }}</span>
                </el-card>
              </el-col>
              <el-col :span="8">
                <el-card shadow="always" class="card-child-card">
                  <span class="head-card-span">Docker版本：</span
                  ><span class="head-card-span2">{{ node.docker_v }}</span>
                </el-card>
              </el-col>
              <el-col :span="8">
                <el-card shadow="always" class="card-child-card">
                  <span class="head-card-span">创建时间：</span
                  ><span class="head-card-span2">{{ node.create_time }}</span>
                </el-card>
              </el-col>
            </el-row>
            <el-row :gutter="12" style="padding-top: 7px">
              <el-col :span="8">
                <el-card shadow="always" class="card-child-card">
                  <span class="head-card-span">Kubelet版本：</span
                  ><span class="head-card-span2">{{ node.kubelet_v }}</span>
                </el-card>
              </el-col>
              <el-col :span="8">
                <el-card shadow="always" class="card-child-card">
                  <span class="head-card-span">Kube-Proxy版本：</span
                  ><span class="head-card-span2">{{ node.kubeProxy_v }}</span>
                </el-card>
              </el-col>
              <el-col :span="8">
                <el-card shadow="always" class="card-child-card">
                  <span class="head-card-span">操作系统：</span
                  ><span class="head-card-span2"
                    >{{ node.OS }}: {{ node.kernel_v }}</span
                  >
                </el-card>
              </el-col>
            </el-row>
          </el-col>
        </el-row>
      </div>
    </el-header>
    <el-main>
      <div>
        <el-row>
          <!-- 系统信息 -->
          <el-col :span="24">
            <el-card shadow="never">
              <el-collapse v-model="activeNames" @change="handleChange">
                <el-collapse-item name="1">
                  <template #title>
                    <span style="font-size: 16px">系统信息</span>
                  </template>
                  <p>操作系统和kubenetes信息</p>
                  <el-row :gutter="0">
                    <el-col :span="10">
                      <el-table :data="OS_key" style="width: 100%">
                        <el-table-column label="键">
                          <template v-slot="scope">
                            <span>{{ scope.row }}</span>
                          </template>
                        </el-table-column>
                        <!-- <el-table-column label="值" width="180" /> -->
                      </el-table>
                    </el-col>
                    <el-col :span="10">
                      <el-table :data="OS_value" style="width: 100%">
                        <el-table-column label="值">
                          <template v-slot="scope">
                            <span>{{ scope.row }}</span>
                          </template>
                        </el-table-column>
                      </el-table>
                    </el-col>
                  </el-row>
                </el-collapse-item>
              </el-collapse>
            </el-card>
          </el-col>
          <!-- 标签 -->
          <el-col :span="24">
            <el-card shadow="never">
              <el-collapse v-model="activeNames" @change="handleChange">
                <el-collapse-item name="1">
                  <template #title>
                    <span style="font-size: 16px">标签</span>
                  </template>
                  <p>键/值 可以被用在主机调度规则里和一些其他的高级设置中</p>
                  <el-row :gutter="0">
                    <el-col :span="10">
                      <el-table :data="labels_key" style="width: 100%">
                        <el-table-column label="键">
                          <template v-slot="scope">
                            <span>{{ scope.row }}</span>
                          </template>
                        </el-table-column>
                      </el-table>
                    </el-col>
                    <el-col :span="10">
                      <el-table :data="labels_val" style="width: 100%">
                        <el-table-column label="值">
                          <template v-slot="scope">
                            <span>{{ scope.row }}</span>
                          </template>
                        </el-table-column>
                      </el-table>
                    </el-col>
                  </el-row>
                </el-collapse-item>
              </el-collapse>
            </el-card>
          </el-col>
          <!-- 注释 -->
          <el-col :span="24">
            <el-card shadow="never">
              <el-collapse v-model="activeNames" @change="handleChange">
                <el-collapse-item name="1">
                  <template #title>
                    <span style="font-size: 16px">注释</span>
                  </template>
                  <p>Key/value 元数据</p>
                  <el-row :gutter="0">
                    <el-col :span="10">
                      <el-table :data="annotations_key" style="width: 100%">
                        <el-table-column label="键">
                          <template v-slot="scope">
                            <span>{{ scope.row }}</span>
                          </template>
                        </el-table-column>
                      </el-table>
                    </el-col>
                    <el-col :span="10">
                      <el-table :data="annotations_val" style="width: 100%">
                        <el-table-column label="值">
                          <template v-slot="scope">
                            <span>{{ scope.row }}</span>
                          </template>
                        </el-table-column>
                      </el-table>
                    </el-col>
                  </el-row>
                </el-collapse-item>
              </el-collapse>
            </el-card>
          </el-col>
          <!-- Taints -->
          <el-col :span="24">
            <el-card shadow="never">
              <el-collapse v-model="activeNames" @change="handleChange">
                <el-collapse-item name="1">
                  <template #title>
                    <span style="font-size: 16px">Taints</span>
                  </template>
                  <p>
                    通过向节点添加taints和tolerations，确保工作负载只在适当的节点上运行
                  </p>
                  <el-row :gutter="0">
                    <el-col :span="10">
                      <el-table :data="taints_keys" style="width: 100%">
                        <el-table-column label="键">
                          <template v-slot="scope">
                            <span>{{ scope.row }}</span>
                          </template>
                        </el-table-column>
                      </el-table>
                    </el-col>
                    <el-col :span="10">
                      <el-table :data="taints_vals" style="width: 100%">
                        <el-table-column label="值">
                          <template v-slot="scope">
                            <span>{{ scope.row }}</span>
                          </template>
                        </el-table-column>
                      </el-table>
                    </el-col>
                  </el-row>
                </el-collapse-item>
              </el-collapse>
            </el-card>
          </el-col>
        </el-row>
      </div>
    </el-main>
  </el-container>
</template>
<script>
import common from "../common/Config";
import httpClient from "../../utils/request";
export default {
  data() {
    return {
      nodename: "",
      node: {
        arch: "",
        docker_v: "",
        kernel_v: "",
        kubelet_v: "",
        kubeProxy_v: "",
        OS: "",
        OS_type: "",
        create_time: "",
        ip: "",
      },
      OS_info: {},
      OS_key: [
        "系统架构",
        "Docker 版本",
        "内核版本",
        "Kubelet 版本",
        "Kube 代理版本",
        "操作系统映像",
        "系统类型",
      ],
      OS_value: [],
      //标签
      labels: {},
      labels_key: [],
      labels_val: [],
      //注释
      annotations: {},
      annotations_key: [],
      annotations_val: [],
      //污点
      taints: [],
      taints_keys: [],
      taints_vals: [],
      getNodeDetailData: {
        url: common.K8sGetNodeDetail,
        params: {
          name: "",
        },
      },
    };
  },
  methods: {
    //获取从url传过来的node名
    getNodeInfo() {
      // 获取当前页面的 URL 参数
      const urlParams = new URLSearchParams(window.location.search);
      // 获取特定名称的参数值
      this.nodename = urlParams.get("name");
    },
    //获取node详情
    getNodeDetail(node) {
      this.getNodeDetailData.params.name = node;
      httpClient
        .get(this.getNodeDetailData.url, this.getNodeDetailData)
        .then((res) => {
          console.log("node详情为：", res.data);
          this.node.ip = res.data.status.addresses[0].address;
          this.node.create_time = this.timeTrans(
            res.data.metadata.creationTimestamp
          );
          this.node.kubelet_v = res.data.status.nodeInfo.kubeletVersion;
          this.node.kubeProxy_v = res.data.status.nodeInfo.kubeProxyVersion;
          this.node.OS = res.data.status.nodeInfo.osImage;
          this.node.kernel_v =
            res.data.status.nodeInfo.kernelVersion.split("-")[0];
          this.node.docker_v =
            res.data.status.nodeInfo.containerRuntimeVersion.replace(
              "docker://",
              ""
            );
          this.node.arch = res.data.status.nodeInfo.architecture;
          this.node.OS_type = res.data.status.nodeInfo.operatingSystem;
          this.osinfoadd();
          this.labels = res.data.metadata.labels;
          console.log("获取标签：", this.labels);
          this.objsadd(this.labels, this.labels_key, this.labels_val);
          this.annotations = res.data.metadata.annotations;
          this.objsadd(
            this.annotations,
            this.annotations_key,
            this.annotations_val
          );
          for (let i in res.data.spec.taints) {
            this.taints.push(res.data.spec.taints[i]);
            //console.log("污点数组：", this.taints[0].effect);
          }
          this.addtaints();
        })
        .catch((res) => {
          console.log("报错为：", res.err);
        });
    },
    addtaints() {
      let i = 0;
      for (i in this.taints) {
        console.log("xxx", this.taints[i]);
        this.objsadd(this.taints[i], this.taints_keys, this.taints_vals);
      }
      // console.log("keysL: ", this.taints_keys);
      // console.log("keysL: ", this.taints_vals);
    },
    osinfoadd() {
      let i = 0;
      for (let v in this.node) {
        if (i == 7) {
          //console.log("os_value数组复制完成：", this.OS_value);
          return;
        }
        this.OS_value.push(this.node[v]);
        //console.log("第", i, "次赋值：", this.node[v]);
        i = i + 1;
      }
    },
    //组装key，val数组
    objsadd(obj, keys, vals) {
      for (let key in obj) {
        // console.log("key: ", key);
        // console.log("val: ", this.labels[key]);
        keys.push(key);
        if (obj[key] == "") {
          vals.push("-");
        } else {
          vals.push(obj[key]);
        }
      }
    },
    //转换时间戳
    timeTrans(timestamp) {
      let date = new Date(new Date(timestamp).getTime() + 8 * 3600 * 1000);
      date = date.toJSON();
      date = date.substring(0, 19).replace("T", " ");
      return date;
    },
  },
  beforeMount() {
    this.getNodeInfo();
    this.getNodeDetail(this.nodename);
  },
};
</script>
<style>
.head-card-span {
  font-size: 12px;
  color: rgb(145, 143, 143);
}
.head-card-span2 {
  font-size: 13px;
}
.el-collapse-item__header {
  justify-content: flex-start;
}
.card-div {
  width: 1600px;
  height: 50px;
  background: #78c9cf;
  border: 1px solid #8bd1d6;
  margin-left: auto;
  margin-right: auto;
}
.heard-card {
  display: flex;
  justify-content: center;
}
.card-div-div {
  width: 530px;
  background-color: #8bd1d6;
  text-align: center;
}
.card-div-right-boder {
  border-right: 2px solid #78c9cf;
}
.card-child-card {
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
}
.carddiv {
  /* width: 530px; */
  width: 800vh;
  background-color: #78c9cf;
  height: 70px;
  border: 1px solid #8bd1d6;
}
.el-container {
  margin-left: auto;
  margin-right: auto;
  height: 100vh;
  width: 70%;
}
</style>
