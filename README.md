# Glacier-wk


Glacier-wk uses to a node run-time to query your glacier vaults for inventory and upload and download archives. Particularly useful for archives that are larger than 1GB as you'll need to perform a multi-part upload. The client is able to perform these actions by leveraging the aws CLI and configuration installed on your computer. Here is a list of what the client can do.

- multipart uploads
- inventory queries
- archive downloads
- more..

## Limitations

- Only runs on \*nix based systems (use a Linux subsystem for windows)
- No support for single part uploads
- Uploads, although broken into multiple parts are atomic. You'll need to start the upload over if one part fails

## Requirements

- node ^8.0.0
- python ^2.7
- aws-cli v2

## Before you begin

- You must have an AWS account and aws-cli setup and configured on your computer.
- glacier-wk uses your current aws account and does not accept profile parameters. `aws --profile`
- glacier-wk will write and read from vaults in your Default region as set in your aws configuration
- glacier-wk can not create vaults. You'll need to log into your AWS console and create a vault before being able to upload anything
- AWS glacier is really cheap but you pay for storage AND retrieval https://aws.amazon.com/s3/pricing/s
- The official maximum size of an archive to upload is 40TB, but I have only tested with files up to 150GB. Please open an issue if a larger file fails to upload.
- The larger the file is, the larger the chunk size you should select from the prompt to split your file. Chunk size can range from 1Mb to around 2GB. It's recommended you pick the largest possible chunk size.
- For many of the commands below, you'll find that the cli asks you to provide a project name. This essentially referes to directories that glacier-wk creates to keep all configuration Ids organized and easier to manage.

## Installation

1. clone the repo
2. `npm i`

## Usage

### Uploading a file

1. `npm run glacier`
2. Pick upload and follow the prompts.

### Retrieving an archive without knowing the archiveId

1. `npm run glacier`
2. pick the vault inventory option and wait for the inventory file to become available [6 - 24 hrs]
3. `npm run glacier`
4. pick the get archive Ids option.
5. Navigate to your project directory, Identify the archive you want to download, copy the archiveId.
6. `npm run glacier`
7. pick the initiate retieval option.
8. Wait a little for the job to become available.
9. retrieve the jobId from the output file and run `npm run glacier` then pick retrieve.

### Querying contents of your vault

1. Check step 1 and 2 above.

### Querying progress of a job

1. `npm run glacier`
2. pick the query job option then provide vault and project name.

### Deleting an archive

1. Once you have your archiveId (steps 1 and 2 from the retrieve routing above) run `npm run glacier`
2. pick the query job option then provide vault and project name.
