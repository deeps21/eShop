// Decorators
import { Component, Input } from '@angular/core';

// Models
import { product } from '../../models/product.model';

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.css']
})
export class productComponent {
  @Input('product') product: product;
}
