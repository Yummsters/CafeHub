import React from 'react';

const Fail = () => { // response 객체를 가지고 와서 추출하여 사용.
  // message에러메시지, code에러코드
    return (
      <div>
        <h1>결제 실패</h1>
        {/* <p>에러메시지: {message}</p>
        <p>에러코드: {code}</p> */}


      </div>
    );
};

export default Fail;