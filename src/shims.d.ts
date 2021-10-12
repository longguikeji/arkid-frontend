declare module '*.vue' {
  import Vue from 'vue'
  export default Vue
}

declare module '*.json'

declare module 'element-ui/lib/locale/lang/*' {
  export const elementLocale: any
}

declare module '*.gif' {
  export const gif: any
}

// TODO: remove this part after vue-image-crop-upload has its typescript file
declare module 'vue-image-crop-upload'

// TODO: remove this part after vue-grid-layout has its typescript file
declare module 'vue-grid-layout'

declare module 'vue-cropper'
