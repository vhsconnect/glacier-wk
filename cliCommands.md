- get archive-ids with a job-id

```console
 aws glacier get-job-output --account-id - --vault-name <my-vault> --job-id <job-id> output.json
```

- get job-ids from an inventory : inventory-retrivel

```console
aws glacier initiate-job --account-id - --vault-name my-vault --job-parameters '{"Type": "inventory-retrieval"}'
```

- list all jobs

```console
aws glacier list-jobs --account-id - --vault-name <my-vault>
```

- Get job info / status

```console
aws glacier describe-job --account-id - --vault-name <my-vault> --job-id <job-id>
```

- confirm a job's final hash

```console
aws glacier complete-multipart-upload --checksum <TREEHASH> --archive-size <archive-sizse> --upload-id <upload-id> --account-id - --vault-name <my-vault>
```

- describe the vault

```console
aws glacier describe-vault --account-id - --vault-name <myvault>
```

- retrieving an archive: Initiatizing an Archive Retrieval job

```console
aws glacier initiate-job --account-id - --vault-name <my-vault> --job-parameters file://job-archive-retrieval.json
```

-> where job-archive-retrieval.json can be the following

```json
{
  "Type": "archive-retrieval",
  "ArchiveId": "",
  "Description": "",
  "SNSTopic": ""
}
```

- download archive

```console
aws glacier get-job-output --account-id - --vault-name <vault> --job-id <job-id> output.zip
```

- delete archive

```console
aws glacier delete-archive --vault-name <vault> --account-id - --archive-id *** <archiveID> ***
```
