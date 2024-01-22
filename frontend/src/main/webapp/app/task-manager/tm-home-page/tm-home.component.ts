import {Component, ElementRef, OnInit, signal, ViewChild} from '@angular/core';
import {FaIconLibrary, FontAwesomeModule} from '@fortawesome/angular-fontawesome';
import {AsyncPipe, NgForOf, NgIf, NgStyle} from '@angular/common';
import { RouterLink } from '@angular/router';
import {NewTaskModalComponent} from "../components/modal-window/new-task-modal/new-task-modal.component";
import {ClockComponent} from "../components/clock/clock.component";
import {TaskModalWrapperComponent} from "../components/modal-window/task-modal-wrapper/task-modal-wrapper.component";
import {SidebarComponent} from "../components/sidebar/sidebar.component";
import {faArrowAltCircleDown} from "@fortawesome/free-solid-svg-icons";
import {TaskService} from "../services/task.service";
import {ITask} from "../task-manager.model";
import {Observable} from "rxjs";


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
    NgStyle,
    AsyncPipe,
    NgForOf
  ],
  templateUrl: './tm-home.component.html',
  styleUrl: './tm-home.component.scss'
})

export default class TmHomeComponent implements OnInit {
  @ViewChild('modalWrapper') modalWrapper!: TaskModalWrapperComponent
  isUserSettingsCollapsed = false;
  subtask = false;
  showSidebar = false;
  taskList!: Observable<ITask[]>;

  constructor(
    private taskService: TaskService,
    private library: FaIconLibrary
  ) {
    library.addIcons(faArrowAltCircleDown)
  }

  ngOnInit() {
    this.taskList = this.taskService.tasks();
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
