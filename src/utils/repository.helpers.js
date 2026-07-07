const buildUpdateQuery = ({ table, id, data, columns, returning }) => {
  const entries = Object.entries(columns).filter(([field]) => data[field] !== undefined);

  if (entries.length === 0) {
    return null;
  }

  const setClauses = entries.map(([, column], index) => `${column} = $${index + 1}`);
  const values = entries.map(([field]) => data[field]);

  values.push(id);

  return {
    text: `
      UPDATE ${table}
      SET ${setClauses.join(", ")}, updated_at = CURRENT_TIMESTAMP
      WHERE id = $${values.length}
      RETURNING ${returning};
    `,
    values,
  };
};

module.exports = {
  buildUpdateQuery,
};
