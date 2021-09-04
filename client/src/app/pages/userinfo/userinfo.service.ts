import { BehaviorSubject, Subject } from 'rxjs';
import { Injectable } from '@angular/core';
@Injectable({
  providedIn: 'root'
})
export class UserinfoService {
  Wallet : BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  constructor() { }
}
