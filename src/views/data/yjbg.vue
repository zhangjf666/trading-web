<template>
  <div class="app-container">
    <!--搜索栏-->
    <div class="head-container">
        <el-row :gutter="20">
            <el-col :span="16">
                <el-input
                    v-model="query.context"
                    clearable
                    size="large"
                    placeholder="搜索标题,股票代码,股票名称,研究员...."
                />
            </el-col>
            <el-col :span="8">
                <el-button type="primary" size="large" @click="searchData">查询</el-button>
            </el-col>
        </el-row>
        <el-collapse>
            <el-collapse-item>
                <span class="collapse-title" slot="title">分类查询</span>
                <div class="form-row check-type">
                    <label class="row-padding">研报分类</label>
                    <el-checkbox-group v-model="query.category">
                        <el-checkbox v-for="ybfl in ybflList" :label="ybfl.value" :key="ybfl.value">{{ybfl.name}}</el-checkbox>
                    </el-checkbox-group>
                </div>
                <div class="form-row">
                  <label class="row-padding">股票代码</label>
                  <el-input class="row-padding" v-model="query.stockCode" size="small" placeholder="股票代码" style="width: 120px;"/>
                  <label class="row-padding">股票名称</label>
                  <el-input class="row-padding" v-model="query.stockName" size="small" placeholder="股票名称" style="width: 120px;"/>
                  <label class="row-padding">研究员</label>
                  <el-input class="row-padding" v-model="query.researcher" size="small" placeholder="研究员" style="width: 200px;"/>
                </div>
                <div class="form-row">
                  <label class="row-padding">行业名称</label>
                  <el-input class="row-padding" v-model="query.industryName" size="small" placeholder="行业名称" style="width: 120px;"/>
                  <label class="row-padding">机构名称</label>
                  <el-input class="row-padding" v-model="query.orgName" size="small" placeholder="机构名称" style="width: 120px;"/>
                  <label class="row-padding">研报最小页数</label>
                  <el-input class="row-padding" v-model="query.minPage" size="small" placeholder="策略和宏观研报不填写" style="width: 200px;"/>
                </div>
                <div class="form-row">
                  <label class="row-padding">起止时间</label>
                  <el-date-picker
                    ref="picker"
                    v-model="query.betweenDate"
                    type="daterange"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期"
                    :default-time="['00:00:00', '23:59:59']"
                    :picker-options="pickerOptions"
                    value-format="yyyy-MM-dd"
                  />
                </div>
            </el-collapse-item>
        </el-collapse>
    </div>
    <div class="detail" v-if="data.length > 0">
        <div class="detail-item" v-for="(item,index) in data" :key="index">
          <el-descriptions :title="item.title" :column="3">
            <template slot="extra">
              <el-button type="primary" size="small"><a :href='item.download_url'>下载</a></el-button>
            </template>
            <el-descriptions-item label="研报分类">
              <el-tag :type="ybflTag(item.category)" size="small">{{showYbfl(item.category)}}</el-tag>
            </el-descriptions-item>
            <el-descriptions-item label="研报页数" v-if="item.category == '1' || item.category == '2'">{{item.page}}</el-descriptions-item>
            <el-descriptions-item label="发布时间">{{item.publish_date}}</el-descriptions-item>
            <el-descriptions-item label="股票名称" v-if="item.category == '1'">{{item.stock_name}}</el-descriptions-item>
            <el-descriptions-item label="股票代码" v-if="item.category == '1'">{{item.stock_code}}</el-descriptions-item>
            <el-descriptions-item label="研究员">{{item.researcher}}</el-descriptions-item>
            <el-descriptions-item label="行业名称" v-if="item.category == '1' || item.category == '2'">{{item.industry_name}}</el-descriptions-item>
            <el-descriptions-item label="机构名称">{{item.org_s_name}}</el-descriptions-item>
            <el-descriptions-item label="评级" v-if="item.category == '1' || item.category == '2'">{{item.s_rating_name}}</el-descriptions-item>
          </el-descriptions>
          <el-collapse>
            <el-collapse-item>
              <span class="collapse-title" slot="title">摘要</span>
              <div>{{item.summary}}</div>
            </el-collapse-item>
          </el-collapse>
        </div>
    </div>
    <div class="pagination">
        <el-pagination v-if="data.length > 0"
            background
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page.sync="pagination.page"
            :page-size="pagination.perPage"
            :page-count="pagination.pages"
            layout="prev, pager, next, jumper"
            :total="pagination.total">
        </el-pagination>
    </div>
  </div>
</template>

<script>
import { getYjbg } from "@/api/trading";
import util from "@/utils/my-utils"

