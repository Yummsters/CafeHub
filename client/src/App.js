// import './App.css';
import { BrowserRouter as Router, Route, Routes, BrowserRouter } from 'react-router-dom';
import { persistStore } from 'redux-persist';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import Main from './main/Main';
import ReviewList from './reviewList/ReviewList';
import LoginPage from './login/LoginPage';
import SearchId from './searchId/SearchId';
import SearchPw from './searchPw/SearchPw';
import WishStore from './userMyPage/WishStore';
import WishReview from './userMyPage/WishReview';
import SearchIdResult from './searchId/SearchIdResult';
import SignUpUser from './signUp/SignUpUser';
import SignUpStore from './signUp/SignUpStore';
import ManagerAd from './managerMyPage/ManagerAd';
import ManagerPoint from './managerMyPage/ManagerPoint';
import ManagerConfirm from './managerMyPage/ManagerConfirm';
import Map from './map/Map';
import MyReivew from './userMyPage/MyReivew';
import MyReply from './userMyPage/MyReply';
import ReviewDetail from './review/ReviewDetail';
import ReviewModify from './review/ReviewModify';
import ReviewWrite from './review/ReviewWrite';
import UserInfo from './userMyPage/UserInfo';
import StoreUserInfo from './storeMyPage/StoreUserInfo';
import UserPoint from './userMyPage/UserPoint';
import Header from './components/Header';
import Footer from './components/Footer';
import 'bootstrap/dist/css/bootstrap.min.css';
import StoreInfo from './storeMyPage/StoreInfo';
import Keypad from './storeMyPage/Keypad';
import StoreReview from './storeMyPage/StoreReview';
import StoreClose from './storeMyPage/StoreClose';
import StoreBanner from './storeMyPage/StoreBanner';
import store from './persist-store';
import ChoicePoint from './storeMyPage/ChoicePoint';
import UsePoint from './storeMyPage/UsePoint';

export const persistor = persistStore(store);
function App() {

  const DefaultLayout = ({ children }) => (
    <div>
       <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
      <Header />
      {children}
      <Footer />
      </PersistGate>
    </Provider>
    </div>
  );

  // Header와 Footer가 없는 특별한 레이아웃 컴포넌트
  const NoHeaderFooterLayout = ({ children }) => (
    <div>
    <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
       {children}
      </PersistGate>
    </Provider>
    </div>
  );

  return (
    <BrowserRouter>
            <Routes>
              <Route exact path='/' element={<DefaultLayout><Main/></DefaultLayout>}/>
              <Route exact path='/login' element={<DefaultLayout><LoginPage/></DefaultLayout>}/>
              <Route exact path='/searchId' element={<DefaultLayout><SearchId/></DefaultLayout>}/>
              <Route exact path='/searchIdResult' element={<DefaultLayout><SearchIdResult/></DefaultLayout>}/>
              <Route exact path='/searchPw' element={<DefaultLayout><SearchPw/></DefaultLayout>}/>
              <Route exact path='/wishStore' element={<DefaultLayout><WishStore/></DefaultLayout>}/>
              <Route exact path='/wishReview' element={<DefaultLayout><WishReview/></DefaultLayout>}/>
              <Route exact path='/signUpUser' element={<DefaultLayout><SignUpUser/></DefaultLayout>}/>
              <Route exact path='/signUpStore' element={<DefaultLayout><SignUpStore/></DefaultLayout>}/>
              <Route exact path="/managerAd" element={<DefaultLayout><ManagerAd/></DefaultLayout>} />
              <Route exact path="/managerPoint" element={<DefaultLayout><ManagerPoint/></DefaultLayout>} />
              <Route exact path="/managerConfirm" element={<DefaultLayout><ManagerConfirm/></DefaultLayout>} />
              <Route exact path="/map" element={<DefaultLayout><Map/></DefaultLayout>} />
              <Route exact path="/reviewList" element={<DefaultLayout><ReviewList/></DefaultLayout>} />
              <Route exact path="/userPoint" element={<DefaultLayout><UserPoint/></DefaultLayout>}/>
              <Route exact path="/userInfo" element={<DefaultLayout><UserInfo/></DefaultLayout>} />
              <Route exact path="/storeuserInfo" element={<DefaultLayout><StoreUserInfo/></DefaultLayout>} />
              <Route exact path="/myReivew" element={<DefaultLayout><MyReivew/></DefaultLayout>} />
              <Route exact path="/myReply" element={<DefaultLayout><MyReply/></DefaultLayout>} />
              <Route exact path='/reviewDetail/:reviewNo' element={<DefaultLayout><ReviewDetail/></DefaultLayout>}/>
              <Route exact path='/reviewModify' element={<DefaultLayout><ReviewModify/></DefaultLayout>}/>
              <Route exact path='/reviewWrite' element={<DefaultLayout><ReviewWrite/></DefaultLayout>}/>
              <Route exact path='/storeInfo' element={<DefaultLayout><StoreInfo/></DefaultLayout>}/>
              <Route exact path='/storeClose' element={<DefaultLayout><StoreClose/></DefaultLayout>}/>
              <Route exact path='/keypad' element={<NoHeaderFooterLayout><Keypad/></NoHeaderFooterLayout>}/>
              <Route exact path='/storeReview' element={<DefaultLayout><StoreReview/></DefaultLayout>}/>
              <Route exact path='/storeBanner' element={<DefaultLayout><StoreBanner/></DefaultLayout>}/>
              <Route exact path='/choicePoint/:memNo' element={<NoHeaderFooterLayout><ChoicePoint/></NoHeaderFooterLayout>}/>
              <Route exact path='/usePoint/:memNo' element={<NoHeaderFooterLayout><UsePoint/></NoHeaderFooterLayout>}/>

            </Routes>
       </BrowserRouter>
  );
}

export default App;
