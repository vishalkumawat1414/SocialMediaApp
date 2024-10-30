import React, { useEffect, useState } from "react";
import Avatar from "../avatar/Avatar";
import "./Post.scss";
import { AiOutlineHeart } from "react-icons/ai";
import { BsFillHeartFill } from "react-icons/bs";
import { AiFillDelete } from "react-icons/ai";
import { useDispatch} from "react-redux";
import {  getUserProfile, likeAndUnlikePost } from "../../redux/slices/postsSlice";
import { useNavigate, useParams } from "react-router-dom";
import { axiosClient } from "../../utils/axiosClient";

function Post({ post }) {
	const navigate = useNavigate();
	const dispatch = useDispatch();
	const [isMyProfile, setIsMyProfile] = useState(false);
	const params = useParams();

	useEffect(()=>{
    setIsMyProfile(post?.owner?._id === params?.userId);
	},[isMyProfile,params?.userId])

	async function handelPostLike() {
		dispatch(
			likeAndUnlikePost({
				postId: post?._id,
			}),
		);
	}
 
	async function handelPostDelete() {
		  await axiosClient.delete(`/posts/${post?._id}`)
		 await dispatch(getUserProfile({userId: params?.userId,}))
	}
	return (
		<div className="Post">
			<div
				onClick={() => navigate(`/profile/${post?.owner?._id}`)}
				className="heading">
				<Avatar src={post?.owner?.avatar?.url} />
				<h4>{post?.owner?.name}</h4>
			</div>
			<div className="content">
				<img src={post?.image?.url} alt="post" />
			</div>
			<div className="footer">
				<div className="like-del">
					<div className="like" onClick={handelPostLike}>
						{post?.isLiked ? (
							<BsFillHeartFill className="iconred" />
						) : (
							<AiOutlineHeart className="icon" />
						)}

						<h4>{`${post?.likeCount} likes`}</h4>
					</div>
					{isMyProfile&& (
						<div className="bin" onClick={handelPostDelete}>
							<AiFillDelete />
						</div>
					)}
				</div>
				<p className="caption">{post?.caption}</p>
				<h6 className="time-ago">{post?.timeAgo}</h6>
			</div>
		</div>
	);
}

export default Post;
