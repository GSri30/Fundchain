import { UserinfoService } from "./userinfo.service";
import {
  Component,
  OnInit,
  OnDestroy,
  Input,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
} from "@angular/core";
import {
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

  dataSource: NbTreeGridDataSource<FSEntry>;

  sortColumn: string;
  sortDirection: NbSortDirection = NbSortDirection.NONE;

  userPictureOnly: boolean = false;
  user: any;
  private destroy$: Subject<void> = new Subject<void>();
  Name: String;
  Email: String = "test@email.com";
  UUID: String = "10";
  Wallet: Boolean = false;
  themes = [
    {
      value: "cosmic",
      name: "Cosmic",
    },
  ];

  currentTheme = "cosmic";

  constructor(
    private sidebarService: NbSidebarService,
    private menuService: NbMenuService,
    private themeService: NbThemeService,
    private userService: UserData,
    private layoutService: LayoutService,
    private breakpointService: NbMediaBreakpointsService,
    private dataSourceBuilder: NbTreeGridDataSourceBuilder<FSEntry>,
    private userinfo: UserinfoService,
    private cds: ChangeDetectorRef
  ) {
    this.dataSource = this.dataSourceBuilder.create(this.data);
  }

  ngOnInit(): void {
    this.currentTheme = this.themeService.currentTheme;

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
      data: { Type: "Out Transactions", Amount: "100", kind:'dir'},
      children: [
        { data: { Type: "Transaction 1", Amount: "50", kind: 'doc' } },
        { data: { Type: "Transaction 2", Amount: "50", kind: 'doc' } },
      ],
    },
    {
      data: { Type: "In Transactions", Amount: "150", kind:'dir' },
      children: [
        { data: { Type: "Transaction 1", Amount: "40", kind: 'doc' } },
        { data: { Type: "Transaction 2", Amount: "60", kind: 'doc' } },
      ],
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
