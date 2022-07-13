import type { UploadHandler } from '@remix-run/node';
import { writeAsyncIterableToWritable } from '@remix-run/node';
import {
  unstable_composeUploadHandlers as composeUploadHandlers,
  unstable_createMemoryUploadHandler as createMemoryUploadHandler,
} from '@remix-run/node';
import AWS from 'aws-sdk';
import { PassThrough } from 'stream';
import { v4 as uuid } from 'uuid';

const { S3_ACCESS_KEY_ID, S3_SECRET_ACCESS_KEY, S3_REGION, S3_BUCKET_NAME } =
  process.env;

if (
  !(S3_ACCESS_KEY_ID && S3_SECRET_ACCESS_KEY && S3_REGION && S3_BUCKET_NAME)
) {
  throw new Error(`AWS and S3 is missing required configuration.`);
}

const uploadStream = ({ Key }: Pick<AWS.S3.Types.PutObjectRequest, 'Key'>) => {
  const s3 = new AWS.S3({
    credentials: {
      accessKeyId: S3_ACCESS_KEY_ID,
      secretAccessKey: S3_SECRET_ACCESS_KEY,
    },
    region: S3_REGION,
  });
  const pass = new PassThrough();
  return {
    writeStream: pass,
    promise: s3
      .upload({
        Bucket: S3_BUCKET_NAME,
        Key,
        Body: pass,
        ContentType: 'image/png',
      })
      .promise(),
  };
};

export async function uploadStreamToS3(data: AsyncIterable<Uint8Array>) {
  const stream = uploadStream({
    Key: 'images/' + uuid(),
  });
  await writeAsyncIterableToWritable(data, stream.writeStream);
  const file = await stream.promise;
  return file;
}

export const s3UploadHandler: UploadHandler = async ({ data }) => {
  const uploaded = await uploadStreamToS3(data);
  return 'https://' + process.env.DEV_HOST + '/' + uploaded.Key;
};

export const uploadHandler: UploadHandler = composeUploadHandlers(
  s3UploadHandler,
  createMemoryUploadHandler()
);
