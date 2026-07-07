const createError = (statusCode, message) => {
  const error = new Error(message);
  error.statusCode = statusCode;
  return error;
};

const ensureFound = (record, message) => {
  if (!record) {
    throw createError(404, message);
  }

  return record;
};

const mapDatabaseError = (error, fallbackMessage = "Database operation failed") => {
  if (error.code === "23505") {
    return createError(409, "Record already exists");
  }

  if (error.code === "23503") {
    return createError(400, "Referenced record does not exist");
  }

  if (error.code === "42703" || error.code === "42P01") {
    return createError(500, "Database schema is out of date. Run npm run migrate.");
  }

  return createError(500, fallbackMessage);
};

module.exports = {
  createError,
  ensureFound,
  mapDatabaseError,
};
