export default {
  //namespace
  k8sNamespaceList: "http://127.0.0.1:8999/api/corev1/getnamespaces",
  //deployment
  K8sCreateDeployment: "http://127.0.0.1:8999/api/appsv1/createdeployment",
  K8sDeploymentList: "http://127.0.0.1:8999/api/appsv1/getdeployments",
  K8sDeploymentDetail: "http://127.0.0.1:8999/api/appsv1/getdeploymentdetail",
  K8sDeleteDeployment: "http://127.0.0.1:8999/api/appsv1/deletedeployment",
  K8sScaleDeployment: "http://127.0.0.1:8999/api/appsv1/scaledeployment",
  K8sRestartDeployment: "http://127.0.0.1:8999/api/appsv1/restartdeployment",
  K8sUpdateDeployment: "http://127.0.0.1:8999/api/appsv1/updatedeployment",
  K8sGetNamespaceDeploymentNum:
    "http://127.0.0.1:8999/api/appsv1/getnamespacedeployNum",
  //pod
  K8sGetPodList: "http://127.0.0.1:8999/api/corev1/getpods",
  K8sGetPodDetail: "http://127.0.0.1:8999/api/corev1/podetail",
  K8sDeletePod: "http://127.0.0.1:8999/api/corev1/deletepod",
  K8sUpdatePod: "http://127.0.0.1:8999/api/corev1/updatepod",
  K8sGetContainers: "http://127.0.0.1:8999/api/corev1/getcontainers",
  K8sGetContainerLog: "http://127.0.0.1:8999/api/corev1/getlog",
  K8sGetPodNum: "http://127.0.0.1:8999/api/corev1/getpodnum",
  k8sTerminalWs: "ws://127.0.0.1:8081/ws",
  K8sGetLogs: "ws://127.0.0.1:8999/api/getlogs",
  //daemonset
  K8sGetDaemonSetList: "http://127.0.0.1:8999/api/appsv1/getdaemonSet",
  K8sGetDaemonSetDetail: "http://127.0.0.1:8999/api/appsv1/getdaemonSetDetail",
  K8sDeleteDaemonSet: "http://127.0.0.1:8999/api/appsv1/deleteDaemonSet",
  K8sUpdateDaemonSet: "http://127.0.0.1:8999/api/appsv1/updateDaemonSet",
  //statefulset
  K8sGetStatefulSetList: "http://127.0.0.1:8999/api/appsv1/getstatefulSets",
  K8sGetStatefulSetDetail:
    "http://127.0.0.1:8999/api/appsv1/getstatefulSetDetail",
  K8sDeleteStatefulSet: "http://127.0.0.1:8999/api/appsv1/deletestatefulSet",
  K8sUpdateStatefulSet: "http://127.0.0.1:8999/api/appsv1/updatestatefulSet",
  //node
  K8sGetNodeList: "http://127.0.0.1:8999/api/corev1/getnodes",
  K8sGetNodeDetail: "http://127.0.0.1:8999/api/corev1/getnodedetail",
  //namespace
  K8sGetNamespaceList: "http://127.0.0.1:8999/api/corev1/getnamespaces",
  K8sGetNamespaces: "http://127.0.0.1:8999/api/corev1/getnamespaceList",
  K8sGetNamespaceDetail: "http://127.0.0.1:8999/api/corev1/getnamespaceDetail",
  K8sDeleteNamespace: "http://127.0.0.1:8999/api/corev1/deletenamespace",
  //

  //编辑器配置
  cmOptions: {
    mode: "text/yaml", //编辑器的内容格式
    theme: "idea", //编辑器主题
    lineNumbers: true, //显示行数
    smartIndent: true, //智能缩进
    indentUnit: 4, // 智能缩进单元长度为 4 个空格
    styleActiveLine: true, // 显示选中行的样式
    matchBrackets: true, //每当光标位于匹配的方括号旁边时，都会使其高亮显示
    readonly: false,
    linewrapping: true, //自动换行
  },
};
