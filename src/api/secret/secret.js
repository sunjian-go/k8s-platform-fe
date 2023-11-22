import httpClient from "@/utils/request";

export function getSecretsReq(getSecretsData) {
  return httpClient({
    method: "get",
    url: "/corev1/getsecrets",
    params: getSecretsData,
  });
}
export function getSecretsDetailReq(getSecretDetailData) {
  return httpClient({
    method: "get",
    url: "/corev1/getsecretdetail",
    params: getSecretDetailData,
  });
}
export function updateSecretReq(updateSecretData) {
  return httpClient({
    method: "put",
    url: "/corev1/updatesecret",
    data: updateSecretData,
  });
}
export function deleteSecretReq(deleteSecretData) {
  return httpClient({
    method: "delete",
    url: "/corev1/deletesecret",
    params: deleteSecretData,
  });
}
export function createSecretReq(createSecretData) {
  return httpClient({
    method: "post",
    url: "/corev1/createSecret",
    data: createSecretData,
  });
}