const pickDefined = (source, fields) => {
  const dto = {};

  fields.forEach((field) => {
    if (source[field] !== undefined) {
      dto[field] = source[field];
    }
  });

  return dto;
};

const toDtoList = (items, mapper) => {
  return items.map((item) => mapper(item));
};

module.exports = {
  pickDefined,
  toDtoList,
};
