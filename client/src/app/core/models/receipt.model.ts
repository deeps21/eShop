import { User } from './user.model';
import { product } from './product.model';

export class Receipt {
  constructor(
    public user: User,
    public productsInfo: product[],
    public totalPrice: number
  ) { }
}
