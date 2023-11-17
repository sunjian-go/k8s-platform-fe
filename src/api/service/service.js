import httpClient from "@/utils/request";

export function getServicesReq(getServicesData) {
  return httpClient({
    method: "get",
    url: "/corev1/getsvc",
    params: getServicesData,
  });
}
export function createServicesReq(createServiceData) {
  return httpClient({
    method: "post",
    url: "/corev1/createsvc",
    data: createServiceData,
  });
}
export function deleteServiceReq(deleteServiceData) {
  return httpClient({
    method: "delete",
    url: "/corev1/deletesvc",
    params: deleteServiceData,
  });
}
