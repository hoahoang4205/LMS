// ... existing code ...

// Route xóa học viên khỏi khóa học
router.delete('/courses/:courseId/students/:userId', authenticateToken, removeStudentFromCourse);

// ... existing code ... 