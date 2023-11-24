import httpClient from "@/utils/request";

export function getConfigMapsReq(getConfigMapsData) {
  return httpClient({
    method: "get",
    url: "/corev1/getcms",
    params: getConfigMapsData,
  });
}
export function getConfigMapsDetailReq(getConfigMapDetailData) {
  return httpClient({
    method: "get",
    url: "/corev1/getcmdetail",
    params: getConfigMapDetailData,
  });
}
export function updateConfigMapReq(updateConfigMapData) {
  return httpClient({
    method: "put",
    url: "/corev1/updatecm",
    data: updateConfigMapData,
  });
}
export function deleteConfigMapReq(deleteConfigMapData) {
  return httpClient({
    method: "delete",
    url: "/corev1/deletecm",
    params: deleteConfigMapData,
  });
}
export function createConfigMapReq(createConfigMapData) {
  return httpClient({
    method: "post",
    url: "/corev1/createcm",
    data: createConfigMapData,
  });
}