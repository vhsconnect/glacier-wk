uploading

1. initiate multipart upload -> return an init json -> extract init
2. after splitting. upload-multipart-part each part with the upload id 
3. after all the uploads, confirm checksum hash -> 



retrieving

1. get inventory list
2. get archive id
3. initiate archive retrieval job with a specific formatted json indiacting archive id > returns a job id 
4. download the archive with the job id
