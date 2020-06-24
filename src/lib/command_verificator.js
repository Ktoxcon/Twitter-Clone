const unbracket = require("unbracket");

const longArguments = (command) => {
  return unbracket.unbracketWithBrackets(command);
};

const CommandParser = (req) => {
  const longArgument = longArguments(req.body.command).join("");
  const replacement = new RegExp(longArgument);
  const rawReq = req.body.command.replace(replacement, "");
  const toParse = rawReq
    .trim()
    .split(" ")
    .filter((arg) => arg.trim());
  const command = toParse.shift();
  const args = [longArgument, ...toParse.filter((i) => i !== "[]")];

  return { command, args };
};

const CommandMatcher = ({ command }) => {
  const COMMANDS = [
    "ADD_TWEET",
    "DELETE_TWEET",
    "EDIT_TWEET",
    "VIEW_TWEETS",
    "FOLLOW",
    "UNFOLLOW",
    "PROFILE",
    "LOGIN",
    "REGISTER",
  ];

  const commandMatched = COMMANDS.filter(
    (match) => match === String(command).toUpperCase()
  ).join();

  if (commandMatched !== "") {
    return commandMatched;
  } else {
    return "Unrecognized command";
  }
};

const CommentValidator = (command) => {
  if (command !== "Unrecognized command") {
    return true;
  } else {
    return false;
  }
};

const ArgumentValidator = ({ command, args }) => {
  const COMMANDS = {
    ADD_TWEET: 1,
    DELETE_TWEET: 1,
    EDIT_TWEET: 2,
    VIEW_TWEETS: 1,
    FOLLOW: 1,
    UNFOLLOW: 1,
    PROFILE: 1,
    LOGIN: 2,
    REGISTER: 4,
  };

  let validArgs = false;

  for (const commandMatched in COMMANDS) {
    if (String(command).toUpperCase() === commandMatched) {
      if (args.length === COMMANDS[commandMatched]) {
        validArgs = true;
      }
    }
  }

  return validArgs;
};

const getAction = (req) => {
  const action = this.CommandParser(req);
  const validCommand = this.CommentValidator(this.CommandMatcher(action));
  const validArguments = this.ArgumentValidator(action);

  if (validCommand) {
    if (validArguments) return action;
    else {
      return { command: "NULL", args: "Invalid arguments" };
    }
  } else {
    return { command: "INVALID_COMMAND", args: "NULL" };
  }
};

module.exports = {
  CommandParser,
};
