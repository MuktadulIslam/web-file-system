// src/app/page.tsx

'use client';

// import FileSystem from '@/components/FileSystem';
import FileSystem from '@/components/FileSystem2';
import { FileTypeConfig } from '@/types';
import { BookOpen, ClipboardCheck, Video, FileText, Users } from 'lucide-react';

export default function Home() {
  // Example configuration for a Learning Management System
  const fileTypes: FileTypeConfig[] = [
    {
      component: <div>Course Component</div>,
      name: 'Course',
      key: 'course',
      icon: BookOpen,
      color: '#3B82F6',
    },
    {
      component: <div>Exam Component</div>,
      name: 'Exam',
      key: 'exam',
      icon: ClipboardCheck,
      color: '#EF4444',
    },
    {
      component: <div>Video Lesson Component</div>,
      name: 'Video Lesson',
      key: 'video-lesson',
      icon: Video,
      color: '#8B5CF6',
    },
    {
      component: <div>Assignment Component</div>,
      name: 'Assignment',
      key: 'assignment',
      icon: FileText,
      color: '#F59E0B',
    },
    {
      component: <div>Study Group Component</div>,
      name: 'Study Group',
      key: 'study-group',
      icon: Users,
      color: '#10B981',
    },
  ];

  return (
    <main>
        <FileSystem
          config={{
            fileTypes,
            folderColor: '#FFA500',
            username: 'muktadul',
          }}
        />
    </main>
  );
}