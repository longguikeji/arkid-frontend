export function getBaseUrl() {
  let baseUrl = process.env.VUE_APP_BASE_API || ''
  if (baseUrl.charAt(0) !== '/' && baseUrl.length > 0) baseUrl = '/' + baseUrl
  return baseUrl
}
