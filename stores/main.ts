import { Alert } from 'models/alert.model';
import { defineStore } from 'pinia';
import { User } from "firebase/auth";
import { User_db } from 'models/user_db.model';


export const useStore = defineStore('main', {
  state: () => {
    return {
      user: {} as User,
      user_db: {} as User_db,
      alerts: new Array<Alert>,
      sign_in_alert: false as Boolean,
      global_loading: true as Boolean,
    };
  },
  getters: {
    getUser():User {
      return this.user;
    },
    getUser_db():User_db {
      return this.user_db
    },
    getAlerts():Array<Alert> {
      return this.alerts;
    },
    getSignInAlert():Boolean {
      return this.sign_in_alert;
    },
    getGlobalLoading():Boolean {
      return this.global_loading
    },
  },
  actions: {
    setUser(user:User):void {
      this.user = user;
    },
    setUser_db(user_db:User_db):void {
      this.user_db = user_db
    },
    setAlert(alert:Alert):void {
      this.alerts.push(alert);
    },
    patchAlerts(alert:Alert):void {
      const index = this.alerts.indexOf(alert);
      const arr = [...this.alerts];
      arr.splice(index, 1);
      this.alerts = arr;
    },
    resetAlerts():void {
      this.alerts = [];
    },
    setSignInAlert(sign_in_alert:boolean):void {
      console.log('SetSignInAlert')
      this.sign_in_alert = sign_in_alert;
    },
    setGlobalLoading(loading:Boolean):void {
      this.global_loading = loading;
    },
  },
});
