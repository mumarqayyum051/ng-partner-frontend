import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'no-content',
  templateUrl: './no-content.component.html',
  styleUrls: ['./no-content.component.css'],
})
export class NoContentComponent implements OnInit {
  @Input() label = 'No More Connections!';

  constructor() {}

  ngOnInit(): void {}
}
