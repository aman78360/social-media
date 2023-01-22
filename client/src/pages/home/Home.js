import { Outlet } from "react-router-dom";
import NavBar from "../../components/navbar/NavBar";

function Home() {
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
