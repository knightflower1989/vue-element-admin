<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input
        v-model="listQuery.name"
        :placeholder="$t('xxx.name')"
        style="width: 200px;"
        class="filter-item"
        @keyup.enter.native="handleFilter"
      />
      <el-select v-model="listQuery.status" :placeholder="$t('xxx.status')" clearable style="width: 90px" class="filter-item">
        <el-option v-for="item in statusOptions" :key="item" :label="item" :value="item" />
      </el-select>
      <el-select v-model="listQuery.sort" style="width: 140px" class="filter-item" @change="handleFilter">
        <el-option v-for="item in sortOptions" :key="item.key" :label="item.label" :value="item.key" />
      </el-select>
      <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">
        {{ $t('xxx.btn_search') }}
      </el-button>
      <el-button
        class="filter-item"
        style="margin-left: 10px;"
        type="primary"
        icon="el-icon-edit"
        @click="handleCreate"
      >
        {{ $t('xxx.btn_add') }}
      </el-button>
      <el-button
        v-waves
        :loading="downloadLoading"
        class="filter-item"
        type="primary"
        icon="el-icon-download"
        @click="handleDownload"
      >
        {{ $t('xxx.btn_export_all') }}
      </el-button>
    </div>

    <el-table
      :key="tableKey"
      v-loading="listLoading"
      :data="list"
      border
      fit
      highlight-current-row
      style="width: 100%;"
      @sort-change="sortChange"
    >
      <el-table-column
        :label="$t('xxx.id')"
        prop="id"
        sortable="custom"
        align="center"
        width="80"
        :class-name="getSortClass('id')"
      >
        <template slot-scope="{row}">
          <span>{{ row.id }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('xxx.name')" min-width="110px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.name }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('xxx.cnt')" min-width="110px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.cnt }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('xxx.prize')" min-width="110px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.prize }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('xxx.rule')" min-width="110px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.rule }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('xxx.game_id')" min-width="110px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.game_id }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('xxx.op_ids')" min-width="110px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.op_ids }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('xxx.description')" min-width="150px">
        <template slot-scope="{row}">
          <span class="link-type" @click="handleUpdate(row)">{{ row.description }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('xxx.start_time')" width="150px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.start_time | parseTime('{y}-{m}-{d} {h}:{i}') }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('xxx.end_time')" width="150px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.end_time | parseTime('{y}-{m}-{d} {h}:{i}') }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('xxx.create_time')" width="150px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.create_time | parseTime('{y}-{m}-{d} {h}:{i}') }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('xxx.status')" class-name="status-col" width="100">
        <template slot-scope="{row}">
          <el-tag :type="row.status | statusFilter">
            {{ row.status }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column :label="$t('xxx.actions')" align="center" width="300" class-name="small-padding fixed-width">
        <template slot-scope="{row,$index}">
          <el-button type="success" size="mini" @click="handleExport(row)">
            {{ $t('xxx.btn_export') }}
          </el-button>
          <el-button type="primary" size="mini" @click="handleUpdate(row)">
            {{ $t('xxx.btn_edit') }}
          </el-button>
          <el-button
            v-if="row.status!='published'"
            size="mini"
            type="success"
            @click="handleModifyStatus(row,'published')"
          >
            {{ $t('xxx.btn_publish') }}
          </el-button>
          <el-button v-if="row.status!='draft'" size="mini" @click="handleModifyStatus(row,'draft')">
            {{ $t('xxx.btn_draft') }}
          </el-button>
          <el-button v-if="row.status!='deleted'" size="mini" type="danger" @click="handleDelete(row,$index)">
            {{ $t('xxx.btn_delete') }}
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination
      v-show="total>0"
      :total="total"
      :page.sync="listQuery.page"
      :limit.sync="listQuery.limit"
      @pagination="getList"
    />

    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form
        ref="dataForm"
        :rules="rules"
        :model="temp"
        label-position="left"
        label-width="100px"
        style="width: 400px; margin-left:50px;"
      >
        <el-form-item :label="$t('xxx.no')" prop="no">
          <el-input v-model="temp.no" :disabled.sync="disableEditNo" />
        </el-form-item>
        <el-form-item :label="$t('xxx.name')" prop="name">
          <el-input v-model="temp.name" />
        </el-form-item>
        <el-form-item :label="$t('xxx.prize')" prop="prize">
          <el-input v-model="temp.prize" />
        </el-form-item>
        <el-form-item :label="$t('xxx.rule')" prop="rule">
          <el-input v-model="temp.rule" />
        </el-form-item>
        <el-form-item :label="$t('xxx.description')" prop="description">
          <el-input v-model="temp.description" />
        </el-form-item>
        <el-form-item :label="$t('xxx.game_id')" prop="game_id">
          <el-input v-model="temp.game_id" />
        </el-form-item>
        <el-form-item :label="$t('xxx.op_ids')" prop="op_ids">
          <el-input v-model="temp.op_ids" />
        </el-form-item>
        <el-form-item :label="$t('xxx.start_time')" prop="start_time">
          <el-date-picker v-model="temp.start_time" type="datetime" placeholder="Please pick a date" />
        </el-form-item>
        <el-form-item :label="$t('xxx.end_time')" prop="end_time">
          <el-date-picker v-model="temp.end_time" type="datetime" placeholder="Please pick a date" />
        </el-form-item>
        <el-form-item :label="$t('xxx.status')">
          <el-select v-model="temp.status" class="filter-item" placeholder="Please select">
            <el-option v-for="item in statusOptions" :key="item" :label="item" :value="item" />
          </el-select>
        </el-form-item>
        <el-form-item :label="$t('xxx.cnt')" prop="cnt">
          <el-input v-model="temp.cnt" :disabled.sync="disableEditCnt" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">
          {{ $t('xxx.btn_cancel') }}
        </el-button>
        <el-button type="primary" @click="dialogStatus==='create'?createData():updateData()">
          {{ $t('xxx.btn_confirm') }}
        </el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
import {
  fetchList,
  createAccount,
  updateAccount,
  modifyAccountStatus,
  deleteAccount,
  fetchGroupIdList
} from '@/api/code'
import waves from '@/directive/waves' // waves directive
import { parseTime } from '@/utils'
import Pagination from '@/components/Pagination' // secondary package based on el-pagination
import i18n from '@/lang'

const calendarTypeOptions = [
  { key: 'CN', display_name: 'China' },
  { key: 'US', display_name: 'USA' },
  { key: 'JP', display_name: 'Japan' },
  { key: 'EU', display_name: 'Eurozone' }
]

// arr to obj, such as { CN : "China", US : "USA" }
const calendarTypeKeyValue = calendarTypeOptions.reduce((acc, cur) => {
  acc[cur.key] = cur.display_name
  return acc
}, {})

export default {
  name: 'CodeTable',
  components: { Pagination },
  directives: { waves },
  filters: {
    statusFilter(status) {
      const statusMap = {
        published: 'success',
        draft: 'info',
        deleted: 'danger'
      }
      return statusMap[status]
    },
    typeFilter(type) {
      return calendarTypeKeyValue[type]
    }
  },
  data() {
    return {
      tableKey: 0,
      list: null,
      group_list: [],
      total: 0,
      next_no: 0,
      listLoading: true,
      listQuery: {
        page: 1,
        limit: 10,
        name: undefined,
        status: undefined,
        sort: '+id'
      },
      calendarTypeOptions,
      // sortOptions: [{ label: 'ID Ascending', key: '+id' }, { label: 'ID Descending', key: '-id' }],
      statusOptions: ['published', 'draft', 'deleted'],
      temp: {
        id: 0,
        no: 0,
        name: '',
        prize: '',
        rule: '',
        description: '',
        game_id: '',
        op_ids: '',
        status: 'published',
        start_time: '',
        end_time: '',
        cnt: 0
      },
      dialogFormVisible: false,
      dialogStatus: '',
      // textMap: {
      //   update: 'Edit',
      //   create: 'Create'
      // },
      dialogPvVisible: false,
      rules: {
        no: [{ required: true, message: 'no required', trigger: 'blur' }],
        name: [{ required: true, message: 'name required', trigger: 'blur' }],
        prize: [{ required: true, message: 'prize required', trigger: 'blur' }],
        rule: [{ required: true, message: 'rule required', trigger: 'blur' }],
        description: [{ required: true, message: 'description is required', trigger: 'blur' }],
        start_time: [{ type: 'date', required: true, message: 'start_time is required', trigger: 'change' }],
        end_time: [{ type: 'date', required: true, message: 'end_time is required', trigger: 'change' }],
        status: [{ required: true, message: 'status is required', trigger: 'change' }],
        cnt: [{ required: true, message: 'cnt required', trigger: 'blur' }]
      },
      downloadLoading: false,
      disableEditNo: false,
      disableEditCnt: false
    }
  },
  computed: {
    textMap: function() {
      return {
        update: i18n.t('xxx.edit'),
        create: i18n.t('xxx.create')
      }
    },
    sortOptions: function() {
      return [{ label: i18n.t('xxx.ascending'), key: '+id' }, { label: i18n.t('xxx.descending'), key: '-id' }]
    }
  },
  created() {
    this.getList()
    // this.getGroupIdList()
  },
  methods: {
    getList() {
      this.listLoading = true
      fetchList(this.listQuery).then(response => {
        this.list = response.data.items
        this.total = response.data.total
        this.next_no = response.data.next_no
        this.listLoading = false
        // // Just to simulate the time of the request
        // setTimeout(() => {
        //   this.listLoading = false
        // }, 1.5 * 1000)
      })
    },
    getGroupIdList() {
      this.listLoading = true
      fetchGroupIdList({}).then(response => {
        this.group_list = response.data
        this.listLoading = false
      })
    },
    handleFilter() {
      this.listQuery.page = 1
      this.getList()
    },
    handleModifyStatus(row, status) {
      this.$confirm('此操作将切换账号状态, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        modifyAccountStatus({ id: row.id, status: status }).then(response => {
          if (response.code !== 20000) {
            this.$message({
              showClose: true,
              message: '操作出错了呢：' + response.msg,
              type: 'error',
              duration: 2000
            })
          } else {
            this.$notify({
              title: 'Success',
              message: '操作成功',
              type: 'success',
              duration: 2000
            })
            row.status = status
          }
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    sortChange(data) {
      const { prop, order } = data
      if (prop === 'id') {
        this.sortByID(order)
      }
    },
    sortByID(order) {
      if (order === 'ascending') {
        this.listQuery.sort = '+id'
      } else {
        this.listQuery.sort = '-id'
      }
      this.handleFilter()
    },
    resetTemp() {
      this.temp = {
        id: this.next_no,
        no: this.next_no,
        name: '',
        prize: '',
        rule: '',
        description: '',
        game_id: '',
        op_ids: '',
        status: 'published',
        start_time: new Date(),
        end_time: new Date(),
        cnt: 0
      }
    },
    handleCreate() {
      this.resetTemp()
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    createData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          const tempData = Object.assign({}, this.temp)
          tempData.start_time = parseTime(tempData.start_time)
          tempData.end_time = parseTime(tempData.end_time)
          tempData.cnt = parseInt(tempData.cnt)
          createAccount(tempData).then(() => {
            this.list.unshift(tempData)
            this.dialogFormVisible = false
            this.$notify({
              title: 'Success',
              message: 'Created Successfully',
              type: 'success',
              duration: 2000
            })
          })
        }
      })
    },
    handleUpdate(row) {
      this.temp = Object.assign({}, row) // copy obj
      this.temp.start_time = new Date(this.temp.start_time)
      this.temp.end_time = new Date(this.temp.end_time)
      this.dialogStatus = 'update'
      this.dialogFormVisible = true
      this.disableEditNo = true
      if (parseInt(this.temp.cnt) > 0) {
        this.disableEditCnt = true
      }
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    updateData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          const tempData = Object.assign({}, this.temp)
          tempData.start_time = parseTime(tempData.start_time)
          tempData.end_time = parseTime(tempData.end_time)
          tempData.cnt = parseInt(tempData.cnt)
          updateAccount(tempData).then(() => {
            const index = this.list.findIndex(v => v.id === this.temp.id)
            this.list.splice(index, 1, this.temp)
            this.dialogFormVisible = false
            this.disableEditNo = false
            this.disableEditCnt = false
            this.$notify({
              title: 'Success',
              message: 'Update Successfully',
              type: 'success',
              duration: 2000
            })
          })
        }
      })
    },
    handleDelete(row, index) {
      this.$confirm('此操作将永久删除该账号, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteAccount({ 'id': row.id }).then(response => {
          if (response.code !== 20000) {
            this.$message({
              showClose: true,
              message: '操作出错了呢：' + response.msg,
              type: 'error',
              duration: 2000
            })
          } else {
            this.$notify({
              title: 'Success',
              message: '删除成功',
              type: 'success',
              duration: 2000
            })
            this.list.splice(index, 1)
          }
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    handleExport(row) {
      this.downloadLoading = true
      import('@/vendor/Export2Excel').then(excel => {
        const tHeader = ['id', 'no', 'code', 'prize', 'rule', 'start_time', 'end_time']
        const data = []
        const codes = JSON.parse(row.codes)
        console.log(codes)
        for (let i = 0; i < codes.length; i++) {
          const code = codes[i]
          const item = [i + 1, row.no, code, row.prize, row.rule, row.start_time, row.end_time]
          data.push(item)
        }
        console.log(data)
        excel.export_json_to_excel({
          header: tHeader,
          data,
          filename: 'table_code_list_' + row.no
        })
        this.downloadLoading = false
      })
    },
    handleDownload() {
      this.downloadLoading = true
      import('@/vendor/Export2Excel').then(excel => {
        const tHeader = ['id', 'name', 'cnt', 'prize', 'rule', 'game_id', 'op_ids', 'description', 'start_time', 'end_time', 'create_time', 'status']
        for (let i = 0; i < tHeader.length; i++) {
          tHeader[i] = i18n.t('xxx.' + tHeader[i])
        }
        const filterVal = ['id', 'name', 'cnt', 'prize', 'rule', 'game_id', 'op_ids', 'description', 'start_time', 'end_time', 'create_time', 'status']
        const data = this.formatJson(filterVal)
        excel.export_json_to_excel({
          header: tHeader,
          data,
          filename: 'table-list'
        })
        this.downloadLoading = false
      })
    },
    formatJson(filterVal) {
      return this.list.map(v => filterVal.map(j => {
        if (j === 'create_time' || j === 'start_time' || j === 'end_time') {
          return parseTime(v[j])
        } else {
          return v[j]
        }
      }))
    },
    getSortClass: function(key) {
      const sort = this.listQuery.sort
      return sort === `+${key}` ? 'ascending' : 'descending'
    }
  }
}
</script>
