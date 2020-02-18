import {Vue, Component, Watch} from 'vue-property-decorator';
import { OperationRecord, OperationRecordData, SUBJECT_CHOICES, SimpleUser } from '@/models/oneid';
import * as api from '@/services/oneid';
import './Oplog.less';


const pageSizeOpts = [10, 15, 20, 25, 30, 35, 40, 45, 50, 60, 80, 100];


const calcDefaultPageSize = (sizes: number[]) => {
  let index = 0;
  let count = (window.screen.height - 79 - 138 - (32+16)) / 41;
  for (let i=0; i<sizes.length; i++) {
    if (count <= sizes[i]) {
      index = i;
      break;
    }
  }
  if (index > 0) {
    const preDiff = count - sizes[index-1];
    const curDiff = sizes[index] - count;
    if (curDiff > preDiff) {
      index--;
    }
  }
  return sizes[index];
};


@Component({
  template: html`
    <div class="ui-admin-oplog flex-col flex-auto">
      <div v-if="recordList === null" class="loading">
        <Spin large></Spin>
      </div>
      <div v-else class="main flex-auto">
        <div class="table-wrapper">
          <div :class="\`table-filter-line-before\${!filterLine ? ' table-filter-line-before-hide' : ''}\`">
            <XIcon name="filter" size="13px">
          </div>
          <Table
            class="table"
            :data="tableData"
            :columns="columns"
            :row-class-name="rowClassName"
          />
        </div>
        <div class="page-wrapper">
          <Page
            v-if="recordList"
            class="page flex-row"
            :total="pagination.total"
            :page-size="pagination.pageSize"
            :page-size-opts="pagination.pageSizeOpts"
            @on-change="onPageChange"
            @on-page-size-change="onPageSizeChange"
            show-total
            show-sizer
            show-elevator
          >
          </Page>
        </div>
        <Modal
          v-model="showModal"
          className="record-detail"
          :closable="false"
          :maskClosable="true"
          width="800"
        >
          <div slot="header" class="header">
            <span>详细日志</span>
          </div>
          <div v-if="currentRecord" class="body">
            <div class="left">
              <div class="basic">
                <div class="flex-auto">
                  <span class="label">事件类型：</span>
                  <span class="content">{{currentRecord.subject}}</span>
                </div>
                <div class="flex-auto">
                  <span class="label">事件人：</span>
                  <span class="content">{{currentRecord.user.name}}</span>
                </div>
                <div class="flex-auto">
                  <span class="label">时间：</span>
                  <span class="content">{{currentRecord.created}}</span>
                </div>
              </div>
              <div class="summary">
                <div class="label">事件信息：</div>
                <div class="content">{{currentRecord.summary}}</div>
              </div>
              <div class="detail">
                <div class="label">详细日志：</div>
                <div class="content">{{currentRecord.detail}}</div>
              </div>
            </div>
            <div class="right">
            </div>
          </div>
          <div slot="footer" class="footer">
            <Button type="primary" @click="showModal = false" class="close">关闭</Button>
          </div>
        </Modal>
      </div>
    </div>
  `,
})
export default class Oplog extends Vue {
  recordList: OperationRecord[] | null = null;

  showModal: boolean = false;
  currentRecord: OperationRecord | null = null;

  pagination = {
    total: 0,
    page: 1,
    defaultPageSize: calcDefaultPageSize(pageSizeOpts),
    pageSize: calcDefaultPageSize(pageSizeOpts),
    pageSizeOpts: pageSizeOpts,
  };

  comps = {
    subject: {
      name: '事件类型',
      type: 'filter',
      width: 200,
      icon: 'f-funnel',
      show: false,
      closeWhenClick: false,
      filterMultiple: true,
      query: {
        items: Object.keys(SUBJECT_CHOICES).map(key => ({
          label: SUBJECT_CHOICES[key],
          value: key,
          selected: false,
          cache: false,
        })),
      },
    },
    user: {
      name: '事件人',
      type: 'search',
      width: 200,
      icon: 'f-magnifyingglass',
      show: false,
      closeWhenClick: false,
      query: {
        keyword: null,
        cache: null,
      },
    },
    created: {
      name: '时间',
      type: 'filter',
      width: 300,
      icon: 'f-funnel',
      show: false,
      closeWhenClick: true,
      filterMultiple: false,
      query: {
        selected: null,
        cache: null,
        items: [
          {
            label: '今天',
            value: '0',
          },
          {
            label: '一周以内',
            value: '7',
          },
          {
            label: '一个月以内',
            value: '30',
          },
          {
            label: '半年以内',
            value: '180',
          },
          {
            label: '一年以内',
            value: '365',
          },
        ],
      },
    },
    summary: {
      name: '事件信息',
      type: 'search',
      icon: 'f-magnifyingglass',
      show: false,
      closeWhenClick: false,
      query: {
        keyword: null,
        cache: null,
      },
    },
  };

