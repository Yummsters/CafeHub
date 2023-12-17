// import './App.css';
import { BrowserRouter as Router, Route, Routes, BrowserRouter, Navigate } from 'react-router-dom';
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
import OAuth2 from './login/OAuth2';
import Success from './payment/Success';
import Fail from './payment/Fail';
import OAuth2Err from './login/OAuth2Err';
import SearchPwResult from './searchPw/SearchPwResult';
import UserReview from './userReview/UserReview';
import { IsLoginCheck } from './components/IsLoginCheck';
import { IsSManagerCheck, IsStoreCheck, IsUserCheck } from './components/IsMemberTypeCheck';
import RecommendCafe from './main/RecommandCafe';

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
              {/* 모두 사용 가능 */}
              <Route exact path='/' element={<DefaultLayout><Main/></DefaultLayout>}/>
              <Route exact path='/recoReviewCafe' element={<DefaultLayout><RecommendCafe/></DefaultLayout>}/>
              <Route exact path="/map" element={<DefaultLayout><Map/></DefaultLayout>} />
              <Route exact path="/reviewList" element={<DefaultLayout><ReviewList/></DefaultLayout>} />
              <Route exact path='/userReview/:nickname' element={<DefaultLayout><UserReview/></DefaultLayout>}/>
              <Route exact path='/reviewDetail/:reviewNo' element={<DefaultLayout><ReviewDetail/></DefaultLayout>}/>
              <Route exact path='/oauth2/redirect/:accessToken/:refreshToken' element={<DefaultLayout><OAuth2/></DefaultLayout>}/>
              <Route exact path='/oauth2Error' element={<DefaultLayout><OAuth2Err/></DefaultLayout>}/>

              {/*로그인 한 사람 모두 사용 가능 */}
              <Route exact path='/payment/success' element={!IsLoginCheck() ? <DefaultLayout><Success/></DefaultLayout> : <Navigate to="/"/>}/>
              <Route exact path='/payment/fail' element={!IsLoginCheck() ? <DefaultLayout><Fail/></DefaultLayout> : <Navigate to="/"/>}/>

              {/* 로그인 하지 않은 사람만 사용 가능 */}
              <Route exact path='/login' element={IsLoginCheck() ? <DefaultLayout><LoginPage/></DefaultLayout> : <Navigate to="/"/>}/>
              <Route exact path='/searchId' element={IsLoginCheck() ? <DefaultLayout><SearchId/></DefaultLayout> : <Navigate to="/"/>}/>
              <Route exact path='/searchIdResult' element={IsLoginCheck() ? <DefaultLayout><SearchIdResult/></DefaultLayout> : <Navigate to="/"/>}/>
              <Route exact path='/searchPw' element={IsLoginCheck() ? <DefaultLayout><SearchPw/></DefaultLayout> : <Navigate to="/"/>}/>
              <Route exact path='/searchPwResult' element={IsLoginCheck() ? <DefaultLayout><SearchPwResult/></DefaultLayout> : <Navigate to="/"/>}/>
              <Route exact path='/signUpUser' element={IsLoginCheck() ? <DefaultLayout><SignUpUser/></DefaultLayout> : <Navigate to="/"/>}/>
              <Route exact path='/signUpStore' element={IsLoginCheck() ? <DefaultLayout><SignUpStore/></DefaultLayout> : <Navigate to="/"/>}/>

              {/* 로그인 한 유저 & 매니저만 사용 가능 */}
              <Route exact path='/wishStore' element={(IsUserCheck() || IsSManagerCheck())&& !IsLoginCheck() ? <DefaultLayout><WishStore/></DefaultLayout> : <Navigate to="/"/>}/>
              <Route exact path='/wishReview' element={(IsUserCheck() || IsSManagerCheck())&& !IsLoginCheck() ? <DefaultLayout><WishReview/></DefaultLayout>:  <Navigate to="/"/>}/>
              <Route exact path="/userPoint" element={(IsUserCheck() || IsSManagerCheck())&& !IsLoginCheck() ? <DefaultLayout><UserPoint/></DefaultLayout> : <Navigate to="/"/>}/>
              <Route exact path="/userInfo" element={(IsUserCheck() || IsSManagerCheck())&& !IsLoginCheck() ? <DefaultLayout><UserInfo/></DefaultLayout> : <Navigate to="/"/>} />
              <Route exact path="/myReivew" element={(IsUserCheck() || IsSManagerCheck())&& !IsLoginCheck() ? <DefaultLayout><MyReivew/></DefaultLayout> : <Navigate to="/"/>} />
              <Route exact path="/myReply" element={(IsUserCheck() || IsSManagerCheck())&& !IsLoginCheck() ? <DefaultLayout><MyReply/></DefaultLayout> : <Navigate to="/"/>} />
              <Route exact path='/reviewModify/:reviewNo' element={(IsUserCheck() || IsSManagerCheck())&& !IsLoginCheck() ? <DefaultLayout><ReviewModify/></DefaultLayout> : <Navigate to="/"/>}/>
              <Route exact path='/reviewWrite' element={(IsUserCheck() || IsSManagerCheck())&& !IsLoginCheck() ? <DefaultLayout><ReviewWrite/></DefaultLayout> : <Navigate to="/"/>}/>

              {/* 로그인 한 사장 & 매니저만 사용 가능 */}
              <Route exact path='/storeInfo' element={(IsStoreCheck() || IsSManagerCheck()) && !IsLoginCheck() ? <DefaultLayout><StoreInfo/></DefaultLayout> : <Navigate to="/"/>}/>
              <Route exact path='/storeClose' element={(IsStoreCheck() || IsSManagerCheck()) && !IsLoginCheck() ? <DefaultLayout><StoreClose/></DefaultLayout> : <Navigate to="/"/>}/>
              <Route exact path='/keypad' element={(IsStoreCheck() || IsSManagerCheck()) && !IsLoginCheck() ? <NoHeaderFooterLayout><Keypad/></NoHeaderFooterLayout> : <Navigate to="/"/>}/>
              <Route exact path='/storeReview' element={(IsStoreCheck() || IsSManagerCheck()) && !IsLoginCheck() ? <DefaultLayout><StoreReview/></DefaultLayout> : <Navigate to="/"/>}/>
              <Route exact path='/storeBanner' element={(IsStoreCheck() || IsSManagerCheck()) && !IsLoginCheck() ? <DefaultLayout><StoreBanner/></DefaultLayout> : <Navigate to="/"/>}/>
              <Route exact path='/choicePoint/:memNo' element={(IsStoreCheck() || IsSManagerCheck()) && !IsLoginCheck() ? <NoHeaderFooterLayout><ChoicePoint/></NoHeaderFooterLayout> : <Navigate to="/"/>}/>
              <Route exact path='/usePoint/:memNo' element={(IsStoreCheck() || IsSManagerCheck()) && !IsLoginCheck() ? <NoHeaderFooterLayout><UsePoint/></NoHeaderFooterLayout> : <Navigate to="/"/>}/>
              <Route exact path="/storeuserInfo" element={(IsStoreCheck() || IsSManagerCheck()) && !IsLoginCheck() ? <DefaultLayout><StoreUserInfo/></DefaultLayout> : <Navigate to="/"/>} />
              
              {/* 로그인 한 매니저만 사용 가능 */} 
              <Route exact path="/managerAd" element={IsSManagerCheck() && !IsLoginCheck() ? <DefaultLayout><ManagerAd/></DefaultLayout> : <Navigate to="/"/>} />
              <Route exact path="/managerPoint" element={IsSManagerCheck() && !IsLoginCheck() ? <DefaultLayout><ManagerPoint/></DefaultLayout> : <Navigate to="/"/>} />
              <Route exact path="/managerConfirm" element={IsSManagerCheck() && !IsLoginCheck() ? <DefaultLayout><ManagerConfirm/></DefaultLayout> : <Navigate to="/"/>} />
             
              
             
            </Routes>
       </BrowserRouter>
  );
}

export default App;
