import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {AsyncPipe, NgForOf} from "@angular/common";
import {CategoryService, EntityArrayResponseType} from "../../../entities/category/service/category.service";
import {ICategory} from "../../../entities/category/category.model";
import {RouterLink} from "@angular/router";

@Component({
  selector: 'jhi-sidebar',
  standalone: true,
  imports: [
    NgForOf,
    AsyncPipe,
    RouterLink
  ],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss'
})
export class SidebarComponent implements OnInit {

  @Output() filters: EventEmitter<{ filterName: string, value: string }> = new EventEmitter();
  @Output() showSidebar = new EventEmitter();
  categoriesList!: ICategory[] | null;

  predicate = 'id';
  ascending = true;

  constructor(private categoryService: CategoryService) {
  }

  trackId = (_index: number, item: ICategory): number => this.categoryService.getCategoryIdentifier(item);

  ngOnInit(): void {
    this.categoryService.query().subscribe((res: EntityArrayResponseType) => {
      this.categoriesList = res.body;
      console.log(this.categoriesList)

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
