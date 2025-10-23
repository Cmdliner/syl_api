export enum ParcelStatus {
    RECEIVED = 'received',
    ASSIGNED = 'assigned',
    PICKED_UP = 'picked_up',
    DELIVERED = 'delivered',
    IN_TRANSIT = 'in_transit',
    FAILED = 'failed',
    CANCELLED='cancelled'

};

export enum DeliveryType {
    INTRASTATE = 'intrastate', 
    INTERSTATE = 'interstate',
    LOCAL = 'local',
    EXPRESS = 'express',
    STANDARD = 'standard'
}

export enum ParcelType {
    BULK = 'bulk',
    FRAGILE = 'fragile',
    PERISHABLE = 'perishable',
    DOCUMENT = 'document',
    OVERSIZED = 'oversized',
    STANDARD = 'standard'
}