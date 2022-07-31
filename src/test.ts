import path from 'path';

console.log(Boolean(process.env.TS_NODE_DEV)? 'DEVELOPMENT_ENV' : 'PRODUCTION_ENV');
console.log(path.resolve(__filename));