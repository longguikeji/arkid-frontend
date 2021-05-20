import Cookies from 'js-cookie'

// App
const sidebarStatusKey = 'sidebar_status'
export const getSidebarStatus = () => Cookies.get(sidebarStatusKey)
export const setSidebarStatus = (sidebarStatus: string) => Cookies.set(sidebarStatusKey, sidebarStatus)

const languageKey = 'language'
export const getLanguage = () => Cookies.get(languageKey)
export const setLanguage = (language: string) => Cookies.set(languageKey, language)

const sizeKey = 'size'
export const getSize = () => Cookies.get(sizeKey)
export const setSize = (size: string) => Cookies.set(sizeKey, size)

// OriginUrl
const originUrlKey = 'origin_url'
export const getOriginUrl = () => Cookies.get(originUrlKey)
export const setOriginUrl = (originUrl: string) => Cookies.set(originUrlKey, originUrl)

// Desktop
const desktopStatusKey = 'desktop_status'
export const getDesktopStatus = () => Cookies.get(desktopStatusKey)
export const setDesktopStatus = (desktopStatus: string) => Cookies.set(desktopStatusKey, desktopStatus)

const desktopAppKey = 'desktop_current_app'
export const getDesktopApp = () => Cookies.get(desktopAppKey)
export const setDesktopApp = (desktopApp: string) => Cookies.set(desktopAppKey, desktopApp)
export const removeDesktopApp = () => Cookies.remove(desktopAppKey)
