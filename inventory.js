const shell = require('shelljs');
let vaultName = process.argv[2]
let output = process.argv[3]
shell.echo('USAGE: npm run inventory [vault-name] [filename.json]')
shell.exec(`
aws glacier initiate-job --account-id - --vault-name ${vaultName} --job-parameters '{"Type": "inventory-retrieval"}' > ${output}
`)


