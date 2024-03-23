<template>
  <el-card>
    <!-- 条件搜索 -->
    <el-form :model="queryParams" :inline="true">
      <el-form-item label="岗位名称" prop="postName">
        <el-input placeholder="请输入岗位名称" clearable size="mini" v-model="queryParams.postName"></el-input>
      </el-form-item>
      <el-form-item label="岗位状态" prop="postStatus">
        <el-select v-model="queryParams.postStatus" size="mini" placeholder="请选择岗位状态">
          <el-option v-for="item in postStatusList" :key="item.value" :label="item.label" :value="item.value"> </el-option>
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
        <el-button plain type="primary" icon="el-icon-plus" size="mini" @click="addPostDialogVisible = true">新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button plain type="danger" icon="el-icon-delete" size="mini" :disabled="multiple" @click="batchHandleDelete">删除</el-button>
      </el-col>
    </el-row>

    <!-- 列表 -->
    <el-table border stripe style="width: 100%" :header-cell-style="{ background: '#eef1f6', color: '#606266' }" v-loading="loading" :data="postList" @selection-change="handleSelectionChange">
      <el-table-column type="selection"></el-table-column>
      <el-table-column label="ID" v-if="false" prop="id" />
      <el-table-column label="岗位名称" prop="postName" />
      <el-table-column label="岗位编码" prop="postCode" />
      <el-table-column label="岗位状态" prop="postStatus">
        <template slot-scope="scope">
          <el-switch
            v-model="scope.row.postStatus"
            :active-value="1"
            :inactive-value="2"
            active-color="#13ce66"
            inactive-color="#f5222d"
            active-text="启用"
            inactive-text="停用"
            @change="postUpdateStatus(scope.row)"
          >
          </el-switch>
        </template>
      </el-table-column>
      <el-table-column label="创建时间" prop="createTime" />
      <el-table-column label="描述" prop="remark" />
      <el-table-column label="更多操作">
        <template slot-scope="scope">
          <el-button type="text" size="small" icon="el-icon-edit" @click="handleUpdate(scope.row.id)">编辑</el-button>
          <el-button type="text" size="small" icon="el-icon-delete" @click="handleDelete(scope.row)">删除</el-button>
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
    <!-- 新增对话框 -->
    <el-dialog title="新增岗位" :visible.sync="addPostDialogVisible" width="30%" @close="addPostDialogClosed">
      <el-form :model="addPostForm" ref="addPostFormRef" :rules="addPostFormRules" label-width="80px">
        <el-form-item label="岗位名称" prop="postName">
          <el-input v-model="addPostForm.postName" placeholder="请输入岗位名称" clearable></el-input>
        </el-form-item>
        <el-form-item label="岗位编码" prop="postCode">
          <el-input v-model="addPostForm.postCode" placeholder="请输入岗位编码" clearable></el-input>
        </el-form-item>
        <el-form-item label="岗位状态" prop="postStatus">
          <el-radio-group v-model="addPostForm.postStatus">
            <el-radio :label="1"> 启用 </el-radio>
            <el-radio :label="2"> 停用 </el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="岗位描述" prop="remark">
          <el-input v-model="addPostForm.remark" placeholder="请输入岗位描述" size="normal" clearable></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="addPost">确定</el-button>
        <el-button type="primary" @click="addPostDialogVisible = false">取消</el-button>
      </span>
    </el-dialog>

    <!-- 编辑对话框 -->
    <el-dialog title="编辑岗位" :visible.sync="editPostDialogVisible" width="30%" @close="editPostDialogClosed">
      <el-form :model="editPostForm" ref="editPostFormRef" :rules="editPostFormRules" label-width="80px">
        <el-form-item label="岗位名称" prop="postName">
          <el-input v-model="editPostForm.postName" placeholder="请输入岗位名称" clearable></el-input>
        </el-form-item>
        <el-form-item label="岗位编码" prop="postCode">
          <el-input v-model="editPostForm.postCode" placeholder="请输入岗位编码" clearable></el-input>
        </el-form-item>
        <el-form-item label="岗位状态" prop="postStatus">
          <el-radio-group v-model="editPostForm.postStatus">
            <el-radio :label="1"> 启用 </el-radio>
            <el-radio :label="2"> 停用 </el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="岗位描述" prop="remark">
          <el-input v-model="editPostForm.remark" placeholder="请输入岗位描述" size="normal" clearable></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="editPost">编辑</el-button>
        <el-button type="primary" @click="editPostDialogVisible = false">取消</el-button>
      </span>
    </el-dialog>
  </el-card>
</template>

