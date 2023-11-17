import httpClient from "@/utils/request";

export function getWorkflowsReq(getWorkflowsData) {
  return httpClient({
    method: "get",
    url: "/workflow/getworkflows",
    params: getWorkflowsData,
  });
}
export function createWorkflowReq(createWorkflowData) {
  return httpClient({
    method: "post",
    url: "/workflow/createworkflow",
    data: createWorkflowData,
  });
}
export function deleteWorkflowReq(deleteWorkflowData) {
  return httpClient({
    method: "delete",
    url: "/workflow/delbyid",
    params: deleteWorkflowData,
  });
}
