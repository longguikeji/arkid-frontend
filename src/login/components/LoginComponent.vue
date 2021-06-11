<template>
  <el-dialog
    visible
    :show-close="false"
    class="login"
    center
    :fullscreen="isFullScreen"
    width="450px"
  >
    <div slot="title">
      <el-image
        :src="icon"
        class="login-image"
      />
      <h2
        class="login-title"
      >
        {{ title }}
      </h2>
    </div>
    <el-tabs
      v-if="currentPage"
      v-model="currentFormIndex"
      stretch
      @tab-click="handleTabClick"
    >
      <el-tab-pane
        v-for="(form, formIndex) in currentPage.forms"
        :key="formIndex"
        :label="form.label"
        :name="formIndex.toString()"
      >
        <el-form
          :ref="pageData"
          :model="currentFormData"
          :rules="rules"
        >
          <el-form-item
            v-for="(item, itemIndex) in form.items"
            :key="itemIndex"
            :prop="item.name"
            :class="{'authcode': hasGraphicCode(item)}"
          >
            <el-input
              v-model="formData[pageData][formIndex][item.name]"
              :type="item.type"
              :name="item.name"
              :placeholder="item.placeholder"
              :show-password="item.type === 'password'"
              @blur="onBlur($event, item.name)"
            >
              <login-button
                v-if="item.append"
                slot="append"
                :config="item.append"
                :action="btnClickHandler"
              />
            </el-input>
            <img
              v-if="item.name === 'code' && !item.append"
              :src="graphicCodeSrc"
              alt=""
              @click="getGraphicCode"
            >
          </el-form-item>
          <login-button
            :long="true"
            :config="form.submit"
            :action="btnClickHandler"
          />
        </el-form>
      </el-tab-pane>
    </el-tabs>
    <div
      v-if="currentPage.bottoms"
      class="form-bottom"
    >
      <login-button
        v-for="(bottom, bottomIndex) in currentPage.bottoms"
        :key="bottomIndex"
        :config="bottom"
        :action="btnClickHandler"
        type="text"
        class="form-bottom-button"
      />
    </div>
    <div
      v-if="currentPage.extend"
      class="third-login"
    >
      <el-divider>{{ currentPage.extend.title }}</el-divider>
      <login-button
        v-for="(btn, btnIndex) of currentPage.extend.buttons"
        :key="btnIndex"
        :config="btn"
        :action="btnClickHandler"
        type="text"
      />
    </div>
  </el-dialog>
</template>

<script lang="ts" src="./LoginComponent.ts">

</script>
<style lang="scss" scoped>
.login {
  text-align: center;
  margin: 0 auto;

  &-image {
    width: 60px;
    height: 60px;
  }

  &-title {
    color: gray;
  }
}
.form-bottom {
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
  flex-direction: row-reverse;

  &-button {
    margin-left: 0px;
  }
}

.third-login {
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
}

::v-deep .authcode {
  .el-form-item__content {
    display: flex;
    input {
      border-top-right-radius: 0px;
      border-bottom-right-radius: 0px;
    }
    img {
      height: 36px;
      cursor: pointer;
      border-top-right-radius: 4px;
      border-bottom-right-radius: 4px;
    }
  }
}
</style>
