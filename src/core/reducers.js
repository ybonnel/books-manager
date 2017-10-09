import {routerReducer} from "react-router-redux";
// import { reducer as FormReducer } from "redux-form";
import {combineReducers} from "redux";
import {authReducer} from "./auth/index";
import {booksReducer} from "./books/index";
import {modalReducer} from "./modal/index";
import {authorsReducer} from "./authors/index";
import {artistsReducer} from "./artists/index";
import {seriesReducer} from "./serie/index";
import {collectionsReducer} from "./collection/index";
import {editorsReducer} from "./editor/index";
import {stylesReducer} from "./style/index";
import {locationsReducer} from "./location/index";


export default combineReducers({
    auth: authReducer,
    routing: routerReducer,
    books: booksReducer,
    authors: authorsReducer,
    artists: artistsReducer,
    series: seriesReducer,
    collections: collectionsReducer,
    editors: editorsReducer,
    styles: stylesReducer,
    locations: locationsReducer,
    modal: modalReducer,
    // form: FormReducer
});
