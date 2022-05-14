// Decorators and Lifehooks
import { Component, OnInit } from '@angular/core';

// Forms
import { FormControl, FormGroup, Validators, AbstractControl } from '@angular/forms';

// Router
import { Router, ActivatedRoute } from '@angular/router';

// Services
import { ProductService } from '../../../core/services/Product.service';

// Custom Validators
import { isUrlValidator } from '../../../core/directives/is-url.directive';
import { isIsbnValidator } from '../../../core/directives/is-isbn.directive';

@Component({
  selector: 'app-Product-edit',
  templateUrl: './Product-edit.component.html',
  styleUrls: ['./Product-edit.component.css']
})
export class ProductEditComponent implements OnInit {
  editProductForm: FormGroup;
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
        this.editProductForm.patchValue({ ...res.data });
      });
  }

  initForm(): void {
    this.editProductForm = new FormGroup({
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
      .editProduct(this.id, this.editProductForm.value)
      .subscribe((res) => {
        this.router.navigate([`/Product/details/${res.data._id}`]);
      });
  }

  get title(): AbstractControl {
    return this.editProductForm.get('title');
  }

  get author(): AbstractControl {
    return this.editProductForm.get('author');
  }

  get genre(): AbstractControl {
    return this.editProductForm.get('genre');
  }

  get year(): AbstractControl {
    return this.editProductForm.get('year');
  }

  get description(): AbstractControl {
    return this.editProductForm.get('description');
  }

  get cover(): AbstractControl {
    return this.editProductForm.get('cover');
  }

  get isbn(): AbstractControl {
    return this.editProductForm.get('isbn');
  }

  get pagesCount(): AbstractControl {
    return this.editProductForm.get('pagesCount');
  }

  get price(): AbstractControl {
    return this.editProductForm.get('price');
  }

}
