import { IsEnum, IsNumber, IsString, ValidateNested, IsNotEmpty, IsPhoneNumber, IsArray, ArrayMinSize, ArrayMaxSize } from "class-validator";
import { Transform, Type } from "class-transformer";
import { ParcelType, DeliveryType } from "src/common/enums/parcel.enum";

class RecipientInfoDto {
    @IsString()
    @IsNotEmpty()
    fullname: string;

    @IsPhoneNumber()
    @IsNotEmpty()
    phone_number: string;
}

class LocationDto {
    @IsString()
    @IsNotEmpty()
    address: string;

    @Transform(({ value }) => Array.isArray(value) ? value.map(parseFloat) : value)
    @IsArray()
    @ArrayMinSize(2)
    @ArrayMaxSize(2)
    @IsNumber({}, { each: true })
    coordinates: [number, number];
}

export class CreateParcelDto {
    @IsString()
    @IsNotEmpty()
    description: string;

    @Transform(({ value }) => typeof value === 'string' ? JSON.parse(value) : value)
    @ValidateNested()
    @Type(() => RecipientInfoDto)
    @IsNotEmpty()
    recipient_info: RecipientInfoDto;

    @IsEnum(DeliveryType)
    @IsNotEmpty()
    delivery_type: DeliveryType;

    @IsEnum(ParcelType)
    @IsNotEmpty()
    parcel_type: ParcelType;

    @Transform(({ value }) => parseFloat(value))
    @IsNumber()
    @IsNotEmpty()
    weight: number;

    @IsString()
    @IsNotEmpty()
    dimensions: string;

    @Transform(({ value }) => typeof value === 'string' ? JSON.parse(value) : value)
    @ValidateNested()
    @Type(() => LocationDto)
    @IsNotEmpty()
    pickup_location: LocationDto;

    @Transform(({ value }) => typeof value === 'string' ? JSON.parse(value) : value)
    @ValidateNested()
    @Type(() => LocationDto)
    @IsNotEmpty()
    dropoff_location: LocationDto;

    @Transform(({ value }) => parseFloat(value))
    @IsNumber()
    @IsNotEmpty()
    delivery_cost: number;
}