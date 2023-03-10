import React from "react";
import { useDispatch } from "react-redux";
import styled from "styled-components";
import { __diaryData } from "../../redux/modules/diarySlice";
import { flex } from "../../UI/common";
import Buttons from "../common/Button/Buttons";
import DiaryDeleteModal from "./DiaryDeleteModal";

const DiaryManageCard = ({ data }) => {
  const dispatch = useDispatch();

  return (
    <>
      {data.diaries?.map((diary) => {
        const { diaryId, diaryName, invitedNickname, invitedProfileImg } = diary;
        return diary.couple === 0 ? (
          <SoloDiary key={`diary_${diaryId}`}>
            <h1>{diaryName}</h1>
            <DisplayDiv flex justify="space-between">
              <div>
                <span>나만의 그림일기!</span>
              </div>
              <div>
                <DiaryDeleteModal bigTxt={`${diaryName}을(를) 삭제하시겠어요?`}>
                  <Buttons.Invite onClick={() => dispatch(__diaryData(diaryId))}>삭제하기</Buttons.Invite>
                </DiaryDeleteModal>
              </div>
            </DisplayDiv>
          </SoloDiary>
        ) : (
          <CoupleDiary key={`diary_${diaryId}`}>
            <h1>{diaryName}</h1>
            <DisplayDiv flex justify="space-between">
              <div>
                {invitedNickname === null ? (
                  <span>아직 상대방이 없어요!</span>
                ) : (
                  <ConnectedUserProfile>
                    <img src={invitedProfileImg} alt="프사" />
                    <span>{invitedNickname}님과 함께써요</span>
                  </ConnectedUserProfile>
                )}
              </div>
              <div>
                <DiaryDeleteModal bigTxt={`${diaryName}을(를) 삭제하시겠어요?`} diaryId={diaryId}>
                  <Buttons.Invite onClick={() => dispatch(__diaryData(diaryId))}>연결끊기</Buttons.Invite>
                </DiaryDeleteModal>
              </div>
            </DisplayDiv>
          </CoupleDiary>
        );
      })}
    </>
  );
};

export default DiaryManageCard;

const SoloDiary = styled.div`
  width: 100%;
  height: 10.2rem;
  padding: 2rem;
  box-shadow: 0px 0px 15px rgba(0, 0, 0, 0.1);
  border-radius: 15px;
  margin-bottom: 2rem;
  button {
    color: #ff7070;
  }
`;

const CoupleDiary = styled(SoloDiary)``;

const ConnectedUserProfile = styled.div`
  ${flex}
  img {
    width: 3rem;
  }
`;

const DisplayDiv = styled.div`
  ${flex("space-between", "")}
`;
