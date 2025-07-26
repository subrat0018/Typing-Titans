package main

import (
	"fmt"
	"net/http"
	"typing-titans/controller"
	"typing-titans/service/cron"
)

func main() {
	http.HandleFunc("/ws", controller.WsHandler)
	fmt.Printf("WebSocket Server Started...")
	go cron.RunCronJob()
	err := http.ListenAndServe(":8080", nil)
	if err != nil {
		fmt.Printf("Error while initializing server err: %v", err)
	}
}
