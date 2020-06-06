const prompt = require('./prompt.js');
const handler = require('./handler.js');
const inventory = require('./inventory.js');
const archiveIds = require('./archiveIds.js');
const initRetrieval = require('./initRetrieval.js');
const retrieve = require('./retrieve.js');

const welcomePromptPairs = [[
  `Hello, What would you like to do?\n
0. Upload\n
1. Start inventory retrieval job\n
2. Get vault inventory\n
3. Start an archive retrieval job\n
4. Retrieve your archive\n
`, 'response',
]];

const exe = [handler, inventory, archiveIds, initRetrieval, retrieve];
console.log('about to prompt');
prompt(welcomePromptPairs, true, ({ response }) => {
  console.log('handler', handler);
  console.log('response', response);
  return exe[Number(response)]();
});
