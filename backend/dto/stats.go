package dto

type Stats struct {
	totalCorrectWords int64
}

func (s *Stats) TotalCorrectWords() int64 {
	if s == nil {
		return 0
	}
	return s.totalCorrectWords
}
