import { Component, OnInit, ElementRef, ViewChild } from "@angular/core";
import { RestService } from "../rest.service";
import { Router } from "@angular/router";
import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal';
import {UserListSelectorComponent} from "../user-list-selector/user-list-selector.component";
import {initialState} from "ngx-bootstrap/timepicker/reducer/timepicker.reducer";


@Component({
  selector: 'app-template',
  templateUrl: './template.component.html',
  styleUrls: ['./template.component.css']
})
export class TemplateComponent implements OnInit {
  public modalRef: BsModalRef;

  constructor(public rest: RestService, public router: Router, private modalService: BsModalService) { }

  users: any

  tags: any

  selectedTags: any


 async ngOnInit(): Promise<void> {
    const users = await this.rest.getUsers();
    this.users = users;
    const tags = users.map(user => {
      return {
        display: `${user.firstName} ${user.lastName}`,
        value: user,
        readonly: true
      }
    })
   this.tags = tags;
  }

  onItemAdded(event) {
    console.log("HERE!")
    this.session.assignedUserIds = this.selectedTags.map(tag => tag.value._id)
  }

  validationMessage: String;

  session: any={
    topic: "",
    creatorFirstName: "",
    creatorEmail: "",
    departmentFilter: "",
    assignedUserIds: [],
    prompts: []
  }

  addPrompt() {
    this.session.prompts.push({
      label: "",
      type: null,
      possibleAnswers: null
    })
  }


  close() {
    this.validationMessage = null;
  }

  async assignUsersModal() {
    const initialState = {users: this.users}
    this.modalRef = this.modalService.show(UserListSelectorComponent, {  initialState });
    this.modalRef.content.onClose.subscribe(result => {
      console.log('results', result);
    })
  }

  async createSession(): Promise<void> {
    this.validationMessage = null;
    try {
      //const promptData = await this.rest.createPrompt(this.prompt);
      console.log(this.session)
      const data = await this.rest.createSession(this.session);
      console.log({ data });

    } catch (e) {
      console.log({ e });
    }

  }
}