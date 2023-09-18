import React, { useEffect, useState } from "react";
import axios from "axios";
import { AiFillCloseCircle } from "react-icons/ai";
import styles from "./PostDetail.module.css";
import { useRecoilValue } from "recoil";
//import { loginState } from "../state/LoginState"; // 사용자 정보를 담은 recoil 상태
import CommentComponent from "../Comment/CommentComponent";
import { FaUser } from "react-icons/fa";

function PostComponent({ onClose }) {
    const [postData, setPostData] = useState(null);
    const [editedCaption, setEditedCaption] = useState(""); // 수정한 캡션을 저장
    const [isEditing, setIsEditing] = useState(false);

    // const currentUser = useRecoilValue(loginState);
    const currentUser = 1;
    // const postId = 8;

    // 제일 먼저 특정 게시글의 전체 데이터를 받아와서 postData에 넣어줌
    useEffect(() => {
        axios
            .get("https://d4ec-218-151-64-223.ngrok-free.app/posts/8", {
                headers: {
                    "ngrok-skip-browser-warning": true,
                },
            })
            .then((response) => {
                setPostData(response.data);
                setEditedCaption(response.data.postCaption);
            })
            .catch((error) => {
                console.error("데이터를 가져오는 중 오류가 발생했습니다:", error);
            });
    }, []);

    console.log(postData);

    // 데이터가 로드되지 않았을 때의 처리
    if (!postData) {
        return <div>Loading...</div>;
    }

    // 게시글 수정 함수
    const handleEditPost = () => {
        // 게시글 작성자의 ID
        const postUserId = postData.user.userId;

        // 로그인한 사용자의 ID를 사용
        const currentUserId = currentUser.userId;

        // 게시글 작성자와 현재 사용자가 동일한 경우에만 수정 가능
        if (currentUserId === postUserId) {
            setIsEditing(true);
            // 수정할 내용과 게시글 id를 사용하여 patch 요청을 보냄
            const editData = {
                postCaption: editedCaption, // 수정된 내용
                tags: postData.tags, // 태그 정보는 그대로 사용
            };
            axios
                .patch(
                    `https://d4ec-218-151-64-223.ngrok-free.app/posts/${postData.id}?userId=${currentUserId}`,
                    editData,
                ) // ngrok 서버 주소로 변경
                .then((response) => {
                    console.log("게시글 수정 성공:", response.data);
                    // 수정된 내용을 화면에 반영
                    setPostData({ ...postData, postCaption: editedCaption });
                })
                .catch((error) => {
                    console.error("게시글 수정 중 오류가 발생했습니다:", error);
                });
        } else {
            alert("게시글 작성자와 현재 사용자가 다릅니다. 수정할 수 없습니다.");
        }
    };

    // 게시글 삭제 함수
    const handleDeletePost = () => {
        const postUserId = postData.user.userId;

        const currentUserId = currentUser.userId;

        // 게시글 작성자와 현재 사용자가 동일한 경우에만 삭제 가능
        if (currentUserId === postUserId) {
            // 게시글 ID와 유저 ID를 사용하여 DELETE 요청을 보냄
            axios
                .delete(`https://d4ec-218-151-64-223.ngrok-free.app/posts/${postData.id}?userId=${currentUserId}`) // ngrok 서버 주소로 변경
                .then((response) => {
                    // 게시글 삭제가 성공한 경우 처리
                    console.log("게시글 삭제 성공:", response.data);
                    // 삭제 후 필요한 동작을 수행할 수 있습니다.
                })
                .catch((error) => {
                    console.error("게시글 삭제 중 오류가 발생했습니다:", error);
                });
        } else {
            // 게시글 작성자와 현재 사용자가 다른 경우 삭제할 수 없음을 알림
            console.log("게시글 작성자와 현재 사용자가 다릅니다. 삭제할 수 없습니다.");
        }
    };

    return (
        <div className={styles.modal}>
            <button onClick={onClose} className={styles.close_button}>
                <AiFillCloseCircle />
            </button>
            <div className={styles.modal_content}>
                <div className={styles.postContainer}>
                    {/* 이미지 */}
                    <img src={postData.postImage} alt="게시글 이미지" className={styles.image} />

                    {/* 수정 버튼 */}
                    <button onClick={handleEditPost} className={styles.edit_button}>
                        게시글 수정
                    </button>

                    {/* 삭제 버튼 */}
                    <button onClick={handleDeletePost} className={styles.delete_button}>
                        게시글 삭제
                    </button>

                    {/* 태그 */}
                    <div className={styles.tags}>
                        {postData.tags && postData.tags.map((tag) => <span key={tag}>{tag}</span>)}
                    </div>

                    {/* 제목 */}
                    <h2 className={styles.postTitle}>{postData.postTitle}</h2>

                    {/* 주소 */}
                    <h3 className={styles.postAddress}>{postData.postAddress}</h3>

                    <div className={styles.userInfo}>
                        {postData.user.profileImage ? (
                            <img src={postData.user.profileImage} alt="프로필 이미지" className={styles.profileImage} />
                        ) : (
                            <div className={styles.profileIcon}>
                                <FaUser size={25}/>
                            </div>
                        )}
                        <p className={styles.username}>작성자: {postData.user.username}</p>
                    </div>

                    {/* 날짜 */}
                    <p className={styles.createdAt}>작성 날짜: {postData.createdAt}</p>

                    {/* 캡션 */}
                    {/* 수정 중이 아니라면 내용을 나타나게 하고, 수정 중이라면 textarea가 나타나도록 함. */}
                    {isEditing ? (
                        <textarea value={editedCaption} onChange={(e) => setEditedCaption(e.target.value)} rows="5" />
                    ) : (
                        <p className={styles.post_caption}>{postData.postCaption}</p>
                    )}

                    <CommentComponent />
                </div>
            </div>
        </div>
    );
}

export default PostComponent;