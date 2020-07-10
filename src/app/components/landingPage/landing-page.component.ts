import { Component, OnInit, ViewChild, ChangeDetectorRef } from '@angular/core';
import { CardService } from '../../services/card.service'
import { CardModel, CardModelList } from '../../models/card.model'
import { HostListener } from '@angular/core';
import { Observable, of } from 'rxjs';
import { PageEvent, MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
@Component({
  selector: 'app-landing-page',
  templateUrl: './landing-page.component.html',
  styleUrls: ['./landing-page.component.scss'],
  providers: [CardService]
 
})
export class LandingPageComponent implements OnInit {
  CardModel: CardModel = new CardModel()
  CardModelList: CardModelList = new CardModelList()
  innerWidth: number;
  isTab: boolean;
  searchText: any;
  mutableClone: Array<any> = []



  @ViewChild(MatPaginator) paginator: MatPaginator;
  obs: Observable<any>;
  dataSource: MatTableDataSource<any> = new MatTableDataSource<any>();
sortable: string;
searchable: string;
  constructor(
    private _cardService: CardService,
    private changeDetectorRef: ChangeDetectorRef
  ) { }
  SortFilter: Array<any> = [
    { value: 'Tittle', viewValue: 'Sort By Tittle' },
    { value: 'Time', viewValue: 'Sort By Updated Time' },
  ];
  sortModel: string;
  @HostListener('window:resize', ['$event'])

//  Checking the width of window to turn table into cards
  onResize(event) {
    this.innerWidth = window.innerWidth;
    if (this.innerWidth > 769) {
      this.isTab = true;
    }
    else {
      this.isTab = false;

    }

  }

  // loads data from assets via service
  getSampleDataJson() {
    this._cardService.getSampleData().subscribe(
      data => {
        this.CardModelList.CarList = data
        this.mutableClone = data
        // assigns to pagination 
        this.changeDetectorRef.detectChanges();
        this.dataSource.data = this.mutableClone
        this.dataSource.paginator = this.paginator;
        this.obs = this.dataSource.connect();
        try {
          // retriving keywords from localstorage to maintain state
          var keyword = localStorage.getItem('search').trim()
          var sortkey = localStorage.getItem('sortkey').trim()
          console.log(keyword)
          console.log(sortkey)
        } catch (error) {
          
        }
        
       
        if(sortkey){
          this.doSort(sortkey)
          this.sortable = sortkey
          this.sortModel = sortkey
        }
        if(keyword){
          this.searchText = keyword
          this.search(keyword)
        }
      }
    )
  }

  // sorting
  doSort(value){
    console.log(value)
    this.sortable = value 
if(value == 'Tittle'){
  this.mutableClone.sort((a, b) => (a.name > b.name) ? 1 : -1)
  this.dataSource.data = this.mutableClone;
  // set localstorage key value

  localStorage.setItem('sortkey',value)

}else{
  this.mutableClone.sort((a, b) => (a.dateLastEdited < b.dateLastEdited) ? 1 : -1)
  this.dataSource.data = this.mutableClone
    // set localstorage key value

  localStorage.setItem('sortkey',value)


}
  }
// clear search/sort
  clear(ev){
if(ev =="search"){
  this.search(' ')
  this.searchable =""
  this.searchText = ""
  localStorage.removeItem('search')
}
else{
  this.sortable = ""
  this.sortModel = ""
  localStorage.removeItem('sortkey')
}
  }

  // search-> split words into 3 fragments to get content between the "",
 
  search(keyword: string) {
    this.searchable = keyword
    localStorage.setItem('search', keyword.trim())
    this.mutableClone = this.CardModelList.CarList
    var temp = [];
    var splitted = keyword.split('"', 3);
    var inputPara = keyword.split(' ');
    // Exact Search
    if (splitted[1]?.length > 0) {
      this.mutableClone.forEach(element => {
        if (element.name.toLowerCase().includes(splitted[1].toLocaleLowerCase()) || element.description.toLowerCase().includes(splitted[1].toLocaleLowerCase())) {
          temp.push(element);
        }
      });

    } else {
      // Loose Search
      var counter = 0
      
      this.mutableClone.forEach(dataRow => {
        inputPara.forEach(element => {
          if (dataRow.name.toLowerCase().includes(element.toLowerCase()) || dataRow.description.toLowerCase().includes(element.toLowerCase())   ) {
            counter = counter + 1
            if (counter == inputPara.length) {
              counter = 0;
              temp.push(dataRow)
            }

          }
        });
      });


    }
    this.mutableClone = temp
    this.dataSource.data = this.mutableClone
  }

  ngOnInit(): void {
    this.onResize(event);
    this.getSampleDataJson();
  
  }

}
