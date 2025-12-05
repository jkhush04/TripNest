module.exports = (fn) => {
  return (req, res, next) => {
    fn(req, res, next).catch((e) => next(e));
  };
};
//wrapasync is a middleware and is used to handle errors in async functions