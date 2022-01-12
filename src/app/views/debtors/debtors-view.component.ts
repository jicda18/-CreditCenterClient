import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { GridComponent } from 'src/app/components/grid/grid.component';
import { Debtor } from 'src/app/models/debtor.model';
import { GridCol } from 'src/app/models/grid-col.model';
import { Loan } from 'src/app/models/loan.model';
import { ApiService } from 'src/app/services/api.service';
import { dateStandardFormat, dateTimeStandardFormat, getModel, toCurrency } from 'src/app/utils/helpers.utils';

@Component({
  selector: 'app-debtors-view',
  templateUrl: './debtors-view.component.html',
  styles: [
  ]
})
export class DebtorsViewComponent implements OnInit {
  public debtor?: Debtor;

  @ViewChild('grid', { static: false }) private _grid?: GridComponent;

  public cols: GridCol[] = [
    { key: 'inserted_at', label: 'Fecha', type: 'date', filter: false },
    { key: 'amount', label: 'Monto', type: 'numeric', filter: false },
    { key: 'interest', label: 'Interes', type: 'text', filter: false },
    { key: 'type', label: 'Tipo', type: 'text', filter: false },
    { key: 'summary', label: 'Capital', type: 'numeric', filter: false },
    { key: 'frequency_key', label: 'Frecuency', type: 'text', filter: false },
    { key: 'currency_key', label: 'Moneda', type: 'text', filter: false },
    { key: 'fee_amount', label: 'Cuotas', type: 'numeric', filter: false },
    { key: 'thanks_days', label: 'Dia de Gracias', type: 'numeric', filter: false },
  ];
  public endpoint?: string;
  public includes = ['currency', 'frequency'];

  constructor(private api: ApiService, private route: ActivatedRoute, private router: Router) { }

  ngOnInit(): void {
    const key = this.route.snapshot.paramMap.get('key') ?? '';

    getModel<Debtor>(key, 'debtors', this.api, this.router, '/debtors').then((debtor) => this.debtor = debtor);

    if (key !== '') {
      this.endpoint = `debtors/${key}/loans`;
    }
  }

  public mapper(loan: Loan): { [key: string]: any } {
    const currency = loan.currency;
    const frequency = loan.frequency;

    return {
      key: loan.key,
      inserted_at: dateStandardFormat(loan.inserted_at),
      amount: toCurrency(loan.amount ?? 0),
      interest: (loan.interest * 100) + '%',
      type: loan.type === 'interest_capital' ? 'Interes más Capital' : 'Interes Fijo',
      summary: toCurrency(loan.summary ?? 0),
      frequency_key: frequency?.title,
      currency_key: currency?.currency,
      fee_amount: toCurrency(loan.fee_amount),
      thanks_days: loan.thanks_days,
    };
  }
}
