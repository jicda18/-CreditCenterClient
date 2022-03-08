import { Component, Input, OnInit } from '@angular/core';
import { toCurrency } from 'src/app/utils/helpers.utils';

@Component({
  selector: 'app-overview-card',
  templateUrl: './overview-card.component.html',
  styleUrls: ['./overview-card.component.scss']
})
export class OverviewCardComponent implements OnInit {
  @Input() data: { title: string, icon: string, value: string | number, description?: string, theme: string }[] = [];

  constructor() { }

  ngOnInit(): void {
  }

  public format_value(value: number | string): string {
    return typeof value === 'string' ? value : toCurrency(value);
  }
}
