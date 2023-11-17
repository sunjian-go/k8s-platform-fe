import httpClient from "@/utils/request";

export function getResourcesReq() {
  return httpClient({
    method: "get",
    url: "/resources",
  });
}
