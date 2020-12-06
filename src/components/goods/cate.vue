<template>
  <div>
    <template>
      <div>
        <h3>商品分类</h3>
        <!-- 面包屑导航 -->
        <el-breadcrumb separator="/">
          <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
          <el-breadcrumb-item>商品管理</el-breadcrumb-item>
          <el-breadcrumb-item>商品分类</el-breadcrumb-item>
        </el-breadcrumb>
        <!-- 卡片视图区域 -->
        <el-card>
          <!-- 添加分类按钮区域 -->
          <el-row>
            <el-col>
              <el-button type="primary" @click="showAddCateDialog"
                >添加分类</el-button
              >
            </el-col>
          </el-row>
          <!-- 分类表格data(设置数据源) :columns(设置表格中列配置信息) :selection-type(是否有复选框):expand-type(是否展开数据) show-index(是否设置索引列) index-text(设置索引列头)border(是否添加纵向边框) :show-row-hover(是否鼠标悬停高亮) -->
          <tree-table
            class="treeTable"
            :data="cateList"
            :columns="columns"
            :selection-type="false"
            :expand-type="false"
            show-index
            index-text="#"
            border
            :show-row-hover="false"
          >
            <!-- 是否有效 -->
            <template slot="isok" slot-scope="scope">
              <i
                class="el-icon-success"
                v-if="scope.row.cat_deleted === false"
                style="color: lightgreen"
              ></i>
              <i class="el-icon-error" v-else style="color: red"></i>
            </template>
            <!-- 排序 -->
            <template slot="order" slot-scope="scope">
              <el-tag size="mini" v-if="scope.row.cat_level === 0">一级</el-tag>
              <el-tag
                type="success"
                size="mini"
                v-else-if="scope.row.cat_level === 1"
                >二级</el-tag
              >
              <el-tag type="warning" size="mini" v-else>三级</el-tag>
            </template>
            <!-- 操作 -->
            <template slot="opt">
              <el-button type="primary" icon="el-icon-edit" size="mini"
                >编辑</el-button
              >
              <el-button type="danger" icon="el-icon-delete" size="mini"
                >删除</el-button
              >
            </template>
          </tree-table>
          <!-- 分页 -->
          <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="queryInfo.pagenum"
            :page-sizes="[3, 5, 10, 15]"
            :page-size="queryInfo.pagesize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="total"
          >
          </el-pagination>
        </el-card>
        <!-- 添加分类对话框 -->
        <el-dialog
          title="添加分类"
          :visible.sync="addCateDialogVisible"
          width="50%"
        >
          <!-- 添加分类的表单 -->
          <el-form
            :model="addCateForm"
            :rules="addCateFormRules"
            ref="addCateFormRef"
            label-width="100px"
            class="demo-ruleForm"
          >
            <el-form-item label="分类名称:" prop="cat_name">
              <el-input v-model="addCateForm.cat_name"></el-input>
            </el-form-item>
            <el-form-item label="父级分类：">
              <!-- options: 指定数据源 -->
              <!-- props: 用来指定配置对象 -->
              <!-- change-on-select: 允许选择一级分类 -->
              <el-cascader
                expand-trigger="hover"
                :options="parentCateList"
                :props="cascaderProps"
                v-model="selectedKeys"
                @change="parentCateChanged"
              ></el-cascader>
            </el-form-item>
          </el-form>
          <span slot="footer" class="dialog-footer">
            <el-button @click="addCateDialogVisible = false">取 消</el-button>
            <el-button type="primary" @click="addCateDialogVisible = false"
              >确 定</el-button
            >
          </span>
        </el-dialog>
      </div>
    </template>
  </div>
</template>

<script>
export default {
  data() {
    return {
      //商品分类数据列表
      cateList: [],
      // 查询分类数据的条件
      queryInfo: {
        type: 3,
        pagenum: 1,
        pagesize: 5,
      },
      //保存总数据条数
      total: 0,
      //为table指定列的定义
      columns: [
        {
          label: '分类名称',
          prop: 'cat_name',
        },
        {
          label: '是否有效',
          // 将当前列定义为模板列
          type: 'template',
          // 当前列使用的模板名称
          template: 'isok',
        },
        {
          label: '排序',
          type: 'template',
          template: 'order',
        },
        {
          label: '操作',
          type: 'template',
          template: 'opt',
        },
      ],
      //控制添加分类弹出框的显示与隐藏
      addCateDialogVisible: false,
      //添加分类的表单数据对象
      addCateForm: {
        // 将要添加的分类名称
        cat_name: '',
        //父级分类的Id
        cat_pid: '',
        // 分类的等级，默认要添加的是1级分类
        cat_level: '',
      },
      // 添加分类表单的校验规则
      addCateFormRules: {
        cat_name: [
          { required: true, message: '请输入分类名称', trigger: 'blur' },
        ],
      },
      // 父级分类的列表
      parentCateList: [],
      //指定级联选择器的配置对象
      cascaderProps: {
        value: 'cat_id',
        label: 'cat_name',
        children: 'children',
      },
      //选中的父级分类的Id数组
      selectedKeys: [],
    }
  },
  created() {
    this.getCateList()
  },
  methods: {
    async getCateList() {
      //获取商品分类数据
      const { data: res } = await this.$http.get('categories', {
        params: this.queryInfo,
      })
      if (res.meta.status !== 200) {
        return this.$message.error('获取商品列表数据失败')
      }
      //将数据列表赋值给cateList
      this.cateList = res.data.result
      //保存总数据条数
      this.total = res.data.total
      // console.log(res.data)
    },
    //监听发pagesize改变
    handleSizeChange(newSize) {
      this.queryInfo.pagesize = newSize
      this.getCateList()
    },
    //监听pagenum改变
    handleCurrentChange(newPage) {
      this.queryInfo.pagenum = newPage
      this.getCateList()
    },
    // 点击按钮,展示添加分类的对话框
    showAddCateDialog() {
      //先获取父级分类的数据列表
      this.getParentCateList()
      //再展示出对话框
      this.addCateDialogVisible = true
    },
    //获取父级分类的数据列表
    async getParentCateList() {
      const { data: res } = await this.$http.get('categories', {
        params: { type: 2 },
      })
      if (res.meta.status !== 200) {
        return this.$message.error('获取数据失败!')
      }
      console.log(res.data)
      this.ParentCateList = res.data
    },
    // 选择项发生变化会触发的函数
    parentCateChanged() {
      // // 如果 selectedKeys 数组的 length 大于 0，证明选中了父级分类
      // if (this.selectedKeys.length > 0) {
      //   // 父级分类的 ID
      //   this.addCateForm.cat_pid = this.selectedKeys[
      //     this.selectedKeys.length - 1
      //   ]
      //   // 为当前分类的等级赋值
      //   this.addCateForm.cat_level = this.selectedKeys.length
      // } else {
      //   this.addCateForm.cat_pid = 0
      //   this.addCateForm.cat_level = 0
      // }
      console.log(this.selectedKeys)
    },
  },
}
</script>

<style lang="less" scoped>
.treeTable {
  margin-top: 15px;
}
</style>