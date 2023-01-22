import Login from "./pages/login/Login";
import Signup from "./pages/signup/Signup";
import Home from "./pages/home/Home";
import { Routes, Route } from "react-router-dom";
import RequiredUser from "./components/RequiredUser";
import Feed from "./components/feed/Feed";
import Profile from "./components/profile/Profile";
import UpdateProfile from "./components/updateProfile/UpdateProfile";
function App() {
	return (
		<div className="App">
			<Routes>
				<Route element={<RequiredUser />}>
					<Route element={<Home />}>
						<Route path="/" element={<Feed />} />
						<Route path="/profile/:userId" element={<Profile />} />
						<Route
							path="/updateProfile"
							element={<UpdateProfile />}
						/>
					</Route>
				</Route>
				<Route path="/login" element={<Login />} />
				<Route path="/signup" element={<Signup />} />
			</Routes>
		</div>
	);
}

export default App;
