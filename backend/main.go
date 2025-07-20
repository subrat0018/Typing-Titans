package main

import (
	"fmt"
	"net/http"
	"typing-titans/controller"
)

func main() {
	http.HandleFunc("/ws", controller.WsHandler)
	fmt.Printf("WebSocket Server Started...")
	err := http.ListenAndServe(":8080", nil)
	if err != nil {
		fmt.Printf("Error while initializing server err: %v", err)
	}
}
