import { Component, OnInit } from '@angular/core';

import { getListening } from './../../variables';

@Component({
  selector: 'app-search-page',
  templateUrl: './search-page.component.html',
  styleUrls: ['./search-page.component.css']
})
export class SearchPageComponent implements OnInit {

  //listening: boolean = false

  constructor() {
  }

  ngOnInit(): void {
  }

  alert(message: string): void {
    alert(message);
  }

  getListening(): boolean {
    return getListening();
  }

}
