import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-loading',
  templateUrl: './loading.component.html',
  styles: [
  ]
})
export class LoadingComponent implements OnInit {
  @Input() public theme = 'yellow';
  @Input() public loading = false;
  @Input() public size = '2rem';
  @Input() public customClass = '';
  @Input() public lineWidth = '0.25em';

  constructor() { }

  ngOnInit(): void {
  }

}
