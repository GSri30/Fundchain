import {Component, OnDestroy} from '@angular/core';
import { NbThemeService } from '@nebular/theme';
import { takeWhile } from 'rxjs/operators' ;
import { SolarData } from '../../@core/data/solar';

interface CardSettings {
  title: string;
  iconClass: string;
  type: string;
  count: number;
}

class Organization{
  name : string;
  id: string;
  type : string;
  description : string;
}

@Component({
  selector: 'ngx-dashboard',
  styleUrls: ['./dashboard.component.scss'],
  templateUrl: './dashboard.component.html',
})
export class DashboardComponent implements OnDestroy {

  private alive = true;

  solarValue: number;
  FundsReceivedCard: CardSettings = {
    title: 'Funds Received',
    iconClass: 'nb-lightbulb',
    type: 'primary',
    count: 400,
  };
  ContributorsCard: CardSettings = {
    title: 'Contributors',
    iconClass: 'nb-plus-circled',
    type: 'info',
    count: 600,
  };
  GoalsReachedCard: CardSettings = {
    title: 'Goals Reached',
    iconClass: 'nb-checkmark-circle',
    type: 'success',
    count: 300,
  };
  RecipientsCard: CardSettings = {
    title: 'Recipients',
    iconClass: 'nb-person',
    type: 'warning',
    count: 500,
  };

  orgs : Organization[] = [
    {
      name : "Test1",
      id : "1",
      type : "Health",
      description : "This organization....." 
    },
    {
      name : "Test2",
      id : "2",
      type : "Education",
      description : "This organization....." 
    }
  ];
  statusCards: string;

  commonStatusCardsSet: CardSettings[] = [
    this.FundsReceivedCard,
    this.ContributorsCard,
    this.GoalsReachedCard,
    this.RecipientsCard,
  ];

  statusCardsByThemes: {
    default: CardSettings[];
    cosmic: CardSettings[];
    corporate: CardSettings[];
    dark: CardSettings[];
  } = {
    default: this.commonStatusCardsSet,
    cosmic: this.commonStatusCardsSet,
    corporate: [
      {
        ...this.FundsReceivedCard,
        type: 'warning',
      },
      {
        ...this.ContributorsCard,
        type: 'primary',
      },
      {
        ...this.GoalsReachedCard,
        type: 'danger',
      },
      {
        ...this.RecipientsCard,
        type: 'info',
      },
    ],
    dark: this.commonStatusCardsSet,
  };

  constructor(private themeService: NbThemeService,
              private solarService: SolarData) {
    this.themeService.getJsTheme()
      .pipe(takeWhile(() => this.alive))
      .subscribe(theme => {
        this.statusCards = this.statusCardsByThemes[theme.name];
    });

    this.solarService.getSolarData()
      .pipe(takeWhile(() => this.alive))
      .subscribe((data) => {
        this.solarValue = data;
      });
  }

  ngOnDestroy() {
    this.alive = false;
  }

  openorg(org : any){
    console.log(org);
  }
}
