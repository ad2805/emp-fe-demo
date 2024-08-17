import './App.css';
import Main from './component/Main';
import { ToastContainer } from 'react-toastify';

function App() {
  return (
    <div
     style={{
      backgroundColor:'#ebebeb',
      width:'calc(100% - 10px)',
      height:'100vh',
    //   overflow: 'hidden'  // Add this line to ensure no overflow
    }}
    >
       <ToastContainer />
      <Main />
    </div>
  );
}

export default App;
