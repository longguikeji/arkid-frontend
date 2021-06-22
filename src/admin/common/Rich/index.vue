<template>
  <div
    :class="{fullscreen: fullscreen}"
    class="tinymce-container"
    :style="{width: state.width || '360px', height: state.height || '600px'}"
  >
    <tinymce-editor
      :id="id"
      v-model="state.value"
      :init="initOptions"
    />
    <div
      v-if="state.isDisabledUploadImage"
      class="editor-custom-btn-container"
    >
      <editor-image
        class="editor-upload-btn"
        @successCBK="imageSuccessCBK"
      />
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Mixins, Watch } from 'vue-property-decorator'
import RichState from './RichState'
import BaseVue from '@/admin/base/BaseVue'
// Docs: https://www.tiny.cloud/docs/advanced/usage-with-module-loaders/
// Import TinyMCE
import 'tinymce/tinymce'
// Default icons are required for TinyMCE 5.3 or above
import 'tinymce/icons/default'
// Import themes
import 'tinymce/themes/silver'
import 'tinymce/themes/mobile'
// Any plugins you want to use has to be imported
import 'tinymce/plugins/advlist'
import 'tinymce/plugins/anchor'
import 'tinymce/plugins/autolink'
import 'tinymce/plugins/autosave'
import 'tinymce/plugins/code'
import 'tinymce/plugins/codesample'
import 'tinymce/plugins/directionality'
import 'tinymce/plugins/emoticons'
import 'tinymce/plugins/fullscreen'
import 'tinymce/plugins/hr'
import 'tinymce/plugins/image'
import 'tinymce/plugins/imagetools'
import 'tinymce/plugins/insertdatetime'
import 'tinymce/plugins/link'
import 'tinymce/plugins/lists'
import 'tinymce/plugins/media'
import 'tinymce/plugins/nonbreaking'
import 'tinymce/plugins/noneditable'
import 'tinymce/plugins/pagebreak'
import 'tinymce/plugins/paste'
import 'tinymce/plugins/preview'
import 'tinymce/plugins/print'
import 'tinymce/plugins/save'
import 'tinymce/plugins/searchreplace'
import 'tinymce/plugins/spellchecker'
import 'tinymce/plugins/tabfocus'
import 'tinymce/plugins/table'
import 'tinymce/plugins/template'
import 'tinymce/plugins/textpattern'
import 'tinymce/plugins/visualblocks'
import 'tinymce/plugins/visualchars'
import 'tinymce/plugins/wordcount'
import TinymceEditor from '@tinymce/tinymce-vue'
import { AppModule } from '@/store/modules/app'
import EditorImage, { IUploadObject } from './EditorImage.vue'
import { plugins, toolbar } from './config'

@Component({
  name: 'Rich',
  components: {
    TinymceEditor,
    EditorImage
  }
})
export default class extends Mixins(BaseVue) {
  private hasChange = false
  private hasInit = false
  private fullscreen = false
  // https://www.tiny.cloud/docs/configure/localization/#language
  // and also see langs files under public/tinymce/langs folder
  private languageTypeList: { [key: string]: string } = {
    en: 'en',
    zh: 'zh_CN',
    es: 'es',
    ja: 'ja',
    ko: 'ko_KR'
  }

  get state(): RichState {
    return this.$state as RichState
  }

  get id(): string {
    return this.state.id ? this.state.id : 'vue-tinymce-' + +new Date() + ((Math.random() * 1000).toFixed(0) + '')
  }

  get language() {
    return this.languageTypeList[AppModule.language]
  }

  get initOptions() {
    return {
      selector: `#${this.id}`,
      body_class: 'panel-body ',
      object_resizing: false,
      toolbar: this.state.toolbar ? this.state.toolbar : toolbar,
      menubar: this.state.menubar,
      plugins: plugins,
      language: this.language,
      language_url: this.language === 'en' ? '' : `/tinymce/langs/${this.language}.js`,
      skin_url: '/tinymce/skins/',
      emoticons_database_url: '/tinymce/emojis.min.js',
      end_container_on_empty_block: true,
      powerpaste_word_import: 'clean',
      code_dialog_height: 450,
      code_dialog_width: 1000,
      advlist_bullet_styles: 'square',
      advlist_number_styles: 'default',
      imagetools_cors_hosts: ['www.tinymce.com', 'codepen.io'],
      default_link_target: '_blank',
      link_title: false,
      nonbreaking_force_tab: true,
      convert_urls: false,
      init_instance_callback: (editor: any) => {
        if (this.state.value) {
          editor.setContent(this.state.value)
        }
        this.hasInit = true
        editor.on('NodeChange Change KeyUp SetContent', () => {
          this.hasChange = true
          this.$emit('input', editor.getContent())
        })
      },
      setup: (editor: any) => {
        editor.on('FullscreenStateChanged', (e: any) => {
          this.fullscreen = e.state
        })
      }
    }
  }

  @Watch('language')
  private onLanguageChange() {
    const tinymceManager = (window as any).tinymce
    const tinymceInstance = tinymceManager.get(this.id)
    if (this.fullscreen) {
      tinymceInstance.execCommand('mceFullScreen')
    }
    if (tinymceInstance) {
      tinymceInstance.destroy()
    }
    this.$nextTick(() => tinymceManager.init(this.initOptions))
  }

  private imageSuccessCBK(arr: IUploadObject[]) {
    const tinymce = (window as any).tinymce.get(this.id)
    arr.forEach(v => {
      tinymce.insertContent(`<img class="wscnph" src="${v.url}" >`)
    })
  }
}
</script>
<style lang="scss">

.tinymce-container {
  position: relative;
  line-height: normal;
  .mce-fullscreen {
    z-index: 10000;
  }
}
.editor-custom-btn-container {
  position: absolute;
  right: 6px;
  top: 6px;
  &.fullscreen {
    z-index: 10000;
    position: fixed;
  }
}
.editor-upload-btn {
  display: inline-block;
}
textarea {
  visibility: hidden;
  z-index: -1;
}

</style>
