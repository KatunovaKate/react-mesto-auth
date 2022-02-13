import React from "react";
import Header from "./Header";
import Main from "./Main";
import Footer from "./Footer";
import PopupWithForm from "./PopupWithForm";
import ImagePopup from "./ImagePopup";
import EditProfilePopup from "./EditProfilePopup";
import EditAvatarPopup from "./EditAvatarPopup";
import AddPlacePopup from "./AddPlacePopup";
import Login from "./Login";
import Register from "./Register";
import ProtectedRoute from "./ProtectedRoute";
import api from "./../utils/API";
import * as auth from "./Auth.js";
import { CurrentUserContext } from "../contexts/CurrentUserContext";
import { Route, Switch, Redirect, useHistory } from "react-router-dom";

function App() {
  const [isEditProfilePopupOpen, setIsEditProfilePopupOpen] =
    React.useState(false);
  const [isAddPlacePopupOpen, setIsAddPlacePopupOpen] = React.useState(false);
  const [isEditAvatarPopupOpen, setIsEditAvatarPopupOpen] =
    React.useState(false);
  const [isDeletePopupOpen, setIsDeletePopupOpenn] = React.useState(false);
  const [selectedCard, setSelectedCard] = React.useState(null);
  const [currentUser, setCurrentUser] = React.useState({});
  const [cards, setCards] = React.useState([]);
  const [loggedIn, setLoggedIn] = React.useState(false);
  const [userInfo, setUserInfo] = React.useState({
    email: "",
    password: "",
  });
  const history = useHistory();

  React.useEffect(() => {
    api
      .getCards()
      .then((cardData) => {
        setCards(cardData);
      })
      .catch((err) => console.log(err));
  }, []);

  function handleCardLike(card) {
    const isLiked = card.likes.some((i) => i._id === currentUser._id);
    api
      .toggleLike(card._id, !isLiked)
      .then((newCard) => {
        setCards((state) =>
          state.map((c) => (c._id === card._id ? newCard : c))
        );
      })
      .catch((err) => console.log(err));
  }

  React.useEffect(() => {
    api
      .getInfo()
      .then((userData) => {
        setCurrentUser(userData);
      })
      .catch((err) => console.log(err));
  }, []);

  React.useEffect(() => {
    const closeByEscape = (e) => {
      if (e.key === "Escape") {
        closeAllPopups();
      }
    };
    document.addEventListener("keydown", closeByEscape);
    return () => document.removeEventListener("keydown", closeByEscape);
  }, []);

  function handleCardClick(card) {
    setSelectedCard(card);
  }

  function handleEditProfileClick() {
    setIsEditProfilePopupOpen(true);
  }

  function handleDeleteClick(_id) {
    api
      .deleteCard(_id)
      .then(() => {
        setCards((state) => state.filter((item) => item._id !== _id));
      })
      .catch((err) => console.log(err));
  }

  function handleAddPlaceClick() {
    setIsAddPlacePopupOpen(true);
  }

  function handleEditAvatarClick() {
    setIsEditAvatarPopupOpen(true);
  }

  function closeAllPopups() {
    setIsEditProfilePopupOpen(false);
    setIsEditAvatarPopupOpen(false);
    setIsAddPlacePopupOpen(false);
    setSelectedCard(null);
    setIsDeletePopupOpenn(false);
  }

  function handleUpdateUser({ name, about }) {
    api
      .setUserInfo({ name, about })
      .then((userData) => {
        setCurrentUser(userData);
        closeAllPopups();
      })
      .catch((err) => console.log(err));
  }

  function handleUpdateAvatar({ avatar }) {
    api
      .setAvatar({ avatar })
      .then((userData) => {
        setCurrentUser(userData);
        closeAllPopups();
      })
      .catch((err) => console.log(err));
  }

  function handleAddPlaceSubmit({ name, link }) {
    api
      .addCard({ name, link })
      .then((newCard) => {
        setCards([newCard, ...cards]);
        closeAllPopups();
      })
      .catch((err) => console.log(err));
  }

  const onLogin = (data) => {
    return auth.authorize(data).then((data) => {
      setLoggedIn(true);
      localStorage.setItem("jwt", data.token);
    });
  };

  // function tokenCheck() {
  //   const jwt = localStorage.getItem("jwt");
  //   if (jwt) {
  //     auth.getContent(jwt).then((res) => {
  //       if (res) {
  //         setLoggedIn(!loggedIn);
  //         history.push("/");
  //       }
  //     });
  //   }
  // }

  // React.useEffect(() => {
  //   tokenCheck();
  // }, []);

  React.useEffect(() => {
    if (loggedIn) {
      history.push("/");
    }
  }, [loggedIn]);

  Promise.all([api.getCards(), api.getInfo()])
  .then(([cards, userData]) => {
    setCurrentUser(userData);
    setCards(cards)
  })
  .catch(err => console.log(`Ошибка загрузки данных: ${err}`))

  return (
    <div className="page__content">
      <CurrentUserContext.Provider value={currentUser}>
        <Header loggedIn={loggedIn} userData={userInfo} />
        <Switch>
          <Route exact path="/sign-up">
            <Register />
          </Route>
          <Route exact path="/sign-in">
            <Login onLogin={onLogin} />
          </Route>
          <ProtectedRoute loggedIn={loggedIn} exact path="/" component={Main}>
            <Main
              onDeleteClick={handleDeleteClick}
              onCardClick={handleCardClick}
              onEditProfile={handleEditProfileClick}
              onAddPlace={handleAddPlaceClick}
              onEditAvatar={handleEditAvatarClick}
              onLikeClick={handleCardLike}
              cards={cards}
            />
          </ProtectedRoute>
          <Route path="*">
            {loggedIn ? <Redirect to="/" /> : <Redirect to="/sign-in" />}
          </Route>
        </Switch>
        <Footer />
        <EditProfilePopup
          isOpen={isEditProfilePopupOpen}
          onUpdateUser={handleUpdateUser}
          onClose={closeAllPopups}
        />
        <AddPlacePopup
          isOpen={isAddPlacePopupOpen}
          onUpdateUser={handleAddPlaceSubmit}
          onClose={closeAllPopups}
        />
        <PopupWithForm
          name="remove"
          title="Вы уверены?"
          isOpen={isDeletePopupOpen}
          onClose={closeAllPopups}
          buttonName="Да"
        ></PopupWithForm>
        <EditAvatarPopup
          isOpen={isEditAvatarPopupOpen}
          onClose={closeAllPopups}
          onUpdateAvatar={handleUpdateAvatar}
        />
        <ImagePopup card={selectedCard} onClose={closeAllPopups} />
      </CurrentUserContext.Provider>
    </div>
  );
}

export default App;
