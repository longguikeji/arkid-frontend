export default function processUUId(uuid: string): string {
  uuid = uuid.replace(/-/g, '')
  return uuid
}