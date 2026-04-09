import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface FreeItem {
  id: number;
  title: string;
  description: string;
  price: number;
  isAvailable: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class TestDataService {
  private freeApiUrl = 'https://jsonplaceholder.typicode.com/posts';

  constructor(private http: HttpClient) { }

  /**
   * Get free test data from API
   */
  getFreeData(): Observable<any[]> {
    return this.http.get<any[]>(`${this.freeApiUrl}?_limit=10`);
  }

  /**
   * Get single free item
   */
  getFreeItem(id: number): Observable<any> {
    return this.http.get<any>(`${this.freeApiUrl}/${id}`);
  }

  /**
   * Get mock free data (no API call)
   */
  getMockFreeData(): FreeItem[] {
    return [
      {
        id: 1,
        title: 'Free Product 1',
        description: 'This is a free product for testing',
        price: 0,
        isAvailable: true
      },
      {
        id: 2,
        title: 'Free Product 2',
        description: 'Another free product with full features',
        price: 0,
        isAvailable: true
      },
      {
        id: 3,
        title: 'Limited Free Product',
        description: 'Free product with limited features',
        price: 0,
        isAvailable: true
      }
    ];
  }
}
