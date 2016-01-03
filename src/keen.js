import Keen from 'keen-js';

import config from '../config.json';

// Setup keen instance
const keen = new Keen(config.keen);
export default keen;
