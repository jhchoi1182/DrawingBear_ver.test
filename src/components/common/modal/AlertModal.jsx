import { useNavigate } from "react-router-dom";
import styled, { css } from "styled-components";
import { Modal } from "./ReactModal";

const AlertModal = ({ showModal, children, bigTxt, smallTxt, select, move, onClick }) => {
  const navigate = useNavigate();
  const ConfirmReactionHandler = () => {
    onClick && onClick();
    navigate(move);
  };

  return (
    <Modal showModal={showModal}>
      <Modal.Trigger>{children}</Modal.Trigger>
      <Modal.Portal>
        <Modal.BackDrop notClose transparent>
          <Modal.ContentBox>
            <AlertBox>
              <div className="text-box">
                <h4>{bigTxt}</h4>
                <p>{smallTxt}</p>
              </div>
              <hr />
              {select ? (
                <SelectBtnBox>
                  <Modal.Close>
                    <button className="select cancel">취소</button>
                  </Modal.Close>
                  <Modal.Close>
                    <button className="select confirm" onClick={ConfirmReactionHandler}>
                      확인
                    </button>
                  </Modal.Close>
                </SelectBtnBox>
              ) : move ? (
                <button className="confirm alone" onClick={ConfirmReactionHandler}>
                  확인
                </button>
              ) : (
                <Modal.Close>
                  <button className="confirm alone" onClick={ConfirmReactionHandler}>
                    확인
                  </button>
                </Modal.Close>
              )}
            </AlertBox>
          </Modal.ContentBox>
        </Modal.BackDrop>
      </Modal.Portal>
    </Modal>
  );
};

export default AlertModal;

export const AlertModalCss = () => {
  return css`
    display: grid;
    width: 28rem;
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    z-index: 100;
    border-radius: 12px;
    box-shadow: 0 1px 4px #d7d7d7;
    background-color: white;
    .text-box {
      display: block;
      text-align: center;
      word-break: keep-all;
      align-items: center;
      padding: 3rem;
      font-weight: 700;
      p {
        font-size: 1rem;
      }
    }
    hr {
      height: 1px;
      border: 0;
      background-color: #d7d7d7;
    }
    button {
      width: 100%;
      height: 4rem;
      border: none;
      background-color: white;
      cursor: pointer;
    }
  `;
};

const AlertBox = styled.div`
  ${AlertModalCss}
  .select {
    width: 14rem;
    color: #bdbdbd;
    border-bottom-left-radius: 12px;
    border-bottom-right-radius: 12px;
  }
  .cancel {
    border-right: 1px solid #d7d7d7;
    border-bottom-right-radius: 0px;
  }
  .confirm {
    color: #3cc7a6;
  }
  .alone {
    border-bottom-left-radius: 12px;
    border-bottom-right-radius: 12px;
  }
`;

const SelectBtnBox = styled.div`
  display: flex;
`;
