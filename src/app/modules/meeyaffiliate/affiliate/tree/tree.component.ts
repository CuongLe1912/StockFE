import * as _ from "lodash";
import { Location } from '@angular/common';
import { MAFAffiliateService } from '../affiliate.service';
import { Component, OnInit, ViewChild } from '@angular/core';
import { AppConfig } from '../../../../_core/helpers/app.config';
import { validation } from '../../../../_core/decorators/validator';
import { ResultApi } from '../../../../_core/domains/data/result.api';
import { TableData } from '../../../../_core/domains/data/table.data';
import { ToastrHelper } from "../../../../_core/helpers/toastr.helper";
import { OptionItem } from '../../../../_core/domains/data/option.item';
import { ActionData } from '../../../../_core/domains/data/action.data';
import { MoreActionData } from '../../../../_core/domains/data/grid.data';
import { ConstantHelper } from '../../../../_core/helpers/constant.helper';
import { UtilityExHelper } from "../../../../_core/helpers/utility.helper";
import { CompareType } from '../../../../_core/domains/enums/compare.type';
import { MAFAddTreeComponent } from './components/add.tree/add.tree.component';
import { MAFAddNodeComponent } from "../components/add.node/add.node.component";
import { ModalSizeType } from '../../../../_core/domains/enums/modal.size.type';
import { EditComponent } from '../../../../_core/components/edit/edit.component';
import { NavigationStateData } from '../../../../_core/domains/data/navigation.state';
import { MAFChangeTreeComponent } from './components/change.tree/change.tree.component';
import { ActionType, ControllerType } from '../../../../_core/domains/enums/action.type';
import { NodeSelectEventArgs, TreeViewComponent } from '@syncfusion/ej2-angular-navigations';
import { MAFChangeMeeyIdComponent } from './components/change.meeyid/change.meeyid.component';
import { MafAffiliateEntity } from '../../../../_core/domains/entities/meeyaffiliate/affiliate.entity';
import { MAFNodeType, MAFRankType } from '../../../../_core/domains/entities/meeyaffiliate/enums/affiliate.type';

@Component({
  templateUrl: './tree.component.html',
  styleUrls: ['./tree.component.scss'],
})
export class MAFTreeComponent extends EditComponent implements OnInit {
  @ViewChild("treeview") listTree: TreeViewComponent;
  actions: ActionData[] = [];
  moreActions: MoreActionData[];
  item: MafAffiliateEntity = new MafAffiliateEntity();

  listTreeData: any[];
  listTreeCurrent: any[];
  selectedNodes: any[];
  field: Object;
  currentNodeId: string;
  currentNode: any;
  nodeBranch: any;
  memberCommission: any;

  addNoteProcess = false;
  showInfoNote = false;
  showNoteBranch = false;
  showChangeMeeyId = false;

  processSearch = false;
  allowViewDetail = false;
  allowChangeTree = false;
  allowChangeMeeyId = false;

  emptyMessageTree = '';
  emptyMeeyIdTree = false;
  pageSizeChild = 20;

  constructor(public service: MAFAffiliateService, private location: Location) {
    super();
  }

  async ngOnInit() {
    await this.loadItems();
    this.renderActions();
    this.location.replaceState("/admin/mafaffiliate/tree");
  }

  async loadItems() {
    this.loading = true;
    this.listTreeData = [];
    this.listTreeCurrent = [];
    this.selectedNodes = [];

    await this.service.TreeNode(1, 1000, 0).then((result: ResultApi) => {
      if (ResultApi.IsSuccess(result)) {
        let items = result.Object;
        this.createTreeViewBranch(items);
      }
    });
    this.allowViewDetail = await this.authen.permissionAllow("MAFAffiliate", ActionType.ViewDetail);
    this.allowChangeTree = await this.authen.permissionAllow("MAFAffiliate", ActionType.UpdateTree);
    this.allowChangeMeeyId = await this.authen.permissionAllow("MAFAffiliate", ActionType.ChangeLeader);
    this.loading = false;
  }

