package service

import "typing-titans/service/request"

// For later use:: when I'll use a cache and a db
type BaseGameHandler interface {
	HandleGame(clientID string, event *request.Event)
}
