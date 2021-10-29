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
  };
};

// exports.deserializeUser = ((id, done) => {
//   User.findById(id, (err, user) => {
//     done(err, user);
//   });
// });
