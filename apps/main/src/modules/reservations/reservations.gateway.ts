import { RESERVATION_GATEWAY_NAMESPACE } from '@app/common/constants/websocket';
import {
    WebSocketGateway,
    WebSocketServer,
} from '@nestjs/websockets';
import { Server } from 'socket.io';

@WebSocketGateway({
    cors: {
      origin: process.env.CLIENT_APP_URL
    },
    namespace: RESERVATION_GATEWAY_NAMESPACE
})
export class ReservationGateway {
    @WebSocketServer()
    server: Server;

    emitReservation(sessionId: string) {
        this.server.emit('reservation', { sessionId });
    }
}
