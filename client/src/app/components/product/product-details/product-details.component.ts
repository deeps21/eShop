// Decorators and Lifehooks
import { Component, OnInit } from '@angular/core';

// Router
import { Router, ActivatedRoute } from '@angular/router';

// Services
import { ProductService } from '../../../core/services/Product.service';
import { CartService } from '../../../core/services/cart.service';
import { HelperService } from '../../../core/services/helper.service';

// Models
import { Product } from '../../../core/models/Product.model';

@Component({
  selector: 'app-Product-details',
  templateUrl: './Product-details.component.html',
  styleUrls: ['./Product-details.component.css']
})
export class ProductDetailsComponent implements OnInit {
  Product: Product;
  ProductId: string;
  userId: string;
  isLogged: boolean;
  isAdmin: boolean;
  isRated: boolean;
  isAdded: boolean;
  isBought: boolean;
  stars = ['', '', '', '', ''];

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private ProductService: ProductService,
    private cartService: CartService,
    private helperService: HelperService
  ) { }

  ngOnInit(): void {
    this.ProductId = this.route.snapshot.paramMap.get('ProductId');
    this.isLogged = this.helperService.isLoggedIn();
    this.isAdmin = this.helperService.isAdmin();
    this.userId = this.helperService.getProfile().id;

    this.ProductService
      .getSingleProduct(this.ProductId)
      .subscribe((res) => {
        this.Product = res.data;
        this.calcRating(this.Product.currentRating);
      });
  }

  buyProduct(): void {
    this.cartService
      .addToCart(this.ProductId)
      .subscribe(() => {
        this.helperService.cartStatus.next('add');
        this.isBought = true;
      }, () => {
        this.isBought = true;
      });
  }

  addToFavorites(): void {
    this.ProductService
      .addToFavourites(this.ProductId)
      .subscribe(() => {
        this.isAdded = true;
      }, () => {
        this.isAdded = true;
      });
  }

  rateProduct(rating: number): void {
    if (!this.isRated) {
      this.isRated = true;
      this.ProductService
        .rateProduct(this.ProductId, { rating: rating })
        .subscribe((res) => {
          this.Product.currentRating = res.data.currentRating;
          this.Product.ratedCount++;
          this.calcRating(this.Product.currentRating);
        });
    }
  }

  calcRating(rating: number): void {
    this.stars = ['', '', '', '', ''];
    rating = Math.round(rating);
    for (let i = 0; i < rating; i++) {
      this.stars[i] = 'checked';
    }
  }

  resetRating(): void {
    this.calcRating(this.Product.currentRating);
  }

  login(): void {
    this.router.navigate(['/user/login']);
  }

}