  renderActions() {
    this.moreActions = [];
    this.moreActions.push({
      Name: 'Thêm mới',
      Icon: 'la la-plus',
      Actions: [
        {
          name: 'Thêm nhánh mới',
          icon: 'fa fa-user-plus',
          className: 'btn btn-success',
          systemName: ActionType.AddNewBranch,
          click: () => {
            this.dialogService.WapperAsync({
              cancelText: 'Hủy',
              confirmText: 'Lưu',
              size: ModalSizeType.Large,
              objectExtra: {
                addType: 'addBranch',
              },
              title: 'Thêm nhánh',
              object: MAFAddTreeComponent,
            }, () => this.loadItems());
          }
        },
        {
          name: 'Thêm TTKD mới',
          icon: 'fa fa-users',
          className: 'btn btn-info',
          systemName: ActionType.AddNewRank,
          click: () => {
            this.dialogService.WapperAsync({
              cancelText: 'Hủy',
              confirmText: 'Lưu',
              size: ModalSizeType.Large,
              objectExtra: {
                addType: 'addRank',
              },
              title: 'Thêm Trung tâm kinh doanh',
              object: MAFAddTreeComponent,
            }, () => this.loadItems());
          }
        },
        {
          icon: 'fa fa-users',
          name: 'Thêm Khách hàng',
          className: 'btn btn-info',
          systemName: ActionType.AddNew,
          click: () => {
            let node = this.listTreeCurrent?.find(c => c.Id == this.currentNodeId);
            if (node && node.isBranch) {
              this.dialogService.WapperAsync({
                cancelText: 'Hủy',
                confirmText: 'Thêm mới',
                size: ModalSizeType.Medium,
                objectExtra: {
                  BranchId: node.BranchId,
                },
                title: 'Thêm khách hàng vào hệ thống cây hoa hồng',
                object: MAFAddNodeComponent,
              }, () => this.loadItems());
            } else {
              ToastrHelper.Error('Vui lòng chọn nhánh để thêm mới khách hàng');
            }
          }
        }
      ],
    });
    this.moreActions.push({
      Name: 'Sơ đồ cây',
      Icon: 'la la-map',
      Actions: [
        {
          name: 'Sơ đồ bảng',
          icon: 'la la-list',
          className: 'btn btn-info',
          systemName: ActionType.View,
          click: () => {
            let obj: NavigationStateData = {
              prevUrl: "/admin/mafaffiliate",
            };
            this.router.navigate(["/admin/mafaffiliate/"], {
              state: { params: JSON.stringify(obj) },
            });
          }
        }
      ],
    });
    this.moreActions.forEach(async (item: MoreActionData) => {
      item.Actions = await this.authen.actionsAllowName('MAFAffiliate', item.Actions);
    });
  }

