import React, { useState, useEffect, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import Videos from './videos/videos';
import Menu from './menu/menu';
import Quiz from './quiz/Quiz';
import './course_videos_page.css';
import { message } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';

const CourseVideosPage = () => {
  const { courseId } = useParams();
  const [chapters, setChapters] = useState([]);
  const [videos, setVideos] = useState([]);
  const [quizzes, setQuizzes] = useState([]);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [selectedQuiz, setSelectedQuiz] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = useCallback(async () => {
    try {
      const [chaptersResponse, videosResponse, quizzesResponse] = await Promise.all([
        axios.get(`http://localhost:5000/courses/${courseId}/chapters`),
        axios.get(`http://localhost:5000/courses/${courseId}/videos`),
        axios.get(`http://localhost:5000/courses/${courseId}/quizzes`)
      ]);

      console.log('Chapters response:', chaptersResponse.data);
      console.log('Videos response:', videosResponse.data);
      console.log('Quizzes response:', quizzesResponse.data);

      setChapters(chaptersResponse.data);
      setVideos(videosResponse.data);
      setQuizzes(quizzesResponse.data);
      
      if (videosResponse.data.length > 0) {
        setSelectedVideo(videosResponse.data[0]);
        setSelectedQuiz(null);
      }
      setLoading(false);
    } catch (err) {
      console.error('Error fetching data:', err);
      setError('Có lỗi xảy ra khi tải dữ liệu');
      setLoading(false);
    }
  }, [courseId]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleVideoSelect = (video) => {
    console.log('Selected video:', video);
    setSelectedVideo(video);
    setSelectedQuiz(null);
  };

  const handleQuizSelect = (quiz) => {
    console.log('Selected quiz:', quiz);
    if (quiz && quiz.id) {
      setSelectedQuiz(quiz);
      setSelectedVideo(null);
    } else {
      message.error('Không thể tải bài kiểm tra');
    }
  };

  if (loading) return (<div className="loading-icon"><LoadingOutlined /></div>);
  if (error) return <div>{error}</div>;

  return (
    <div className="course-videos-container">
      <div className="menu-section">
        <Menu
          videos={videos}
          chapters={chapters}
          quizzes={quizzes}
          onVideoSelect={handleVideoSelect}
          onQuizSelect={handleQuizSelect}
        />
      </div>
      <div className="content-section">
        {selectedVideo && <Videos video={selectedVideo} />}
        {selectedQuiz && Object.keys(selectedQuiz).length > 0 && (
          <Quiz quiz={selectedQuiz} />
        )}
      </div>
    </div>
  );
};

export default CourseVideosPage;