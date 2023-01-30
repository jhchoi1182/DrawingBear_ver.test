import styled from "styled-components";
import { flex } from "../UI/common";
import NoDiaryBear from "../assets/images/noDiaryBear.webp";
const NoChatList = () => {
  return (
    <>
      <StContainer>
        <StWrapper>
          <h3>아직 연결된 커플 다이어리가 없어요</h3>
          <img src={NoDiaryBear} alt="다이어리 없을 때 곰돌이 그림" />
        </StWrapper>
      </StContainer>
    </>
  );
};
export default NoChatList;

const StContainer = styled.div`
  height: 85vh;
  display: flex;
  justify-content: center;
`;
const StWrapper = styled.div`
  ${flex("", "", "column")}
  .addDiary {
    ${flex("", "", "column")}
  }
  & h3 {
    font-size: 1.6rem;
    margin-bottom: 1.6rem;
  }
  & img {
    width: 10.5rem;
    height: 11.5rem;
  }
`;
