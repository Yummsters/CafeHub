import { useLocation, useNavigate } from 'react-router';
import searchId from './searchIdStyle.css';

const SearchIdResult = () => {
    const location = useLocation();
    const searchId = location.state.result;
    const navigate = useNavigate();

    return(
        <div className='searchId-container'>
            <div className='searchId-bg'>
                <div className='searchId-section'>
                    <div className='searchId-title'>아이디 찾기</div> <br/>
                    <div className='searchIdResult-text'>
                    아이디는 <br/> -------- <br/> <b>{searchId}</b> <br/> -------- <br/>입니다
                    </div>
                    <div className='searchId-button'>
                        <button type="button" onClick={()=>navigate('/login')}> <span>확인</span> </button>
                    </div>
                    <div className='searchInfo'><a href="/searchPw">비밀번호 찾기</a></div>
                </div>
            </div>
        </div>
    );
}

export default SearchIdResult;