// Decorators and Lifehooks
import { Component, OnInit } from '@angular/core';

// Forms
import { FormControl, FormGroup, Validators } from '@angular/forms';

// Router
import { Router, ActivatedRoute } from '@angular/router';

// Services
import { ProductService } from '../../../core/services/Product.service';

@Component({
  selector: 'app-Product-delete',
  templateUrl: './Product-delete.component.html',
  styleUrls: ['./Product-delete.component.css']
})
export class ProductDeleteComponent implements OnInit {
  deleteProductForm: FormGroup;
  id: string;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private ProductService: ProductService
  ) { }

  ngOnInit(): void {
    this.initForm();
    this.id = this.route.snapshot.paramMap.get('ProductId');

    this.ProductService
      .getSingleProduct(this.id)
      .subscribe((res) => {
        this.deleteProductForm.patchValue({ ...res.data });
      });
  }

  initForm(): void {
    this.deleteProductForm = new FormGroup({
      'title': new FormControl('', [
        Validators.required
      ]),
      'author': new FormControl('', [
        Validators.required
      ]),
      'genre': new FormControl('', [
        Validators.required
      ]),
      'description': new FormControl('', [
        Validators.required,
        Validators.minLength(10)
      ]),
      'price': new FormControl('', [
        Validators.required,
        Validators.min(0)
      ])
    });
  }

  onSubmit(): void {
   this.ProductService
      .deleteProduct(this.id)
      .subscribe(() => {
        this.router.navigate(['/home']);
      });
  }

}
