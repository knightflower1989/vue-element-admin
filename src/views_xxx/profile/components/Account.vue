<template>
  <div>
    <el-form ref="accountForm" :model="accountForm" :rules="accountRules">
      <el-form-item :label="$t('profile.id')">
        <el-input v-model.trim="accountForm.id" :disabled="true" />
      </el-form-item>
      <el-form-item :label="$t('profile.nickname')">
        <el-input v-model.trim="accountForm.name" />
      </el-form-item>
      <el-form-item :label="$t('profile.email')">
        <el-input v-model.trim="accountForm.email" :disabled="true" />
      </el-form-item>
      <el-form-item :label="$t('profile.phone')">
        <el-input v-model.trim="accountForm.phone" />
      </el-form-item>
      <el-form-item :label="$t('profile.password')" prop="password">
        <el-input ref="password" v-model.trim="accountForm.password" name="password" />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submit">{{ $t('profile.update') }}</el-button>
      </el-form-item>
    </el-form>
  </div>

</template>

<script>
import { update } from '@/api/user'
import store from '@/store'

export default {
  name: 'Account',
  props: {
    user: {
      type: Object,
      default: () => {
        return {
          id: 0,
          name: '',
          email: '',
          phone: '',
          avatar: '',
          password: ''
        }
      }
    }
  },
  data() {
    const validatePassword = (rule, value, callback) => {
      if (value.length < 6 && value.length !== 0) {
        callback(new Error('The password can not be less than 6 digits'))
      } else {
        callback()
      }
    }
    return {
      accountForm: {
        id: 0,
        name: '',
        email: '',
        phone: '',
        password: ''
      },
      accountRules: {
        password: [{ required: false, trigger: 'blur', validator: validatePassword }]
      }
    }
  },
  created() {
    this.accountForm.id = this.user.id
    this.accountForm.name = this.user.name
    this.accountForm.email = this.user.email
    this.accountForm.phone = this.user.phone
  },
  methods: {
    submit() {
      this.$refs.accountForm.validate(valid => {
        if (valid) {
          this.loading = true

          const tempData = Object.assign({}, this.accountForm)
          update(tempData).then(async response => {
            this.loading = false

            this.$message({
              message: 'User information has been updated successfully',
              type: 'success',
              duration: 5 * 1000
            })

            if (tempData.password !== undefined && tempData.password.length > 0) {
              await store.dispatch('user/resetToken')
              this.$router.push({ name: 'login', query: { redirect: this.$route.path }})
              // this.$router.push(`/login?redirect=${this.$route.path}`)
            }
          })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    }
  }
}
</script>
