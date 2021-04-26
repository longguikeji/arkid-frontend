export default function processUUId(uuid: string) {
  if (!uuid || typeof uuid !== 'string') return
  uuid = uuid.replace(/-/g, '')
  return uuid
}