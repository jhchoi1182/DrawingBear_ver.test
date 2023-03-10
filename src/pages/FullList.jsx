import React, { useRef, useState, useEffect, memo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import styled from "styled-components";
import { useQuery } from "@tanstack/react-query";
import { AiOutlineSetting } from "react-icons/ai";
import { BsTriangleFill } from "react-icons/bs";
import { BsSearch } from "react-icons/bs";
import DiarySettingModal from "../components/main/DiarySettingModal/DiarySettingModal";
import FilterDropdown from "../components/common/dropdown/FilterDropdown";
import SearchHeader from "../components/FullList/SearchHeader";
import DiaryCard from "../components/FullList/DiaryCard";
import Loading from "../components/common/Loading";
import Buttons from "../components/common/Button/Buttons";
import { StSection } from "../UI/common";
import { diaryApi } from "../apis/axios";
import { Header } from "../components/common/header/Header";

const DiaryList = memo(() => {
  const navigate = useNavigate();
  const diaryName = localStorage.getItem("diaryName");
  const diaryCouple = localStorage.getItem("couple");
  const [changeHeader, setChangeHeader] = useState(false);
  const [dateOrderedPosts, setDateOrderedPosts] = useState({});
  const [filter, setFilter] = useState("최신순");
  const [isScrollBottom, setIsScrollBottom] = useState(false);

  const sectionRef = useRef(null);

  const diaryId = useParams().id;
  const { data, isLoading } = useQuery(["Allposts"], () => diaryApi.get(diaryId), {
    refetchOnReconnect: true,
    refetchOnWindowFocus: true,
  });

  const orderPostsByDate = (data) => {
    const orderedPosts = {};
    if (!isLoading) {
      data.forEach((item) => {
        const temp = item.createdAt.slice(0, 10);
        if (orderedPosts[temp]) {
          orderedPosts[temp].push(item);
        } else {
          orderedPosts[temp] = [item];
        }
      });
    }
    return orderedPosts;
  };

  const locailDate = (date) => {
    return new Date(date).toLocaleDateString("ko-KR", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const listPageScrollhandler = (e) => {
    const { target } = e;
    if (target.scrollTop / (target.scrollHeight - target.offsetHeight) >= 0.5) {
      setIsScrollBottom(true);
    } else {
      setIsScrollBottom(false);
    }
  };

  const defaultHeader = () => {
    return (
      <Header.SpaceBetween>
        <Header.Back link="/">{diaryName}</Header.Back>
        <Header.OnClickBtn color="#242424" fontSize="2rem">
          <BsSearch onClick={() => setChangeHeader(true)} />
          <DiarySettingModal diaryName={diaryName} diaryId={diaryId} couple={diaryCouple}>
            <AiOutlineSetting />
          </DiarySettingModal>
        </Header.OnClickBtn>
      </Header.SpaceBetween>
    );
  };

  useEffect(() => {
    if (!data) return;
    setDateOrderedPosts(orderPostsByDate(data));
  }, [data]);

  if (!data) return <Loading />;
  return (
    <>
      <Header>
        {!changeHeader && defaultHeader()}
        {changeHeader && <SearchHeader setChangeHeader={setChangeHeader} />}
      </Header>
      <StFilterContainer>
        <FilterDropdown filter={filter} setFilter={setFilter} />
      </StFilterContainer>
      <StListPageSection onScroll={listPageScrollhandler} ref={sectionRef}>
        {(() => {
          switch (filter) {
            case "최신순":
              return Object.keys(dateOrderedPosts).map((date, n) => {
                return (
                  <StDiaryCarsWrapper key={`orderedPosts${n}`}>
                    <div className="orderedDate">{locailDate(date)}</div>
                    {dateOrderedPosts[date].map((post, n) => {
                      return <DiaryCard key={`postData${n}`} postData={post} />;
                    })}
                    <StDivisionLine />
                  </StDiaryCarsWrapper>
                );
              });
            case "오래된순":
              return Object.keys(dateOrderedPosts)
                .reverse()
                .map((date, n) => {
                  return (
                    <StDiaryCarsWrapper key={`orderedPosts${n}`}>
                      <div className="orderedDate">{locailDate(date)}</div>
                      {dateOrderedPosts[date].map((post, n) => {
                        return <DiaryCard key={`postData${n}`} postData={post} />;
                      })}
                      <StDivisionLine />
                    </StDiaryCarsWrapper>
                  );
                });
            case "북마크":
              return Object.keys(dateOrderedPosts).map((date, n) => {
                return (
                  <StDiaryCarsWrapper key={`orderedPosts${n}`}>
                    <div className="orderedDate">{locailDate(date)}</div>
                    {dateOrderedPosts[date]
                      .filter((post) => post.bookmark)
                      .map((post, n) => {
                        return <DiaryCard key={`postData${n}`} postData={post} />;
                      })}
                    <StDivisionLine />
                  </StDiaryCarsWrapper>
                );
              });
            default:
              return null;
          }
        })()}
      </StListPageSection>

      {isScrollBottom ? (
        <>
          <StScrollTopButton
            onClick={() => {
              sectionRef.current.scrollTo({ top: 0, behavior: "smooth" });
            }}
          />
        </>
      ) : null}

      <StAddPostButton
        onClick={() => {
          navigate(`/write/${diaryId}`);
        }}
      />
    </>
  );
});

export default DiaryList;

const StAddPostButton = styled(Buttons.AddPost)`
  position: fixed;
  right: calc(50% - 15.5rem);
  bottom: 3rem;
`;

const StScrollTopButton = styled(BsTriangleFill)`
  position: absolute;
  left: 50%;
  bottom: 3rem;
  width: 2rem;
  height: 2rem;
  transform: translateX(-50%);
  cursor: pointer;
  filter: drop-shadow(0px 0px 2px rgba(0, 0, 0, 0.7));
`;

const StListPageSection = styled(StSection)`
  height: calc(100vh - 6rem);
  &::-webkit-scrollbar {
    width: 1rem;
  }
  &::-webkit-scrollbar-thumb {
    background: var(--positive_2);
    border-radius: 10px;
  }
  &::-webkit-scrollbar-track {
    background: var(--grayscale_1);
  }
`;
const StDivisionLine = styled.div`
  position: absolute;
  left: 0;
  width: 100%;
  height: 1.5rem;
  background-color: var(--grayscale_2);
  margin: 2rem 0;
`;

const StDiaryCarsWrapper = styled.div`
  margin-top: 8rem;
  &:first-child {
    margin-top: 3rem;
  }
  .orderedDate {
    width: min-content;
    white-space: nowrap;
    background: #f5f5f5;
    padding: 0.5rem 1.5rem;
    font-size: 1.9rem;
    font-weight: 700;
    border-radius: 25px;
    margin-bottom: 2rem;
  }
`;

const StFilterContainer = styled.div`
  position: absolute;
  z-index: 10;
  right: 2.2rem;
  top: 7.5rem;
`;