  createTreeView(items, changeList = true, selected = '', itemPage = null) {
    let listBR = [];
    let listBranch = [];
    let listTreeData = [];
    if (!changeList) {
      items.forEach((item: any) => {
        if (listBR.length < 1 || !listBR.includes(item.BranchId)) {
          listBR.push(item.BranchId);
          let lastId = listBranch.length > 0 ? listBranch[listBranch.length - 1].Id : -1;
          let refcount: number = items.filter(c => c.BranchId == item.BranchId).map(a => a.FnCount).reduce(function (a, b) {
            return a + b;
          });
          listBranch.push({ Id: lastId - 1, Name: item.Branch, BranchId: item.BranchId, Level: -1, refcount: refcount, isBranch: true, hasChild: true, expanded: true })
        }
      })
      let totalRefcount = 0;
      listBR.forEach(b => {
        totalRefcount += listBranch.find(c => c.BranchId == b).refcount;
      })
      listTreeData.push({ Id: -1, Name: 'Meey land', isMeeyland: true, hasChild: true, refcount: totalRefcount, expanded: true })
      listTreeData.push(...listBranch);
    }

    let pidSearch = 0;
    items.forEach((item: any) => {
      item.tooltip = item.RankCumulative + " - " + item.Name;
      let branch = listTreeData.find(c => c.BranchId == item.BranchId);
      if (item.ParentId)
        item.Level = item.ParentId;
      else
        item.Level = branch.Id;
      if (item.F1Ids.length > 0) {
        item.hasChild = true;
      }
      if (selected) {
        selected = selected.trim();
        if (item?.Phone?.toLowerCase() == selected.toLowerCase()
          || item?.Email?.toLowerCase() == selected.toLowerCase()
          || item?.MeeyId?.toLowerCase() == selected.toLowerCase()
          || item?.Ref?.toUpperCase() == selected.toUpperCase()) {
          item.isSelected = true;
          this.selectedNodes.push(item.Id);
          item.expanded = true
          pidSearch = item.Id;
          this.selectParent(items, item);
        }
      }
    })

    if (pidSearch > 0 && itemPage && itemPage?.Pages) {
      if (itemPage.Pages > itemPage.Index) {
        items.push({ Id: (pidSearch - 9999), Name: 'Xem thêm', isLoadMore: true, Level: pidSearch, page: itemPage.Index, totalPage: itemPage.Pages })
      }
    }
    if (items.length > 0) {
      listTreeData.push(...items);
    } else {
      listTreeData = [];
      this.showEmptyTree();
    }
    if (changeList) {
      this.listTreeData = listTreeData;
    }
    this.listTreeCurrent = listTreeData;
    this.changeDataSource(listTreeData);
  }

  createTreeViewBranch(items: any) {
    let listBR = [];
    let listBranch = [];
    let listTreeData = [];
    items.forEach((item: any) => {
      if (listBR.length < 1 || !listBR.includes(item.Id)) {
        listBR.push(item.Id);
        let refcount: number = items.find(c => c.Id == item.Id).Count,
          lastId = listBranch.length > 0 ? listBranch[listBranch.length - 1].Id : -1;
        listBranch.push({
          Id: lastId - 1,
          Level: -1,
          isBranch: true,
          Name: item.Name,
          tooltip: item.Name,
          BranchId: item.Id,
          refcount: refcount,
          hasChild: refcount > 0
        })
      }
    })
    let totalRefcount = 0;
    listBR.forEach(b => {
      totalRefcount += listBranch.find(c => c.BranchId == b).refcount;
    })
    listTreeData.push({ Id: -1, Name: 'Meey land', tooltip: 'Meey land', isMeeyland: true, hasChild: true, refcount: totalRefcount, expanded: true })
    listTreeData.push(...listBranch);

    this.listTreeData = listTreeData;
    this.listTreeCurrent = listTreeData;
    this.changeDataSource(listTreeData);
  }

  selectParent(items, item) {
    if (item?.ParentId && item.ParentId > 0) {
      var parent = items.find(c => c.Id === item.ParentId);
      if (parent) {
        parent.expanded = true;
        this.selectParent(items, parent);
      }
    }
  }

  async searchNodes() {
    let valid = await validation(this.item, ['Customer']);
    if (valid) {
      this.loading = true;
      this.processSearch = true;
      this.clearAll();
      await this.service.TreeNode(1, this.pageSizeChild, null, null, this.item.Customer.trim()).then((result: ResultApi) => {
        if (ResultApi.IsSuccess(result)) {
          if (result.Object) {
            if (Array.isArray(result.Object)) {
              let items = result.Object;
              let itemPage = result.ObjectExtra?.Paging;
              this.createTreeView(items, false, this.item.Customer, itemPage);
            } else {
              this.changeDataSource([]);
              this.showEmptyTree(result.Object);
            }
          } else {
            this.changeDataSource([]);
            this.showEmptyTree();
          }

        }
      });

      setTimeout(() => {
        // this.listTree.expandAll();
        this.loading = false;
        this.processSearch = false;
      }, 100);
    }
  }

  clearCustomer() {
    if (!this.item.Customer) {
      this.clearAll();
      this.listTreeCurrent = this.listTreeData;
      this.changeDataSource(this.listTreeData);
    }
  }

