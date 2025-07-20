package dto

type StateMachine struct {
	createdAt    int64
	startsAt     int64
	currentState State
}

type State string

const (
	StateUnspecified State = "Unspecified"
	StateCreate      State = "Create"
	StateInProgress  State = "InProgress"
	StateEnd         State = "End"
)

func (s *StateMachine) CreatedAt() int64 {
	if s == nil {
		return 0
	}
	return s.createdAt
}

func (s *StateMachine) StartsAt() int64 {
	if s == nil {
		return 0
	}
	return s.startsAt
}

func (s *StateMachine) CurrentState() State {
	if s == nil {
		return StateUnspecified
	}
	return s.currentState
}
