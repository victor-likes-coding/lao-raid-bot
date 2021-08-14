export const errors = {
  bans: {
    NO_BAN_PERMS: {
      text: "You do not possess the capability to ban members, please reach out to the owner for access.",
      code: 10000,
    },
    NO_BAN_BOTS: {
      text: "The command you are attempting to use is intended towards human members and not bots.",
      code: 10001,
    },
    NO_MOD_BANS: {
      text: "Can't ban members who can ban others, it's usurping power.",
      code: 10002,
    },
    NO_SELF_BAN: {
      text: "Members cannot ban themselves, please leave the server yourself if you want to ban yourself.",
      code: 10003,
    },
  },
  interactions: {
    GEN_ERR: {
      text: "There was an error while executing this command!",
      code: 20000,
    },
  },
  kicks: {
    NO_KICK_PERMS: {
      text: "You do not possess the capability to kick members, please reach out to the owner for access.",
      code: 40000,
    },
    NO_KICK_BOTS: {
      text: "The command you are attempting to use is intended towards human members and not bots.",
      code: 40001,
    },
    NO_MOD_KICKS: {
      text: "Can't kick members who can kick others, it's usurping power.",
      code: 40002,
    },
    NO_SELF_KICK: {
      text: "Members cannot kick themselves, please leave the server yourself if you want to kick yourself.",
      code: 40003,
    },
  },
  internal: {
    MISS_REQ_PARAMS: {
      text: "Missing required params in setting error up.",
      code: 30000,
    },
    NAN: {
      text: "Required parm should be a floatable string (i.e. .5 or 1.25 etc)",
      code: 30001,
    },
  },
};
