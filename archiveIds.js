const shell = require('shelljs')
let vaultName = process.argv[2]
let inventoryJSON = require('./' + process.argv[3])
let output = process.argv[4]

let jobId = inventoryJSON.jobId

shell.echo('USAGE: npm run archiveIds [vault-name] [inventory job file] [output file]')
shell.exec(`
 aws glacier get-job-output --account-id - --vault-name ${vaultName} --job-id ${jobId} ${output}
`)
