import httpClient from "@/utils/request";

export function getStatefulSetsReq(getStatefulSetsData) {
  return httpClient({
    method: "get",
    url: "/appsv1/getstatefulSets",
    params: getStatefulSetsData,
  });
}
export function updateStatefulSetsReq(updateStatefulSetsData) {
  return httpClient({
    method: "put",
    url: "/appsv1/updatestatefulSet",
    data: updateStatefulSetsData,
  });
}
export function getStatefulSetsDetailReq(getStatefulSetDetailData) {
  return httpClient({
    method: "get",
    url: "/appsv1/getstatefulSetDetail",
    params: getStatefulSetDetailData,
  });
}
export function deleteStatefulSetReq(deleteStatefulSetData) {
  return httpClient({
    method: "delete",
    url: "/appsv1/deletestatefulSet",
    params: deleteStatefulSetData,
  });
}
export function createStatefulSetReq(createStatefulSetData) {
  return httpClient({
    method: "post",
    url: "/appsv1/createStatefulSet",
    data: createStatefulSetData,
  });
}