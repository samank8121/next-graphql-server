import { GraphQLUpload } from 'graphql-upload-ts';
import type { FileUpload } from 'graphql-upload-ts';
import { scalarType, extendType, nonNull, arg } from 'nexus';
import { createWriteStream } from 'fs';
import path from 'path';
import { File } from '../entities/File';
import { Context } from '../types/Context';

export const Upload = scalarType({
  name: 'Upload',
  asNexusMethod: 'upload', // allows t.upload() in your type definitions
  description: 'The `Upload` scalar type represents a file upload.',
  serialize: GraphQLUpload.serialize,
  parseValue: GraphQLUpload.parseValue,
  parseLiteral: GraphQLUpload.parseLiteral,
});

const UPLOAD_DIR = path.join(process.cwd(), 'uploads'); // create this folder

export const FileMutations = extendType({
  type: 'Mutation',
  definition(t) {
    t.nonNull.field('uploadFile', {
      type: 'File', // or a simple objectType if you prefer
      args: {
        file: nonNull(arg({ type: 'Upload' })),
        // you can add more args like folder, description, etc.
      },
      async resolve(_parent, { file }, context: Context): Promise<File> {
        console.log('Received file upload request');
        console.log('File argument:', file);
        const { userId } = context;
        if (!userId) {
          throw new Error('You must be logged in to upload files');
        }

        const { createReadStream, filename, mimetype } = await file as FileUpload;

        // Generate unique filename to avoid collisions
        const uniqueFilename = `${Date.now()}-${filename}`;
        const filePath = path.join(UPLOAD_DIR, uniqueFilename);

        // Ensure upload directory exists
        // (you can use fs.promises.mkdir with { recursive: true } in production)

        // Stream the file to disk
        return new Promise((resolve, reject) => {
          createReadStream()
            .pipe(createWriteStream(filePath))
            .on('finish', async () => {
              const fileEntity = File.create({
                filename: uniqueFilename,
                originalName: filename,
                mimetype,
                size: 0, // you can get size from stream if needed
                path: filePath,
                user: { id: userId }, // or load the full user
              });

              await fileEntity.save();
              resolve(fileEntity);
            })
            .on('error', (err:any) => reject(err));
        });
      },
    });
  },
});