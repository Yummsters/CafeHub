import keypadStyle from './keypadStyle.css';

const Keypad = () =>{
    return(
        <div className="keypad-container">
            <input className="keypadInput" type="text" id="phoneNum" name="phoneNum"/>
            <div className="keypadNum-section">
                <button className="keypad-1"> 1</button>
                <button className="keypad-2"> 2</button>
                <button className="keypad-3"> 3</button>
                <button className="keypad-4"> 4</button>
                <button className="keypad-5"> 5</button>
                <button className="keypad-6"> 6</button>
                <button className="keypad-7"> 7</button>
                <button className="keypad-8"> 8</button>
                <button className="keypad-9"> 9</button>
                <button className="keypad-confirm"> 확인 </button>
                <button className="keypad-0"> 0</button>
                <button className="keypad-delete"> &lt; </button>
            </div>
        </div>
    );
}

export default Keypad;