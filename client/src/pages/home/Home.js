import React, { useEffect } from "react";
import { useDispatch } from "react-redux";

import { Outlet } from "react-router";
import Navbar from "../../components/navbar/Navbar";
import { getMyInfo } from "../../redux/slices/appConfigSlice";

	function Home() {
    const dispatch = useDispatch()
	useEffect(()=>{
		dispatch(getMyInfo())
	},[dispatch])

	return (
		<>
			<Navbar />
			<div className='outlet' style={{ marginTop: "60px" }}>
				<Outlet />
			</div>
		</>
	);

	}
export default Home;
