import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { ApiService } from 'src/app/services/api.service';

@Component({
  selector: 'app-transactions',
  templateUrl: './transactions.component.html',
  styles: [
  ]
})
export class TransactionsComponent implements OnInit {
  public form: FormGroup;
  public loading = false;
  public actionOptions = [
    { value: 1, label: 'Cobro' },
    { value: -1, label: 'Prestar' },
  ];

  public incomeInvalid = false;

  constructor(private fb: FormBuilder, private api: ApiService, private ms: MessageService) {
    this.form = this.fb.group({
    });
  }

  ngOnInit(): void {
  }

  public async submit(): Promise<void> {
    this.loading = true;

    if (this.form.valid) {
    } else {
      this.form.markAllAsTouched();
    }

    this.loading = false;
  }
}
