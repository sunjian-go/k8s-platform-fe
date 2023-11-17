import httpClient from "@/utils/request";

export function getDeploymentsReq(getDeploymentsData) {
  return httpClient({
    method: "get",
    url: "/appsv1/getdeployments",
    params: getDeploymentsData,
  });
}
export function getDeploymentsDetailReq(getDeploymentsDetailData) {
  return httpClient({
    method: "get",
    url: "/appsv1/getdeploymentdetail",
    params: getDeploymentsDetailData,
  });
}
export function createDeploymentsReq(createDeploymentsData) {
  return httpClient({
    method: "post",
    url: "/appsv1/createdeployment",
    data: createDeploymentsData,
  });
}
export function restartDeploymentsReq(restartDeploymentsData) {
  return httpClient({
    method: "put",
    url: "/appsv1/restartdeployment",
    data: restartDeploymentsData,
  });
}
export function deleteDeploymentsReq(deleteDeploymentsData) {
  return httpClient({
    method: "delete",
    url: "/appsv1/deletedeployment",
    params: deleteDeploymentsData,
  });
}
export function scaleDeploymentsReq(scaleDeploymentsData) {
  return httpClient({
    method: "put",
    url: "/appsv1/scaledeployment",
    params: scaleDeploymentsData,
  });
}
export function updateDeploymentsReq(updateDeploymentsData) {
  return httpClient({
    method: "put",
    url: "/appsv1/updatedeployment",
    data: updateDeploymentsData,
  });
}