export default {
  name: "InlineEditTable",
  data() {
    return {
      tableHeight: 500,
      tableOffsetTop: 0,
      tableHeader: [
        { label: "title", name:"标题" },
        { label: "stock_name", name:"股票名称" },
        { label: "stock_code", name:"股票代码" },
        { label: "page", name:"研报页数" },
        { label: "count", name:"近一月报告数量" },
        { label: "publish_date", name: "发布时间" },
        { label: "researcher", name: "研究员" },
        { label: "download_url", name: "下载链接" },
        { label: "org_s_name", name:"机构名称" },
        { label: "industry_name", name:"行业名称" },
        { label: "s_rating_name", name:"评级" },
        { label: "category", name: "研报分类" }
      ],
      ybflList: [
        { name: '个股研报', value: '1' },
        { name: '行业研报', value: '2' },
        { name: '策略研报', value: '3' },
        { name: '宏观研报', value: '4' }
      ],
      checkYbflAll: true,
      isIndeterminate: false,
      data: [],
      query: {
        context: "",
        stockName: "",
        stockCode: "",
        researcher: "",
        orgName: "",
        industryName: "",
        minPage: "",
        betweenDate: "",
        category: ['1', '2', '3', '4'],
        page: "",
        perPage: "10"
      },
      pagination:{
          total: 0,
          page: 1,
          pages: 1,
          perPage: 10
      },
      pickerOptions: {
          shortcuts: [{
            text: '最近一周',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
              picker.$emit('pick', [start, end]);
            }
          }, {
            text: '最近一个月',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
              picker.$emit('pick', [start, end]);
            }
          }, {
            text: '最近三个月',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
              picker.$emit('pick', [start, end]);
            }
          }]
        }
    };
  },
  mounted() {
    const start = new Date();
    start.setTime(start.getTime() - 3600 * 1000 * 24 * 365);
    this.query.betweenDate = [
      util.formatDate(start),
      util.formatDate(new Date()),
    ];
  },
  computed: {},
  methods: {
    searchData() {
      this.query.page = "1"
      this.queryData()
    },
    queryData() {
      var param = Object.assign({} ,this.query)
      param['beginDate'] = this.query.betweenDate[0]
      param['endDate'] = this.query.betweenDate[1]
      getYjbg(param, true).then((res) => {
        //分页数据
        this.pagination.total = res.data.total
        this.pagination.page = res.data.page
        this.pagination.pages = res.data.pages
        this.pagination.perPage = res.data.per_page
        this.data = res.data.items;
      });
    },
    headerStyle() {
      return {
        "background-color": "#66B1FF",
        color: "#FFFFFF",
        "border-bottom": "1px #409EFF solid",
      };
    },
    handleCurrentChange(page) {
        this.query.page = page
        this.queryData()
    },
    handleSizeChange(perPage) {
        this.query.perPage = perPage
        this.queryData()
    },
    showYbfl(val){
      for(var i = 0; this.ybflList.length; i++){
        if(this.ybflList[i].value === val){
          return this.ybflList[i].name
        }
      }
      return ""
    },
    ybflTag(val) {
        if(val === "1"){
          return ""
        } else if(val === "2"){
          return "success"
        }  else if(val === "3"){
          return "warning"
        }  else if(val === "4"){
          return "danger"
        }
    }
  },
};
</script>

<style lang="scss" scoped>
.line {
  text-align: center;
}
.form-row{
  padding: 5px 0px 5px 20px;
}
.row-padding {
  padding-right: 20px;
}
.check-type {
  display: flex;
  flex-direction: row;
  align-items: center;
  .check-all {
    display: flex;
    flex-direction: row;
    align-items: center;
    padding-right: 20px;
  }
}
.pagination {
    width: 60%;
    display: flex;
    padding: 5px;
    align-items: center;
}
.collapse-title {
    flex: 1 0 90%;
    order: 1;
}
::v-deep.el-collapse {
    border-bottom-color: transparent;
    border-top-color: transparent;
    .el-collapse-item__header {
        flex: 1 0 auto;
        order: -1;
        border-bottom-color: transparent;
    }
    .el-collapse-item__wrap {
        border-bottom-color: transparent;
    }
    .el-collapse-item__content {
        padding-bottom: 0px;
    }
}
.detail {
  display: flex;
  width: 60%;
  align-items: center;
  flex-direction: column;
  margin-left: 40px;
  .detail-item {
     display: flex;
     align-items: flex-start;
     flex-direction: column;
     border-top: 1px solid #e6ebf5;
     border-bottom: 1px solid #e6ebf5;
     padding: 5px 0px 5px 0px;
     margin-bottom: -1px;
  }
}
</style>
