const handleAsync = asyncFunc => async (req, res, next) => {
  try {
    await asyncFunc(req, res, next);
  } catch (error) {
    next(error);
  }
};

export default handleAsync;
