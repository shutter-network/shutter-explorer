package websocket

import (
	"context"
	"encoding/json"
	"net/http"
	"sync"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/gorilla/websocket"
	"github.com/pkg/errors"
	"github.com/rs/zerolog/log"
	"github.com/shutter-network/shutter-explorer/backend/internal/usecase"
)

// ClientManager manages WebSocket clients and broadcasting
type ClientManager struct {
	clients    map[*websocket.Conn]bool
	broadcast  chan []byte
	register   chan *websocket.Conn
	unregister chan *websocket.Conn
	usecases   *usecase.Usecases
	sync.Mutex
}

// NewClientManager creates a new ClientManager
func NewClientManager(usecases *usecase.Usecases) *ClientManager {
	return &ClientManager{
		clients:    make(map[*websocket.Conn]bool),
		broadcast:  make(chan []byte),
		register:   make(chan *websocket.Conn),
		unregister: make(chan *websocket.Conn),
		usecases:   usecases,
	}
}

// Run starts the manager to handle register/unregister clients and broadcasting messages
func (manager *ClientManager) Run(ctx context.Context) {
	// Start the periodic message sender and query the db via usecases
	manager.sendTotalExecutedTransactions(ctx, 60*time.Second, "shielded inclusion")
	manager.sendLatestSequencerTransactions(ctx, 30*time.Second, "10")
	manager.sendLatestUserTransactions(ctx, 60*time.Second, "10")
	manager.sendTotalTXsByTXStatusLast30Days(ctx, 60*time.Second, "shielded inclusion")

	for {
		select {
		case conn := <-manager.register:
			manager.Lock()
			manager.clients[conn] = true
			manager.Unlock()
		case conn := <-manager.unregister:
			manager.Lock()
			if _, ok := manager.clients[conn]; ok {
				delete(manager.clients, conn)
				conn.Close()
			}
			manager.Unlock()
		case message := <-manager.broadcast:
			manager.Lock()
			for conn := range manager.clients {
				err := conn.WriteMessage(websocket.TextMessage, message)
				if err != nil {
					conn.Close()
					delete(manager.clients, conn)
				}
			}
			manager.Unlock()
		}
	}
}

// HandleWebSocket handles WebSocket connections
func (manager *ClientManager) HandleWebSocket(c *gin.Context) {
	upgrader := websocket.Upgrader{
		CheckOrigin: func(r *http.Request) bool {
			return true
		},
	}

	conn, err := upgrader.Upgrade(c.Writer, c.Request, nil)
	if err != nil {
		return
	}

	manager.register <- conn

	for {
		_, _, err := conn.ReadMessage()
		if err != nil {
			manager.unregister <- conn
			break
		}
	}
}

// sendPeriodicMessages sends a JSON object to all clients every d seconds
func (manager *ClientManager) sendPeriodicMessages(ctx context.Context, d time.Duration, callback func(ctx context.Context) WebsocketResponse) {
	for {
		time.Sleep(d)
		message := callback(ctx)

		log.Debug().Str("eventType", string(message.Type)).Msg("streamed websocket periodic message")
		messageJSON, err := json.Marshal(message)
		if err != nil {
			log.Err(errors.Wrapf(err, "errors while marshalling JSON"))
			continue
		}
		manager.broadcast <- messageJSON
	}
}
