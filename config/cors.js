const cors = require('cors');
const { ENV } = require('./env');

module.exports.corsMiddleware = cors({
  origin: (origin, cb) => {
    if (!origin) return cb(null, true);
    try {
      const hostname = new URL(origin).hostname;
      const ok = ENV.allowedOrigins.some((o) => {
        if (o === 'https://*.vercel.app') return hostname.endsWith('.vercel.app');
        return origin.startsWith(o);
      });
      return ok ? cb(null, true) : cb(new Error('CORS blocked'));
    } catch {
      return cb(new Error('Invalid origin'));
    }
  },
  credentials: true,
  methods: ['GET','POST','OPTIONS']
});
