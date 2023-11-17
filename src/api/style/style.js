import httpClient from "@/utils/request";

export function getColorReq() {
  return httpClient({
    method: "get",
    url: "/getColor",
  });
}
export function updateColorReq(updateColorData) {
  return httpClient({
    method: "put",
    url: "/updateColor",
    data: updateColorData,
  });
}
