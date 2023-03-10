import { useState } from "react";
import { useEffect } from "react";
import styled, { css } from "styled-components";
import { useParams } from "react-router-dom";
import { flex, StSection } from "../UI/common";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { GrPrevious } from "react-icons/gr";
import { postsApi } from "../apis/axios";
import Canvas from "../components/common/canvas/Canvas";
import HashTagInput from "../components/common/HashTagInput";
import TextEditor from "../components/common/TextEditor";
import WeatherPicker from "../components/write/WeatherPicker";
import { imgUrlConvertBlob } from "../utils/imgUrlConvertBlob";
import Loading from "../components/common/Loading";
import useDispatchHook from "../hooks/useDispatchHook";
import {Header} from "../components/common/header/Header";

const UpdatePost = () => {
  const [isDrawingEnd, setIsDrawingEnd] = useState(false);
  const [contents, setContents] = useState("");
  const [weather, setWeather] = useState("");
  const [canvas, setCanvas] = useState("");
  const [tags, setTags] = useState([]);
  const params = useParams().id;
  const queryClient = useQueryClient();
  const { openAlertModal } = useDispatchHook();

  const {
    data: postsData,
    isError,
    isLoading,
  } = useQuery(["posts"], () => postsApi.get(params));

  const { mutate } = useMutation(postsApi.patch, {
    onError: (err) => {
      const status = err?.response.request.status;
      status === 401 && openAlertModal({ bigTxt: "상대방의 일기는 수정할 수 없어요!" });
    },
    onSuccess: () => {
      queryClient.invalidateQueries("posts");
      openAlertModal({bigTxt: "성공적으로 수정했어요 !",move: `/detail/${params}`})
    },
  });

  useEffect(() => {
    if (!postsData) return;
    const post = postsData;
    setTags([...post.tag.split(",")]);
    setContents(post.content);
    setWeather(post.weather);
  }, [postsData, params]);

  const formEnterKeyPrevent = (event) => {
    event.key === "Enter" && event.preventDefault();
  };

  const writeFormSubmitHandler = (event) => {
    event.preventDefault();
    let blob = imgUrlConvertBlob(canvas);
    let formData = new FormData(event.target);

    formData.get("title");
    formData.get("createdAt");
    formData.append("image", blob, "img.file");
    formData.append("content", contents);
    formData.append("weather", weather || "sun");
    formData.append("tag", tags);
    mutate({ formData: formData, postId: params }, {});
  };

  const defaultHeader = () => {
    return (
      <>
        <Header.Back link={`/detail/${params}`}>다이어리 수정</Header.Back>
        <Header.OnClickBtn onClick={() => setIsDrawingEnd(!isDrawingEnd)}>다음</Header.OnClickBtn>
      </>
    );
  };

  const drawingEndHeader = () => {
    return (
      <>
        <StHeaderTextWrapper>
          <GrPrevious className="drawingStateBtn" onClick={() => setIsDrawingEnd(!isDrawingEnd)} />
          <h3>다이어리 수정</h3>
        </StHeaderTextWrapper>
        <span>
          <StWriteFormSubmitBtn type="submit" form="writeForm">
            수정
          </StWriteFormSubmitBtn>
        </span>
      </>
    );
  };

  if (isLoading) return <Loading />;
  if (isError) return <div>에러</div>;
  return (
    <>
        <Header>
          <Header.SpaceBetween>
            {isDrawingEnd ? drawingEndHeader() : defaultHeader()}
          </Header.SpaceBetween>
        </Header>
        <StSlideWrapper isDrawingEnd={isDrawingEnd}>
          <StTextSection>
            <StTextSectionFrom
              id="writeForm"
              onSubmit={writeFormSubmitHandler}
              onKeyDown={formEnterKeyPrevent}
              encType="multipart/form-data"
            >
              <StTextSectionBox className="titleInputBox">
                <span>날짜</span>
                <input
                  type="date"
                  name="createdAt"
                  defaultValue={postsData.createdAt.split("T")[0]}
                />
              </StTextSectionBox>
              <StTextSectionBox className="tagInputBox">
                <span>태그</span>
                <HashTagInput tags={tags} setTags={setTags} />
              </StTextSectionBox>
              <StTextSectionBox className="textInputBox">
                <span>제목</span>
                <input
                  type="text"
                  name="title"
                  placeholder="제목을 입력해주세요"
                  defaultValue={postsData.title}
                />
              </StTextSectionBox>
              <StTextSectionBox className="weatherPickerBox">
                <span>오늘의 날씨는 ?</span>
                <WeatherPicker weather={weather} setWeather={setWeather} />
              </StTextSectionBox>
            </StTextSectionFrom>
          </StTextSection>
          <StCanvasSection flex justify="flex-start" derection="column">
            <Canvas
              canvas={canvas}
              setCanvas={setCanvas}
              canvasBg={postsData.image}
            />
            <TextEditor contents={contents} setContents={setContents} />
          </StCanvasSection>
        </StSlideWrapper>
    </>
  );
};

export default UpdatePost;

const StCanvasSection = styled(StSection)`
  min-height: calc(100vh - 6rem);
`;

const StTextSection = styled(StSection)`
  min-height: calc(100vh - 6rem);
`;

const StTextSectionFrom = styled.form`
  display: flex;
  flex-direction: column;
  gap: 2rem;
  padding: 2rem;

  .titleInputBox {
    input {
      flex-grow: 0;
      width: 50%;
    }
  }

  .tagInputBox {
    input {
      background: none;
    }
  }

  .weatherPickerBox {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 1.5rem;
  }
`;

const StTextSectionBox = styled.div`
  width: 100%;
  height: 4rem;
  display: flex;
  align-items: center;
  gap: 2.4rem;

  span {
    font-size: 1.4rem;
    white-space: nowrap;
  }
  input {
    flex-grow: 1;
    height: 100%;
    border: none;
    outline: none;
    border-radius: 8px;
    background: #f5f5f5;
    padding: 1rem;
  }
`;

const StSlideWrapper = styled.div`
  position: relative;
  width: 200%;
  height: 100%;
  min-height: calc(100vh - 6rem);
  display: flex;
  transition: transform 0.4s ease-in-out;
  ${(props) =>
    props.isDrawingEnd &&
    css`
      transform: translateX(-50%);
    `}
`;

const StWriteFormSubmitBtn = styled.button`
  color: #3cc7a6;
  cursor: pointer;
  border: none;
  background-color: transparent;
  font-size: 1.7rem;
`;

const StHeaderTextWrapper = styled.div`
  ${flex}
  margin-top: 0.1rem;
  gap: 0.6rem;
  .drawingStateBtn {
    font-size: 2.4rem;
  }
`;
