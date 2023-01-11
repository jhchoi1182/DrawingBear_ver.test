import { useState } from "react";
import styled, { css } from "styled-components";
import { useRef } from "react";
import { StContainer, StHeader, StSection } from "../UI/common";

import Canvas from "../components/FabricCanvas/Canvas";

const Write = () => {
  const [isDrawing, setIsDrawing] = useState(true);

  return (
    <StContainer>
      <StHeader flexCenter>
        <h1>LOGO</h1>
        <button onClick={() => setIsDrawing(!isDrawing)}>
          {isDrawing ? "그림" : "제목"}
        </button>
      </StHeader>
      <StCanvasSection drawing={isDrawing}>
        <Canvas />
        <textarea></textarea>
      </StCanvasSection>
      <StTitleSection drawing={isDrawing}>
        <div>
          <span>제목 : </span>
          <input type="text" placeholder="제목을 입력해주세요" />
        </div>
        <div>
          <span>날짜 : </span>
          <input type="date" placeholder="2023.01.01" />
        </div>
        <div>
          <span>태그 : </span>
          <input type="text" placeholder="태그를 입력해주세요" />
        </div>
      </StTitleSection>
    </StContainer>
  );
};

export default Write;

const StCanvasSection = styled(StSection)`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 10px;

  ${(props) =>
    !props.drawing &&
    css`
      display: none;
    `}

  textarea {
    width: 100%;
    height: 100px;
    border: 1px solid #d9d9d9;
    border-radius: 4px;
    padding: 10px;
    margin-top: 10px;
    resize: none;
  }
`;

const StTitleSection = styled(StSection)`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 20px;
  padding: 10px;
  ${(props) =>
    props.drawing &&
    css`
      display: none;
    `}
`;
