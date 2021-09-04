import { Component, OnInit } from '@angular/core';

class Organization{
  name : string;
  id: string;
  description : string;
  progress : Number;
}

@Component({
  selector: 'ngx-education',
  templateUrl: './education.component.html',
  styleUrls: ['./education.component.scss']
})
export class EducationComponent implements OnInit {
  orgs : Organization[] = [
    {
      name : "Organization 1",
      id : "1101",
      description : "Please Donate for the country",
      progress : 10
    },
    {
      name : "Organization 2",
      id : "1101",
      description : "Please Donate for the country. Please Donate for the country.Please Donate for the country.Please Donate for the country.Please Donate for the country.",
      progress : 75
    },
    {
      name : "Organization 3",
      id : "1101",
      description : "Please Donate for the country",
      progress : 35
    },
    {
      name : "Organization 4",
      id : "1101",
      description : "Please Donate for the country",
      progress : 35
    }
  ];
  constructor() { }

  ngOnInit(): void {
  }

  donate(){

  }
}
