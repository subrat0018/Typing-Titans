package cron

import (
	"fmt"
	"time"
)

func RunCronJob() {
	ticker := time.NewTicker(1 * time.Second)

	for {
		t := <-ticker.C
		fmt.Printf("time from ticker: %v\n", t)
	}
}
