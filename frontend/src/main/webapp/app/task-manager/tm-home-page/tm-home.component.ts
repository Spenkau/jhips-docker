import {Component, ElementRef, signal, ViewChild} from '@angular/core';
import {FaIconLibrary, FontAwesomeModule} from '@fortawesome/angular-fontawesome';
import {NgIf, NgStyle} from '@angular/common';
import { RouterLink } from '@angular/router';
import {NewTaskModalComponent} from "../modal-window/new-task-modal/new-task-modal.component";
import {ClockComponent} from "../clock/clock.component";
import {TaskModalWrapperComponent} from "../modal-window/task-modal-wrapper/task-modal-wrapper.component";
import {SidebarComponent} from "../sidebar/sidebar.component";
import {faArrowAltCircleDown} from "@fortawesome/free-solid-svg-icons";


@Component({
  selector: 'jhi-task-manager',
  standalone: true,
  imports: [
    FontAwesomeModule,
    NgIf,
    RouterLink,
    NewTaskModalComponent,
    ClockComponent,
    TaskModalWrapperComponent,
    SidebarComponent,
    NgStyle
  ],
  templateUrl: './tm-home.component.html',
  styleUrl: './tm-home.component.scss'
})

export default class TmHomeComponent {
  @ViewChild('modalWrapper') modalWrapper!: TaskModalWrapperComponent
  isUserSettingsCollapsed = false;
  subtask = false;
  showSidebar = false;

  constructor(library: FaIconLibrary) {
    library.addIcons(faArrowAltCircleDown)
  }


  openModal(subtask: boolean): void {
    this.subtask = subtask;
    this.modalWrapper.openModal();
  }

  closeSidebar(value: boolean): void
  {
    this.showSidebar = value;
  }

}
