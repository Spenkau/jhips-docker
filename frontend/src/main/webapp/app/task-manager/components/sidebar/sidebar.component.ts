import {Component, EventEmitter, Output, signal} from '@angular/core';
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

  @Output() showSidebar = new EventEmitter();

  closeSidebar(): void {
    this.showSidebar.emit(false);
  }

}
