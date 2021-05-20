<template>
  <div class="components-container">

    <pan-thumb :image="user.avatar" />

    <el-button type="primary" icon="el-icon-upload" style="position: absolute;bottom: 15px;margin-left: 40px;" @click="imagecropperShow=true">
      {{ $t('profile.change_avatar') }}
    </el-button>

    <image-cropper
      v-show="imagecropperShow"
      :key="imagecropperKey"
      :width="300"
      :height="300"
      :params="getParams()"
      url="/api/user/avatar"
      :lang-type="language"
      @close="close"
      @crop-upload-success="cropSuccess"
      @crop-upload-fail="cropFail"
    />
  </div>
</template>

<script>
import ImageCropper from '@/components/ImageCropper'
import PanThumb from '@/components/PanThumb'
import { mapGetters } from 'vuex'

export default {
  name: 'AvatarUpload',
  components: { ImageCropper, PanThumb },
  props: {
    user: {
      type: Object,
      default: () => {
        return {
          id: '',
          name: '',
          email: '',
          avatar: '',
          role: ''
        }
      }
    }
  },
  data() {
    return {
      imagecropperShow: false,
      imagecropperKey: 0
    }
  },
  computed: {
    ...mapGetters([
      'id',
      'name',
      'avatar',
      'roles',
      'phone',
      'email',
      'language'
    ])
  },
  methods: {
    cropSuccess(resData) {
      this.imagecropperShow = false
      this.imagecropperKey = this.imagecropperKey + 1

      this.$store.dispatch('user/getInfo').then(() => {
        this.user.avatar = this.avatar
      }).catch(() => {
        console.log('error')
      })
    },
    cropFail(err) {
      console.log(err)
    },
    close() {
      this.imagecropperShow = false
    },
    getParams() {
      const data = { id: this.user.id }
      return data
    }
  }
}
</script>

<style scoped>
  .avatar{
    width: 200px;
    height: 200px;
    border-radius: 50%;
  }
</style>

