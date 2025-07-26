package request

type Event struct {
	EventType EventType `json:"event_type"`
	Data      *Data     `json:"data"`
}

type Data struct {
	Word string `json:"word"`
}

func (d *Data) GetWord() string {
	if d == nil {
		return ""
	}
	return d.Word
}

type EventType string

const (
	EventTypeUnspecified EventType = "unspecified"
	EventTypeJoin        EventType = "join"
	EventTypeUpdate      EventType = "update"
)

func (e *Event) GetEventType() EventType {
	if e == nil {
		return EventTypeUnspecified
	}
	return e.EventType
}

func (e *Event) GetData() *Data {
	if e == nil {
		return &Data{}
	}

	return e.Data
}
