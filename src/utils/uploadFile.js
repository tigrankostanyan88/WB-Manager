const AppError = require('./appError');
const Files = require('../controllers/File');

module.exports = uploadFile = async (repo, row, modelName, file, nameUsed, field = null) => {
  const modelForFiles = {
    id: row.id,
    files: Array.isArray(row.files) ? row.files : [],
    modelName,
  };

  const image = await new Files(modelForFiles, file).replace(nameUsed);

  if (image.status !== 'success') {
    const msg =
      (typeof image.message === 'object'
        ? Object.values(image.message).join(' ')
        : image.message) || 'Image save failed';
    throw new AppError(msg, 400);
  }

  await repo.createFile(image.table);

  if (field) {
    const path = `/images/${image.table.table_name}/large/${image.table.name}.${image.table.ext}`;
    await repo.update(row, { [field]: path });
  }

  return image;
};

