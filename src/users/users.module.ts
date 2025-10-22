import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from './schemas/user.schema';
import { UsersService } from './users.service';
import { CloudinaryModule } from 'src/cloudinary/cloudinary.module';
import { Customer, CustomerSchema } from './schemas/discriminators/customer.schema';
import { Rider, RiderSchema } from './schemas/discriminators/rider.schema';

@Module({
    imports: [
        MongooseModule.forFeature([{
            name: User.name,
            schema: UserSchema,
            discriminators: [
                { name: Customer.name, schema: CustomerSchema },
                { name: Rider.name, schema: RiderSchema }
            ]
        }]),
        CloudinaryModule
    ],
    providers: [UsersService],
    controllers: [UsersController],
    exports: [MongooseModule],

})
export class UsersModule { }