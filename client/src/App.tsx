import { Outlet } from "react-router";
import "./App.css";
import { ToastContainer } from "react-toastify";

function App() {
  return (
    <main>
      <ToastContainer
        position="top-center"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick={false}
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
      <Outlet />
    </main>
  );
}

export default App;
