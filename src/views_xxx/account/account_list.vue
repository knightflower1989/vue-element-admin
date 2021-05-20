<template>
  <account-table />
</template>

<script>
import { mapGetters } from 'vuex'
import AccountTable from './components/account_table'

export default {
  name: 'AccountMgr',
  components: {
    AccountTable
  },
  computed: {
    ...mapGetters([
      'name'
    ])
  },
  methods: {

  }
}
</script>

<style lang="scss" scoped>

</style>
