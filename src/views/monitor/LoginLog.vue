<template>
  <el-card>
    <!-- 条件搜索 -->
    <el-form :model="queryParams" :inline="true">
      <el-form-item label="用户名称" prop="userame">
        <el-input placeholder="请输入用户名称" clearable size="mini" v-model="queryParams.username" @keyup.enter.native="handleQuery"></el-input>
      </el-form-item>
      <el-form-item label="登录状态" prop="loginStatus">
        <el-select v-model="queryParams.loginStatus" size="mini" placeholder="请选择登录状态">
          <el-option v-for="item in loginStatusList" :key="item.value" :label="item.label" :value="item.value"> </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="开始时间" prop="beginTime">
        <el-date-picker class="input-width" size="mini" type="date" style="width: 190px" value-format="yyyy-MM-dd" placeholder="请选择开始时间" v-model="queryParams.beginTime"></el-date-picker>
      </el-form-item>
      <el-form-item label="结束时间" prop="endTime">
        <el-date-picker class="input-width" size="mini" type="date" style="width: 190px" value-format="yyyy-MM-dd" placeholder="请选择结束时间" v-model="queryParams.endTime"></el-date-picker>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
        <el-button type="primary" icon="el-icon-refresh" size="mini" @click="handleReset">重置</el-button>
      </el-form-item>
    </el-form>
    <!-- 操作按钮 -->
    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button plain type="danger" icon="el-icon-delete" size="mini" :disabled="multiple" @click="batchHandleDelete">删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button plain type="danger" icon="el-icon-delete" size="mini" @click="handleClean">清空</el-button>
      </el-col>
    </el-row>

    <!-- 列表 -->
    <el-table border stripe style="width: 100%" :header-cell-style="{ background: '#eef1f6', color: '#606266' }" v-loading="loading" :data="sysLoginInfoList" @selection-change="handleSelectionChange">
      <el-table-column type="selection"></el-table-column>
      <el-table-column label="ID" v-if="false" prop="id" />
      <el-table-column label="用户账号" prop="username" />
      <el-table-column label="登录IP地址" prop="ipAddress" />
      <el-table-column label="登录地点" prop="loginLocation" />
      <el-table-column label="浏览器类型" prop="brower" />
      <el-table-column label="操作系统" prop="os" />
      <el-table-column label="登录状态" prop="loginStatus">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.loginStatus === 1" type="success">成功</el-tag>
          <el-tag v-else-if="scope.row.loginStatus === 2" type="danger">失败</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="提示信息" prop="message" />
      <el-table-column label="访问时间" prop="loginTime" />
      <el-table-column label="更多操作">
        <template slot-scope="scope">
          <el-button type="text" size="small" icon="el-icon-delete" @click="handleDelete(scope.row.id)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="queryParams.pageNum"
      :page-sizes="[20, 40, 80, 100]"
      :page-size="queryParams.pageSize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total"
    >
    </el-pagination>
  </el-card>
</template>

<script>
export default {
  // eslint-disable-next-line vue/multi-word-component-names
  name: 'LoginLog',
  data() {
    return {
      queryParams: {},
      loginStatusList: [
        { value: '1', label: '成功' },
        { value: '2', label: '失败' },
      ],
      loading: true,
sysLoginInfoList: [],
      ids: [],
      single: true,
      multiple: true,
      total:0
    }
  },
  watch: {},
  computed: {},
  methods: {
    // 获取列表
    async getLoginInfoList() {
      this.loading = true

      const { data: res } = await this.$api.querySysLoginInfoList(this.queryParams)

      console.log(res)
      this.sysLoginInfoList = res.data.list
      this.total = res.data.total
      this.loading = false
    },
    // 搜索
    handleQuery() {
      this.queryParams.pageNum = 1;
      this.getLoginInfoList()
    },
    // 重置
    handleReset() {
      this.queryParams = {}
      this.getLoginInfoList()
      this.$message.success('重置成功')
    },
    // 页面size变化
    handleSizeChange(newSize) {
      this.queryParams.pageSize = newSize
      this.getLoginInfoList()
    },
    // 页面变化
    handleCurrentChange(newPage) {
      this.queryParams.pageNum = newPage
      this.getLoginInfoList()
    },

    // 删除岗位
    async handleDelete(id) {
      const confirmResult = await this.$confirm('是否确认删除日志编号为"' + id + '"的数据项？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }).catch(err => err)
      if (confirmResult != 'confirm') {
        return this.$message.info('已取消删除')
      }
      const { data: res } = await this.$api.deleteSysLoginInfo(id)
      this.$message.success('删除成功')
      await this.getLoginInfoList()
    },
    // 批量删除
    async batchHandleDelete() {
      const loginInfoIds = this.Ids
      const confirmResult = await this.$confirm('是否删除日志编号为"' + loginInfoIds + '"的数据项？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }).catch(err => err)
      if (confirmResult != 'confirm') {
        return this.$message.info('已取消批量删除')
      }
      await this.$api.batchDeleteSysLoginInfo(loginInfoIds)
      this.$message.success('批量删除成功')
      await this.getLoginInfoList()
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.Ids = selection.map(item => item.id)
      this.single = selection.length != 1
      this.multiple = !selection.length
    },
    // 清空日志
    async handleClean() {
      const confirmResult = await this.$confirm('是否清空登录日志?','提示',{
        confirmButtonText:'确定',
        cancelButtonText:'取消',
        type:"warning"
      }).catch(err=>err)
      if(confirmResult !='confirm'){
        return this.$message.info('已取消')
      }
      await this.$api.cleanSysLoginInfo()
      this.$message.success('清空成功')
await this.getLoginInfoList()
    }
  },
  created() {
    this.getLoginInfoList()
  },
  mounted() {},
}
</script>

<style lang="less" scoped></style>
