import Mux from '@mux/mux-node';

const { Video } = new Mux(
  process.env.MUX_TOKEN_ID,
  process.env.MUX_TOKEN_SECRET
);

export default async function handler(req, res) {
  try {
    const upload = await Video.Uploads.create({
      cors_origin: 'https://your-dashboard-domain.com', // Allow client-side uploads
      new_asset_settings: {
        playback_policy: 'public', // Adjust as needed
      },
    });

    res.status(200).json({
      url: upload.url, // Signed URL for direct upload
      uploadId: upload.id,
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to create MUX upload URL' });
  }
}