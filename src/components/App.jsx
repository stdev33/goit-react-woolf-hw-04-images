import React, { useState, useEffect } from 'react';
import backend from '../helpers/pixabay-api';
import Searchbar from './Searchbar/Searchbar';
import ImageGallery from './ImageGallery/ImageGallery';
import ImageGalleryItem from './ImageGalleryItem/ImageGalleryItem';
import Button from './Button/Button';
import Loader from './Loader/Loader';
import Modal from './Modal/Modal';
import css from './App.module.css';

const App = () => {
  const imagesPerPage = 12; // also used in condition to render 'Load more' button

  const [images, setImages] = useState([]);
  const [totalImages, setTotalImages] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [page, setPage] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const [largeImageURL, setLargeImageURL] = useState('');

  useEffect(() => {
    if (!searchQuery) {
      return;
    }

    const fetchImages = async () => {
      setLoading(true);

      try {
        const response = await backend.requestImages(
          searchQuery,
          page,
          imagesPerPage
        );
        setImages(prevImages => [...prevImages, ...response.data.hits]);
        setTotalImages(response.data.totalHits);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchImages();
  }, [searchQuery, page]);

  const handleSearchSubmit = query => {
    setSearchQuery(query);
    setPage(1);
    setImages([]);
    setTotalImages(0);
  };

  const handleLoadMore = () => {
    setPage(prevPage => prevPage + 1);
  };

  const openModal = largeImageURL => {
    setShowModal(true);
    setLargeImageURL(largeImageURL);
  };

  const closeModal = () => {
    setShowModal(false);
    setLargeImageURL('');
  };

  return (
    <div className={css.App}>
      <Searchbar onSubmit={handleSearchSubmit} />
      <ImageGallery>
        {images.map(({ id, webformatURL, largeImageURL }) => (
          <ImageGalleryItem
            key={id}
            src={webformatURL}
            alt=""
            onClick={() => openModal(largeImageURL)}
          />
        ))}
      </ImageGallery>
      {loading && <Loader size={80} color="#00BFFF" />}
      {images.length >= imagesPerPage &&
        page * imagesPerPage < totalImages &&
        !loading && <Button onClick={handleLoadMore}>Load more</Button>}
      {error && (
        <div className={css.Error}>An error occurred: {error.message}</div>
      )}
      {showModal && (
        <Modal largeImageURL={largeImageURL} onClose={closeModal} />
      )}
    </div>
  );
};

export { App };
