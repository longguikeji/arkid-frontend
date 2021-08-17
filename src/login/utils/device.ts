import { v4 as uuidv4 } from 'uuid'

export function getDeviceType() {
  let deviceType: string = ''
  const ua = window.navigator.userAgent
  const isWindowsPhone = /(?:Windows Phone)/.test(ua)
  const isSymbian = /(?:SymbianOS)/.test(ua) || isWindowsPhone
  const isAndroid = /(?:Android)/.test(ua)
  const isFireFox = /(?:Firefox)/.test(ua)
  const isTablet = /(?:iPad|PlayBook)/.test(ua) || (isAndroid && !/(?:Mobile)/.test(ua)) || (isFireFox && /(?:Tablet)/.test(ua))
  const isPhone = /(?:iPhone)/.test(ua) && !isTablet
  const isPc = !isPhone && !isAndroid && !isSymbian
  if (isAndroid || isPhone) {
    deviceType = '手机'
  } else if (isTablet) {
    deviceType = '平板'
  } else if (isPc) {
    deviceType = 'PC'
  }
  return deviceType
}

export function getOS() {
  const ua = navigator.userAgent
  const isWin = (navigator.platform == "Win32") || (navigator.platform == "Windows")
  const isMac = (navigator.platform == "Mac68K") || (navigator.platform == "MacPPC") || (navigator.platform == "Macintosh") || (navigator.platform == "MacIntel")
  if (isMac) return "Mac"
  const isUnix = (navigator.platform == "X11") && !isWin && !isMac
  if (isUnix) return "Unix";
  const isLinux = (String(navigator.platform).indexOf("Linux") > -1)
  if (isLinux) return "Linux"
  if (isWin) {
    const isWin2K = ua.indexOf("Windows NT 5.0") > -1 || ua.indexOf("Windows 2000") > -1
    if (isWin2K) return "Win2000"
    const isWinXP = ua.indexOf("Windows NT 5.1") > -1 || ua.indexOf("Windows XP") > -1
    if (isWinXP) return "WinXP"
    const isWin2003 = ua.indexOf("Windows NT 5.2") > -1 || ua.indexOf("Windows 2003") > -1
    if (isWin2003) return "Win2003"
    const isWinVista= ua.indexOf("Windows NT 6.0") > -1 || ua.indexOf("Windows Vista") > -1
    if (isWinVista) return "WinVista"
    const isWin7 = ua.indexOf("Windows NT 6.1") > -1 || ua.indexOf("Windows 7") > -1
    if (isWin7) return "Win7"
    const isWin10 = ua.indexOf("Windows NT 10") > -1 || ua.indexOf("Windows 10") > -1
    if (isWin10) return "Win10"
  }
}

export function getBrowser() {
  const ua = navigator.userAgent.toLowerCase()
  const reg = /(msie|firefox|chrome|opera|version).*?([\d.]+)/
  const info = ua.match(reg)
  const browser = {
    name: info && info[1] ? info[1].replace(/version/, "'safari") : '',
    version: info && info[2] ? info[2] : ''
  }
  return `浏览器: ${browser.name}, 版本号: ${browser.version}`
}

export function getDeviceId() {
  const uuid = uuidv4()
  return uuid.replace(/-/g, '')
}

export function getIP() {
  return (window as any).returnCitySN.cip
}
