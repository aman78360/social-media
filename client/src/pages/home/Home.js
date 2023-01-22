import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { Outlet } from "react-router-dom";
import NavBar from "../../components/navbar/NavBar";
import { getMyInfo } from "../../redux/slices/appConfigSlice";

function Home() {
	const dispatch = useDispatch();
	useEffect(() => {
		dispatch(getMyInfo());
	}, [dispatch]);
	return (
		<div>
			<NavBar />
			<div className="outlet" style={{ marginTop: "60px" }}>
				<Outlet />
			</div>
		</div>
	);
}

export default Home;
