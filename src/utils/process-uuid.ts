export default function processUUId(uuid: string) {
  if (!uuid) return
  uuid = uuid.replace(/-/g, '')
  return uuid
}