import {Component, ElementRef, signal, ViewChild} from '@angular/core';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { NgIf } from '@angular/common';
import { RouterLink } from '@angular/router';
import {NewTaskModalComponent} from "./new-task-modal/new-task-modal.component";

@Component({
  selector: 'jhi-task-manager',
  standalone: true,
  imports: [
    FaIconComponent,
    NgIf,
    RouterLink,
    NewTaskModalComponent
  ],
  templateUrl: './task-manager.component.html',
  styleUrl: './task-manager.component.scss'
})
export default class TaskManagerComponent {
  isUserSettingsCollapsed = false;

  @ViewChild('dialog') dialog!: ElementRef<HTMLDialogElement>;

  closeModal() {
    this.dialog.nativeElement.close();
    this.dialog.nativeElement.classList.remove('opened');
  }

  openModal() {
    this.dialog.nativeElement.showModal();
    this.dialog.nativeElement.classList.add('opened');
  }

  ngAfterViewInit() {
    this.dialog.nativeElement.addEventListener('click', (event: MouseEvent) => {
      const target = event.target as Element;
      if (target.nodeName === 'DIALOG') {
        this.closeModal();
      }
    });
  }

}