  public changeDataSource(data) {
    this.listTree.fields = {
      dataSource: data, id: 'Id', parentID: 'Level', text: 'Name', hasChildren: 'hasChild', selected: 'isSelected'
    }
    if (this.selectedNodes.length > 0) {
      this.listTree.selectedNodes = this.selectedNodes;
      this.currentNodeId = null;
      this.nodeClicked(null);
    }
  }

  nodeClicked(event: NodeSelectEventArgs) {
    if (this.currentNodeId) {
      if (this.currentNodeId != this.listTree.selectedNodes[0]) {
        this.currentNodeId = this.listTree.selectedNodes[0];
        this.showNoteCurrent()
      }
    } else {
      this.currentNodeId = this.listTree.selectedNodes[0];
      this.showNoteCurrent()
    }
  }

  async showNoteCurrent() {
    this.loading = true;
    let showInfoNote = false;
    let showNoteBranch = false;
    let showChangeMeeyId = false;
    let node = this.listTreeCurrent.find(c => c.Id == this.currentNodeId);
    if (node) {
      if (node.isLoadMore) {
        this.location.replaceState("/admin/mafaffiliate/tree");
        await this.loadMore(node);
      } else {
        this.clearAll();
        this.currentNode = node;

        if (node.isMeeyland) {
          await this.getDetailBranch(0, MAFNodeType.Center);
          this.location.replaceState("/admin/mafaffiliate/tree");
          showNoteBranch = true;
        } else if (node.isBranch) {
          await this.getDetailBranch(node.BranchId, MAFNodeType.Branch);
          this.location.replaceState("/admin/mafaffiliate/tree");
          showNoteBranch = true;
        } else {
          let option: OptionItem = ConstantHelper.MAF_RANK_TYPES.find((c) => c.value == node.RankId);
          if (!option) {
            if (!node.ParentId) {
              showChangeMeeyId = true;
            }
          }
          if (showChangeMeeyId) {
            await this.getDetailBranch(node.RankId, MAFNodeType.Rank);
            this.location.replaceState("/admin/mafaffiliate/tree");
            showNoteBranch = true;
          } else {
            await this.getCurrentCommission(node.Id);
            showInfoNote = true;
            this.location.replaceState("/admin/mafaffiliate/tree?id=" + node.Id);
          }
        }
      }
    }
    setTimeout(() => {
      if (!this.addNoteProcess)
        this.loading = false;
      this.showInfoNote = showInfoNote;
      this.showNoteBranch = showNoteBranch;
      this.showChangeMeeyId = showChangeMeeyId;
    }, 300);
  }

  async getDetailBranch(id, type) {
    let date = new Date();
    let month: any = date.getMonth() + 1;
    if (month < 10) month = '0' + month;
    let filter: TableData = {
      Filters: [{
        Value: month + '/' + (date.getFullYear()),
        Name: 'Month',
        Compare: CompareType.S_Equals
      },
      {
        Value: true,
        Name: 'ViewTree',
        Compare: CompareType.B_Equals
      }]
    };
    this.nodeBranch = {};
    await this.service.getCommissionItems(filter, id, type).then((result: ResultApi) => {
      if (ResultApi.IsSuccess(result) && result.Object.length > 0) {
        this.nodeBranch = result.Object[0];
      }
    });
    this.nodeBranch.Id = id;
    this.nodeBranch.Type = type;
  }

  async getCurrentCommission(id) {
    let date = new Date();
    let month: any = date.getMonth() + 1;
    if (month < 10) month = '0' + month;
    let filter: TableData = {
      Filters: [{
        Value: month + '/' + (date.getFullYear()),
        Name: 'Month',
        Compare: CompareType.S_Equals
      },
      {
        Value: true,
        Name: 'ViewTree',
        Compare: CompareType.B_Equals
      }]
    };
    this.nodeBranch = {};
    this.memberCommission = {};
    await this.service.getCommissionItems(filter, id, MAFNodeType.Member).then((result: ResultApi) => {
      if (ResultApi.IsSuccess(result) && result.Object.length > 0) {
        this.memberCommission = result.Object[0];
      }
    });
  }

