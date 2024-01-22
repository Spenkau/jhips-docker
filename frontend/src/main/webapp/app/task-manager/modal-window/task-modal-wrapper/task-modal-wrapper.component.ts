import {AfterViewInit, Component, ElementRef, ViewChild} from '@angular/core';
import {NewTaskModalComponent} from "../new-task-modal/new-task-modal.component";
import {NgIf} from "@angular/common";

@Component({
  selector: 'jhi-task-modal-wrapper',
  standalone: true,
  imports: [
    NewTaskModalComponent,
    NgIf
  ],
  templateUrl: './task-modal-wrapper.component.html',
  styleUrl: './task-modal-wrapper.component.scss'
})
export class TaskModalWrapperComponent implements AfterViewInit {
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
