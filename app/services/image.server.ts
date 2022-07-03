import type { UploadHandler } from '@remix-run/node';
import { writeAsyncIterableToWritable } from '@remix-run/node';
import {
  unstable_composeUploadHandlers as composeUploadHandlers,
  unstable_createMemoryUploadHandler as createMemoryUploadHandler,
} from '@remix-run/node';
import AWS from 'aws-sdk';
import { PassThrough } from 'stream';

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
        Bucket: 'photo-sharing-service-dev-dev-dev',
        Key,
        Body: pass,
        ContentType: 'image/png',
      })
      .promise(),
  };
};

export async function uploadStreamToS3(data: any, filename: string) {
  const stream = uploadStream({
    Key: 'website/images/' + filename,
  });
  await writeAsyncIterableToWritable(data, stream.writeStream);
  const file = await stream.promise;
  return file;
}

export const s3UploadHandler: UploadHandler = async ({ filename, data }) => {
  const uploaded = await uploadStreamToS3(data, filename!);
  return (
    'https://' +
    process.env.DEV_HOST +
    '/' +
    uploaded.Key.replace('website/', '')
  );
};

export const uploadHandler: UploadHandler = composeUploadHandlers(
  s3UploadHandler,
  createMemoryUploadHandler()
);
