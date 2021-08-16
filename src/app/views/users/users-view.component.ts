import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { User } from 'src/app/models/user.model';
import { ApiService } from 'src/app/services/api.service';
import { getModel } from 'src/app/utils/helpers.utils';

@Component({
  selector: 'app-users-view',
  templateUrl: './users-view.component.html',
  styles: [
  ]
})
export class UsersViewComponent implements OnInit {
  public user?: User;

  constructor(private api: ApiService, private route: ActivatedRoute, private router: Router) { }

  ngOnInit(): void {
    const key = this.route.snapshot.paramMap.get('key') ?? '';

    getModel<User>(key, 'users', this.api, this.router, '/users').then((user) => this.user = user);
  }
}
