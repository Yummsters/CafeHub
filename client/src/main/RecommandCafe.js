import './mainStyle.css';
import Main1 from './Main1';
import Main2 from './Main2';
import Main3 from './Main3';
import Main4 from './Main4';
import { useEffect } from 'react';
const RecommendCafe = () => {
    useEffect(()=>{
        document.getElementById('Main2').scrollIntoView({behavior:'smooth'});
    },[])

    return (
        <div className='Main'>
            <Main1/>
            <div id="Main2"><Main2/></div>
            <Main3/>
            <Main4/>
        </div>
    )
}

export default RecommendCafe;