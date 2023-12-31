import httpClient from "@/utils/request";

export function getPvcsReq(getPvcsData) {
  return httpClient({
    method: "get",
    url: "/corev1/getpvcs",
    params: getPvcsData,
  });
}
export function getStorageClassesReq() {
  return httpClient({
    method: "get",
    url: "/corev1/getStorageClasses",
  });
}
export function getPvcsDetailReq(getPvcDetailData) {
  return httpClient({
    method: "get",
    url: "/corev1/getpvcdetail",
    params: getPvcDetailData,
  });
}
export function updatePvcReq(updatePvcData) {
  return httpClient({
    method: "put",
    url: "/corev1/updatepvc",
    data: updatePvcData,
  });
}
export function deletePvcReq(deletePvcData) {
  return httpClient({
    method: "delete",
    url: "/corev1/deletepvc",
    params: deletePvcData,
  });
}
export function createPvcReq(createPvcData) {
  return httpClient({
    method: "post",
    url: "/corev1/createPvc",
    data: createPvcData,
  });
}