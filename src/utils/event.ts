export function preventPaste(e: Event, name: string) {
  if (name.includes('password')) {
    e.preventDefault()
    return false
  }
}