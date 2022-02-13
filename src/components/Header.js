import React from "react";
import { NavLink } from "react-router-dom";
import logo from "../images/logo.svg";

function Header({ loggedIn }) {

  // function checkIsLoggedIn() {
  //   if (loggedIn) {
  //     return (
  //       <NavLink
  //         activeClassName={`header__link_type_disabled`}
  //         className={"header__link"}
  //         to={"/sign-in"}
  //       >
  //         Выйти
  //       </NavLink>
  //     );
  //   } else {
  //     <>
  //       <NavLink
  //         activeClassName={`header__link_type_disabled`}
  //         className={"header__link"}
  //         to={"/sign-up"}
  //       >
  //         Регистрация
  //       </NavLink>
  //       <NavLink
  //         activeClassName="header__link_type_disabled"
  //         className={"header__link"}
  //         to={"/sign-in"}
  //       >
  //         Войти
  //       </NavLink>
  //     </>;
  //   }
  // }

  return (
    <header className="header">
      <img className="logo" src={logo} alt="logo" />
      <NavLink
        activeClassName={`header__link_type_disabled`}
        className={"header__link"}
        to={"/sign-up"}
      >
        Регистрация
      </NavLink>
      <NavLink
        activeClassName="header__link_type_disabled"
        className={"header__link"}
        to={"/sign-in"}
      >
        Войти
      </NavLink>
    </header>
  );
}

export default Header;
