import {Component, OnInit, ViewChild} from "@angular/core";
import {UserService} from "./service/user.service";
import {IPrivateUser} from "./user.model";
import {ActivatedRoute, Data, Router} from "@angular/router";
import SharedModule from "../../shared/shared.module";
import {NgOptimizedImage} from "@angular/common";
import {TaskComponent} from "../task/list/task.component";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {UserSearchDialogComponent} from "./user-search-dialog/user-search-dialog.component";
import {FormsModule} from "@angular/forms";


@Component({
  selector: 'jhi-user-taskpage',
  standalone: true,
  imports: [SharedModule, NgOptimizedImage, TaskComponent, FormsModule],
  templateUrl: './user.component.html'
})
export class UserComponent implements OnInit {
  @ViewChild(TaskComponent) taskComponent!: TaskComponent;
  user?: IPrivateUser | null;
  data!: Data;

  constructor(
    private userService: UserService,
    private route: ActivatedRoute,
    private router: Router,
    private modalService: NgbModal
  ) {
    // this.router.events.subscribe(() => {
    //   this.modalService.dismissAll();
    // })
  }

  ngOnInit(): void {
    const login = this.route.snapshot.paramMap.get('login');
    if (login) {
      this.userService.find(login).subscribe(user => this.user = user.body);
    }

    this.route.data.subscribe((data: Data) => this.data = data)
  }

  showUsers(): void {
    this.modalService.open(UserSearchDialogComponent, {size: 'lg'})
  }
}
