const array = require("./array");
const cookies = require("js-cookie");

module.exports = {
  session: {
    getToken: () => {
      return { access_token: cookies.get("access_token") };
    },
    getUser: () => {
      let userStr = cookies.get("user");
      if (userStr) return JSON.parse(userStr);
      else return {};
    }
  },

  permissions: {
    list: () => {
      let permissions = cookies.get("permissions");
      if (permissions) return JSON.parse(permissions);
      else return {};
    },
    has: (perms = []) => {
      try {
        if (typeof perms == "string") perms = perms.split(",");
        let permissions = cookies.get("permissions");
        if (!permissions) return false;
        permissions = JSON.parse(permissions);
        return array.arrayContainsArray(permissions, perms);
      } catch (e) {
        return false;
      }
    }
  }
};
