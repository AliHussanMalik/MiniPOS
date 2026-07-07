// Request validation middleware
// Checks request data against a simple schema before the controller runs.

const isValidType = (value, type) => {
  if (type === "array") {
    return Array.isArray(value);
  }

  if (type === "integer") {
    return Number.isInteger(value);
  }

  return typeof value === type;
};

const validateObject = (schema, data, prefix = "") => {
  const errors = [];

  Object.entries(schema).forEach(([field, rules]) => {
    const value = data[field];
    const fieldName = prefix ? `${prefix}.${field}` : field;

    if (rules.required && (value === undefined || value === null || value === "")) {
      errors.push(`${fieldName} is required`);
      return;
    }

    if (value === undefined || value === null || value === "") {
      return;
    }

    if (rules.type && !isValidType(value, rules.type)) {
      errors.push(`${fieldName} must be a ${rules.type}`);
      return;
    }

    if (rules.minLength && typeof value === "string" && value.length < rules.minLength) {
      errors.push(`${fieldName} must be at least ${rules.minLength} characters`);
    }

    if (rules.min !== undefined && typeof value === "number" && value < rules.min) {
      errors.push(`${fieldName} must be at least ${rules.min}`);
    }

    if (rules.pattern && typeof value === "string" && !rules.pattern.test(value)) {
      errors.push(`${fieldName} format is invalid`);
    }

    if (rules.allowedValues && !rules.allowedValues.includes(value)) {
      errors.push(`${fieldName} must be one of: ${rules.allowedValues.join(", ")}`);
    }

    if (rules.itemSchema && Array.isArray(value)) {
      value.forEach((item, index) => {
        if (!item || typeof item !== "object" || Array.isArray(item)) {
          errors.push(`${fieldName}[${index}] must be an object`);
          return;
        }

        errors.push(...validateObject(rules.itemSchema, item, `${fieldName}[${index}]`));
      });
    }
  });

  return errors;
};

const validate = (schema, source = "body") => {
  return (req, res, next) => {
    const data = req[source] || {};
    const errors = validateObject(schema, data);

    if (errors.length > 0) {
      return res.status(400).json({
        message: "Validation failed",
        errors,
      });
    }

    return next();
  };
};

module.exports = validate;
