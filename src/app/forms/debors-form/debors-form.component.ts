import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { Debtor } from 'src/app/models/debtor.model';
import { ApiService } from 'src/app/services/api.service';

@Component({
  selector: 'app-debors-form',
  templateUrl: './debors-form.component.html',
  styles: [
  ]
})
export class DeborsFormComponent implements OnInit, OnChanges {
  @Input() debtor?: Debtor;

  @Output() cancel = new EventEmitter<void>();
  @Output() inserted = new EventEmitter<any>();
  @Output() updated = new EventEmitter<any>();

  public form: FormGroup;
  public loading = false;

  constructor(private fb: FormBuilder, private api: ApiService, private ms: MessageService) {
    this.form = this.fb.group({
    });
  }

  ngOnInit(): void {
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (this.debtor !== undefined) {
    }
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