<script>
export default {
  // eslint-disable-next-line vue/multi-word-component-names
  name: 'Role',
  data() {
    return {
      queryParams: {},
      postStatusList: [
        { value: '1', label: '启用' },
        { value: '2', label: '停用' },
      ],
      loading: true,
      postList: [],
      total: 0,
      addPostDialogVisible: false,
      addPostFormRules: {
        postName: [{ required: true, message: '请输入岗位名称', trigger: 'blur' }],
        postCode: [{ required: true, message: '请输入岗位标识', trigger: 'blur' }],
        postStatus: [{ required: true, message: '请输入岗位状态', trigger: 'blur' }],
      },
      addPostForm: {
        postName: '',
        postCode: '',
        postStatus: 1,
        remark: '',
      },
      editPostDialogVisible: false,
      editPostFormRules: {
        postName: [{ required: true, message: '请输入岗位名称', trigger: 'blur' }],
        postCode: [{ required: true, message: '请输入岗位标识', trigger: 'blur' }],
        postStatus: [{ required: true, message: '请输入岗位状态', trigger: 'blur' }],
      },
      editPostForm: {},
      ids: [],
      single: true,
      multiple: true,
    }
  },
  watch: {},
  computed: {},
  methods: {
    // 获取列表
    async getPostList() {
      this.loading = true

      const { data: res } = await this.$api.queryPostList(this.queryParams)

      console.log(res)
      this.postList = res.data.list
      this.total = res.data.total
      this.loading = false
    },
    // 搜索
    handleQuery() {
      this.queryParams.pageNum = 1;
      this.getPostList()
    },
    // 重置
    handleReset() {
      this.queryParams = {}
      this.getPostList()
      this.$message.success('重置成功')
    },
    // 页面size变化
    handleSizeChange(newSize) {
      this.queryParams.pageSize = newSize
      this.getPostList()
    },
    // 页面变化
    handleCurrentChange(newPage) {
      this.queryParams.pageNum = newPage
      this.getPostList()
    },
    // 修改状态
    async postUpdateStatus(row) {
      let text = row.postStatus == 2 ? '停用' : '启用'
      const confirmResult = await this.$confirm('确认要' + text + '"' + row.postName + '"岗位吗?', '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }).catch(err => err)
      if (confirmResult != 'confirm') {
        await this.getPostList()
        return this.$message.info('已取消修改')
      }
      await this.$api.updatePostStatus(row.id, row.postStatus)
      await this.getPostList()
      return this.$message.success(text + '成功')
    },
    // 新建对话框关闭事件
    addPostDialogClosed() {
      this.$refs.addPostFormRef.resetFields()
    },
    // 新增操作
    addPost() {
      this.$refs.addPostFormRef.validate(async valid => {
        if (!valid) return
        const { data: res } = await this.$api.addPost(this.addPostForm)
        this.$message.success('新增岗位成功')
        this.addPostDialogVisible = false
        this.getPostList()
      })
    },
    // 编辑更新岗位
    async handleUpdate(id) {
      const { data: res } = await this.$api.postInfo(id)
      this.editPostForm = res.data
      this.editPostDialogVisible = true
    },
    // 编辑对话框关闭事件
    editPostDialogClosed() {
      this.$refs.editPostFormRef.resetFields()
    },
    // 修改岗位
    editPost() {
      this.$refs.editPostFormRef.validate(async valid => {
        if (!valid) return
        const { data: res } = await this.$api.updatePost(this.editPostForm)
        this.$message.success('修改岗位成功')
        this.editPostDialogVisible = false
        this.getPostList()
      })
    },
    // 删除岗位
    async handleDelete(row) {
      const confirmResult = await this.$confirm('是否确认删除岗位编码为"' + row.postCode + '"的数据项？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }).catch(err => err)
      if (confirmResult != 'confirm') {
        return this.$message.info('已取消删除')
      }
      const { data: res } = await this.$api.deleteSysPost(row.id)
      this.$message.success('删除成功')
      await this.getPostList()
    },
    // 批量删除
    async batchHandleDelete() {
      const postIds = this.Ids
      const confirmResult = await this.$confirm('是否删除岗位编号为"' + postIds + '"的数据项？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }).catch(err => err)
      if (confirmResult != 'confirm') {
        return this.$message.info('已取消批量删除')
      }
      await this.$api.batchDeleteSysPost(postIds)
      this.$message.success('批量删除成功')
      await this.getPostList()
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.Ids = selection.map(item => item.id)
      this.single = selection.length != 1
      this.multiple = !selection.length
    },
  },
  created() {
    this.getPostList()
  },
  mounted() {},
}
</script>

<style lang="less" scoped></style>
