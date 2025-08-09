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

func (s *StateMachine) SetCurrentState(state State) {
	if s == nil {
		s = &StateMachine{}
	}
	s.currentState = state
}

func (s *StateMachine) SetStartsAt(time int64) {
	if s == nil {
		s = &StateMachine{}
	}
	s.startsAt = time
}

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

func NewStateMachine(createdAt int64, startsAt int64, state State) *StateMachine {
	return &StateMachine{
		createdAt:    createdAt,
		startsAt:     startsAt,
		currentState: state,
	}
}
