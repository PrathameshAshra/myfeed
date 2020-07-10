import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { Observable } from 'rxjs';

@Injectable({
    providedIn: "root"
})
export class CardService {
    
    constructor(private httpClient: HttpClient) {

    }


    public getSampleData(): Observable<any> {
        return this.httpClient.get<any>("/assets/json/mock_data.json")

    }
    }
