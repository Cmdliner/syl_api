import { Module } from '@nestjs/common';
import { ParcelsController } from './parcels.controller';
import { ParcelsService } from './parcels.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Parcel, ParcelSchema } from './schemas/parcel.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Parcel.name, schema: ParcelSchema }])
  ],
  controllers: [ParcelsController],
  providers: [ParcelsService],
  exports: [MongooseModule]
})
export class ParcelsModule { }
