import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-search-bar',
  templateUrl: './search-bar.component.html',
  styleUrls: ['./search-bar.component.css']
})
export class SearchBarComponent {
  searchCriteria = {
    title: '',
     genre: '',
    releaseYear: ''
  } 

 
  @Output() search: EventEmitter<any> = new EventEmitter<any>();

  onSearch(): void {
    console.log('Search triggered with:', this.searchCriteria);
    this.search.emit(this.searchCriteria);
    }
  }



