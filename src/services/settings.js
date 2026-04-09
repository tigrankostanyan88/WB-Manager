const AppError = require('../utils/appError');
const Files = require('../controllers/File');
const repo = require('../repositories/settings');

const buildSafeBody = (body = {}) => {
  const toStr = (v) => (v === undefined || v === null ? null : String(v));
  const safe = {};
  safe.address = toStr(body.address);
  safe.email = toStr(body.email);
  safe.phone = toStr(body.phone);
  safe.bankCard = toStr(body.bankCard);
  safe.map_lat = toStr(body.map_lat);
  safe.map_lng = toStr(body.map_lng);
  safe.facebook = toStr(body.facebook);
  safe.instagram = toStr(body.instagram);
  safe.telegram = toStr(body.telegram);
  safe.whatsapp = toStr(body.whatsapp);
  safe.siteName = toStr(body.siteName);
  if (body.workingHours !== undefined) {
    safe.workingHours = typeof body.workingHours === 'string' ? body.workingHours : body.workingHours ? JSON.stringify(body.workingHours) : null;
  }
  return safe;
};

module.exports = {
  // Get settings
  getSettings: async (startTime) => {
    await repo.sync();

    const settings = await repo.findOne({ includeFiles: true });
    if (!settings) throw new AppError('Կարգավորումները չեն գտնվել։', 404);

    const data = settings.toJSON ? settings.toJSON() : settings;
    const hasLogoFile = Array.isArray(data.files) && data.files.some(f => f.name_used === 'logo_img');
    if (!hasLogoFile) data.logo = null;

    return {
      settings: data,
      time: `${Date.now() - startTime} ms`
    };
  },

  // Update or create settings
  updateSettings: async (body, files, startTime) => {
    await repo.sync();

    const safeBody = buildSafeBody(body || {});
    const wasCreated = !(await repo.findOne());

    let row;
    if (wasCreated) {
      row = await repo.create(safeBody);
    } else {
      const existing = await repo.findOne();
      await repo.update(existing, safeBody);
      row = await repo.findOne({ includeFiles: true });
    }

    // Handle Logo Upload
    const filePayload = files?.logo || files?.image || files?.avatar;
    if (filePayload) {
      const modelForFiles = {
        id: row.id,
        files: Array.isArray(row.files) ? row.files : [],
        constructor: { name: 'settings' }
      };

      console.log(modelForFiles, 'model settings ....');
      

      const image = await new Files(modelForFiles, filePayload).replace('logo_img');

      if (image.status !== 'success') {
        throw new AppError(Object.values(image.message || {}).join(' ') || 'Logo save failed', 400);
      }

      await row.createFile(image.table);
      await repo.update(row, {
        logo: `/images/${image.table.table_name}/large/${image.table.name}.${image.table.ext}`
      });
    }

    // Refetch to get final updated data
    const updatedSettingsRow = await repo.findOne({ includeFiles: true });
    const updatedSettings = updatedSettingsRow?.toJSON ? updatedSettingsRow.toJSON() : updatedSettingsRow;
    const hasLogoFileAfter = updatedSettings && Array.isArray(updatedSettings.files) && updatedSettings.files.some(f => f.name_used === 'logo_img');
    if (updatedSettings && !hasLogoFileAfter) updatedSettings.logo = null;

    return {
      settings: updatedSettings,
      wasCreated,
      time: `${Date.now() - startTime} ms`
    };
  }
};
