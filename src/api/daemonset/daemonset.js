import httpClient from "@/utils/request";

export function getDaemonSetsReq(getDaemonSetsData) {
  return httpClient({
    method: "get",
    url: "/appsv1/getdaemonSet",
    params: getDaemonSetsData,
  });
}
export function updateDaemonSetsReq(updateDaemonSetsData) {
  return httpClient({
    method: "put",
    url: "/appsv1/updateDaemonSet",
    data: updateDaemonSetsData,
  });
}
export function getDaemonSetsDetailReq(getDaemonSetDetailData) {
  return httpClient({
    method: "get",
    url: "/appsv1/getdaemonSetDetail",
    params: getDaemonSetDetailData,
  });
}
export function deleteDaemonSetReq(deleteDaemonSetData) {
  return httpClient({
    method: "delete",
    url: "/appsv1/deleteDaemonSet",
    params: deleteDaemonSetData,
  });
}
export function createDaemonSetReq(createDaemonSetData) {
  return httpClient({
    method: "post",
    url: "/appsv1/createDaemonset",
    data: createDaemonSetData,
  });
}