const { getUserActivity } = require("../handlers/getActivityUser");
const { sendFormattedEvents } = require("../handlers/formatedEvents");
const { handleManagerError } = require("../handlers/errorHandler");
const axios = require("axios");

jest.mock("axios");

describe("getUserActivity", () => {
  let consoleErrorSpy;

  beforeEach(() => {
    consoleErrorSpy = jest.spyOn(console, "error").mockImplementation(() => {});
  });

  afterEach(() => {
    consoleErrorSpy.mockRestore();
    jest.clearAllMocks();
  });

  test("should handle 404 error (username invalid)", async () => {
    const username = "InvalidUser";
    const mockError = {
      response: {
        status: 404,
        statusText: "Not Found",
      },
    };
    axios.get.mockRejectedValueOnce(mockError);

    const result = await getUserActivity(username);

    expect(axios.get).toHaveBeenCalledTimes(1);
    expect(axios.get).toHaveBeenCalledWith(
      `https://api.github.com/users/${username}/events`
    );

    expect(consoleErrorSpy).toHaveBeenCalledTimes(1);
    expect(consoleErrorSpy).toHaveBeenCalledWith(
      "Error: User 'InvalidUser' not found on GitHub"
    );
    expect(result).toBeUndefined();
  });

  test("should handle other API errors", async () => {
    const username = "AnotherUser";
    const mockError = {
      response: {
        status: 500,
        statusText: "Server Error",
      },
    };
    axios.get.mockRejectedValueOnce(mockError);

    const result = await getUserActivity(username);

    expect(axios.get).toHaveBeenCalledTimes(1);
    expect(consoleErrorSpy).toHaveBeenCalledTimes(1);
    expect(consoleErrorSpy).toHaveBeenCalledWith(
      "GitHub API Error: 500 - Server Error"
    );
  });

  test("should handle network errors", async () => {
    const username = "NetworkErrorUser";
    const mockError = {
      message: "Network Error",
    };
    axios.get.mockRejectedValueOnce(mockError);

    const result = await getUserActivity(username);

    expect(axios.get).toHaveBeenCalledTimes(1);
    expect(consoleErrorSpy).toHaveBeenCalledTimes(1);
    expect(consoleErrorSpy).toHaveBeenCalledWith("Error: Network Error");
  });
});

describe("sendFormattedEvents", () => {
  test("should return all PushEvents with their counts and other events without counts", () => {
    const mockActivityData = [
      { type: "PushEvent", name: "AngelPenalver/repo1" },
      { type: "PushEvent", name: "AngelPenalver/repo2" },
      { type: "PushEvent", name: "AngelPenalver/repo1" },
      { type: "PushEvent", name: "AngelPenalver/repo2" },
      { type: "CreateEvent", name: "AngelPenalver/repo1" },
      { type: "WatchEvent", name: "AngelPenalver/repo2" },
    ];
    const result = sendFormattedEvents(mockActivityData);

    const expected = [
      { name: "AngelPenalver/repo1", type: "PushEvent", value: 2 },
      { name: "AngelPenalver/repo2", type: "PushEvent", value: 2 },
      { name: "AngelPenalver/repo1", type: "CreateEvent" },
      { name: "AngelPenalver/repo2", type: "WatchEvent" },
    ];

    expect(result).toEqual(expected);
  });

  test("should handle empty activity data", () => {
    const result = sendFormattedEvents([]);
    expect(result).toEqual([]);
  });

  test("should handle unknown event types", () => {
    const mockActivityData = [
      { type: "UnknownEvent", name: "AngelPenalver/repo1" },
    ];
    const result = sendFormattedEvents(mockActivityData);
    expect(result).toEqual([
      { name: "AngelPenalver/repo1", type: "UnknownEvent" },
    ]);
  });
});

describe("handleManagerError", () => {
  let consoleErrorSpy;

  beforeEach(() => {
    consoleErrorSpy = jest.spyOn(console, "error").mockImplementation(() => {});
  });

  afterEach(() => {
    consoleErrorSpy.mockRestore();
  });

  test("should handle 404 error", () => {
    const error = {
      response: {
        status: 404,
      },
    };
    const username = "testuser";
    const result = handleManagerError(error, username);

    expect(consoleErrorSpy).toHaveBeenCalledWith(
      "Error: User 'testuser' not found on GitHub"
    );
    expect(result).toBe("Error: User 'testuser' not found on GitHub");
  });

  test("should handle other API errors", () => {
    const error = {
      response: {
        status: 500,
        statusText: "Server Error",
      },
    };
    const result = handleManagerError(error);

    expect(consoleErrorSpy).toHaveBeenCalledWith(
      "GitHub API Error: 500 - Server Error"
    );
    expect(result).toBe("GitHub API Error: 500 - Server Error");
  });

  test("should handle non-API errors", () => {
    const error = {
      message: "Network Failure",
    };
    const result = handleManagerError(error);

    expect(consoleErrorSpy).toHaveBeenCalledWith("Error: Network Failure");
    expect(result).toBe("Error: Network Failure");
  });
});
