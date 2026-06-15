import { createNhostClient, withClientSideSessionMiddleware } from '@nhost/nhost-js';

const nhost = createNhostClient({
  subdomain: import.meta.env.VITE_NHOST_SUBDOMAIN || 'local',
  region: import.meta.env.VITE_NHOST_REGION || 'local',
  configure: [withClientSideSessionMiddleware]
});

export default nhost;
