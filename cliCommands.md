- get archive-ids with a job-id

```console
 aws glacier get-job-output --account-id - --vault-name my-vault --job-id zbxcm3Z_3z5UkoroF7SuZKrxgGoDc3RloGduS7Eg-RO47Yc6FxsdGBgf_Q2DK5Ejh18CnTS5XW4_XqlNHS61dsO4CnMW output.json
```

- get job-ids from an inventory : inventory-retrivel

```console
aws glacier initiate-job --account-id - --vault-name vault58 --job-parameters '{"Type": "inventory-retrieval"}'
```

- list all jobs

```console
aws glacier list-jobs --account-id - --vault-name my-vault
```

Get job info / status

```console
aws glacier describe-job --account-id - --vault-name my-vault --job-id zbxcm3Z_3z5UkoroF7SuZKrxgGoDc3RloGduS7Eg-RO47Yc6FxsdGBgf_Q2DK5Ejh18CnTS5XW4_XqlNHS61dsO4CnMW
```

confirm a job's final hash

```console
aws glacier complete-multipart-upload --checksum $TREEHASH --archive-size 3145728 --upload-id $UPLOADID --account-id - --vault-name vault58
```

describe the vault

```console
aws glacier describe-vault --account-id - --vault-name myvault
```

- retrieving an archive: Initiatizing an Archive Retrieval job

```console
aws glacier initiate-job --account-id - --vault-name my-vault --job-parameters file://job-archive-retrieval.json
```

-> where job-archive-retrieval.json can be the following

```json
{
  "Type": "archive-retrieval",
  "ArchiveId": "kKB7ymWJVpPSwhGP6ycSOAekp9ZYe_--zM_mw6k76ZFGEIWQX-ybtRDvc2VkPSDtfKmQrj0IRQLSGsNuDp-AJVlu2ccmDSyDUmZwKbwbpAdGATGDiB3hHO0bjbGehXTcApVud_wyDw",
  "Description": "Retrieve archive on 2015-07-17",
  "SNSTopic": "arn:aws:sns:us-west-2:0123456789012:my-topic"
}
```

download archive

```console
aws glacier get-job-output --account-id - --vault-name vault58 --job-id "" output.zip
```
