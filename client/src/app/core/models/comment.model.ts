import { User } from './user.model';
import { product } from './product.model';

export class Comment {
  constructor(
    public _id: string,
    public user: User,
    public content: string,
    public product: product,
    public creationDate?: Date
  ) { }
}
