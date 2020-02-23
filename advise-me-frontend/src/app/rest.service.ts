import { Injectable } from "@angular/core";
import {
  HttpClient,
  HttpHeaders,
  HttpErrorResponse
} from "@angular/common/http";
import AuthService from "./authentication/auth-service";
import { Socket } from "ngx-socket-io";
import { Session } from "./models/session";

const endpoint = "http://localhost:3000/";

@Injectable({
  providedIn: "root"
})
export class RestService {
  constructor(
    private http: HttpClient,
    public auth: AuthService,
    private socket: Socket
  ) {}

  sessionsChanged = this.socket.fromEvent<any>("sessionChanged");
  sessionsAdded = this.socket.fromEvent<any>("sessionAdded");
  promptAsked = this.socket.fromEvent<any>("promptAsked");

  getHeaders(headers: HttpHeaders = new HttpHeaders()): HttpHeaders {
    return headers.append(
      "Authorization",
      "Basic " + btoa(`${this.auth?.user?.email}:${this.auth?.user?.password}`)
    );
  }

  async post(url, body) {
    try {
      const httpOptions = {
        headers: this.getHeaders()
      };
      const data = await this.http.post(url, body, httpOptions).toPromise();
      return data;
    } catch (err) {
      console.log({ err });
      if (err.status === 401) {
        throw { error: "UNAUTHORIZED" };
      }
      throw { ERROR: "ERROR" };
    }
  }

  async put(url, body) {
    try {
      const httpOptions = {
        headers: this.getHeaders()
      };
      const data = await this.http.put(url, body, httpOptions).toPromise();
      console
      return data;
    } catch (err) {
      console.log({ err });
      if (err.status === 401) {
        throw { error: "UNAUTHORIZED" };
      }
      throw { ERROR: "ERROR" };
    }
  }


  async get(url, options: any = {}) : Promise<any> {
    try {
      console.log({options})
      const newHeaders = this.getHeaders(options?.headers);
      options.headers = newHeaders;

      console.log({options})

      console.log({ options });

      const data = await this.http.get(url, options).toPromise();
      return data;
    } catch (err) {
      console.log({ err });
      if (err.status === 401) {
        throw { error: "UNAUTHORIZED" };
      }
      throw { ERROR: "ERROR" };
    }
  }

  async getUsers() : Promise<any> {
    const data = await this.get(`${endpoint}users`);
    return data;
  }

  async getUser(userId) {
    const data = await this.get(`${endpoint}users/${userId}`);
    return data;
  }

  async login(user) {
    const data = await this.post(`${endpoint}login`, user);
    console.log({ data });
    return data;
  }

  async register(user) {
    const data = await this.post(`${endpoint}register`, user);
    console.log({ data });
    return data;
  }

  async updateUser(userId, user) {
    const data = await this.put(`${endpoint}users/${userId}`, user);
    console.log({ data });
    return data;
  }

  async createSession(session) {
    return this.post(`${endpoint}sessions`, session);
  }

  async updateSession(sessionId, sessionUpdates) {
    return this.put(`${endpoint}sessions/${sessionId}`, sessionUpdates);
  }

  async activateSession(sessionId, sessionUpdates) {
    return this.put(`${endpoint}sessions/${sessionId}`, sessionUpdates);
  }

  async getSessionById(id) {
    return this.get(`${endpoint}sessions/${id}`);
  }


  async answerPrompt(sessionId, promptId, response) {

    return this.post(`${endpoint}sessions/${sessionId}/prompts/${promptId}/answer-prompt`, {response});
  }

  async updatePrompt(sessionId, promptId, displayIndex) {

    return this.put(`${endpoint}sessions/${sessionId}/prompts/${promptId}`, {displayIndex});
  }

  async getSessionsByUserIds(userIds: [String]) {
    console.log({userIds})
    return this.get(`${endpoint}sessions`, {
      params: {userIds}
    });
  }
}
