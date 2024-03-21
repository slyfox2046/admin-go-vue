<template>
  <el-card>
    <!-- 条件搜索 -->
    <el-form :model="queryParams" :inline="true">
      <el-form-item label="部门名称" prop="deptName">
        <el-input placeholder="请输入部门名称" clearable size="mini" v-model="queryParams.deptName" @keyup.enter.native="handleQuery"></el-input>
      </el-form-item>
      <el-form-item label="部门状态" prop="deptStatus">
        <el-select v-model="queryParams.deptStatus" size="mini" placeholder="请选择部门状态">
          <el-option v-for="item in deptStatusList" :key="item.value" :label="item.label" :value="item.value"> </el-option>
        </el-select>
      </el-form-item>

      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
        <el-button type="primary" icon="el-icon-refresh" size="mini" @click="handleReset">重置</el-button>
      </el-form-item>
    </el-form>
    <!-- 操作按钮 -->
    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button plain type="primary" icon="el-icon-plus" size="mini" @click="handleAdd">新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button plain type="info" icon="el-icon-sort" size="mini" @click="toggleExpandAll">展开/折叠</el-button>
      </el-col>
    </el-row>

    <!-- 列表 -->
    <el-table
      border
      stripe
      style="width: 100%"
      :header-cell-style="{ background: '#eef1f6', color: '#606266' }"
      v-loading="loading"
      :data="deptList"
      v-if="refreshTable"
      row-key="id"
      :default-expand-all="isExpandAll"
    >
      <el-table-column label="ID" v-if="false" prop="id" />
      <el-table-column label="部门名称" prop="deptName" />
      <el-table-column label="部门类型" prop="deptType">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.deptType === 1" type="">公司</el-tag>
          <el-tag v-else-if="scope.row.deptType === 2" type="success">中心</el-tag>
          <el-tag v-else-if="scope.row.deptType === 3" type="danger">部门</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="部门状态" prop="deptStatus">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.deptStatus === 1" type="success">正常</el-tag>
          <el-tag v-else-if="scope.row.deptStatus === 2" type="danger">停用</el-tag>
        </template>
      </el-table-column>

      <el-table-column label="更多操作">
        <template slot-scope="scope">
          <el-button type="text" size="small" icon="el-icon-edit" @click="handleUpdate(scope.row)">编辑</el-button>
          <el-button type="text" size="small" icon="el-icon-delete" @click="handleDelete(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 添加或修改岗位对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="600px" append-to-body @close="dialogClose">
      <el-form ref="resRef" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="部门类型" prop="deptType">
          <el-radio-group v-model="form.deptType">
            <el-radio :label="1"> 公司 </el-radio>
            <el-radio :label="2"> 中心 </el-radio>
            <el-radio :label="3"> 部门 </el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="上级部门" prop="parentId">
          <treeselect v-model="form.parentId" :options="deptOptions" placeholder="选择上级部门" />
        </el-form-item>
        <el-form-item label="部门名称" prop="deptName">
          <el-input v-model="form.deptName" placeholder="请输入部门名称" />
        </el-form-item>
        <el-form-item label="部门状态" prop="deptStatus">
          <el-radio-group v-model="form.deptStatus">
            <el-radio :label="1"> 正常</el-radio>
            <el-radio :label="2"> 停用 </el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="cancel">取 消</el-button>
          <el-button type="primary" @click="submitForm">确 定</el-button>
        </div>
      </template>
    </el-dialog>
  </el-card>
</template>

