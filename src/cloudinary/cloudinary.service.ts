import { Inject, Injectable } from '@nestjs/common';
import { UploadApiOptions } from 'cloudinary';
import { CLOUDINARY } from 'src/lib/constants';
import { Readable } from 'stream';
import { buffer } from 'stream/consumers';

@Injectable()
export class CloudinaryService {
    constructor(@Inject(CLOUDINARY) private readonly cloudinaryV2: CloudinaryV2) { }

    async uploadFile(file: Express.Multer.File, options: UploadApiOptions = {}) {
        return new Promise<CloudinaryResponse>((resolve, reject) => {
            const uploadOpts: UploadApiOptions = {
                folder: options.folder || 'uploads',
                resource_type: options.resource_type || 'auto',
                public_id: options.public_id,
                ...(options.transformation && { transformation: options.transformation }),
            };

            const uploadStream = this.cloudinaryV2.uploader.upload_stream(
                uploadOpts,
                (error, result) => {
                    if (error) return reject(error);
                    resolve(result!);
                }
            );
            const bufferStream = new Readable();
            bufferStream.push(file.buffer);
            bufferStream.push(null);

            bufferStream.pipe(uploadStream);
        });
    }

    async deleteFile(public_id: string) {
        return new Promise((resolve, reject) => {
            this.cloudinaryV2.uploader.destroy(public_id, (error, result) => {
                if (error) return reject(error);
                resolve(result);
            });
        });
    }

    getImageUrl(public_id: string) {
        return this.cloudinaryV2.url(public_id);
    }
}
