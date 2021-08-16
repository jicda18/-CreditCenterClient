import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Guarantor } from 'src/app/models/guarantor.model';
import { ApiService } from 'src/app/services/api.service';
import { getModel } from 'src/app/utils/helpers.utils';

@Component({
  selector: 'app-guarantors-view',
  templateUrl: './guarantors-view.component.html',
  styles: [
  ]
})
export class GuarantorsViewComponent implements OnInit {
  public guarantor?: Guarantor;

  constructor(private api: ApiService, private route: ActivatedRoute, private router: Router) { }

  ngOnInit(): void {
    const key = this.route.snapshot.paramMap.get('key') ?? '';

    getModel<Guarantor>(key, 'guarantors', this.api, this.router, '/guarantors').then((guarantor) => this.guarantor = guarantor);
  }
}