  rowClassName(row: any, index: number) {
    return this.filterLine && index === 0 ? 'table-filter-row' : 'table-normal-row';
  }

  renderTableHeader(h: Function, type: string) {
    return h('div', {
      class: 'header-cell-wrapper',
    }, [
      h('div', {}, [h('span', {}, this.comps[type].name)]),
      h('Dropdown', {
        class: 'filter-dropdown',
        props: {
          transfer: true,
          visible: this.comps[type].show,
          trigger: 'custom',
          placement: 'bottom',
          transferClassName: 'filter-dropdown-transfer',
          stopPropagation: true,
        },
      }, [
        h('div', {
          style: {
            display: 'flex',
            alignItems: 'center',
            color: '#ED4013',
            fontSize: '12px',
          },
        }, [
          h('div', {
            on: {
              click: (evt: any) => {
                evt.stopPropagation();
                this.comps[type].show = !this.comps[type].show;
              },
            },
            class: `icon ${this.isActiveComp(type) ? 'icon-active' : ''} ${this.isFilledComp(type) ? 'icon-filled' : ''}`,
          }, [
            h('XIcon', {
              props: {
                name: this.comps[type].icon,
                size: '12px',
                inline: true,
              },
            }, ''),
          ]),
          ...(!(this.isFilledComp(type) && !this.isActiveComp(type)) ? [] : [
            h('span', {
              style: {
                marginLeft: '8px',
                cursor: 'pointer',
              },
              on: {
                click: () => {this.clearComp(type)},
              },
            }, '清空条件'),
          ]),
        ]),
        h('DropdownMenu', {
          slot: 'list',
          directives: [{
            name: 'click-outside',
            value: () => {
              this.comps[type].show = false;
              switch (this.comps[type].type) {
                case 'filter':
                  if (this.comps[type].filterMultiple) {
                    this.comps[type].query.items.forEach((x: any) => {
                      x.cache = x.selected;
                    });
                  }
                  break;
                case 'search':
                  this.comps[type].query.cache = this.comps[type].query.keyword;
                  break;
                default:
                  break;
              }
            },
          }],
        }, [
          this.comps[type].type === 'filter' ? (
            this.renderFilterDropdownMenu(h, type)
          ) : (
            this.renderSearchDropdownMenu(h, type)
          ),
        ]),
      ]),
    ]);
  }

  isFilledComp(type: string) {
    return this.comps[type].query.keyword ||
           this.comps[type].query.selected || (
             this.comps[type].query.items &&
             this.comps[type].query.items.filter(x=>x.selected).length
           );
  }

  isActiveComp(type: string) {
    return this.comps[type].show;
  }

  clearComp(type: string) {
    if (this.comps[type].query.keyword != undefined) {
      this.comps[type].query.keyword = null;
      this.comps[type].query.cache = null;
    } else if (this.comps[type].query.selected != undefined) {
      this.comps[type].query.selected = null;
      this.comps[type].query.cache = null;
    } else if (this.comps[type].query.items != undefined) {
      this.comps[type].query.items.forEach((x: any) => {x.selected = false; x.cache = false;});
    }
    this.$nextTick(() => {this.loadData();});
  }

