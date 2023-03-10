import { useForm } from "react-hook-form";
import styled from "styled-components";
import { loginApi } from "../../apis/axios";
import { Input, WorningWord } from "../common/Input";
import Buttons from "../common/Button/Buttons";
import useDispatchHook from "../../hooks/useDispatchHook";
import { useDispatch } from "react-redux";
import { __LoginModal } from "../../redux/modules/UISlice";

const LonginForm = () => {
  const dispatch = useDispatch();
  const { openAlertModal } = useDispatchHook();

  const loginAxios = async (inputData) => {
    try {
      const { data } = await loginApi.login(inputData);
      localStorage.setItem("token", data.token);
      setTimeout(() => {
        localStorage.clear();
      }, 3600000);
      return dispatch(__LoginModal(true));
    } catch (error) {
      const { status } = error?.response?.request;
      if (status === undefined || null) return;
      else if (status === 412)
        openAlertModal({ bigTxt: "로그인 실패", smallTxt: "이메일 또는 패스워드를 확인해주세요." });
      else if (status === 400)
        openAlertModal({ bigTxt: "로그인 실패", smallTxt: "해당 아이디는 소셜로그인으로 시도해주세요." });
      else openAlertModal({ bigTxt: "로그인 실패" });
    }
  };

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = (inputData) => loginAxios(inputData);

  return (
    <>
      <LocalLoginForm onSubmit={handleSubmit(onSubmit)}>
        <div>
          <label htmlFor="email">이메일</label>
          <input
            className={errors.email?.type === undefined ? "pass" : "fail"}
            type="text"
            id="email"
            name="email"
            placeholder="example@email.com"
            {...register("email", {
              required: true,
              pattern: /^[a-zA-Z0-9+-_.]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/,
            })}
            aria-invalid={errors.email ? "true" : "false"}
          />
          <WorningWord color={errors.email?.type}>이메일 형식에 맞지 않습니다.</WorningWord>
        </div>
        <div>
          <label htmlFor="password">비밀번호</label>
          <input
            className={errors.password?.type === undefined ? "pass" : "fail"}
            type="password"
            id="password"
            name="password"
            placeholder="영문, 숫자 조합 8자리 이상"
            {...register("password", {
              required: true,
              pattern: /(?=.*\d)(?=.*[a-zA-ZS]).{8,}/,
            })}
            aria-invalid={errors?.password ? "true" : "false"}
          />
          <WorningWord color={errors.password?.type}>영문, 숫자 조합 8자리 이상을 적어주세요.</WorningWord>
        </div>
        <div>
          <Buttons.Full
            type="positive"
            disabled={errors.email?.type === undefined && errors.password?.type === undefined ? false : true}
          >
            로그인
          </Buttons.Full>
        </div>
      </LocalLoginForm>
    </>
  );
};

export default LonginForm;

const LocalLoginForm = styled.form`
  div {
    padding-top: 20%;
  }
  ${Input}
`;
