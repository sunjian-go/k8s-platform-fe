import httpClient from "@/utils/request";

export function getIngresssReq(getIngresssData) {
  return httpClient({
    method: "get",
    url: "/networking/geting",
    params: getIngresssData,
  });
}
export function updateIngressReq(updateIngressData) {
  return httpClient({
    method: "put",
    url: "/networking/updateing",
    data: updateIngressData,
  });
}
export function getIngresssDetailReq(getIngressDetailData) {
  return httpClient({
    method: "get",
    url: "/networking/getingdetail",
    params: getIngressDetailData,
  });
}
export function createIngresssReq(createIngressData) {
  return httpClient({
    method: "post",
    url: "/networking/createing",
    data: createIngressDetailData,
  });
}
export function deleteIngressReq(deleteIngressData) {
  return httpClient({
    method: "delete",
    url: "/networking/deleteing",
    params: deleteIngressData,
  });
}
