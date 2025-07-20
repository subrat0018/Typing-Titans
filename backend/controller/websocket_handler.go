package controller

import (
	"fmt"
	"net/http"

	"github.com/gorilla/websocket"
)

var upgrade = websocket.Upgrader{
	CheckOrigin: func(r *http.Request) bool { return true },
}

func WsHandler(w http.ResponseWriter, r *http.Request) {
	conn, err := upgrade.Upgrade(w, r, nil)
	if err != nil {
		fmt.Printf("Error while upgrading, err: %v", err)
		return
	}

	defer conn.Close()
	for {
		_, message, err := conn.ReadMessage()
		if err != nil {
			fmt.Println("Error while reading message")
		}
		fmt.Printf("Recieved: %v\n", string(message))

		err = conn.WriteMessage(websocket.TextMessage, []byte("Ok"))
	}
}
