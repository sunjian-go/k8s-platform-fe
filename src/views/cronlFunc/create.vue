<template>
  <div class="totalDiv">
   <el-row :gutter="10">
        <el-col :span="24">
            <div class="el-col-div-span">
                <span >创建控制器</span>
                <el-divider />
            </div>
        </el-col>
        <el-col :span="24">
            <div>
                <el-card class="card_center" shadow="never" >
                    <div style="width: 90%;margin-left: auto;margin-right: auto;">
                      <el-row :gutter="10" >
                        <el-col :span="24">
                            <div>
                               <el-row :gutter="10">
                                    <el-col :span="8">
                                        <div>
                                            <span>名称</span>
                                            <el-icon class="rulesIcon"><StarFilled /></el-icon><br>
                                            <el-input style="width: 350px;padding-top: 5px;" v-model="createController.name" placeholder="请输入名称"
                                            @change="createController.name==''?_:rmEmpty('name')"
                                            ></el-input>
                                            <div v-if="check">
                                                <span class="rulesFont" v-if="createController.name==''&&addEmpty('name')">请输入名称</span>
                                            </div>
                                        </div>
                                    </el-col>
                                    <el-col :span="8">
                                        <div>
                                            <span>命名空间</span>
                                            <el-icon class="rulesIcon"><StarFilled /></el-icon>
                                            <el-select
                                                v-model="createController.namespace"
                                                filterable
                                                placeholder="请选择"
                                                style="width: 90%;padding-top: 5px;"
                                                @blur="createController.namespace==''?_:rmEmpty('namespace')"
                                            >
                                                <el-option
                                                    v-for="(item, index) in namespaceList"
                                                    :key="index"
                                                    :label="item.metadata.name"
                                                    :value="item.metadata.name"
                                                    />
                                            </el-select>   
                                            <div v-if="check">
                                                <span class="rulesFont" v-if="createController.namespace==''&&addEmpty('namespace')">请选择命名空间</span>
                                            </div>  
                                        </div>    
                                    </el-col>
                                    <el-col :span="8">
                                        <div>
                                            <span>控制器类型</span>
                                            <el-row :gutter="0" style="padding-top: 5px;" v-if="controller=='Deployment'">
                                                <el-col :span="12" style="text-align: right;padding-top: 5px;">
                                                    <span >Deployment: 部署无状态应用</span>
                                                </el-col>
                                                <el-col :span="3">
                                                    <el-input  placeholder="请输入数量" v-model="createController.replcias"></el-input>
                                                </el-col>
                                                <el-col :span="9" style="padding-top: 5px;">
                                                    <span>个Pod</span>
                                                </el-col>
                                            </el-row>   
                                            <el-row v-else-if="controller=='DaemonSet'">
                                                <el-col :span="24" style="padding-top: 5px;">
                                                    <span>DaemonSet: 每台主机部署 1 个 Pod</span>
                                                </el-col>
                                            </el-row>
                                            <el-row v-else-if="controller=='StatefulSet'">
                                                <el-col :span="12" style="display: flex; justify-content: right;padding-top: 5px;">
                                                    <span>StatsfulSet: 部署有状态应用</span>
                                                </el-col>
                                                <el-col :span="3">
                                                    <el-input  placeholder="请输入数量" v-model="createController.replcias"></el-input>
                                                </el-col>
                                                <el-col :span="9"  style="padding-top: 5px;">
                                                    <span>个Pod</span>
                                                </el-col>
                                            </el-row>
                                        </div>
                                    </el-col>
                               </el-row>
                            </div>
                        </el-col>                       
                        <!-- 主机调度 -->
                        <el-col :span="24" style="padding-top:10px">
                            <div style="width: 100%;">
                                <el-row style="background-color: rgb(255, 255, 255);">
                                    <el-col :span="24" style="display: flex; justify-content: center;padding-left: 5px;">
                                        <el-collapse v-model="activeNames"  style="width: 100%;">
                                                <el-collapse-item title="主机调度" name="1">
                                                    <el-card>
                                                        <div>
                                                            <el-row :gutter="10">
                                                                <el-col :span="24">
                                                                <el-radio v-model="baseChoose1" label="true" @change="baseChoose2=false;getNodeList()">指定主机运行所有 Pods</el-radio>
                                                                    <div v-if="baseChoose1">
                                                                    <el-select
                                                                        v-model="createController.nodeName"
                                                                        style="width: 100%"
                                                                        placeholder="请选择节点"
                                                                    >
                                                                        <el-option
                                                                        v-for="(node, nindex) in nodes"
                                                                        :key="nindex"
                                                                        :label="node"
                                                                        :value="node"
                                                                        >
                                                                        </el-option>
                                                                    </el-select>
                                                                    </div>
                                                                </el-col>
                                                                <el-col :span="24">
                                                                <el-radio v-model="baseChoose2" label="true" @change="baseChoose1=false">每个 Pod 自动匹配主机</el-radio>
                                                                    <div v-if="baseChoose2">
                                                                    <el-input
                                                                        v-model="createController.nodeSelectorLabel"
                                                                        placeholder="示例: project=ms,app=gateway"
                                                                    ></el-input>
                                                                    </div>
                                                                </el-col>
                                                            </el-row> 
                                                        </div>
                                                    </el-card>
                                                </el-collapse-item>
                                        </el-collapse>           
                                    </el-col>
                                </el-row>
                            </div> 
                        </el-col>
                        <!-- 标签 -->
                        <el-col :span="24" style="padding-top:10px;">
                            <div style="width: 100%;padding-left: 5px;padding-right: 5px;background-color: rgb(255, 255, 255);">
                                <el-collapse v-model="activeNames"  style="width: 100%;">
                                    <el-collapse-item title="标签" name="label" >
                                        <span class="fontColor">用于调度决策的键值对。</span>
                                        <el-card style="padding-top:5px">
                                            <el-row :gutter="10" style="padding-top: 5px;">
                                                <el-col :span="10">
                                                    <span>键</span>
                                                </el-col>
                                                <el-col :span="2"></el-col>
                                                <el-col :span="10">
                                                    <span>值</span>
                                                </el-col>
                                            </el-row>
                                            <div v-for="v,kvindex in createController.keyValues" :key="kvindex">
                                                <el-row :gutter="10" style="padding-top: 5px;">
                                                    <el-col :span="10">
                                                        <el-input placeholder="Key" v-model="createController.keyValues[kvindex].key"></el-input>
                                                    </el-col>
                                                    <el-col :span="2" style="display: flex; justify-content: center;">=</el-col>
                                                    <el-col :span="10">
                                                        <el-input placeholder="Value" v-model="createController.keyValues[kvindex].value"></el-input>
                                                    </el-col>
                                                    <el-col :span="2" style="display: flex; justify-content: right;">
                                                        <el-button type="primary" @click="rmKeyValues(createController.keyValues)">
                                                            <el-icon><Minus /></el-icon>
                                                        </el-button>
                                                    </el-col>
                                                </el-row>
                                            </div>
                                        </el-card>
                                        <div style="padding-top: 10px;">
                                            <el-button type="primary" @click="addKeyValues(createController.keyValues)">  
                                                <el-icon><Plus /></el-icon>
                                                添加标签
                                            </el-button>
                                        </div>
                                    </el-collapse-item>
                                </el-collapse>
                            </div>
                        </el-col> 
                      </el-row>
                    </div>   
                                     
                </el-card>     
            </div>
        </el-col>
        <el-col :span="24" style="padding-top: 10px;">
            <div>
                <el-card class="card_center" shadow="never" body-style="{padding:0px}">
                    <span style="font-size: 18px;color: gray;">容器组</span>
                    <el-divider />
                    <div v-for="v,cindex in createController.containerArr" :key="cindex">     
                        <!-- <el-divider v-if="cindex>1"/>  -->
                        <el-divider v-if="cindex > 0"></el-divider> 
                        <div>
                            <span style="color:gray">容器{{ containerNum[cindex] }}</span> 
                        </div>
                        <div>
                            <el-row :gutter="20" style="padding-top:20px">                                                              
                                <el-col :span="24">
                                    <div>
                                        <el-row :gutter="10" style="padding-top: 5px;margin-left: 4.8%;margin-right: 4.8%;">
                                            <el-col :span="8">
                                                <span>容器名</span>
                                                <el-icon class="rulesIcon"><StarFilled /></el-icon><br>
                                                <el-input placeholder="请输入容器名" v-model="createController.containerArr[cindex].name" style="width: 100%;padding-top: 5px;" 
                                                @blur="createController.containerArr[cindex].name==''?_:rmEmpty('name')"                                                    
                                                ></el-input>
                                                <div v-if="check">
                                                    <div v-if="createController.containerArr[cindex].name==''&&addEmpty('name')">
                                                        <span class="rulesFont">请输入容器名</span>
                                                    </div>                                                
                                                </div>
                                            </el-col>
                                            <el-col :span="8">
                                                <span>Docker 镜像</span>
                                                <el-icon class="rulesIcon"><StarFilled /></el-icon><br>
                                                <el-input placeholder="请输入镜像名" v-model="createController.containerArr[cindex].image" style="width: 100%;padding-top: 5px;" 
                                                @blur="createController.containerArr[cindex].image==''?_:rmEmpty('image')"                                                    
                                                ></el-input>
                                                <div v-if="check">
                                                    <div v-if="createController.containerArr[cindex].image==''&&addEmpty('image')">
                                                        <span class="rulesFont">请输入镜像名</span>
                                                    </div>                                                
                                                </div>
                                            </el-col>                                            
                                            <el-col :span="8">
                                                <span>镜像下载策略</span>
                                                <el-icon class="rulesIcon"><StarFilled /></el-icon><br>
                                                <el-select v-model="createController.containerArr[cindex].imagePullPolicy"  style="width: 100%;padding-top: 5px;" placeholder="选择镜像下载策略"
                                                @blur="createController.containerArr[cindex].imagePullPolicy==''?_:rmEmpty('imgPullPolicys')"
                                                >
                                                    <el-option
                                                        v-for="(policy, ipindex) in imgPullPolicys"
                                                        :key="ipindex"
                                                        :label="policy"
                                                        :value="policy"
                                                        >
                                                    </el-option>
                                                </el-select>
                                                <!-- <el-input placeholder="请选择下载策略" v-model="createController.containerArr[cindex].imagePullPolicy" style="width: 100%;padding-top: 5px;"></el-input> -->
                                                <div v-if="check">
                                                    <span class="rulesFont" v-if="createController.containerArr[cindex].imagePullPolicy==''&&addEmpty('imgPullPolicys')">请选择下载策略</span>
                                                </div>
                                            </el-col>
                                        </el-row>                                        
                                    </div>    
                                </el-col>                                
                                <el-divider style="width:90%;margin-left:auto;margin-right:auto"/>
                                <!-- 端口映射 -->
                                <el-col :span="24" style="display: flex; justify-content: center;">
                                    <div style="width: 90%;">
                                        <span>端口映射</span><br>
                                        <el-row :gutter="25" style="padding-top:5px">
                                                <el-col :span="6">
                                                    <span>端口名称</span><br>
                                                </el-col>
                                                <el-col :span="6">
                                                    <span>容器端口</span>
                                                    <el-icon class="rulesIcon"><StarFilled /></el-icon>
                                                </el-col>
                                                <el-col :span="4">
                                                    <span>协议</span><br>
                                                </el-col>
                                                <el-col :span="4" style="padding-left: 4%;">
                                                    <span>网络模式</span><br>
                                                </el-col>
                                                <el-col :span="4"></el-col>
                                            </el-row>
                                        <div v-for="v,pindex in createController.containerArr[cindex].portArr" :key="pindex"> 
                                            <el-row :gutter="25" style="padding-top: 5px;">
                                                <el-col :span="6" style="display: flex; justify-content: center;">          
                                                    <el-input style="height:92%;padding-top: 5px;" placeholder="例如：myport" v-model="createController.containerArr[cindex].portArr[pindex].portName"></el-input>
                                                </el-col>
                                                <el-col :span="6" style="display: flex; justify-content: center;">            
                                                    <!-- <el-tooltip :content="123" :disabled="false">  -->
                                                        <el-input style="height:92%;padding-top: 5px;" placeholder="端口范围：0~65535" 
                                                        @input="handleInput(createController.containerArr[cindex].portArr[pindex].containerPort)?_:
                                                        createController.containerArr[cindex].portArr[pindex].containerPort=''"
                                                        v-model="createController.containerArr[cindex].portArr[pindex].containerPort"
                                                        @blur="createController.containerArr[cindex].imagePullPolicy==''?_:rmEmpty('containerPort')"
                                                        ></el-input>                                                    
                                                    <!-- </el-tooltip> -->
                                                </el-col>
                                                <el-col :span="4" style="display: flex; justify-content: center;">
                                                    <el-select
                                                        v-model="createController.containerArr[cindex].portArr[pindex].protocol"
                                                        filterable
                                                        placeholder="请选择协议"
                                                        style="width: 100%;padding-top:5px"
                                                        >
                                                        <el-option
                                                            v-for="(p, i) in proctols"
                                                            :key="i"
                                                            :label="p"
                                                            :value="p"
                                                        >
                                                        </el-option>
                                                        </el-select>
                                                </el-col>
                                                <el-col :span="4" style="display: flex; justify-content: center">
                                                    <!-- <el-radio label="true" size="large" v-model="createController.containerArr[cindex].portArr[pindex].hostportRedio" 
                                                    @click="createController.containerArr[cindex].portArr[pindex].hostportStatus=true">Host模式</el-radio> -->
                                                    <div>
                                                        <el-checkbox  label="Host模式" v-model="createController.containerArr[cindex].portArr[pindex].hostportRedio " size="large" />
                                                        <!-- <svg style="height:20px;width:20px;padding-top:5px"  -->
                                                        <!-- v-if="createController.containerArr[cindex].portArr[pindex].hostportStatus"
                                                        t="1702004170138" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="7533" width="200" height="200"><path d="M512 0C229.24 0 0 229.24 0 512s229.24 512 512 512 512-229.24 512-512S794.76 0 512 0z m-37.035 785.067c-78.677-99.738-171.247-175.719-236.032-199.476l152.747-94.993 74.035 147.252S586.07 338.637 775.817 238.9c-4.608 71.235-23.143 132.949 9.25 208.963-83.32 19.013-254.567 232.722-310.102 337.204z" fill="#27abf3" p-id="7534"></path></svg> -->
                                                        <!-- <svg class="icon" style="height:20px;width:20px;padding-top:5px" aria-hidden="true">
                                                                <use xlink:href="#icon-duihao"></use>
                                                        </svg> -->
                                                        <my-tag style="height:20px;width:20px;padding-top:4px" v-if="createController.containerArr[cindex].portArr[pindex].hostportStatus"></my-tag>
                                                        <el-dialog
                                                            v-model="createController.containerArr[cindex].portArr[pindex].hostportRedio"
                                                            title="请输入Host相关"
                                                            width="30%"
                                                            :before-close="handleClose"
                                                        >
                                                            <div>
                                                                <el-row :gutter="10">
                                                                    <el-col :span="7">
                                                                        <span>请输入HostPort</span>
                                                                    </el-col>
                                                                    <el-col :span="17">
                                                                        <el-input  v-model="createController.containerArr[cindex].portArr[pindex].hostPort" placeholder="端口范围：0~65535"
                                                                        @input="handleInput(createController.containerArr[cindex].portArr[pindex].hostPort)?_:
                                                                            createController.containerArr[cindex].portArr[pindex].hostPort=0"
                                                                        ></el-input>
                                                                    </el-col>
                                                                    <el-col :span="7" style="padding-top: 15px;">
                                                                        <span>请输入HostIP (可选)</span>
                                                                    </el-col>
                                                                    <el-col :span="17" style="padding-top: 15px;">
                                                                        <el-input  v-model="createController.containerArr[cindex].portArr[pindex].hostIP" placeholder="例如：127.0.0.1"></el-input>
                                                                    </el-col>
                                                                </el-row>
                                                            </div>
                                                            <template #footer>
                                                            <span class="dialog-footer">
                                                                <el-button @click="createController.containerArr[cindex].portArr[pindex].hostportRedio = false;
                                                                createController.containerArr[cindex].portArr[pindex].hostportStatus=false
                                                                ">取消</el-button>
                                                                <el-button type="primary" @click="createController.containerArr[cindex].portArr[pindex].hostportRedio = false;
                                                                createController.containerArr[cindex].portArr[pindex].hostportStatus=true">
                                                                提交
                                                                </el-button>
                                                            </span>
                                                            </template>
                                                        </el-dialog>
                                                    </div>
                                                </el-col>
                                                <el-col :span="4" style="display: flex; justify-content: right;">
                                                    <el-button type="primary" @click="rmPorts(createController.containerArr[cindex].portArr)">
                                                        <el-icon><Minus /></el-icon>
                                                    </el-button>
                                                </el-col>
                                            </el-row>
                                            <el-row :gutter="25" style="padding-top: 5px;">
                                                <el-col :span="6" style="display: flex; justify-content: center;">                                                             
                                                </el-col>
                                                <el-col :span="6"> 
                                                    <div v-if="check&&createController.containerArr[cindex].portArr.length>0">
                                                        <span class="rulesFont" v-if="createController.containerArr[cindex].portArr[pindex].containerPort==''&&addEmpty('containerPort')">请输入容器端口</span>
                                                    </div>                                                                                                                      
                                                </el-col>
                                                <el-col :span="4" style="display: flex; justify-content: center;">           
                                                </el-col>
                                                <el-col :span="4" style="display: flex; justify-content: center;">                                               
                                                </el-col>
                                                <el-col :span="4" style="display: flex; justify-content: right;">                                                    
                                                </el-col>
                                            </el-row>
                                        </div>
                                        <div style="padding-top: 10px;">
                                            <el-button type="primary" @click="addPorts(createController.containerArr[cindex].portArr)">
                                                <el-icon><Plus /></el-icon>
                                                添加规则
                                            </el-button>
                                        </div>
                                    </div>
                                </el-col>
                                <el-divider style="width:90%;margin-left:auto;margin-right:auto"/>
                                <!-- 环境变量 -->
                                <el-col :span="24" style="display: flex; justify-content: center;">
                                    <div style="width: 90%;padding-left: 5px;padding-right: 5px;background-color: rgb(255, 255, 255);">
                                        <el-collapse v-model="activeNames"  style="width: 100%;">
                                            <el-collapse-item title="环境变量" :name="createController.containerArr[cindex].randomStrs[0]" >
                                                <span class="fontColor">设置容器可见的环境变量，包括从其他资源(如密文等)注入的值。</span>
                                                <el-card style="padding-top:5px">
                                                    <el-row :gutter="10" style="padding-top: 5px;">
                                                        <el-col :span="11">
                                                            <span>键</span>
                                                        </el-col>
                                                        <el-col :span="2"></el-col>
                                                        <el-col :span="11">
                                                            <span>值</span>
                                                        </el-col>
                                                    </el-row>
                                                    <div v-for="v,eindex in createController.containerArr[cindex].envArr" :key="eindex">
                                                        <el-row :gutter="10" style="padding-top: 5px;">
                                                            <el-col :span="10">
                                                                <el-input placeholder="Key" v-model="createController.containerArr[cindex].envArr[eindex].name"></el-input>
                                                            </el-col>
                                                            <el-col :span="2" style="display: flex; justify-content: center;">=</el-col>
                                                            <el-col :span="10">
                                                                <el-input placeholder="Value" v-model="createController.containerArr[cindex].envArr[eindex].value"></el-input>
                                                            </el-col>
                                                            <el-col :span="2" style="display: flex; justify-content: right;">
                                                                <el-button type="primary" @click="rmvalue(createController.containerArr[cindex].envArr)">
                                                                    <el-icon><Minus /></el-icon>
                                                                </el-button>
                                                            </el-col>
                                                        </el-row>
                                                    </div>
                                                </el-card>
                                                <div style="padding-top: 10px;">
                                                    <el-button type="primary" @click="addvalue(createController.containerArr[cindex].envArr)">
                                                        <el-icon><Plus /></el-icon>
                                                        添加变量
                                                    </el-button>
                                                </div>
                                            </el-collapse-item>
                                        </el-collapse>
                                    </div>
                                </el-col> 
                                <!-- 健康检查 -->
                                <el-col :span="24" style="display: flex; justify-content: center;padding-top: 10px;">
                                    <div style="width: 90%;padding-left: 5px;padding-right: 5px;background-color: rgb(255, 255, 255);">
                                        <el-collapse v-model="activeNames"  style="width: 100%;">
                                            <el-collapse-item title="健康检查" :name="createController.containerArr[cindex].randomStrs[1]">
                                                <span class="fontColor">周期性向容器发出请求，以检测其健康状态。默认设置下，readiness 和 liveness 使用相同的配置参数。对于应用初始化较长的容器，需要增加就绪检测时间.</span>
                                                <el-card style="padding-top:5px">
                                                    <div>
                                                        <el-row :gutter="10">
                                                            <el-col :span="12">   
                                                                <el-row :gutter="10">                                                                
                                                                    <el-col :span="24">
                                                                        <div>
                                                                            <el-radio-group v-model="createController.containerArr[cindex].healthCheck">                                                                                                                                                            
                                                                                <el-radio  :label="false" size="large">否</el-radio>
                                                                                <el-radio  :label="true" size="large">是</el-radio>
                                                                            </el-radio-group>
                                                                        </div>
                                                                    </el-col>
                                                                </el-row>                                                               
                                                            </el-col>
                                                            <el-col :span="12">
                                                                <div v-if="createController.containerArr[cindex].healthCheck" style="padding-top:7px">
                                                                    <span>检查路径</span>
                                                                    <el-input v-model="createController.containerArr[cindex].healthPath" placeholder="目前仅支持http请求状态检查" 
                                                                    style="width:80%;padding-left: 10px;"></el-input>
                                                                </div>    
                                                            </el-col>
                                                        </el-row>
                                                    </div>
                                                </el-card>
                                            </el-collapse-item>
                                        </el-collapse>
                                    </div>
                                </el-col>
                                <!-- 数据卷 -->
                                <el-col :span="24" style="display: flex; justify-content: center;padding-top: 10px;">
                                    <div style="width: 90%;padding-left: 5px;padding-right: 5px;background-color: rgb(255, 255, 255);">
                                        <el-collapse v-model="activeNames"  style="width: 100%;">
                                            <el-collapse-item title="数据卷" :name="createController.containerArr[cindex].randomStrs[2]" >
                                                <span class="fontColor">持久化和共享独立于单个客器生命周期的数据</span>                                                
                                                <div v-for="vm,vindex in createController.containerArr[cindex].volumeArr" :key="vindex" style="padding-top:5px">                                                    
                                                    <el-card>
                                                        <el-row :gutter="10" style="padding-top:5px">
                                                            <el-col :span="12" style="padding-bottom: 5px;">
                                                                <span>卷名</span>
                                                                <el-icon class="rulesIcon"><StarFilled /></el-icon>
                                                                <el-input v-model="createController.containerArr[cindex].volumeArr[vindex].volume.volumeName"
                                                                @input="uniqName(createController.containerArr[cindex].volumeArr[vindex].volume.volumeName)"
                                                                @blur="createController.containerArr[cindex].volumeArr[vindex].volume.volumeName!=''?rmEmpty('volumeName'):_"></el-input>
                                                                <div v-if="check">
                                                                    <span class="rulesFont" v-if="createController.containerArr[cindex].volumeArr[vindex].volume.volumeName==''&&addEmpty('volumeName')">请输入卷名</span>
                                                                </div>
                                                                <div>
                                                                    <span class="rulesFont" v-if="createController.containerArr[cindex].volumeArr[vindex].uniqFlag">该卷名已存在，请重新输入</span>
                                                                </div>
                                                            </el-col>
                                                            <el-col :span="12" style="padding-bottom: 5px;">
                                                                <span>选择类型</span>
                                                                <el-select
                                                                v-model="createController.containerArr[cindex].volumeArr[vindex].volume.type"
                                                                style="width: 100%"
                                                                placeholder="请选择卷类型"
                                                                @change="getVolumes(createController.containerArr[cindex].volumeArr[vindex].volume.type);createController.containerArr[cindex].volumeArr[vindex].volume.context=''">
                                                                <el-option
                                                                v-for="(type, tindex) in volume_types"
                                                                :key="tindex"
                                                                :label="type"
                                                                :value="type"
                                                                >
                                                                </el-option>
                                                                </el-select>
                                                            </el-col>
                                                            <el-col :span="12">
                                                                <div v-if="createController.containerArr[cindex].volumeArr[vindex].volume.type=='configMap'||
                                                                createController.containerArr[cindex].volumeArr[vindex].volume.type=='PersistentVolumeClaim' ||
                                                                createController.containerArr[cindex].volumeArr[vindex].volume.type=='Secret'" style="padding-bottom: 5px;">
                                                                    <span>选择卷</span>
                                                                    <el-icon class="rulesIcon"><StarFilled /></el-icon>
                                                                        <el-select
                                                                            v-model="createController.containerArr[cindex].volumeArr[vindex].volume.context"
                                                                            style="width: 100%"
                                                                            placeholder="选择数据卷"
                                                                            @blur="createController.containerArr[cindex].volumeArr[vindex].volume.context==''?_:rmEmpty('volume')"
                                                                            >
                                                                            <el-option
                                                                                v-for="(volume, vmindex) in volumes"
                                                                                :key="vmindex"
                                                                                :label="volume"
                                                                                :value="volume"
                                                                                >
                                                                            </el-option>
                                                                        </el-select>
                                                                        <div v-if="check && createController.containerArr[cindex].volumeArr.length>0">
                                                                            <span class="rulesFont" v-if="createController.containerArr[cindex].volumeArr[vindex].volume.context==''&&addEmpty('volume')">请选择卷</span>
                                                                        </div>
                                                                </div>
                                                                <div v-if="createController.containerArr[cindex].volumeArr[vindex].volume.type=='HostPath'">
                                                                    <span>主机路径</span>
                                                                    <el-icon class="rulesIcon"><StarFilled /></el-icon>
                                                                    <el-input v-model="createController.containerArr[cindex].volumeArr[vindex].volume.context"
                                                                    @blur="createController.containerArr[cindex].volumeArr[vindex].volume.context!=''?rmEmpty('hostpath'):_"></el-input>
                                                                </div>
                                                                <div v-if="check">
                                                                    <span class="rulesFont" v-if="createController.containerArr[cindex].volumeArr[vindex].volume.context==''&&addEmpty('hostpath')">请输入主机路径</span>
                                                                </div>                                                                 
                                                            </el-col>
                                                            <el-col :span="12" style="padding-bottom: 5px;">
                                                                <div v-if="createController.containerArr[cindex].volumeArr[vindex].volume.type=='configMap'||
                                                                createController.containerArr[cindex].volumeArr[vindex].volume.type=='Secret'">
                                                                    <span>默认模式</span>
                                                                    <el-input v-model="createController.containerArr[cindex].volumeArr[vindex].volume.mode"></el-input>
                                                                </div>
                                                                <div v-if="createController.containerArr[cindex].volumeArr[vindex].volume.type=='HostPath'">
                                                                    <span>主机路径类型检查</span>
                                                                    <el-select
                                                                    v-model="createController.containerArr[cindex].volumeArr[vindex].volume.hostPathType"
                                                                    style="width: 100%"
                                                                    placeholder="请选择卷类型"
                                                                    @change="getVolumes(createController.containerArr[cindex].volumeArr[vindex].volume.type)"
                                                                    >
                                                                        <el-option
                                                                        v-for="(htype, hindex) in hostpath_types"
                                                                        :key="hindex"
                                                                        :label="htype"
                                                                        :value="htype"
                                                                        >
                                                                        </el-option>
                                                                    </el-select>
                                                                </div>
                                                            </el-col>
                                                            
                                                            <div v-if="createController.containerArr[cindex].volumeArr[vindex].volume.type=='configMap'" style="width: 100%;">
                                                            <el-col :span="24" >
                                                                <span>项目</span>
                                                            </el-col>
                                                            <el-col :span="24" style="padding-bottom: 5px;">
                                                                <el-radio v-model="createController.containerArr[cindex].volumeArr[vindex].radio" label="1">所有键</el-radio>
                                                                <el-radio v-model="createController.containerArr[cindex].volumeArr[vindex].radio" label="2" @change="getCMKeys(createController.namespace,
                                                            createController.containerArr[cindex].volumeArr[vindex].volume.context)">选择特定的键</el-radio>
                                                            </el-col>
                                                            <el-col :span="24" v-if="createController.containerArr[cindex].volumeArr[vindex].radio==2">
                                                                <div v-for="v,iindex in createController.containerArr[cindex].volumeArr[vindex].volume.itemArr.length" :key="iindex" >
                                                                <div style="padding-top: 10px;">
                                                                    <el-row :gutter="10">
                                                                    <el-col :span="9" style="padding-top: 5px;">
                                                                        <el-select style="width:100%;" v-model="createController.containerArr[cindex].volumeArr[vindex].volume.itemArr[iindex].key" placeholder="选择键：例如username">
                                                                        <el-option
                                                                            v-for="v,k in tsKeys"
                                                                            :key="k"
                                                                            :label="v"
                                                                            :value="v">
                                                                        </el-option>
                                                                        </el-select>
                                                                    </el-col>
                                                                    <el-col :span="9"> 
                                                                        <el-input style="padding-top: 5px;" v-model="createController.containerArr[cindex].volumeArr[vindex].volume.itemArr[iindex].path" placeholder="路径：my-group/my-username"></el-input>
                                                                    </el-col>
                                                                    <el-col :span="6">
                                                                        <el-input style="padding-top: 5px;" v-model="createController.containerArr[cindex].volumeArr[vindex].volume.itemArr[iindex].mode" placeholder="模式：例如400"></el-input>
                                                                    </el-col>
                                                                    </el-row>  
                                                                </div>
                                                                </div>
                                                                <div style="width: 100%;display: flex;justify-content: flex-end;padding-top: 10px;padding-bottom: 10px;">
                                                                <!-- <el-button type="primary" @click="addItems(containerArr[cindex].volumeArr[vindex].itemArr)">添加项目</el-button> -->
                                                                <d-button-group size="sm">
                                                                    <d-button  icon="delete" color="danger" @click="rmItems(createController.containerArr[cindex].volumeArr[vindex].volume.itemArr)" variant="solid">删除项目</d-button>
                                                                    <d-button  icon="add" color="primary" @click="addItems(createController.containerArr[cindex].volumeArr[vindex].volume.itemArr)" variant="solid">添加项目</d-button>
                                                                </d-button-group>
                                                                </div>
                                                            </el-col>
                                                            </div>
                                                            <el-col :span="24">
                                                            <el-divider/>
                                                            <el-row :gutter="10">
                                                                <el-col :span="11">
                                                                    <span>容器路径</span>
                                                                    <el-icon class="rulesIcon"><StarFilled /></el-icon>                                                                    
                                                                </el-col>
                                                                <el-col :span="11">
                                                                    <span>子路径(仅适用于数据卷挂载)</span>
                                                                </el-col>
                                                                <el-col :span="2" style="display: flex; justify-content: center;">
                                                                    <span>只读</span>
                                                                </el-col>
                                                                <el-col :span="24">
                                                                <div v-for="v,mindex in createController.containerArr[cindex].volumeArr[vindex].mountVolumeArr.length" :key="mindex">
                                                                    <div style="padding-bottom: 10px;">
                                                                    <el-row :gutter="10">
                                                                        <el-col :span="11">                                          
                                                                            <el-input v-model="createController.containerArr[cindex].volumeArr[vindex].mountVolumeArr[mindex].mountPath" 
                                                                            @blur="createController.containerArr[cindex].volumeArr[vindex].mountVolumeArr[mindex].mountPath==''?_:rmEmpty('mountPath');"
                                                                            ></el-input> 
                                                                            <div v-if="check && createController.containerArr[cindex].volumeArr.length>0">
                                                                                <span class="rulesFont" v-if="createController.containerArr[cindex].volumeArr[vindex].mountVolumeArr[mindex].mountPath==''&&addEmpty('mountPath')">请输入容器路径</span>
                                                                            </div>                                         
                                                                        </el-col>
                                                                        <el-col :span="11">                                                 
                                                                            <el-input v-model="createController.containerArr[cindex].volumeArr[vindex].mountVolumeArr[mindex].subPath"></el-input>
                                                                        </el-col>
                                                                        <el-col :span="2" style="display: flex; justify-content: center;">   
                                                                        <el-checkbox v-model="createController.containerArr[cindex].volumeArr[vindex].mountVolumeArr[mindex].readOnly"></el-checkbox>
                                                                        </el-col>
                                                                    </el-row>                                                                    
                                                                    </div>
                                                                </div>
                                                                </el-col>
                                                            </el-row>
                                                            <div style="width: 100%;display: flex;justify-content: flex-end;padding-top: 10px;padding-bottom: 10px;">
                                                                <!-- <el-button type="primary" @click="rmMount(containerArr[cindex].volumeArr[vindex].mountVolumeArr)">删除挂载</el-button>
                                                                <el-button type="primary" @click="addMount(containerArr[cindex].volumeArr[vindex].mountVolumeArr)">添加挂载</el-button> -->
                                                                <d-button-group size="sm">
                                                                <d-button color="danger" icon="delete" @click="rmMount(createController.containerArr[cindex].volumeArr[vindex].mountVolumeArr)" variant="solid"> 删除映射</d-button>
                                                                <d-button color="primary" icon="add" @click="addMount(createController.containerArr[cindex].volumeArr[vindex].mountVolumeArr)" variant="solid"> 添加映射</d-button>
                                                                </d-button-group>
                                                            </div>
                                                            </el-col>
                                                        </el-row>
                                                    </el-card>
                                                </div>                                                
                                                <div style="padding-top: 10px;">
                                                    <el-button type="warning"  @click="rmVolumes(createController.containerArr[cindex].volumeArr)">
                                                        <el-icon><Minus /></el-icon>
                                                            删除卷
                                                    </el-button>
                                                    <el-button type="primary"  @click="addVolumes(createController.containerArr[cindex].volumeArr)">
                                                        <el-icon><Plus /></el-icon>
                                                            添加卷
                                                    </el-button>
                                                </div>
                                            </el-collapse-item>
                                        </el-collapse>
                                    </div>
                                </el-col>
                                <!-- 高级选项 -->
                                <el-col :span="24" style="display: flex; justify-content: center;padding-top: 10px;">
                                    <div style="width: 90%;padding-left: 5px;padding-right: 5px;background-color: rgb(255, 255, 255);">
                                        <el-collapse v-model="activeNames"  style="width: 100%;">
                                            <el-collapse-item title="高级选项" :name="createController.containerArr[cindex].randomStrs[3]">
                                                <span class="fontColor">授子或限制容器影响所运行主机的能力</span>
                                                <div style="padding-top:5px">
                                                    <el-row :gutter="10">
                                                        <!-- 内存资源限制 -->
                                                        <el-col :span="12">   
                                                            <div>
                                                                <el-card>
                                                                    <el-row>
                                                                        <el-col :span="24">
                                                                            <div>
                                                                                <span>内存预留</span>
                                                                            </div>
                                                                            <div style="padding-top:5px">
                                                                                <el-row style="background-color:rgb(226, 220, 220);padding-bottom:0px;display: flex;align-items: center;justify-content: center;">
                                                                                    <el-col :span="22">
                                                                                        <el-input placeholder="例如：128" v-model="createController.containerArr[cindex].reqMem"
                                                                                        @input="handleInput(createController.containerArr[cindex].reqMem)?_:createController.containerArr[cindex].reqMem=''"
                                                                                        ></el-input>
                                                                                    </el-col>
                                                                                    <el-col :span="2" style="text-align:center">MiB</el-col>    
                                                                                </el-row>                                                                
                                                                            </div>
                                                                        </el-col>
                                                                        <el-col :span="24">
                                                                            <div style="padding-top:15px">
                                                                                <span>内存限制</span>
                                                                            </div>                            
                                                                            <div>
                                                                                <el-radio :label=false size="large" v-model="createController.containerArr[cindex].memLimit">无限制</el-radio>  
                                                                            </div>
                                                                            <div>
                                                                                <el-row>                                                                                    
                                                                                    <el-col :span="3">
                                                                                        <el-radio :label=true size="large" style="padding-bottom:5px" v-model="createController.containerArr[cindex].memLimit">限制为</el-radio>
                                                                                    </el-col>
                                                                                    <el-col :span="19" >                                                                                        
                                                                                        <el-row style="background-color:rgb(226, 220, 220);padding-bottom:0px;display: flex;align-items: center;justify-content: center;">
                                                                                            <el-col :span="22">
                                                                                                <el-input placeholder="128" v-model="createController.containerArr[cindex].mem" 
                                                                                                :disabled="!createController.containerArr[cindex].memLimit"
                                                                                                @input="handleInput(createController.containerArr[cindex].mem)?_:
                                                                                                createController.containerArr[cindex].mem=''"
                                                                                                ></el-input>
                                                                                            </el-col>
                                                                                            <el-col :span="2" style="text-align:center">MiB</el-col>    
                                                                                        </el-row>
                                                                                    </el-col>                                                                                    
                                                                                </el-row>                    
                                                                            </div>
                                                                        </el-col>
                                                                        <el-col :span="24"></el-col>
                                                                    </el-row>
                                                                </el-card>
                                                            </div>
                                                        </el-col>
                                                        <!-- CPU资源限制 -->
                                                        <el-col :span="12">
                                                            <div>
                                                                <el-card>
                                                                    <el-row>
                                                                        <el-col :span="24">
                                                                            <div>
                                                                                <span>CPU预留</span>
                                                                            </div>
                                                                            <div style="padding-top:5px">
                                                                                <el-row style="background-color:rgb(226, 220, 220);padding-bottom:0px;display: flex;align-items: center;justify-content: center;">
                                                                                    <el-col :span="20">
                                                                                        <el-input placeholder="例如：1000" v-model="createController.containerArr[cindex].reqCpu"
                                                                                        @input="handleInput(createController.containerArr[cindex].reqCpu)?_:
                                                                                        createController.containerArr[cindex].reqCpu=''"
                                                                                        ></el-input>
                                                                                    </el-col>
                                                                                    <el-col :span="4" style="text-align:center">milli CPUs</el-col>    
                                                                                </el-row>                                                                
                                                                            </div>
                                                                        </el-col>
                                                                        <el-col :span="24">
                                                                            <div style="padding-top:15px">
                                                                                <span>CPU限制</span>
                                                                            </div>                            
                                                                            <div>
                                                                                <el-radio :label=false size="large" v-model="createController.containerArr[cindex].cpuLimit">无限制</el-radio>
                                                                            </div>
                                                                            <div>
                                                                                <el-row>
                                                                                    <el-col :span="3">
                                                                                        <el-radio :label=true size="large" style="padding-bottom:5px" v-model="createController.containerArr[cindex].cpuLimit">限制为</el-radio>
                                                                                    </el-col>
                                                                                    <el-col :span="19" >                                                                                       
                                                                                        <el-row style="background-color:rgb(226, 220, 220);padding-bottom:0px;display: flex;align-items: center;justify-content: center;">
                                                                                            <el-col :span="20">
                                                                                                <el-input placeholder="1000" v-model="createController.containerArr[cindex].cpu" :disabled="!createController.containerArr[cindex].cpuLimit"
                                                                                                @input="handleInput(createController.containerArr[cindex].cpu)?_:
                                                                                                createController.containerArr[cindex].cpu=''"
                                                                                                ></el-input>
                                                                                            </el-col>
                                                                                            <el-col :span="4" style="text-align:center">milli CPUs</el-col>    
                                                                                        </el-row>
                                                                                    </el-col>                                
                                                                                </el-row>
                                                                            </div>
                                                                        </el-col>
                                                                        <el-col :span="24"></el-col>
                                                                    </el-row>
                                                                </el-card>
                                                            </div>
                                                        </el-col>
                                                    </el-row>
                                                </div>
                                            </el-collapse-item>
                                        </el-collapse>
                                    </div>
                                </el-col>
                                <el-col :span="12" class="deploy-create-col2"></el-col>
                            </el-row>
                        </div>
                    </div>
                    <el-divider />
                    <div style="padding-top:10px;padding-left:70px">
                        <el-button type="warning" @click="rmContainers(createController.containerArr)" variant="solid">删除容器</el-button>
                        <el-button type="primary" @click="addContainers(createController.containerArr)">新增容器</el-button>
                    </div>
                </el-card>
                <div style="display: flex; justify-content: center;width: 100%;padding-top: 15px;">
                    <el-button type="primary" class="buttonStyle" @click="create()">启动</el-button>
                    <el-button type="info" class="buttonStyle" @click="backToContro">取消</el-button>
                </div>
            </div>
        </el-col>
   </el-row>
  </div>
