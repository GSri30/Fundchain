import {Component, OnDestroy} from '@angular/core';
import { NbThemeService } from '@nebular/theme';
import { takeWhile } from 'rxjs/operators' ;
import { SolarData } from '../../@core/data/solar';

import { TaquitoService } from './../../taquito.service'

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
    count: 0,
  };
  ContributorsCard: CardSettings = {
    title: 'Contributors',
    iconClass: 'nb-plus-circled',
    type: 'info',
    count: 0,
  };
  GoalsReachedCard: CardSettings = {
    title: 'Goals Reached',
    iconClass: 'nb-checkmark-circle',
    type: 'success',
    count: 0,
  };
  RecipientsCard: CardSettings = {
    title: 'Recipients',
    iconClass: 'nb-person',
    type: 'warning',
    count: 0,
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
              private solarService: SolarData,
              private taquito: TaquitoService) {
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

  async ngOnInit(){
    await this.taquito.set_contract();
    this.RecipientsCard.count = await this.taquito.get_number_posts();
    this.GoalsReachedCard.count = await this.taquito.get_goals_reached();
    this.ContributorsCard.count = await this.taquito.get_total_donors();
    this.FundsReceivedCard.count = await this.taquito.get_total_fund();
  }

  openorg(org : any){
    console.log(org);
  }
}
