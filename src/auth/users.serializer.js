exports.serializeUserWithToken = (userWithToken) => {
  return {
    user: {
      email: userWithToken.user.email,
      subscription: userWithToken.user.subscription,
    },
    token: userWithToken.token,
  };
};

exports.serializeUser = (user) => {
  return {
    email: user.email,
    subscription: user.subscription,
    avatarURL: user.avatarURL,
  };
};

exports.serializeUserAvatar = (user) => {
  return {
    avatarURL: user.avatarURL,
  };
};
