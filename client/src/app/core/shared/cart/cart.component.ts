// Decorators and Lifehooks
import { Component, TemplateRef, OnInit, OnDestroy } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';

// Router
import { Router } from '@angular/router';

// Forms
import { FormControl, FormGroup, Validators } from '@angular/forms';

// RXJS
import { Subscription } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';

// Services
import { CartService } from '../../services/cart.service';
import { HelperService } from '../../services/helper.service';
import { BsModalService } from 'ngx-bootstrap/modal';

// Models
import { Cart } from '../../models/cart.model';
import { product } from '../../models/product.model';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']
})
export class CartComponent implements OnInit, OnDestroy {
  cart: Cart;
  cartForm: FormGroup;
  changesSub$: Subscription;
  removeModalRef: BsModalRef;
  lastCartState: string;
  lastDeleteId: string;

  constructor(
    private router: Router,
    private cartService: CartService,
    private helperService: HelperService,
    private modalService: BsModalService
  ) { }

  ngOnInit(): void {
    this.cartService
      .getCart()
      .subscribe((res) => {
        this.cart = res.data;
        this.cartForm = this.toFormGroup(this.cart.products);
        this.onChanges();
      });
  }

  ngOnDestroy(): void {
    this.changesSub$.unsubscribe();
  }

  toFormGroup(products: product[]): FormGroup {
    const group: any = {};

    products.forEach(product => {
      group[product._id] = new FormControl(
        product.qty || '', [
          Validators.required,
          Validators.min(1),
          Validators.max(20)
        ]);
    });

    return new FormGroup(group);
  }

  onChanges(): void {
    this.changesSub$ = this.cartForm
      .valueChanges
      .pipe(
        debounceTime(800),
        distinctUntilChanged()
      )
      .subscribe(val => {
        if (this.lastCartState !== JSON.stringify(val)) {
          this.lastCartState = JSON.stringify(val);
          this.reCalcSum(val);
        }
      });
  }

  openRemoveModal(template: TemplateRef<any>, id: string): void {
    this.lastDeleteId = id;
    this.removeModalRef = this.modalService.show(
      template,
      { class: 'myModal modal-sm' }
    );
  }

  onRemove(): void {
    this.cartService
      .removeFromCart(this.lastDeleteId)
      .subscribe(() => {
        this.helperService.cartStatus.next('remove');
        this.cart.products = this.cart.products.filter(b => b._id !== this.lastDeleteId);
        this.reCalcSum(this.cartForm.value);
        this.removeModalRef.hide();
      });
  }

  onSubmit(): void {
    this.cartService
      .checkout(this.cartForm.value)
      .subscribe(() => {
        this.helperService.cartStatus.next('updateStatus');
        this.router.navigate(['/user/purchaseHistory']);
      });
  }

  reCalcSum(formValues: object): void {
    let price = 0;
    for (const b of this.cart.products) {
      price += b.price * formValues[b._id];
    }

    this.cart.totalPrice = price;
  }

  getControl(id: string) {
    return this.cartForm.get(id);
  }
}
