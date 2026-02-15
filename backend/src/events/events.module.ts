import { Module } from '@nestjs/common';
import { EventsGateway } from './events.gateway';

@Module({
    providers: [EventsGateway],
    exports: [EventsGateway], // Export so CRM or Billing services can trigger live events
})
export class EventsModule { }
