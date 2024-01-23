import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {AsyncPipe, NgForOf} from "@angular/common";
import {ICategory} from "../../task-manager.model";
import {Observable} from "rxjs";
import {CategoryService} from "../../services/category.service";

@Component({
  selector: 'jhi-sidebar',
  standalone: true,
  imports: [
    NgForOf,
    AsyncPipe
  ],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss'
})
export class SidebarComponent implements OnInit {

  @Output() showSidebar = new EventEmitter();
  categoriesList!: Observable<ICategory[]>;

  constructor(private categoryService: CategoryService) {
  }

  ngOnInit(): void {
    this.categoriesList = this.categoryService.categories();

  }

  closeSidebar(): void {
    this.showSidebar.emit(false);
  }

}
