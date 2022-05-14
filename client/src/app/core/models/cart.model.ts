import { User } from './user.model';
import { product } from '../models/product.model';

export class Cart {
  constructor(
    public user: User,
    public products: product[],
    public totalPrice: number
  ) { }
}
