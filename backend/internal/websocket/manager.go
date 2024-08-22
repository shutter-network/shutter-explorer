package websocket

import (
	"encoding/json"
	"log"
	"net/http"
	"sync"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/gorilla/websocket"
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
func (manager *ClientManager) Run() {
	// Start the periodic message sender and query the db via usecases
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

// sendPeriodicMessages sends a JSON object to all clients every 5 seconds
func (manager *ClientManager) sendPeriodicMessages(d time.Duration, message interface{}) {
	for {
		time.Sleep(d)

		messageJSON, err := json.Marshal(message)
		if err != nil {
			log.Println("Error marshalling JSON:", err)
			continue
		}

		manager.broadcast <- messageJSON
	}
}
