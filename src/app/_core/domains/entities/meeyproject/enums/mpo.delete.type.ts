export enum MPODeleteType{
    // Chưa phát sinh ở các dự án
    Not_Exists_Projects = 1, 
    // Đã phát sinh ở các dự án khác nhưng chưa phát sinh bài đăng
    Exists_Project = 2,
    // Đã phát sinh bài đăng ở các dự án khác
    Has_Article = 3,
}