  clearAll() {
    this.selectedNodes = [];
    this.showInfoNote = false;
    this.currentNode = null;
    this.emptyMessageTree = null;
  }

  async nodeExpanding(event: NodeSelectEventArgs) {
    if (event.nodeData && !this.addNoteProcess) {
      this.addNoteProcess = true;
      this.loading = true;
      let pid = parseInt(event.nodeData?.id.toString());
      let currentNode = this.listTreeCurrent.find(c => c.Id == event.nodeData?.id);
      let currentChilds: any = this.listTree.getTreeData().filter(c => c.Level === pid);
      let pageIndex = 1;
      if (currentChilds.length < 1) {
        if (currentNode.isBranch) {
          await this.service.TreeNode(pageIndex, this.pageSizeChild, 0, currentNode.BranchId).then((result: ResultApi) => {
            if (ResultApi.IsSuccess(result)) {
              let items = result.Object;
              let itemPage = result.ObjectExtra?.Paging;
              items.forEach((item: any) => {
                if (item?.F1Ids && item.F1Ids.length > 0) {
                  item.hasChild = true;
                }
                item.Level = pid;
                item.tooltip = item.RankCumulative + " - " + item.Name;
              })
              if (itemPage.Pages > pageIndex) {
                items.push({ Id: (pid - 9999), Name: 'Xem thêm', isLoadMore: true, Level: pid, branchId: currentNode.BranchId, isBranch: true, page: pageIndex, totalPage: itemPage.Pages })
              }
              this.listTreeData.push(...items);
              this.listTreeCurrent = this.listTreeData;
              this.listTree.addNodes(items)
            }
          });
        } else {
          await this.service.TreeNode(pageIndex, this.pageSizeChild, pid).then((result: ResultApi) => {
            if (ResultApi.IsSuccess(result)) {
              let items = result.Object;
              let itemPage = result.ObjectExtra?.Paging;
              items.forEach((item: any) => {
                if (item.F1Ids.length > 0) {
                  item.hasChild = true;
                }
                item.Level = pid;
                item.tooltip = item.RankCumulative + " - " + item.Name;
              })
              if (itemPage.Pages > pageIndex) {
                items.push({ Id: (pid - 9999), Name: 'Xem thêm', isLoadMore: true, Level: pid, page: pageIndex, totalPage: itemPage.Pages })
              }
              this.listTreeData.push(...items);
              this.listTreeCurrent = this.listTreeData;
              this.listTree.addNodes(items)
            }
          });
        }
      }
      setTimeout(() => {
        this.addNoteProcess = false;
        this.loading = false;
      }, 1000);
    }
  }

  async loadMore(node) {
    if (node && !this.addNoteProcess) {
      this.addNoteProcess = true;
      this.loading = true;
      let pid = node.Level;
      let nodeId = pid;
      let branchId = null;
      let pageIndex = node.page + 1;
      if (node.isBranch) {
        nodeId = 0;
        branchId = node.branchId;
      }
      await this.service.TreeNode(pageIndex, this.pageSizeChild, nodeId, branchId).then((result: ResultApi) => {
        if (ResultApi.IsSuccess(result)) {
          let items = result.Object;
          let itemPage = result.ObjectExtra?.Paging;
          items.forEach((item: any) => {
            if (item.F1Ids.length > 0) {
              item.hasChild = true;
            }
            item.Level = pid;
          })
          if (itemPage.Pages > pageIndex) {
            let nodeLoadMore: any = { Id: (pid - 9999), Name: 'Xem thêm', isLoadMore: true, Level: pid, page: pageIndex, totalPage: itemPage.Pages };
            if (node.isBranch) {
              nodeLoadMore.branchId = node.branchId;
              nodeLoadMore.isBranch = true;
            }
            items.push(nodeLoadMore)
          }
          //Xóa xem thêm cũ
          _.remove(this.listTreeData, function (c) {
            return c.Id === node.Id;
          });
          let targetNodeId: string = this.listTree.selectedNodes[0];
          this.listTree.removeNodes([targetNodeId]);
          this.currentNodeId = null;

          this.listTreeData.push(...items);
          this.listTreeCurrent = this.listTreeData;
          this.listTree.addNodes(items)
        }
      });

      setTimeout(() => {
        this.addNoteProcess = false;
        this.loading = false;
      }, 500);
    }
  }

