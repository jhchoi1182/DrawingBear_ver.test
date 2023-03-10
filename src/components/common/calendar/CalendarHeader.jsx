import React from "react";
import styled from "styled-components";
import { GrPrevious, GrNext } from "react-icons/gr";
import { FiChevronDown } from "react-icons/fi";
import YearSelectModal from "./YearSelectModal";
import { useCallback } from "react";
import { flex } from "../../../UI/common";
import { useQueryClient } from "@tanstack/react-query";
import { BsQuestionCircle } from "react-icons/bs";

const CalendarHeader = (props) => {
  const { selectedMonth, setSelectedMonth, selectedYear, setSelectedYear, showMonth, setShowMonth } = props;
  const queryClient = useQueryClient();

  // 달 이동 버튼 로직

  const prevMonth = useCallback(() => {
    if (selectedMonth === 1) {
      setSelectedMonth(12);
      setSelectedYear((prev) => prev - 1);
    } else {
      setSelectedMonth((prev) => prev - 1);
    }
  }, [selectedMonth, setSelectedMonth, setSelectedYear]);

  const nextMonth = useCallback(() => {
    if (selectedMonth === 12) {
      setSelectedMonth(1);
      setSelectedYear((prev) => prev + 1);
    } else {
      setSelectedMonth((prev) => prev + 1);
    }
  }, [selectedMonth, setSelectedMonth, setSelectedYear]);

  const prevYear = useCallback(() => {
    setSelectedYear((prev) => prev - 1);
  }, [setSelectedYear]);

  const nextYear = useCallback(() => {
    setSelectedYear((prev) => prev + 1);
  }, [setSelectedYear]);

  // 연도 선택

  const onYearController = useCallback(
    (year) => {
      setSelectedYear(year);
      setShowMonth(false);
    },
    [setShowMonth, setSelectedYear]
  );

  const AllListSearchHandler = () => {
    queryClient.setQueryData(["Allposts"], queryClient.getQueryData(["Allposts_copy"]));
  };

  const onTodayMoveHandler = useCallback(() => {
    setSelectedYear(props.today.year);
    setSelectedMonth(props.today.month);
  }, []);

  return (
    <CalendarHeaderBox>
      <TooltipBox>
        <BsQuestionCircle />
        <span className="tooltiptext">공휴일은 2004년~2024년까지만 볼 수 있어요!</span>
      </TooltipBox>
      <div className="shown-date">
        <h3>{`${selectedYear}년`}</h3>
        {showMonth ? null : <h3>{`${selectedMonth}월`}</h3>}
        {showMonth ? (
          <YearSelectModal onYearController={onYearController}>
            <FiChevronDown className="date-show-arrow" />
          </YearSelectModal>
        ) : (
          <FiChevronDown className="date-show-arrow" onClick={() => setShowMonth(true)} />
        )}
      </div>
      <div className="buttons">
        <SearchBox>
          <button onClick={AllListSearchHandler}>전체글</button>
          <button onClick={onTodayMoveHandler}>오늘</button>
        </SearchBox>
        <button onClick={() => (showMonth ? prevYear() : prevMonth())}>
          <GrPrevious />
        </button>
        <button onClick={() => (showMonth ? nextYear() : nextMonth())}>
          <GrNext />
        </button>
      </div>
    </CalendarHeaderBox>
  );
};

export default CalendarHeader;

const CalendarHeaderBox = styled.div`
  display: flex;
  justify-content: space-between;
  color: #242424;
  margin-bottom: 2rem;
  .shown-date {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    cursor: pointer;
  }
  .date-show-arrow {
    color: #3cc7a6;
    font-size: 2.5rem;
  }
  .buttons {
    display: flex;
    align-items: center;
    gap: 2rem;
  }
  button {
    border: none;
    background-color: inherit;
    cursor: pointer;
    font-size: 2rem;
  }
`;

const TooltipBox = styled.div`
  position: relative;
  display: block;
  .tooltiptext {
    visibility: hidden;
    width: 20rem;
    background-color: black;
    color: #fff;
    text-align: center;
    border-radius: 5px;
    padding: 1rem;
    position: absolute;
    z-index: 1;
  }
  :hover .tooltiptext {
    visibility: visible;
  }
`;

const SearchBox = styled.div`
  ${flex}
  gap: 0.8rem;
  margin-right: -0.8rem;
  border-radius: 5px;
  button {
    color: #9b9b9b;
    font-size: 1rem;
    width: 3.7rem;
    height: 2.3rem;
    background-color: #f2f2f2;
  }
`;
