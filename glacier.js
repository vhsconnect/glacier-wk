const prompt = require('./prompt.js');
const handler = require('./handler.js');
const inventory = require('./inventory.js');
const archiveIds = require('./archiveIds.js');
const initRetrieval = require('./initRetrieval.js');
const retrieve = require('./retrieve.js');
const deleteArchive = require('./delete.js');
const queryJob = require('./queryJob.js');


const welcomePromptPairs = [[
  `Hello, What would you like to do?\n
0. Upload\n
1. Start a vault inventory job\n
2. Get Archive Ids\n
3. Inititate archive retrieval job\n
4. Retrieve your archive\n
5. Delete your archive\n
6. Query the progress of a pending job\n
`, 'response',
]];

const exe = [
  handler,
  inventory,
  archiveIds,
  initRetrieval,
  retrieve,
  deleteArchive,
  queryJob,
];

prompt(welcomePromptPairs, ({ response }) => exe[Number(response)]());
