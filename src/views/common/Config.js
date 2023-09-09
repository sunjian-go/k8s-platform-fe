export default {
  k8sNamespaceList: "http://127.0.0.1:8999/api/corev1/getnamespaces",
  K8sCreateDeployment: "http://127.0.0.1:8999/api/appsv1/createdeployment",
  K8sDeploymentList: "http://127.0.0.1:8999/api/appsv1/getdeployments",
  K8sDeploymentDetail: "http://127.0.0.1:8999/api/appsv1/getdeploymentdetail",
  K8sDeleteDeployment: "http://127.0.0.1:8999/api/appsv1/deletedeployment",
  K8sScaleDeployment: "http://127.0.0.1:8999/api/appsv1/scaledeployment",
  K8sRestartDeployment: "http://127.0.0.1:8999/api/appsv1/restartdeployment",
  K8sUpdateDeployment: "http://127.0.0.1:8999/api/appsv1/updatedeployment",
  K8sGetNamespaceDeploymentNum:
    "http://127.0.0.1:8999/api/appsv1/getnamespacedeployNum",

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