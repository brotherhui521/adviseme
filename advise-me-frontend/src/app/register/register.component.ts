import { Component, OnInit, ElementRef, ViewChild } from "@angular/core";
import { RestService } from "../rest.service";
import { Router } from "@angular/router";

@Component({
  selector: "app-register",
  templateUrl: "./register.component.html",
  styleUrls: ["./register.component.css"]
})
export class RegisterComponent implements OnInit {
  constructor(public rest: RestService, public router: Router) {}

  validationMessage: String;
  user: any = {
    email: "",
    password: "",
    firstName: null,
    lastName: null,
    title: null,
    department: null
  };

  ngOnInit(): void {}

  close() {
    this.validationMessage = null;
  }

  async register(): Promise<void> {
    this.validationMessage = null;
    try {
      const data = await this.rest.register(this.user);
      console.log({ data });
      localStorage.setItem("user", JSON.stringify(data));
      this.router.navigateByUrl("/home");
    } catch (e) {
      console.log({ e });

      this.validationMessage = "User Already Exists";
    }
  }
}
