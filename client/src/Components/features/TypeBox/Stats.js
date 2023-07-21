import React from "react";
import { Box } from "@mui/system";
import { Tooltip } from "@mui/material";
import { CHAR_TOOLTIP_TITLE } from "../../../constants/Constants";

const Stats = ({ username, status, wpm, statsCharCount }) => {
  return (
    <>
      <div>Username: {username}</div>
      <Box display="flex" flexDirection="row">
        <h3>WPM: {Math.round(wpm)}</h3>
        {status === "finished" && (
          <h4>Accuracy: {Math.round(statsCharCount[0])} %</h4>
        )}
        {status === "finished" && (
          <Tooltip
            title={
              <span style={{ whiteSpace: "pre-line" }}>
                {CHAR_TOOLTIP_TITLE}
              </span>
            }
          >
            <h4>
              Char:{" "}
              <span className="correct-char-stats">{statsCharCount[1]}</span>/
              <span className="incorrect-char-stats">{statsCharCount[2]}</span>/
              <span className="missing-char-stats">{statsCharCount[3]}</span>/
              <span className="extra-char-stats">{statsCharCount[4]}</span>
            </h4>
          </Tooltip>
        )}
      </Box>
    </>
  );
};

export default Stats;
