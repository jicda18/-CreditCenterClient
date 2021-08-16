import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Business } from 'src/app/models/business.model';
import { ApiService } from 'src/app/services/api.service';
import { getModel } from 'src/app/utils/helpers.utils';

@Component({
  selector: 'app-business-view',
  templateUrl: './business-view.component.html',
  styles: [
  ]
})
export class BusinessViewComponent implements OnInit {
  public business?: Business;

  constructor(private api: ApiService, private route: ActivatedRoute, private router: Router) { }

  ngOnInit(): void {
    const key = this.route.snapshot.paramMap.get('key') ?? '';

    getModel<Business>(key, 'businesses', this.api, this.router, '/businesses').then((business) => this.business = business);
  }
}