  getRankType(data) {
    if (!data) return '';
    let text = ''
    let option: OptionItem = ConstantHelper.MAF_RANK_TYPES.find((c) => c.value == data.RankId);
    if (option) {
      let rankConvert = data.Rank.split(' ');
      let rank = '';
      rankConvert.forEach((r: string) => {
        if (r) {
          rank += r.substring(0, 1).toUpperCase();
        }
      })
      text = '<span class="' + (option && option.color) + ' badge-rank">' + rank + '</span>';
    } else {
      if (data.ParentId) {
        text = '<span class="kt-badge kt-badge--inline kt-badge--info badge-rank">NVKD</span>';
      } else {
        text = '<span class="kt-badge kt-badge--inline kt-badge--warning badge-rank">TTKD</span> ' + UtilityExHelper.shortcutString(data.Rank, 20) + ' -';
      }
    }
    return text;
  }
  getObjectType() {
    if (!this.currentNode.ObjectType) return '';
    let option: OptionItem = ConstantHelper.MAF_OBJECT_TYPES.find((c) => c.value == this.currentNode.ObjectType);
    return '<p class="' + (option && option.color) + '">' + (option && option.label) + "</p>";
  }

  changeTree() {
    if (this.currentNode) {
      this.dialogService.WapperAsync({
        cancelText: 'Hủy',
        confirmText: 'Chuyển cây',
        size: ModalSizeType.Large,
        objectExtra: {
          id: this.currentNode.Id,
        },
        title: 'Tạo yêu cầu chuyển cây',
        object: MAFChangeTreeComponent,
      });
    }
  }

  changeMeeyId() {
    if (this.currentNode) {
      this.dialogService.WapperAsync({
        cancelText: 'Hủy',
        confirmText: 'Lưu',
        size: ModalSizeType.Large,
        objectExtra: {
          id: this.currentNode.Id,
        },
        title: 'Thay đổi MeeyId đại diện TTKD',
        object: MAFChangeMeeyIdComponent,
      }, () => this.loadItems());
    }
  }

  viewUser(meeyId: string) {
    if (this.allowViewDetail) {
      let obj: NavigationStateData = {
        prevUrl: '/admin/mluser',
      };
      let url = AppConfig.getProtocol() + '//' + AppConfig.getDomain() + '/admin/mluser/view?meeyId=' + meeyId;
      this.setUrlState(obj, 'mluser');
      window.open(url, "_blank");
    }
  }

  viewAffiliate(id: string) {
    if (this.allowViewDetail) {
      let obj: NavigationStateData = {
        prevUrl: '/admin/mafaffiliate',
      };
      let url = AppConfig.getProtocol() + '//' + AppConfig.getDomain() + '/admin/mafaffiliate/view?id=' + id + '&back=tree';
      this.setUrlState(obj, 'affiliate');
      window.open(url, "_blank");
    }
  }

  async showEmptyTree(item = null) {
    let emptyMessageTree = 'Hiện tại không có dữ liệu phù hợp';
    let emptyMeeyIdTree = false;
    if (item) {
      emptyMeeyIdTree = true;
      emptyMessageTree = item.MeeyId;
    }

    this.emptyMeeyIdTree = emptyMeeyIdTree;
    this.emptyMessageTree = emptyMessageTree;
  }

  shortcutString(node, length) {
    if (!node.isBranch) {
      let option: OptionItem = ConstantHelper.MAF_RANK_TYPES.find((c) => c.value == node.RankId);
      if (option) {
        let listCheck = [MAFRankType.RANK2]
        if (listCheck.includes(node.RankId)) {
          return node.Name
        } else if (!node.ParentId) {
          return node.Name
        }
      }
      return UtilityExHelper.shortcutString(node.Name, length)
    }
    return node.Name
  }
}
