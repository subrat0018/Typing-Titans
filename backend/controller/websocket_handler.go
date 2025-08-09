package controller

import (
	"encoding/json"
	"fmt"
	"net/http"
	"typing-titans/service"
	"typing-titans/service/request"

	"github.com/google/uuid"
	"github.com/gorilla/websocket"
)

var upgrade = websocket.Upgrader{
	CheckOrigin: func(r *http.Request) bool { return true },
}

func WsHandler(w http.ResponseWriter, r *http.Request) {
	conn, err := upgrade.Upgrade(w, r, nil)
	fmt.Println("Creating a new socket...")
	if err != nil {
		fmt.Printf("Error while upgrading, err: %v", err)
		return
	}

	clientID, err := uuid.NewUUID()
	if err != nil {
		fmt.Printf("Error while generating UUID, err: %v", err)
	}

	defer conn.Close()
	for {
		_, message, err := conn.ReadMessage()
		if err != nil {
			fmt.Println("Error while reading message")
			return
		}

		event := &request.Event{}
		err = json.Unmarshal(message, event)
		if err != nil {
			fmt.Printf("Error while unmarshalling err: %v", err)
			return
		}

		resp := service.HandleGame(clientID.String(), event, conn)
		err = conn.WriteMessage(websocket.TextMessage, []byte(resp.Message))
	}
}
