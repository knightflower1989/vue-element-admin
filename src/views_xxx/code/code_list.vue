<template>
  <account-table />
</template>

<script>
import { mapGetters } from 'vuex'
import AccountTable from './components/code_table'

export default {
  name: 'GameMgr',
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
