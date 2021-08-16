import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { GridComponent } from 'src/app/components/grid/grid.component';
import { Debtor } from 'src/app/models/debtor.model';
import { GridCol } from 'src/app/models/grid-col.model';
import { Loan } from 'src/app/models/loan.model';
import { Transaction } from 'src/app/models/transaction.model';
import { ApiService } from 'src/app/services/api.service';
import { dateTimeStandardFormat, getModel } from 'src/app/utils/helpers.utils';

@Component({
  selector: 'app-debtors-view',
  templateUrl: './debtors-view.component.html',
  styles: [
  ]
})
export class DebtorsViewComponent implements OnInit {
  public debtor?: Debtor;
  public loan?: Loan;
  public transactions?: Transaction[];

  @ViewChild('grid', { static: false }) private _grid?: GridComponent;

  public cols: GridCol[] = [
    { key: 'was_at', label: 'Fecha', type: 'date', filter: false },
    { key: 'bank_key', label: 'Banco', type: 'text', filter: false, disableSort: true },
    { key: 'register_key', label: 'Usuario', type: 'text', filter: false, disableSort: true },
    { key: 'loan_amount', label: 'Monto', type: 'numeric', filter: false, disableSort: true },
    { key: 'loan_balance', label: 'Balance', type: 'numeric', filter: false, disableSort: true },
  ];
  public endpoint?: string;
  public includes = ['bank', 'register'];

  constructor(private api: ApiService, private route: ActivatedRoute, private router: Router) { }

  ngOnInit(): void {
    const key = this.route.snapshot.paramMap.get('key') ?? '';

    getModel<Debtor>(key, 'debtors', this.api, this.router, '/debtors').then((debtor) => this.debtor = debtor);

    if (key !== '') {
      this.api.get<Loan[]>(`debtors/${key}/loans`).then((loans) => {
        if (loans.data !== undefined && loans.data.length > 0) {
          this.loan = loans.data[0];

          this.endpoint = `loans/${this.loan.key}/transactions`;
        }
      });
    }
  }

  public mapper(transaction: Transaction): { [key: string]: any } {
    const bank = transaction.bank;
    const register = transaction.register;

    return {
      bank_key: bank?.bank,
      register_key: register?.name,
      was_at: dateTimeStandardFormat(transaction?.was_at),
      loan_amount: transaction.loan_amount,
      loan_balance: transaction.loan_balance,
    };
  }
}
