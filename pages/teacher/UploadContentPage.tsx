
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Layout from '../../components/Layout';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';

const UploadContentPage: React.FC = () => {
  const [contentType, setContentType] = useState<'lecture' | 'pdf'>('lecture');
  const [subject, setSubject] = useState('math');
  const [title, setTitle] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsUploading(true);
    // Mock upload
    setTimeout(() => {
      setIsUploading(false);
      alert(`Successfully "uploaded" ${title} to ${subject}.`);
      setTitle('');
      setFile(null);
    }, 1500);
  };

  return (
    <Layout>
        <Link to="/teacher/dashboard" className="text-teal-500 hover:underline mb-4 inline-block">&larr; Back to Dashboard</Link>
        <h1 className="text-4xl font-bold mb-8">Upload New Content</h1>
        <Card className="max-w-2xl mx-auto p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                    <label className="block text-sm font-medium">Content Type</label>
                    <select value={contentType} onChange={e => setContentType(e.target.value as 'lecture' | 'pdf')} className="mt-1 w-full p-2 border rounded-md dark:bg-slate-700 dark:border-slate-600 bg-white dark:bg-slate-800">
                        <option value="lecture">Video Lecture</option>
                        <option value="pdf">PDF Study Pack</option>
                    </select>
                </div>
                 <div>
                    <label className="block text-sm font-medium">Subject</label>
                    <select value={subject} onChange={e => setSubject(e.target.value)} className="mt-1 w-full p-2 border rounded-md dark:bg-slate-700 dark:border-slate-600 bg-white dark:bg-slate-800">
                        <option value="math">Mathematics</option>
                        <option value="science">Science</option>
                         <option value="social">Social Studies</option>
                        <option value="english">English</option>
                    </select>
                </div>
                <div>
                    <label htmlFor="title" className="block text-sm font-medium">Title</label>
                    <input type="text" id="title" value={title} onChange={e => setTitle(e.target.value)} required className="mt-1 w-full p-2 border rounded-md dark:bg-slate-700 dark:border-slate-600 bg-transparent" />
                </div>
                <div>
                    <label htmlFor="file" className="block text-sm font-medium">File</label>
                    <input type="file" id="file" onChange={e => setFile(e.target.files ? e.target.files[0] : null)} required className="mt-1 w-full text-sm p-2 border rounded-md dark:bg-slate-700 dark:border-slate-600 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-teal-50 file:text-teal-700 hover:file:bg-teal-100"/>
                </div>
                <Button type="submit" className="w-full" disabled={isUploading}>
                    {isUploading ? 'Uploading...' : 'Upload Content'}
                </Button>
            </form>
        </Card>
    </Layout>
  );
};

export default UploadContentPage;