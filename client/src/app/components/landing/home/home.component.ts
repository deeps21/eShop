// Decorators and Lifehooks
import { Component, OnInit } from '@angular/core';

// Services
import { productService } from '../../../core/services/product.service';

// Models
import { product } from '../../../core/models/product.model';

const newestproductsQuery = '?sort={"creationDate":-1}&limit=5';
const bestRatedproductsQuery = '?sort={"currentRating":-1}&limit=5';
const mostPurchasedproductsQuery = '?sort={"purchasesCount":-1}&limit=5';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  newestproducts: product[];
  bestRatedproducts: product[];
  mostPurchasedproducts: product[];

  constructor(private productService: productService) { }

  ngOnInit(): void {
    this.productService
      .search(newestproductsQuery)
      .subscribe((res) => {
        this.newestproducts = res.data;
      });

    this.productService
      .search(bestRatedproductsQuery)
      .subscribe((res) => {
        this.bestRatedproducts = res.data;
      });

    this.productService
      .search(mostPurchasedproductsQuery)
      .subscribe((res) => {
        this.mostPurchasedproducts = res.data;
      });
  }

}
