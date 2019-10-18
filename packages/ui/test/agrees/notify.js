module.exports = [
  {
    request: {
      path: "/messages",
      method: "POST",
      body: {
        message: "{:message}"
      },
      values: {
        message: "test"
      }
    },
    response: {
      body: {
        result: "{:message}"
      },
      values: {
        message: "test"
      },
      notify: {
        event: "message2",
        body: {
          message: "message! {:message}"
        }
      }
    }
  },
  {
    request: {
      path: "/messages2",
      method: "POST",
      body: {
        message: "{:message}"
      },
      values: {
        message: "test"
      }
    },
    response: {
      body: {
        result: "{:message}"
      },
      values: {
        message: "test"
      },
      notify: {
        body: {
          message: "message2 {:message}"
        }
      }
    }
  },
  {
    request: {
      path: "/long_long_long_path/messages3",
      method: "POST",
      body: {
        message: "{:message}"
      },
      values: {
        message: "test"
      }
    },
    response: {
      body: {
        result: "{:message}"
      },
      values: {
        message: "test"
      },
      notify: {
        body: {
          message: "message2 {:message}"
        }
      }
    }
  }
];
