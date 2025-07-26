package dto

type Stats struct {
	totalCorrectChars int64
	updatedAt         int64
	speed             float64
	isFinished        bool
}

func (s *Stats) TotalCorrectChars() int64 {
	if s == nil {
		return 0
	}
	return s.totalCorrectChars
}

func (s *Stats) UpdatedAt() int64 {
	if s == nil {
		return 0
	}
	return s.updatedAt
}

func (s *Stats) Speed() float64 {
	if s == nil {
		return 0
	}
	return s.speed
}

func (s *Stats) IsFinished() bool {
	if s == nil {
		return false
	}
	return s.isFinished
}

func NewStats(totalCorrectChars int64, updatedAt int64, speed float64, isFinished bool) *Stats {
	return &Stats{
		totalCorrectChars: totalCorrectChars,
		updatedAt:         updatedAt,
		speed:             speed,
		isFinished:        isFinished,
	}
}

func (s *Stats) IsEmpty() bool {
	return (s == nil || (s.totalCorrectChars == 0 && s.updatedAt == 0 && s.speed == 0 && !s.isFinished))
}

func (s *Stats) SetSpeed(speed float64) {
	s.speed = speed
}

func (s *Stats) SetTotalCorrectChars(chars int64) {
	s.totalCorrectChars = chars
}

func (s *Stats) SetUpdatedAt(time int64) {
	s.updatedAt = time
}

func (s *Stats) SetIsFinished(isFinished bool) {
	s.isFinished = isFinished
}
