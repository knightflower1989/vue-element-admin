<template>
  <div class="block">
    <el-timeline>
      <el-timeline-item v-for="(item,index) of timeline" :key="index" :timestamp="item.create_time" placement="top">
        <el-card>
          <h4>{{ item.log_type }}</h4>
          <p>{{ item.log_content }}</p>
        </el-card>
      </el-timeline-item>
    </el-timeline>
  </div>
</template>

<script>

import { userLogList } from '@/api/user'
import { mapGetters } from 'vuex'

export default {
  name: 'Timeline',
  data() {
    return {
      timeline: []
    }
  },
  computed: {
    ...mapGetters([
      'id',
      'name',
      'avatar',
      'roles',
      'phone',
      'email'
    ])
  },
  created() {
    this.getLog()
  },
  methods: {
    getLog() {
      userLogList({ id: this.id }).then(response => {
        if (response.code === 20000) {
          this.timeline = response.data
        }
      })
    }
  }
}
</script>