  renderFilterDropdownMenu(h: Function, type: string) {
    return h('div', {}, [
      h('div', {
        style: {
          display: 'flex',
          justifyContent: 'space-between',
          height: '37px',
          width: '220px',
          borderBottom: '1px solid #0F0F0F',
          paddingTop: '3px',
          paddingLeft: '10px',
          paddingRight: '6px',
        },
      }, [
        h('div', {
          style: {
            fontSize: '12px',
            color: '#CDCDCD',
          },
        }, '筛选：'),
        this.comps[type].filterMultiple ? h('div', {
          style: {
            display: 'flex',
          },
        }, [
          h('div', {
            style: {
              width: '40px',
              height: '17px',
              fontSize: '12px',
              color: '#ED4013',
              backgroundColor: '#2A2A2A',
              border: '0',
              display: 'flex',
              cursor: 'pointer',
            },
          }, [
            h('span', {
              style: {
                margin: 'auto',
              },
              on: {
                click: () => {
                  this.clearComp(type);
                  this.$nextTick(() => {
                    this.comps[type].show = false;
                    this.$nextTick(() => {
                      this.loadData();
                    });
                  });
                },
              },
            }, '清空')
          ]),
          h('div', {
            style: {
              display: 'flex',
              width: '40px',
              height: '17px',
              fontSize: '12px',
              color: '#FFFFFF',
              backgroundColor: '#006064',
              border: '0',
              borderRadius: '2px',
              cursor: 'pointer',
            },
          }, [
            h('span', {
              style: {
                margin: 'auto',
              },
              on: {
                click: () => {
                  this.comps[type].show = false;
                  if (this.comps[type].filterMultiple) {
                    this.comps[type].query.items.forEach((x: any) => {
                      x.selected = x.cache;
                    });
                  }
                  this.$nextTick(() => {
                    this.loadData();
                  });
                },
              },
            }, '确定')
          ]),
        ]): null,
      ]),
      h('div',{
        class: 'dropdown-body',
      }, [
        ...this.comps[type].query.items.map(x => (
          h('DropdownItem', {}, [
            h('div', {
              style: {
                display: 'flex',
                alignItems: 'center',
              },
              on: {
                click: () => {
                  if (this.comps[type].filterMultiple) {
                    x.cache = !x.cache;
                  } else {
                    this.comps[type].query.selected = x.value;
                    if (this.comps[type].closeWhenClick) {
                      this.$nextTick(() => {this.comps[type].show = false;});
                    }
                    this.$nextTick(() => {this.loadData();});
                  }
                },
              },
            }, this.comps[type].filterMultiple ? [
              h('Checkbox', {
                props: {
                  value: x.cache,
                },
              }, ''),
              h('div', {
                style: {
                  marginLeft: '2px',
                },
              }, x.label),
            ] : [
              h('Radio', {
                props: {
                  value: x.value === this.comps[type].query.selected,
                },
              }, [
                h('span', {
                  style: {
                    marginLeft: '5px',
                  },
                }, x.label),
              ]),
            ]),
          ])
        )),
      ]),
    ]);
  }

  renderSearchDropdownMenu(h: Function, type: string) {
    return h('div', {}, [
      h('div', {
        style: {
          display: 'flex',
          justifyContent: 'space-between',
          height: '37px',
          width: '220px',
          borderBottom: '0px solid #0F0F0F',
          paddingTop: '3px',
          paddingLeft: '10px',
          paddingRight: '6px',
        },
      }, [
        h('div', {
          style: {
            fontSize: '12px',
            color: '#CDCDCD',
          },
        }, `输入 ${this.comps[type].name} 以搜索`),
        h('div', {
          style: {
            display: 'flex',
          },
        }, [
          h('div', {
            style: {
              width: '40px',
              height: '17px',
              fontSize: '12px',
              color: '#ED4013',
              backgroundColor: '#2A2A2A',
              border: '0',
              display: 'flex',
              cursor: 'pointer',
            },
          }, [
            h('span', {
              style: {
                margin: 'auto',
              },
              on: {
                click: () => {
                  this.comps[type].show = false;
                  this.comps[type].query.cache = this.comps[type].query.keyword;
                },
              },
            }, '取消')
          ]),
          h('div', {
            style: {
              display: 'flex',
              width: '40px',
              height: '17px',
              fontSize: '12px',
              color: '#FFFFFF',
              backgroundColor: '#006064',
              border: '0',
              borderRadius: '2px',
              cursor: 'pointer',
            },
          }, [
            h('span', {
              style: {
                margin: 'auto',
              },
              on: {
                click: () => {
                  this.comps[type].show = false;
                  if (this.comps[type].query.cache != null) {
                    this.comps[type].query.keyword = this.comps[type].query.cache;
                  }
                  this.$nextTick(() => {
                    this.loadData();
                  });
                },
              },
            }, '确定')
          ]),
        ]),
      ]),
      h('div',{
        style: {
          paddingLeft: '10px',
          paddingRight: '10px',
          paddingBottom: '7px',
        },
      }, [
        h('Input', {
          on: {
            'on-change': (evt: Event) => {
              this.comps[type].query.cache = evt.target.value;
            },
          },
          class: 'search-input',
          props: {
            type: 'text',
            placeholder: `输入${this.comps[type].name}`,
            clearable: false,
            value: this.comps[type].query.cache,
            autofocus: true,
          },
        }, [
          h('XIcon', {
            slot: 'suffix',
            props: {
              name: 'search-cancel',
              md: true,
            },
            style: {
              display: !this.comps[type].query.cache ? 'none' : '',
            },
            on: {
              click: () => {
                this.comps[type].query.cache = null;
              },
            },
          }, ''),
        ]),
      ]),
    ]);
  }

