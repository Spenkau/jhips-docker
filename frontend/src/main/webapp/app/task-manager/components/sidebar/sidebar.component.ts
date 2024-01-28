import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {AsyncPipe, NgForOf} from "@angular/common";
import {ICategory} from "../../task-manager.model";
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

  @Output() filters: EventEmitter<{ filterName: string, value: string }> = new EventEmitter();
  @Output() showSidebar = new EventEmitter();
  categoriesList!: ICategory[];

  constructor(private categoryService: CategoryService) {
  }

  ngOnInit(): void {
    this.categoryService.categories().subscribe(res => {
      this.categoriesList = res;
    });
  }

  applyCategoryFilter(id: number): void {
    this.closeSidebar();
    this.filters.emit({filterName: 'categoryId.equals', value: id.toString()})
  }

  closeSidebar(): void {
    this.showSidebar.emit(false);
  }

}
