import {AfterViewInit, Component, OnInit, ViewChild} from "@angular/core";
import {UserService} from "./service/user.service";
import {IPrivateUser} from "./user.model";
import {ActivatedRoute, Data} from "@angular/router";
import SharedModule from "../../shared/shared.module";
import {NgOptimizedImage} from "@angular/common";
import {TaskComponent} from "../task/list/task.component";


@Component({
  selector: 'jhi-user-taskpage',
  standalone: true,
  imports: [SharedModule, NgOptimizedImage, TaskComponent],
  templateUrl: './user.component.html'
})
export class UserComponent implements OnInit, AfterViewInit {
  @ViewChild(TaskComponent) taskComponent!: TaskComponent;
  user?: IPrivateUser | null;
  data!: Data;

  constructor(
    private userService: UserService,
    private route: ActivatedRoute
  ) {
  }

  ngOnInit(): void {
    const login = this.route.snapshot.paramMap.get('login');
    if (login) {
      this.userService.find(login).subscribe(user => this.user = user.body);
    }

    this.route.data.subscribe((data: Data) => this.data = data)
  }

  ngAfterViewInit(): void {
    // this.taskComponent.load();
  }


}
