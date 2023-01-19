import Login from "./pages/login/Login";
import Signup from "./pages/signup/Signup";
import Home from "./pages/home/Home";
import { Routes, Route } from "react-router-dom";
import RequiredUser from "./components/RequiredUser";
function App() {
	return (
		<div className="App">
			<Routes>
				<Route element={<RequiredUser />}>
					<Route path="/" element={<Home />} />
				</Route>
				<Route path="/login" element={<Login />} />
				<Route path="/signup" element={<Signup />} />
			</Routes>
		</div>
	);
}

export default App;
