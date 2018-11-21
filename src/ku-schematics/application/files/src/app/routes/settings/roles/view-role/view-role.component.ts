import { Component, OnInit, Input } from "@angular/core";
import { NzModalRef, NzModalService } from "ng-zorro-antd";
import { NzMessageService } from "ng-zorro-antd";
import {
    FormBuilder,
    FormGroup,
    FormControl,
    Validators,
    ValidationErrors,
    ReactiveFormsModule
} from "@angular/forms";
import { AddAccountComponent } from "../../account/add-account/add-account.component";
import { AuthSettingService } from "../../auth-setting.service";
import { Account, UserList, Role } from "../../domain";
@Component({
    selector: "app-view-role",
    templateUrl: "./view-role.component.html",
    styleUrls: ["./view-role.component.less"]
})
export class ViewRoleComponent implements OnInit {
    @Input() name: string;
    @Input() id: number;
    constructor(
        private fb: FormBuilder,
        private modalService: NzModalService,
        private message: NzMessageService,
        private modal: NzModalRef,
        private authService: AuthSettingService
    ) {}
    searchKey: string;
    validateForm: FormGroup;
    description: string;
    // 角色关联用户
    dataSet: Account[];
    current: number = 1;
    pageSize: number = 7;
    nzTotal: number = 0;
    // 清空搜索词
    emptySearchKey() {
        this.searchKey = null;
        this.current = 1;
        this.getUserList();
    }
    // 查看用户详情
    viewDetail(id, name) {
        const title = name + " ( ID:" + id + " )";
        const modal2 = this.modalService.create({
            nzTitle: title,
            nzContent: AddAccountComponent,
            nzClosable: true,
            nzWidth: "800",
            nzComponentParams: {
                id: id,
                name: name,
                roles: true, // 区别于用户管理里的用户详情
                type: "view"
            },
            nzFooter: [
                {
                    label: "取消",
                    shape: "default",
                    onClick: () => modal2.destroy()
                }
            ]
        });
    }
    getUserList(type?: string) {
        if (type === "search") {
            this.current = 1;
        }
        //  console.log("getUserList by key", this.searchKey);
        this.authService
            .getUsers(this.searchKey, this.id, this.pageSize, this.current)
            .subscribe(data => {
                // console.log("role detail getUsers", data);
                if (data) {
                    this.nzTotal = data["total"];
                    this.dataSet = data["records"];
                }
            });
    }
    getUserByRole(): void {
        this.authService
            .getRoleDetail(this.id, this.pageSize, this.current)
            .subscribe(data => {
                //  console.log(data);
                if (data) {
                    this.nzTotal = data["total"];
                    this.description = data.description;
                    // this.dataSet = data.associatedUsers;
                }
            });
    }

    ngOnInit() {
        this.getUserByRole();
        this.getUserList();
    }
}
