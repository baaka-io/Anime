export const objectToQueryParams = (queryParams: any) =>
  Object.keys(queryParams)
    .filter(key => queryParams[key] !== null)
    .map(key => `${key}=${queryParams[key]}`)
    .join("&")
