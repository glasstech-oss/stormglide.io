import {
    WebSocketGateway,
    WebSocketServer,
    SubscribeMessage,
    OnGatewayConnection,
    OnGatewayDisconnect,
    MessageBody,
    ConnectedSocket
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Logger } from '@nestjs/common';

@WebSocketGateway({
    cors: {
        origin: process.env.FRONTEND_URL || 'http://localhost:3000',
        credentials: true,
    },
})
export class EventsGateway implements OnGatewayConnection, OnGatewayDisconnect {
    @WebSocketServer()
    server: Server;

    private readonly logger = new Logger(EventsGateway.name);
    private activeConnections = 0;

    // Triggers when a client (or your React app) connects
    handleConnection(client: Socket) {
        this.activeConnections++;
        this.logger.log(`Client connected: ${client.id}. Total active: ${this.activeConnections}`);

        // Instantly broadcast the updated "Live Pulse" to everyone on the landing page
        this.server.emit('system_pulse', {
            status: 'SYSTEMS NOMINAL',
            activeUsers: this.activeConnections,
            deployments: 14 // You can dynamically pull this from Prisma later
        });
    }

    handleDisconnect(client: Socket) {
        this.activeConnections--;
        this.logger.log(`Client disconnected: ${client.id}`);
        this.server.emit('system_pulse', {
            status: 'SYSTEMS NOMINAL',
            activeUsers: this.activeConnections,
        });
    }

    // Listens for a client submitting feedback on their Staging Sandbox
    @SubscribeMessage('submit_staging_feedback')
    handleStagingFeedback(
        @MessageBody() data: { projectId: string; comment: string },
        @ConnectedSocket() client: Socket,
    ) {
        this.logger.log(`Live feedback received for Project ${data.projectId}: ${data.comment}`);

        // Broadcast this specifically to the Super Admin dashboard in real-time
        this.server.emit('admin_notification', {
            type: 'NEW_FEEDBACK',
            message: `New feedback on project ${data.projectId}`,
            timestamp: new Date(),
        });

        return { status: 'Received by Command Center' };
    }
}
