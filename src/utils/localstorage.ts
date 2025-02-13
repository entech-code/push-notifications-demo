"use client";

interface UserData {
  firebaseToken?: string;
}

class User {
  private _data: UserData = {};
  reactCallback: ((token: string) => void) | undefined;

  constructor(setToken?: (token: string) => void) {
    if (typeof localStorage !== "undefined") {
      const localUser = localStorage.getItem("user");
      if (!localUser) localStorage.setItem("user", JSON.stringify({}));

      Object.assign(
        this._data,
        JSON.parse(localStorage.getItem("user") || "{}"),
      );
    }
    this.reactCallback = setToken;
  }

  data = new Proxy(this._data, {
    get(target, prop, receiver) {
      return Reflect.get(target, prop, receiver);
    },
    set: (target, prop, value, receiver) => {
      if (typeof localStorage !== "undefined") {
        localStorage.setItem(
          "user",
          JSON.stringify({ ...target, [prop]: value }),
        );
      }
      if (this?.reactCallback) this.reactCallback(value);
      return Reflect.set(target, prop, value, receiver);
    },
  });
}

export default User;
