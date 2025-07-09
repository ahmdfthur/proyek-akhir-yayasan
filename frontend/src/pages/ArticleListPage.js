// src/pages/ArticleListPage.js
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import apiClient from '../services/api';

const ArticleListPage = () => {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        setLoading(true);
        const response = await apiClient.get('/articles');
        setArticles(response.data);
        setError('');
      } catch (err) {
        setError('Gagal memuat artikel.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchArticles();
  }, []); // Array kosong berarti efek ini hanya berjalan sekali saat komponen dimuat

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="container">
      <h1>Daftar Artikel & Berita</h1>
      <div className="article-list">
        {articles.map(article => (
          <div key={article.id} className="article-card">
            <img src={article.thumbnail_url || 'https://via.placeholder.com/300x200'} alt={article.title} />
            <h2>{article.title}</h2>
            <p>{article.excerpt}...</p>
            <Link to={`/artikel/${article.slug}`}>Baca Selengkapnya</Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ArticleListPage;