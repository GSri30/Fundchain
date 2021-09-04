import { UserinfoService } from "./userinfo.service";
import { Base64 } from 'js-base64';

import {
  Component,
  OnInit,
  OnDestroy,
  Input,
  ChangeDetectionStrategy,
  ApplicationRef,
  ChangeDetectorRef,
} from "@angular/core";
import {
  NbIconLibraries,
  NbMediaBreakpointsService,
  NbMenuService,
  NbSidebarService,
  NbThemeService,
} from "@nebular/theme";
import {
  NbSortDirection,
  NbSortRequest,
  NbTreeGridDataSource,
  NbTreeGridDataSourceBuilder,
} from "@nebular/theme";

import { UserData } from "../../@core/data/users";
import { LayoutService } from "../../@core/utils";
import { map, takeUntil } from "rxjs/operators";
import { Subject } from "rxjs";

import {TaquitoService} from "../../taquito.service"
import { EncodeIntoResult } from "util";

interface TreeNode<T> {
  data: T;
  children?: TreeNode<T>[];
  expanded?: boolean;
}

interface FSEntry {
  Type: string;
  Amount: string;
  items?: number;
  kind: string;
}

@Component({
  selector: "ngx-userinfo",
  templateUrl: "./userinfo.component.html",
  styleUrls: ["./userinfo.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserinfoComponent implements OnInit, OnDestroy {
  customColumn = "Type";
  defaultColumns = ["Amount"];
  allColumns = [this.customColumn, ...this.defaultColumns];
  verifierXP:Number = 2000;
  orgXP:Number = 1000;
  dataSource: NbTreeGridDataSource<FSEntry>;

  sortColumn: string;
  sortDirection: NbSortDirection = NbSortDirection.NONE;

  userPictureOnly: boolean = false;
  user: any;
  private destroy$: Subject<void> = new Subject<void>();
  Name: String = sessionStorage.getItem('name');
  Email: String = sessionStorage.getItem('email');
  UUID: String = Base64.encode(sessionStorage.getItem('email'),true);
  Wallet: Boolean = false;
  themes = [
    {
      value: "cosmic",
      name: "Cosmic",
    },
  ];

  currentTheme = "cosmic";
  tick : String = "checkmark-square-2";
  cross : String = "close-square";
  xpicon : String ="arrowhead-up-outline";
  xpicon2 : String ="arrow-circle-up-outline";


  constructor(
    private sidebarService: NbSidebarService,
    private menuService: NbMenuService,
    private themeService: NbThemeService,
    private userService: UserData,
    private layoutService: LayoutService,
    private breakpointService: NbMediaBreakpointsService,
    private dataSourceBuilder: NbTreeGridDataSourceBuilder<FSEntry>,
    private userinfo: UserinfoService,
    private cds: ChangeDetectorRef,
    private ad: ApplicationRef,
    private taquito: TaquitoService,
    private iconsLibrary: NbIconLibraries
  ) 
  {
    this.dataSource = this.dataSourceBuilder.create(this.data);
  }

   async ngOnInit(): Promise<void> {
    this.userService
      .getUsers()
      .pipe(takeUntil(this.destroy$))
      .subscribe((users: any) => (this.user = users.nick));

    const { xl } = this.breakpointService.getBreakpointsMap();
    this.themeService
      .onMediaQueryChange()
      .pipe(
        map(([, currentBreakpoint]) => currentBreakpoint.width < xl),
        takeUntil(this.destroy$)
      )
      .subscribe(
        (isLessThanXl: boolean) => (this.userPictureOnly = isLessThanXl)
      );

    this.userinfo.Wallet.subscribe((status) => {
      this.Wallet = status;
      this.cds.detectChanges();
    });

    this.currentTheme = this.themeService.currentTheme;

    await this.taquito.set_contract();

    this.update_out_transactions();
    this.update_in_transactions();
  }

  async update_out_transactions()
  {
    const uuid = Base64.encode(sessionStorage.getItem('email'),true);
    var transaction_list = await this.taquito.get_specific_from_transactions(uuid);
    var a = transaction_list as TreeNode<FSEntry>[];
    this.data[0].children = a;
    var amount = 0,i = 0;
    while(i<a.length)
    {
      amount += parseInt(a[i].data.Amount)
      i+=1
    }
    this.data[0].data.Amount = amount.toString();
    this.cds.detectChanges();
    this.dataSource = this.dataSourceBuilder.create(this.data);    
  }

  async update_in_transactions()
  {
    const uuid = Base64.encode(sessionStorage.getItem('email'),true);
    var transaction_list = await this.taquito.get_specific_to_transactions(uuid);
    var a = transaction_list as TreeNode<FSEntry>[];
    this.data[1].children = a;
    var amount = 0,i = 0;
    while(i<a.length)
    {
      amount += parseInt(a[i].data.Amount);
      i+=1;
    }
    this.data[1].data.Amount = amount.toString();   
    this.cds.detectChanges();
    this.dataSource = this.dataSourceBuilder.create(this.data);    
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  updateSort(sortRequest: NbSortRequest): void {
    this.sortColumn = sortRequest.column;
    this.sortDirection = sortRequest.direction;
  }

  getSortDirection(column: string): NbSortDirection {
    if (this.sortColumn === column) {
      return this.sortDirection;
    }
    return NbSortDirection.NONE;
  }

  private data: TreeNode<FSEntry>[] = [
    {
      data: { Type: "Out Transactions", Amount: "0", kind:'dir'},
      children: [],
    },
    {
      data: { Type: "In Transactions", Amount: "0", kind:'dir' },
      children: [],
    },
  ];

  getShowOn(index: number) {
    const minWithForMultipleColumns = 400;
    const nextColumnStep = 100;
    return minWithForMultipleColumns + nextColumnStep * index;
  }
}

@Component({
  selector: "ngx-fs-icon-ui",
  template: `
  <nb-tree-grid-row-toggle [expanded]="expanded" *ngIf="isDir(); else fileIcon">
  </nb-tree-grid-row-toggle>
  <ng-template #fileIcon>
    <nb-icon icon="file-text-outline"></nb-icon>
  </ng-template>
`,
})
export class FsIconUIComponent {
  @Input() kind: string;
  @Input() expanded: boolean;

  isDir(): boolean {
    return this.kind === "dir";
  }
}