  get columns() {
    return [
      {
        width: this.comps.subject.width,
        renderHeader: (h: Function, params: any) => {
          return this.renderTableHeader(h, 'subject');
        },
        render: (h: Function, params: any) => {
          return h('div', this.tableData![params.index].subject)
        },
      },
      {
        width: this.comps.user.width,
        renderHeader: (h: Function, params: any) => {
          return this.renderTableHeader(h, 'user');
        },
        render: (h: Function, params: any) => {
          return h('div', (this.tableData![params.index].user)!.name);
        },
      },
      {
        width: this.comps.created.width,
        renderHeader: (h: Function, params: any) => {
          return this.renderTableHeader(h, 'created');
        },
        render: (h: Function, params: any) => {
          return h('div', this.tableData![params.index].created)
        },
      },
      {
        renderHeader: (h: Function, params: any) => {
          return this.renderTableHeader(h, 'summary');
        },
        render: (h: Function, params: any) => {
          return h('div', this.tableData![params.index].summary);
        },
      },
      {
        title: ' ',
        width: 150,
        render: (h: Function, params: any) => {
          return this.filterLine && params.index === 0 ? null : h('div', {
            on: {
              click: () => {
                this.viewRecordDetail(this.tableData![params.index].uuid);
              },
            },
            style: {
              color: '#006064',
              cursor: 'pointer',
            },
          }, '查看详细日志');
        },
      },
    ];
  }

  get filterLine() {
    if (!this.recordList || !this.recordList.length) {
      return null;
    }

    const subject = this.comps.subject.query.items.filter(x => x.selected).map(x => x.label).join('，');
    const user = this.comps.user.query.keyword;
    const created = this.comps.created.query.items.filter(x => x.value === this.comps.created.query.selected).map(x => x.label).join('');
    const summary = this.comps.summary.query.keyword;

    if (subject || user || created || summary) {
      return OperationRecord.fromData({
        subject: subject || '空',
        user: SimpleUser.fromData({name: user || '空'}),
        created: created || '空',
        summary: summary || '空',
      });
    }

    return null;
  }

  get tableData() {
    if (this.filterLine === null) {
      return this.recordList;
    }
    return [this.filterLine, ...this.recordList];
  }

  async loadData() {
    const {results: recordList, count} = await api.OperationRecord.list(await this.$app.org(), {
      page: this.pagination.page,
      pageSize: this.pagination.pageSize,
      subjects: this.comps.subject.query.items.filter(x => x.selected).map(x => x.value),
      user: this.comps.user.query.keyword,
      days: this.comps.created.query.selected,
      summary: this.comps.summary.query.keyword,
    });
    this.recordList = recordList.map((record: OperationRecordData) => OperationRecord.fromData(record));
    this.pagination.total = count;
  }

  mounted() {
    this.loadData();
  }

  onPageChange(page: number) {
    this.pagination.page = page;
    this.loadData();
  }

  onPageSizeChange(pageSize: number) {
    if (pageSize === this.pagination.pageSize) {
      return;
    }
    this.pagination = {...this.pagination, pageSize};
    this.loadData();
  }

  async viewRecordDetail(id: string) {
    const record = await api.OperationRecord.getRecordWithDetail(await this.$app.org(), id);
    this.currentRecord =  OperationRecord.fromData(record);
    this.showModal = true;
  }
}
