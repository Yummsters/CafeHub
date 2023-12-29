import './mainStyle.css';
import Main1 from './Main1';
import Main2 from './Main2';
import Main3 from './Main3';
import Main4 from './Main4';
const Main = () => {

    return (
        <div className='Main'>
            <Main1/>
            <div id="Main2"><Main2/></div>
            <Main3/>
            <Main4/>
        </div>
    )
}

export default Main;