<script>
// https://gitee.com/y_project/RuoYi-Vue/blob/master/ruoyi-ui/src/views/system/dept/index.vue
import Treeselect from '@riophae/vue-treeselect'
import '@riophae/vue-treeselect/dist/vue-treeselect.css'
export default {
  // eslint-disable-next-line vue/multi-word-component-names
  name: 'Dept',
  components: { Treeselect },
  data() {
    return {
      deptStatusList: [
        { value: 2, label: '停用' },
        { value: 1, label: '启用' },
      ],
      queryParams: {},
      refreshTable: true,
      isExpandAll: true,
      deptList: [],
      loading: true,
      //
      // 部门树选项
      deptOptions: [],
      // 弹出层标题
      title: '',
      // 是否显示弹出层
      open: false,
      // 表单参数
      form: {},
      rules: {
        parentId: [{ required: true, message: '上级部门不能为空', trigger: 'blur' }],
        deptName: [{ required: true, message: '部门名称不能为空', trigger: 'blur' }],
        deptType: [{ required: true, message: '部门类型不能为空', trigger: 'blur' }],
        deptStatus: [{ required: true, message: '部门状态不能为空', trigger: 'blur' }],
      },
    }
  },
  watch: {},
  computed: {},
  methods: {
    // 获取列表
    async getDeptList() {
      this.loading = true

      const { data: res } = await this.$api.queryDeptList(this.queryParams)
      this.deptList = this.$handleTree.handleTree(res.data, 'id')
      this.loading = false
    },
    // 搜索
    handleQuery() {
      this.getDeptList()
    },
    // 重置
    handleReset() {
      this.queryParams = {}
      this.getPostList()
      this.$message.success('重置成功')
    },
    // 展开折叠
    toggleExpandAll() {
      this.refreshTable = false
      this.isExpandAll = !this.isExpandAll
      this.$nextTick(() => {
        this.refreshTable = true
      })
    },
    //
    // 表单重置
    reset() {
      this.form = {
        deptType: 1,
        id: undefined,
        parentId: undefined,
        deptName: undefined,
        deptStatus: 1,
      }
      // this.resetForm('form')
    },
    /** 新增按钮操作 */
    async handleAdd(row) {
      this.reset()
      if (row != undefined) {
        this.form.parentId = row.id
      }
      this.title = '添加部门'
      this.open = true
      const res = await this.$api.querySysDeptVoList()
      console.log('🚀 ~ handleAdd ~ res:', res)
      this.deptOptions = this.$handleTree.handleTree(res.data.data)
    },

    /** 修改按钮操作 */
    async handleUpdate(row) {
      this.reset()
      const res = await this.$api.deptInfo(row.id)
      console.log('🚀 ~ handleUpdate ~ res:', res)
      this.form = res.data.data
      this.open = true
      this.title = '修改部门'
      const dept = await this.$api.querySysDeptVoList()
      this.deptOptions = this.$handleTree.handleTree(dept.data.data)
      // getDept(row.id).then(response => {
      //   this.form = response.data;
      //   this.open = true;
      //   this.title = "修改部门";
      //   listDeptExcludeChild(row.id).then(response => {
      //     this.deptOptions = this.handleTree(response.data, "id");
      //     if (this.deptOptions.length == 0) {
      //       const noResultsOptions = { id: this.form.parentId, deptName: this.form.parentName, children: [] };
      //       this.deptOptions.push(noResultsOptions);
      //     }
      //   });
      // });
    },

    //
    submitForm() {
      this.$refs.resRef.validate(async valid => {
        if (!valid) return
        console.log(this.form)
        if (this.form.id != undefined) {
          // 修改
          await this.$api.deptUpdate(this.form)
          this.$message.success('修改岗位成功')
        } else {
          // 新建
          await this.$api.addDept(this.form)
          this.$message.success('新增岗位成功')
        }

        this.open = false
        this.handleQuery()
      })
    },
    cancel() {
      this.open = false
      this.reset()
    },
    /** 删除按钮操作 */
    async handleDelete(row) {
      const confirmResult = await this.$confirm('是否确认删除部门为"' + row.deptName + '"的数据项？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }).catch(err => err)
      if (confirmResult != 'confirm') {
        return this.$message.info('已取消删除')
      }
      console.log('🚀 ~ handleDelete ~ row.id:', row.id)
      await this.$api.deleteDept(row.id)
      this.$message.success('删除成功')
      await this.handleQuery()
    },
    dialogClose() {
      this.$refs.resRef.resetFields()
    },
  },
  created() {
    this.getDeptList()
  },
  mounted() {},
}
</script>

<style scoped></style>
