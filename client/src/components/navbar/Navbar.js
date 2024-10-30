import React from "react";
import { AiOutlineLogout } from "react-icons/ai";
import {  useSelector } from "react-redux";
import { useNavigate } from "react-router";
import Avatar from "../avatar/Avatar";
import "./Navbar.scss";
import { axiosClient } from "../../utils/axiosClient";
import { KEY_ACCESS_TOKEN, removeItem } from "../../utils/localStorageManager";


 function Navbar() {
	const navigate = useNavigate();
	const myProfile =  useSelector(state =>state.appConfigReducer.myProfile)
	
	
async function handelLogOut(){
 try {
	await axiosClient.post('/auth/logout');
	removeItem(KEY_ACCESS_TOKEN);
	navigate('/login')

 } catch (e) {
	  console.log(e)
 }
	}

	return (
		<div className="Navbar">
			<div className="container">
				<h2
					className="banner hover-link"
					onClick={() => navigate(`/${myProfile?._id}`)}>
					Social Media
				</h2>
				<div className="right-side">
					<div
						className="profile hover-link"
						onClick={() => navigate(`/profile/${myProfile?._id}`)}>
						<Avatar src={myProfile?.avatar?.url} />
					</div>
					<div className="logout hover-link" onClick={handelLogOut}>
						<AiOutlineLogout />
					</div>
				</div>
			</div>
		</div>
	);
}

export default Navbar;
