const parseId = (value) => {
  const id = Number(value);

  if (!Number.isInteger(id) || id < 1) {
    return null;
  }

  return id;
};

const sendError = (res, error) => {
  const statusCode = error.statusCode || 500;
  const isProduction = process.env.NODE_ENV === "production";

  return res.status(statusCode).json({
    message: statusCode === 500 && isProduction ? "Internal server error" : error.message,
  });
};

const asyncHandler = (handler) => {
  return async (req, res) => {
    try {
      await handler(req, res);
    } catch (error) {
      sendError(res, error);
    }
  };
};

const requireId = (req, res) => {
  const id = parseId(req.params.id);

  if (!id) {
    res.status(400).json({ message: "Invalid id parameter" });
    return null;
  }

  return id;
};

module.exports = {
  asyncHandler,
  requireId,
};
