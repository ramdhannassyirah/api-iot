export const handleMessage = async (config, topic, payload) => {
  let data;
  try {
    data = JSON.parse(payload.toString());
  } catch {
    console.warn(`[mqtt:${config.name}] payload bukan JSON di ${topic}`);
    return;
  }

  // TODO: validasi data (zod), lalu simpan ke tabel sensor
  // contoh: await awlrService.saveReading(config.id, data);
  console.log(`[mqtt:${config.name}] ${topic}`, data);
};