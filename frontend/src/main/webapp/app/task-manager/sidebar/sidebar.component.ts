import { Component } from '@angular/core';
import {NgForOf} from "@angular/common";

@Component({
  selector: 'jhi-sidebar',
  standalone: true,
  imports: [
    NgForOf
  ],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss'
})
export class SidebarComponent {

}
