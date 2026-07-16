const { Storage } = require('@google-cloud/storage');
const storage = new Storage();
const bucketName = 'astraltrash_other';
const prefix = 'psychedelic/';

async function listFiles() {
  try {
    const [files] = await storage.bucket(bucketName).getFiles({ prefix });
    files.forEach(file => {
      console.log(file.name);
    });
  } catch (error) {
    console.error('Error listing files:', error);
  }
}
listFiles();
