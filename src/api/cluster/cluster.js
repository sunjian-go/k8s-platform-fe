import httpClient from "@/utils/request";
export function getNodes() {
  return httpClient({
    method: "get",
    url: "/corev1/getnodes",
  });
}
export function getNodeDetailsReq(getNodeDetailData) {
  return httpClient({
    method: "get",
    url: "/corev1/getnodedetail",
    params: getNodeDetailData,
  });
}
export function getNamespacesReq(getNamespaceData) {
  return httpClient({
    method: "get",
    url: "/corev1/getnamespaceList",
    params: getNamespaceData,
  });
}
export function deleteNamespaceReq(deleteNamespaceData) {
  return httpClient({
    method: "delete",
    url: "/corev1/deletenamespace",
    params: deleteNamespaceData,
  });
}
export function getPvsReq(getPvData) {
  return httpClient({
    method: "get",
    url: "/corev1/getpvs",
    params: getPvData,
  });
}
export function deletePvsReq(deletePvData) {
  return httpClient({
    method: "delete",
    url: "/corev1/deletepv",
    params: deletePvData,
  });
}