</template>

<script>
import { getNamespacesReq, getNodes } from "@/api/cluster/cluster";
import {
getConfigMapsDetailReq,
getConfigMapsReq,
} from "@/api/configMap/configMap";
import { createDaemonSetReq } from "@/api/daemonset/daemonset";
import { createDeploymentsReq } from "@/api/deployment/deployment";
import { getPvcsReq } from "@/api/pvc/pvc";
import { getSecretsReq } from "@/api/secret/secret";
import { createStatefulSetReq } from "@/api/statefulset/statefulset";

// 导入自定义组件
import MyTag from './dui.vue';
export default{
    // 注册自定义组件
    components: {
     MyTag,
    },
    data(){
        return{
        controller:"",
        //用于表单中的接收值
        createController: {
            mountName:"",
            keyValues:[],
            name: "",
            namespace: "",
            label_str:"",
            replcias:1,
            ControllerType:"",
            nodeName: "",
            nodeSelectorLabel: "",
            containerArr: [
            {
                randomStrs:["a","b","c","d"],
                dataVolumes:"",
                portsArr:"",
                name: '',
                image: "",
                imagePullPolicy: '',
                reqMem:"",
                reqCpu:"",
                mem:"",
                cpu:"",            
                memLimit:false,
                cpuLimit:false, 
                healthCheck: false,
                healthPath: '',
                portArr: [],
                envArr: [],
                volumeArr: []
            }
            ]
        },
        //创建控制器
        createControllerData:{
            name: "",
            namespace: "",
            label: {},
            nodeName: "",
            nodeSelectorLabel: {},
            containers: [
                {
                name: "",
                image: "",
                ports: [         
                ],
                montVolume: [  
                ],
                envs: [    
                ],
                imagePullpolicy: "",
                reqMem:"",
                reqCpu:"",
                cpu: "",
                mem: "",
                healthCheck: false,
                healthPath: ""
                },
            ],
            volume: [
            ]
        },
        //namespace列表
        namespaceList:[],
        //镜像下载策略列表
        imgPullPolicys:["IfNotPresent","Always","Never"],
        check:false,
        proctols:["TCP", "UDP"],
        redio_host:false,
        baseChoose1:false,
        baseChoose2:false,
        nodes:[],
        volume_types:["configMap","HostPath","EmptyDir","PersistentVolumeClaim","Secret"],
        volumes:[],
        tsKeys:[],
        containerNum:[1],
        activeNames:"",
        emptys:[],
        startNum:0,
        isTooltipDisabled:true,
        hostpath_types:['不检查目标路径','目录：不存在则创建','文件：不存在则创建','现有目录','现有文件','现有socket文件','现有character文件','现有block设备']
     }
    },
     methods:{
        uniqName(name){
            console.log("开始去重")
            let flag=0
            for(let i in this.createController.containerArr){
                for(let j in this.createController.containerArr[i].volumeArr){
                    if(name==this.createController.containerArr[i].volumeArr[j].volume.volumeName){
                        flag++
                        //如果大于1，说明改名字的数量大于1，已存在
                        if(flag>1){
                            //当uniqFlag为true的时候，说明改名字已存在，就可以去做处理了
                            this.createController.containerArr[i].volumeArr[j].uniqFlag=true  
                            this.createController.containerArr[i].volumeArr[j].volume.volumeName=""
                        }else{
                            this.createController.containerArr[i].volumeArr[j].uniqFlag=false  
                        }
                    }
                }
            }
            
        },
        //标签验证
        authLabels(label){
            let reg = new RegExp("(^[A-Za-z]+=[A-Za-z0-9]+).*");
            //如果不匹配
            if (!reg.test(label)) {
                return 2;
            }else{
                let lab = new Map();
                // 将label_str字符串通过","进行分割，返回一个数组存储在a中：例如目前该字符串为："name=test,app=web",那么a就等于["name=test","app=web"]
                let a = label.split(",");
                //遍历a数组中的每个元素
                a.forEach((item) => {
                // item就是每个元素，将每个元素通过"="进行分割，得到一个子字符串数组b，例如，如果当前元素是"name=test"，则b将是["name", "test"]。
                let b = item.split("=");
                // 将分割后的子字符串数组中的第一个元素作为键，第二个元素作为值，存储在上面创建的label对象(map)中。
                lab[b[0]] = b[1];
                });
                return lab
            }
         },
        //创建控制器
        createControllerFunc(){
            if(this.controller!='DaemonSet'){
                this.createControllerData['replicas']=parseInt(this.createController.replcias)
            }
            this.createControllerData.name=this.createController.name
            this.createControllerData.namespace=this.createController.namespace
            this.createControllerData.nodeName=this.createController.nodeName    
            //组装标签组        
            if(this.createController.keyValues.length > 0){
                for(let i in this.createController.keyValues){                    
                    // Object.assign可以往对象中追加key和value值
                    Object.assign(this.createControllerData.label, { [this.createController.keyValues[i].key]: this.createController.keyValues[i].value });
                }
            }
            if(this.createController.nodeSelectorLabel){
                let label=this.authLabels(this.createController.nodeSelectorLabel)
                if(label==2){
                    this.alertFunc("标签验证失败，请重新输入")
                    this.createController.nodeSelectorLabel=""
                    return
                }else {
                    this.createControllerData.nodeSelectorLabel=label
                }
             }
             let vIndex = 0
             for(let j in this.createController.containerArr){
                console.log("xxxxxxxxxxxxxxxxxxxxxxxxxx次数：",vIndex)
                if(j > 0 ){
                    this.createControllerData.containers.push(                                               
                         {
                            name: "",
                            image: "",
                            ports: [],
                            montVolume: [],
                            envs: [],
                            imagePullpolicy: "",
                            reqMem:"",
                            reqCpu:"",
                            cpu: "",
                            mem: "",
                            healthCheck: false,
                            healthPath: ""
                        }                    
                    )
                }
                this.createControllerData.containers[j].name=this.createController.containerArr[j].name
                this.createControllerData.containers[j].image=this.createController.containerArr[j].image
                this.createControllerData.containers[j].ports=this.createController.containerArr[j].portArr
                for(let p in this.createControllerData.containers[j].ports){
                    if(this.createControllerData.containers[j].ports[p].containerPort>0){
                        this.createControllerData.containers[j].ports[p].containerPort=parseInt(this.createControllerData.containers[j].ports[p].containerPort)
                    }
                    
                    //如果hostportStatus为真并且hostPort大于0，说明用户选中该功能并填上有效端口，所以对hostPort做进一步处理
                    if(this.createControllerData.containers[j].ports[p].hostportStatus&&this.createControllerData.containers[j].ports[p].hostPort>0){
                        this.createControllerData.containers[j].ports[p].hostPort=parseInt(this.createControllerData.containers[j].ports[p].hostPort)
                    }else{
                        //否则就说明是用户误点了确认按钮
                        this.createControllerData.containers[j].ports[p].hostportStatus=false
                    }
                }
                this.createControllerData.containers[j].envs=this.createController.containerArr[j].envArr
                this.createControllerData.containers[j].imagePullpolicy=this.createController.containerArr[j].imagePullPolicy
                if(this.createController.containerArr[j].reqMem){
                    this.createControllerData.containers[j].reqMem=this.createController.containerArr[j].reqMem+"Mi"
                }
                if(this.createController.containerArr[j].reqCpu){
                    this.createControllerData.containers[j].reqCpu=this.createController.containerArr[j].reqCpu+"m"
                }
                if(this.createController.containerArr[j].cpu){
                    this.createControllerData.containers[j].cpu=this.createController.containerArr[j].cpu+"m"
                }
                if(this.createController.containerArr[j].mem){
                    this.createControllerData.containers[j].mem=this.createController.containerArr[j].mem+"Mi"
                }
                
                if(this.createController.containerArr[j].healthCheck){
                    this.createControllerData.containers[j].healthCheck=this.createController.containerArr[j].healthCheck
                    this.createControllerData.containers[j].healthPath=this.createController.containerArr[j].healthPath
                }
                //组装卷和卷挂载
                let mIndex=0
                for(let v in this.createController.containerArr[j].volumeArr){
                    for(let m in this.createController.containerArr[j].volumeArr[v].mountVolumeArr){
                        this.createController.containerArr[j].volumeArr[v].mountVolumeArr[m].name=this.createController.containerArr[j].volumeArr[v].volume.volumeName
                        this.createControllerData.containers[j].montVolume[mIndex]=this.createController.containerArr[j].volumeArr[v].mountVolumeArr[m]
                        mIndex++
                    }
                    if(this.createController.containerArr[j].volumeArr[v].volume.type=='HostPath'){
                        switch (this.createController.containerArr[j].volumeArr[v].volume.hostPathType){
                            case '不检查目标路径':
                                this.createController.containerArr[j].volumeArr[v].volume.hostPathType=''
                                break
                            case '目录：不存在则创建':
                                this.createController.containerArr[j].volumeArr[v].volume.hostPathType='DirectoryOrCreate'
                                break
                            case '文件：不存在则创建':
                                this.createController.containerArr[j].volumeArr[v].volume.hostPathType='FileOrCreate'
                                break
                            case '现有目录':
                                this.createController.containerArr[j].volumeArr[v].volume.hostPathType='Directory'
                                break
                            case '现有文件':
                                this.createController.containerArr[j].volumeArr[v].volume.hostPathType='File'
                                break
                            case '现有socket文件':
                                this.createController.containerArr[j].volumeArr[v].volume.hostPathType='Socket'
                                break
                            case '现有character文件':
                                this.createController.containerArr[j].volumeArr[v].volume.hostPathType='CharDevice'
                                break
                            case '现有block设备':
                                this.createController.containerArr[j].volumeArr[v].volume.hostPathType='BlockDevice'
                                break
                        }
                    }
                    this.createControllerData.volume[vIndex]=this.createController.containerArr[j].volumeArr[v].volume
                    vIndex++                    
                }
             }
             console.log("准备创建：",this.createControllerData) 
             switch(this.controller){
                case 'DaemonSet':
                    this.actionCreateController(createDaemonSetReq, this.createControllerData)
                    break
                case 'Deployment':
                    this.actionCreateController(createDeploymentsReq, this.createControllerData)
                    break
                case 'StatefulSet':
                    this.actionCreateController(createStatefulSetReq, this.createControllerData)
                    break
             }
                       
        },
        //根据控制器类型开始创建
        actionCreateController(createFunc,createData){
            createFunc(createData).then(res=>{
                this.$message.success({
                    message: res.msg
                })
             }).catch(res=>{
                this.$message.error({
                    message: res.err
                })
             }).finally(_=>{
                this.clean()
                this.backToContro()
             })  
        },
        handleInput(numstr) {
            // 使用正则表达式匹配只包含数字的字符串
            const regex = /^\d*$/;
            if (!regex.test(numstr)) {
                // 如果输入的值不是只包含数字的字符串，则将输入值重置为之前的值
                return false;
            }
            return true;
        },
        mountVolName(volumeName,mountVolName){
            mountVolName=volumeName
        },
        rmEmpty(value){
            // this.emptys.pop(value)
            for (let i = this.emptys.length - 1; i >= 0; i--) {
                if (this.emptys[i] === value) {
                    this.emptys.splice(i, 1);
                }
            }
            console.log("移除",this.emptys)
        },
        addEmpty(value){
            this.emptys.push(value)
            console.log("添加",this.emptys)
            return true
        },
        rmKeyValues(kvs){
            kvs.pop()
        },
        addKeyValues(kvs){
            kvs.push({
                key: "",
                value: ""
            })
        },
        containerNum(num){
            return num+1
        },
        rmContainers(containers){
            containers.pop() 
            this.containerNum.pop()
        },
        addContainers(containers){
            this.containerNum.push(containers.length+1)
            console.log("当前容器组数量为：",this.containerNum)
            containers.push(
            {
                randomStrs:[Math.random().toString(36).substring(2, 10),Math.random().toString(36).substring(2, 10),Math.random().toString(36).substring(2, 10),Math.random().toString(36).substring(2, 10)],
                name: '',
                image: '',
                imagePullPolicy: '',                
                mem:"",
                cpu:"",                
                memLimit:false,
                cpuLimit:false,
                healthCheck: false,
                healthPath: '',
                portArr: [        
                ],
                envArr: [                 
                ],
                volumeArr: [
                ]
            }
            )
        },
        //返回主页面
        backToContro(){
            switch(this.controller){
                case 'DaemonSet':
                    this.$router.push("/workload/daemonset")
                    break
                case 'Deployment':
                    this.$router.push("/workload/deployment")
                    break
                case 'StatefulSet':
                    this.$router.push("/workload/statefulset")
                    break
            }
            
        },
        //添加特定键
        addItems(items){
            items.push(
            {
                key: "",
                path: "",
                mode:"",
            }
            )
        },
        //删除特定键
        rmItems(items){
            items.pop()
            
        },
        //添加挂载   
        addMount(mounts){
            mounts.push({
                    name: "",
                    mountPath: "",
                    readOnly: false,
                    subPath: ""
            })    
        },
        //删除挂载
        rmMount(mounts){     
            mounts.pop()        
        },
        getCMKeys(namespace,configmap){
            let getCmData = {
            name: configmap,
            namespace: namespace
            }
            getConfigMapsDetailReq(getCmData).
            then(res=>{
            for(let key in res.data.data){
                this.tsKeys.push(key)
                // console.log("获取到：",key)
            }
            }).catch(res=>{
            console.log(res.err)
            })
        },
        //根据类型获取数据卷
        getVolumes(type){
            this.volumes=[]
            let getVolumeData = {
            name:"",
            namespace:this.createController.namespace,
            limit:"",
            page:"",
            }
            switch (type) {
            case 'configMap':
            console.log("cm的namespace:",)
            getConfigMapsReq(getVolumeData).then(res=>{
                for(let key in res.data.items){
                this.volumes.push(res.data.items[key].metadata.name)
                }
            }).catch(res=>{
                console.log(res.err)
            })
            break;
            case 'PersistentVolumeClaim':
            getPvcsReq(getVolumeData).then(res=>{
                for(let key in res.data.items){
                this.volumes.push(res.data.items[key].metadata.name)
                }
            }).catch(res=>{
                console.log(res.err)
            })
            break;
            case 'Secret':
            getSecretsReq(getVolumeData).then(res=>{
                // console.log("aaaaaa",res.data.Items)
                for(let key in res.data.Items){
                    this.volumes.push(res.data.Items[key].metadata.name)
                    // console.log("aaaaaa",res)
                }
                }).catch(res=>{
                console.log(res.err)
                })
            break;
            default:
        }
        },
        //添加卷 
        addVolumes(volumes){
            volumes.push(
            {
                //是否选择特定键
                radio:"1",
                uniqFlag: false,
                volume: {
                    volumeName:"",
                    type:"",
                    context:"",
                    mode: 400,
                    hostPathType:"",
                    itemArr: [
                        {
                        key: '',
                        path: '',
                        mode: ''
                        }
                    ],
                 },                
                mountVolumeArr: [
                    {
                    name: '',
                    mountPath: '',
                    readOnly: false,
                    subPath: ''
                    }
                ]
                }
            )
            console.log("挂载卷长度为：",this.volumess)
        },
        //删除卷
        rmVolumes(volumes){     
            volumes.pop()
        },
        //获取节点列表
        getNodeList(){
            getNodes().then(res=>{
            for(let i in res.data.items){
                this.nodes.push(res.data.items[i].metadata.name)
            }
            // console.log(res.data.items[0].metadata.name)
            // this.nodes=[]
            }).catch((_)=>{
            this.nodes=[]
            })
        },
        //增加环境变量
        addvalue(envs){
            envs.push(
            {
                name: "",
                value: ""
            }
            )
        },
        //删除环境变量
        rmvalue(envs){
            envs.pop()
        },
        redioForStats(redio,status){
            status = redio
            console.log("xxxxx",this.createController)
        },
        //删除端口组
        rmPorts(ports){
            ports.pop()
        },
        //添加端口组
        addPorts(ports){
        ports.push(
          {
            portName:"",
            containerPort:0,
            protocol:"",
            hostportRedio:false,
            hostportStatus:false,
            hostPort:0,
            hostIP:""
          }
        )
        },
        alertFunc(info){
            this.$alert(info, '提示', {
            confirmButtonText: 'OK',
            })
        },
        create(){
            this.check = true;
            console.log("验证长度。。。。。。",this.emptys)            
            //延时0.001秒执行是因为如果立即执行的话，会直接执行到底，而不会等上面将数据插入emptys之后再执行
            // 所以为了准确校验必须加个延迟执行
            setTimeout(function(){                
                if(this.check){
                    if(this.emptys.length == 0){
                        // alert("准备创建")
                        console.log(this.createController)
                        this.createControllerFunc()
                    }else{
                        this.alertFunc("还有必填项没填！")
                    }                
                }
            }.bind(this), 1);  //bind用来绑定上面的this.emptys,是必须加的
            
        },
        clean(){
            //清除createController对象所有值
            Object.assign(this.$data.createController,this.$options.data().createController)
            Object.assign(this.$data.createControllerData,this.$options.data().createControllerData)
        },
        //验证字符串为空
        checkStr(str){
            if(str==""){
                return false
            }else{
                return true
            }
        },
        //获取namespace列表
        getNamespaces() {
        getNamespacesReq()
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
    },
    // beforeMount钩子函数里面的东西在页面实例挂载之前就调用了，用于页面数据的初始化
    beforeMount() {
        this.controller=this.$route.query.obj
        //加载页面时先获取localStorage中的namespace值，若获取不到则默认default，放在下拉框第一位显示
        if (
        localStorage.getItem("namespace") !== "undefined" &&
        localStorage.getItem("namespace") !== null
        ) {
        this.namespaceValue = localStorage.getItem("namespace");
        }
        //然后去获取namespace列表
        this.getNamespaces();

        //获取daemonset列表
        if (this.namespaceValue == "") {
        this.getDaemonSets();
        }
    }
}
</script>
<style>
.el-col-div-span{
    font-size: 20px;
    font-weight: bold;
    color: gray;
    padding-top: 10px;
}
.totalDiv{
    width: 100%;
    height: 100vh;
    margin-left: auto;
    margin-right: auto;
}
.deploy-create-form{
    width: 440px;
}
.deploy-create-col2{
    width: 80%px;
}
.rulesIcon{
    color: red;
    font-size: 7px;
}
.rulesFont{
    color:red;
    font-size: 11px;
}
.center{
    display: flex; 
    justify-content: center;
}
.card_center{
    width:90%;
    margin-left: auto;
    margin-right: auto;
    background-color: rgb(243, 249, 255);
}
.buttonStyle{
    border-radius: 20px;
}
.fontColor{
    color: darkgray;
}


</style>