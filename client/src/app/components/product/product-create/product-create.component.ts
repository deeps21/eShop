// Decorators and Lifehooks
import { Component, OnInit } from '@angular/core';

// Forms
import { FormControl, FormGroup, Validators, AbstractControl } from '@angular/forms';

// Router
import { Router } from '@angular/router';

// Services
import { ProductService } from '../../../core/services/Product.service';

// Custom Validators
import { isUrlValidator } from '../../../core/directives/is-url.directive';
import { isIsbnValidator } from '../../../core/directives/is-isbn.directive';

@Component({
  selector: 'app-Product-create',
  templateUrl: './Product-create.component.html',
  styleUrls: ['./Product-create.component.css']
})
export class ProductCreateComponent implements OnInit {
  createProductForm: FormGroup;

  constructor(
    private router: Router,
    private ProductService: ProductService
  ) { }

  ngOnInit(): void {
    this.createProductForm = new FormGroup({
      'title': new FormControl('', [
        Validators.required
      ]),
      'author': new FormControl('', [
        Validators.required
      ]),
      'genre': new FormControl('', [
        Validators.required
      ]),
      'year': new FormControl('', [
        Validators.required
      ]),
      'description': new FormControl('', [
        Validators.required,
        Validators.minLength(10)
      ]),
      'cover': new FormControl('', [
        Validators.required,
        isUrlValidator
      ]),
      'isbn': new FormControl('', [
        Validators.required,
        isIsbnValidator
      ]),
      'pagesCount': new FormControl('', [
        Validators.required,
        Validators.min(0)
      ]),
      'price': new FormControl('', [
        Validators.required,
        Validators.min(0)
      ])
    });
  }

  onSubmit(): void {
    this.ProductService
      .createProduct(this.createProductForm.value)
      .subscribe((res) => {
        this.router.navigate([`/Product/details/${res.data._id}`]);
      });
  }

  get title(): AbstractControl {
    return this.createProductForm.get('title');
  }

  get author(): AbstractControl {
    return this.createProductForm.get('author');
  }

  get genre(): AbstractControl {
    return this.createProductForm.get('genre');
  }

  get year(): AbstractControl {
    return this.createProductForm.get('year');
  }

  get description(): AbstractControl {
    return this.createProductForm.get('description');
  }

  get cover(): AbstractControl {
    return this.createProductForm.get('cover');
  }

  get isbn(): AbstractControl {
    return this.createProductForm.get('isbn');
  }

  get pagesCount(): AbstractControl {
    return this.createProductForm.get('pagesCount');
  }

  get price(): AbstractControl {
    return this.createProductForm.get('price');
  }

}
