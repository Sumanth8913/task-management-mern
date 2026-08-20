// Small helpers to keep API response shape consistent across controllers.
class ApiError extends Error {
  constructor(statusCode, message, details = null) {
    super(message);
    this.statusCode = statusCode;
    this.details = details;
  }
}

const success = (res, statusCode, data, meta = undefined) => {
  const body = { success: true, data };
  if (meta) body.meta = meta;
  return res.status(statusCode).json(body);
};

module.exports = { ApiError, success };
