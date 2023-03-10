import React from "react";
import { useMemo } from "react";
import styled from "styled-components";

const ClalendarMonth = ({ selectedYear, setSelectedMonth, setShowMonth, todayYear, todayMonth }) => {
  const months = useMemo(() => {
    let monthArr = [];
    for (let i = 1; i < 13; i++) {
      monthArr.push(i);
    }
    return monthArr;
  }, []);

  const onMonthController = (month) => {
    setSelectedMonth(month);
    setShowMonth(false);
  };

  const dateCompareFn = (month) => {
    if (selectedYear > todayYear) return "future";
    else if (selectedYear < todayYear || month <= todayMonth) return "past";
  };

  return (
    <MonthBox>
      {months.map((month) => {
        return (
          <button
            key={month}
            className={dateCompareFn(month)}
            onClick={() => onMonthController(month)}
          >{`${month}월`}</button>
        );
      })}
    </MonthBox>
  );
};

export default React.memo(ClalendarMonth);

const MonthBox = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 0.75rem;
  button {
    width: 10.1rem;
    height: 6rem;
    border: none;
    border-radius: 9px;
    font-size: 1.7rem;
    margin-bottom: 1rem;
    cursor: pointer;
  }
  .future {
    background-color: #e8e8e8;
    color: #b3b3b3;
  }
  .past {
    background: #3cc7a6;
    color: white;
  }
`;
