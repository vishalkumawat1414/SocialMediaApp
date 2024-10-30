import React, { useState, useEffect } from "react";
import "./UpdateProfile.scss";
import userDummyImg from "../../assets/user.png";
import "./UpdateProfile.scss";
import { useDispatch, useSelector } from "react-redux";
import { updateMyprofile } from "../../redux/slices/appConfigSlice";
import { axiosClient } from "../../utils/axiosClient";
import { useNavigate } from "react-router-dom";
import { KEY_ACCESS_TOKEN, removeItem } from "../../utils/localStorageManager";

function UpdateProfile() {
	const myProfile = useSelector((state) => state.appConfigReducer.myProfile);
	const [name, setName] = useState("");
	const [bio, setBio] = useState("");
	const [userImg, setUserImg] = useState("");
	const dispatch = useDispatch();
	const navigate = useNavigate();
	useEffect(() => {
		setName(myProfile?.name || "");
		setBio(myProfile?.bio || "");
		setUserImg(myProfile?.avatar?.url);
	}, [myProfile]);
	// console.log(myProfile);
	function handelImgChange(e) {
		const file = e.target.files[0];
		const fileReader = new FileReader();
		fileReader.readAsDataURL(file);
		fileReader.onload = () => {
			if (fileReader.readyState === fileReader.DONE) {
				setUserImg(fileReader.result);
			}
		};
	}

	function handelsubmit(e) {
		e.preventDefault();
		dispatch(
			updateMyprofile({
				name,
				bio,
				userImg,
			}),
		);
	}

	async function handelDelete() {
		try {
			const response = await axiosClient.delete("/user/");
			await axiosClient.post("/auth/logout");
			removeItem(KEY_ACCESS_TOKEN);
			navigate("/signup");
			return response;
		} catch (e) {
			console.log(e);
		}
	}
	return (
		<div className="UpdateProfile">
			<div className="container">
				<div className="left-part">
					<div className="input-user-img">
						<label className="labelImg" htmlFor="inputImg">
							<img src={userImg ? userImg : userDummyImg} alt={name} />
						</label>
						<input
							className="inputImg"
							id="inputImg"
							type="file"
							accept="image/*"
							onChange={handelImgChange}
						/>
					</div>
				</div>
				<div className="right-part">
					<form onSubmit={handelsubmit}>
						<input
							value={name}
							type="text"
							placeholder="Your Name"
							onChange={(e) => setName(e.target.value)}
						/>
						<input
							value={bio}
							type="text"
							placeholder="Your Bio"
							onChange={(e) => setBio(e.target.value)}
						/>
						<input type="submit" className="btn-primary" />
					</form>

					<button className="delete-account btn-primary" onClick={handelDelete}>
						Delete Account
					</button>
				</div>
			</div>
		</div>
	);
}

export default UpdateProfile;
