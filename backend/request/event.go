package request

type Event struct {
	EventType EventType
	Data      Data
}

type Data struct {
	word string
}

type EventType string

const (
	EventTypeJoin   EventType = "join"
	EventTypeUpdate EventType = "update"
)
