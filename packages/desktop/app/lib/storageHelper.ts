export const KEY_HOME_TUTORIALS_SHOWN = "KEY_HOME_TUTORIALS_SHOWN";
export const KEY_INVEST_TUTORIALS_SHOWN = "KEY_INVEST_TUTORIALS_SHOWN";

export const LocalStorage = {
  getItem: (key: string) => {
    return localStorage.getItem(key);
  },
  setItem: (key: string, value: string) => {
    localStorage.setItem(key, value);
  },
  clear: () => {
    let homeTutorials = localStorage.getItem(KEY_HOME_TUTORIALS_SHOWN);
    let investTutorials = localStorage.getItem(KEY_INVEST_TUTORIALS_SHOWN);
    localStorage.clear();
    localStorage.setItem(KEY_HOME_TUTORIALS_SHOWN, homeTutorials ?? "");
    localStorage.setItem(KEY_INVEST_TUTORIALS_SHOWN, investTutorials ?? "");
  },
};
