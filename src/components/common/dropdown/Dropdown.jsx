import {
  useEffect,
  useMemo,
  useCallback,
  useRef,
  useState,
  useContext,
  createContext,
} from "react";
import styled, { css } from "styled-components";
const DropdownContext = createContext();

const Dropdown = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const toggle = useCallback(() => setIsOpen((prev) => !prev), []);
  const dropdownRef = useRef(null);
  const toggleRef = useRef(null);
  const values = useMemo(
    () => ({ isOpen, dropdownRef, toggle, toggleRef }),
    [isOpen, dropdownRef, toggle, toggleRef]
  );
  const handleClickOutside = (event) => {
    if (!dropdownRef.current) return;
    if (
      !dropdownRef.current.contains(event.target) &&
      !toggleRef.current.contains(event.target)
    ) {
      setIsOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  });

  return (
    <DropdownContext.Provider value={values}>
      {children}
    </DropdownContext.Provider>
  );
};

const DropdownToggle = ({ children }) => {
  const { toggle, toggleRef } = useContext(DropdownContext);
  return (
    <span onClick={toggle} ref={toggleRef}>
      {children}
    </span>
  );
};

const DropdownContainer = ({ children }) => {
  const { isOpen } = useContext(DropdownContext);

  return <Container isOpen={isOpen}>{children}</Container>;
};

const DropdownWrapper = ({ children }) => {
  const { dropdownRef } = useContext(DropdownContext);
  return <ul ref={dropdownRef}>{children}</ul>;
};

const DropdownMenu = ({ children }) => {
  return <li>{children}</li>;
};

Dropdown.Menu = DropdownMenu;
Dropdown.Wrapper = DropdownWrapper;
Dropdown.Toggle = DropdownToggle;
Dropdown.Container = DropdownContainer;
export default Dropdown;

const Container = styled.div`
  width: min-content;
  height: min-content;
  position: relative;
  display: none;
  cursor: pointer;

  ${(props) =>
    props.isOpen &&
    css`
      display: block;
    `}

  ul {
    position: absolute;
    top: 1.5rem;
    left: -2rem;

    width: min-content;
    background: #fff;
    border: 1px solid #d9d9d9;
    border-radius: 5px;
    z-index: 10;

    li {
      list-style: none;
      padding: 0.5rem 1rem;
      border-bottom: 1px solid #fafafa;

      &:hover {
        background: #f8f9fa;
      }
    }
  }
`;
